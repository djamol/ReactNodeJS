const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Load environment variables from a .env file
require('dotenv').config();

// Create an Express app
const app = express();
const port = process.env.PORT || 3000;

const cors = require('cors');

console.log("JWT_SECRET_KEY",process.env.JWT_SECRET_KEY);
console.log("Frontend URL :CORS_CONFIG_URL",process.env.CORS_CONFIG_URL||'http://127.0.0.1:3000');

const corsOptions = {
  origin:  process.env.CORS_CONFIG_URL||'http://127.0.0.1:3000', //Backend Server
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow cookies and credentials
  optionsSuccessStatus: 204, // No content response for preflight requests
};

app.use(cors(corsOptions));


// Middleware for parsing JSON requests
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MySQL database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL database');
});

// Create a users table if it doesn't exist
const createUsersTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(255),
    lastName VARCHAR(255),
    email VARCHAR(255),
    phoneNo VARCHAR(255),
    username VARCHAR(255) UNIQUE,
    password VARCHAR(255)
  )
`;

db.query(createUsersTableQuery, (err, results) => {
  if (err) {
    console.error('Error creating users table:', err);
    process.exit(1);
  }
  console.log('Users table created');
});


const createFilesTableQuery = `
  CREATE TABLE IF NOT EXISTS files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    filename VARCHAR(255),
    filePath VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP

  )
`;

db.query(createFilesTableQuery, (err, results) => {
  if (err) {
    console.error('Error creating files table:', err);
    // Handle the error appropriately (e.g., send a response to the client)
  } else {
    console.log('Files table created');
  }
});


// Define Multer storage configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

//const upload = multer({ storage });
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB file size limit
  },
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|mp4|avi|mkv/;
    const extname = allowedFileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedFileTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      return cb('Error: Invalid file type', false);
    }
  },
});
// Routes for user registration, login, and token generation
app.post('/api/register', async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNo, username, password } = req.body;

// Define validation patterns
    const namePattern = /^[A-Za-z\s]+$/; // Letters and spaces only
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format
    const phonePattern = /^\d{10}$/; // 10-digit phone number
    const usernamePattern = /^[a-zA-Z_.]+$/; // Letters, underscores, and periods
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@#$%^&*!]{8,}$/; // Strong password with at least 8 characters, one lowercase letter, one uppercase letter, and one digit

    // Validate firstName
    if (!namePattern.test(firstName)) {
      return res.status(400).json({ message: 'First name is invalid. Only letters and spaces are allowed.' });
    }

    // Validate lastName
    if (!namePattern.test(lastName)) {
      return res.status(400).json({ message: 'Last name is invalid. Only letters and spaces are allowed.' });
    }

    // Validate email
    if (!emailPattern.test(email)) {
      return res.status(400).json({ message: 'Email is invalid. Please provide a valid email address.' });
    }

    // Validate phoneNo
    if (!phonePattern.test(phoneNo)) {
      return res.status(400).json({ message: 'Phone number is invalid. Please provide a 10-digit phone number.' });
    }

    // Validate username
    if (!usernamePattern.test(username)) {
      return res.status(400).json({ message: 'Username is invalid. Only a-z, A-Z, _, and . are allowed.' });
    }

    // Validate password
    if (!passwordPattern.test(password)) {
      return res.status(400).json({ message: 'Password is invalid. It should be at least 8 characters long and include one lowercase letter, one uppercase letter, and one digit.' });
    }
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);
// Check if the username already exists in the database
    const checkUsernameQuery = 'SELECT id FROM users WHERE username = ?';
    db.query(checkUsernameQuery, [username], (err, results) => {
      if (err) {
        console.error('Error checking username:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: 'Username already exists. Please choose a different username.' });
      }

});
    // Insert user data into the database
    const insertUserQuery = `
      INSERT INTO users (firstName, lastName, email, phoneNo, username, password)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
      insertUserQuery,
      [firstName, lastName, email, phoneNo, username, hashedPassword],
      (err, results) => {
        if (err) {
          console.error('Error registering user:', err);
          return res.status(500).json({ message: 'Internal server error' });
        }
        res.status(201).json({ message: 'User registered successfully' });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const findUserQuery = 'SELECT * FROM users WHERE username = ?';

    db.query(findUserQuery, [username], async (err, results) => {
      if (err) {
        console.error('Error finding user:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const user = results[0];

      // Check if the provided password matches the stored hash
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate a JWT toke
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY);

      res.json({ token });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Middleware for token authentication
function authenticateToken(req, res, next) {
 //   let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
 //const token = req.header(tokenHeaderKey);
 const token = req.headers.authorization
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
//console.log("token",token);
  jwt.verify(token,jwtSecretKey, (err, user) => {
    if (err) {
//console.log("err",err);
   if (err.name === 'JsonWebTokenError') {
        return res.status(403).json({ message: 'Invalid token' });
      }
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
      return res.status(500).json({ message: 'Internal server error' }); 
   }
    req.user = user;
    next();
  });
}


app.post('/api/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    const { userId } = req.user;
    const { filename, path } = req.file;

    // Insert file data into the database
    const insertFileQuery = `
      INSERT INTO files (userId, filename, filePath)
      VALUES (?, ?, ?)
    `;

    db.query(insertFileQuery, [userId, filename, path], (err, results) => {
      if (err) {
        console.error('Error uploading file:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }
      res.status(201).json({ message: 'File uploaded successfully' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/files', authenticateToken, (req, res) => {
  const { userId } = req.user;

  // Retrieve files associated with the user from the database
  const getFilesQuery = 'SELECT * FROM files WHERE userId = ?';

  db.query(getFilesQuery, [userId], (err, results) => {
    if (err) {
      console.error('Error retrieving files:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.json(results);
  });
});

app.delete('/api/files/:id/:filename', authenticateToken, (req, res) => {
  const { userId } = req.user;
  const fileId = req.params.id;

  // Find and delete the file from the database
  const deleteFileQuery = 'DELETE FROM files WHERE id = ? AND userId = ?';

  db.query(deleteFileQuery, [fileId, userId], (err, results) => {
    if (err) {
      console.error('Error deleting file:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.affectedRows === 0) {
  //    return res.status(404).json({ message: 'File not found' });
    }

    // Delete the file from the server
    fs.unlinkSync('uploads/'+req.params.filename);

    res.json({ message: 'File deleted successfully' });
  });
});


function isValidFilename(filename) {
  const allowedCharacters = /^[a-zA-Z0-9_.-]+$/; // Example: Allow letters, numbers, underscores, periods, and hyphens

  if (filename.length > 25) {
    return false; // Example: Limit filename length to 255 characters
  }

  return allowedCharacters.test(filename);
}
// Add a new route to rename files by their ID
app.put('/api/files/:id/rename', authenticateToken, (req, res) => {
  const { userId } = req.user;
  const fileId = req.params.id;
  const { newFilename } = req.body; // Assuming you send the new filename in the request body
	
if (!isValidFilename(newFilename)) {
    return res.status(400).json({ message: 'Invalid new filename' });
  }

  // Get the old filename and filepath from the database
  const getFileInfoQuery = 'SELECT filename, filePath FROM files WHERE id = ? AND userId = ?';

  db.query(getFileInfoQuery, [fileId, userId], (err, results) => {
    if (err) {
      console.error('Error retrieving file info:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'File not found or you do not have permission to rename it' });
    }

    const { filename, filePath } = results[0];

    // Rename the file on the server
    const newFilePath = 'uploads/' + newFilename; // Create the new file path with the new filename

    fs.rename(filePath, newFilePath, (renameErr) => {
      if (renameErr) {
        console.error('Error renaming file:', renameErr);
        return res.status(500).json({ message: 'Error renaming file on the server' });
      }

      // Update the filename and filePath in the database
      const updateFilenameQuery = 'UPDATE files SET filename = ?, filePath = ? WHERE id = ? AND userId = ?';

      db.query(updateFilenameQuery, [newFilename, newFilePath, fileId, userId], (updateErr) => {
        if (updateErr) {
          console.error('Error updating filename and filePath:', updateErr);
          return res.status(500).json({ message: 'Internal server error' });
        }

        res.json({ message: 'File renamed successfully' });
      });
    });
  });
});



// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

