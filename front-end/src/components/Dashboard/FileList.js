import React, { useEffect, useState } from 'react'; // Import useState from 'react'
import { useDispatch } from 'react-redux';
import { renameFile, fetchFiles, deleteFile } from '../../actions/fileActions';

import DashboardHeader from './Header';
const FileList = () => {
  const dispatch = useDispatch();
  //const { files } = useSelector((state) => state.fileReducer);
  const [fetchedData, setFetchedData] = useState([]); // Use useState from 'react'
  const [isRenaming, setIsRenaming] = useState(false);
  const [newFilename, setNewFilename] = useState('');
  const [status_msg, setStatus] = useState(null);
  const [renamingFileId, setRenamingFileId] = useState(null); // renamingFileId
  useEffect(() => {
    // Fetch the files when the component mounts
    fetchfile();
  }, [dispatch]);
  const File_API = "http://107.172.21.30:3000/";
  const handleRename = (id, filename) => {
    // Show the rename input field
    setIsRenaming(true);
    setRenamingFileId(id);
    // Set the current filename in the input field
    setNewFilename(filename);
  };

  const handleRenameSubmit = (id, filename) => {
    // Dispatch the renameFile action
    dispatch(renameFile(id, filename, newFilename)).then((res) => {
      console.log("Rename res", res);
      if (res.message) {
        setStatus(res.message);
        setTimeout(() => {
          setStatus(null);
        }, 5000);
      }
    });
    setRenamingFileId(null);

    // Hide the rename input field
    setIsRenaming(false);
    // Clear the input field
    setNewFilename('');
  };

  const handleDelete = (id, filename) => {
    // Dispatch the deleteFile action
    dispatch(deleteFile(id, filename));
    fetchfile();
  };
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  };
  const fetchfile = () => {
    dispatch(fetchFiles())
      .then((response) => {
        //console.log("dis res",response);  
        // Store the fetched data in the component's state
        setFetchedData(response.payload); // Assuming payload contains the data
      })
      .catch((error) => {
        console.error('Fetch files error:', error);
      });
  }


  return (
    <div>
      <DashboardHeader />
      <h2 className="mb-4">Your Files</h2>
      {fetchedData.length === 0 ? (
        <p className="alert alert-info">No files available.</p>
      ) : (
        <ul className="list-group">
          {status_msg ? (
            <div className="container mt-5">
              <div className="row justify-content-center">
                <div className="col-md-6">
                  <div className="alert alert-primary">
                    <h4 className="alert-heading">Rename</h4>
                    <p>{status_msg}</p>
                  </div>
                </div>
              </div>
            </div>) : null}


          {fetchedData.map((file) => (
            <li className="list-group-item d-flex justify-content-between align-items-center" key={file.id}>
              {isRenaming && file.id === renamingFileId ? (
                <input
                  type="text"
                  value={newFilename}
                  onChange={(e) => setNewFilename(e.target.value)}
                />
              ) : (
                <a href={`${File_API}${file.filePath}`} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                  {file.filename}
                </a>
              )}
              <span>{formatDate(file.created_at)}</span>
              <div>
                {renamingFileId === file.id ? (
                  <button
                    onClick={() => handleRenameSubmit(file.id, file.filename)}
                    className="btn btn-success btn-sm"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => handleRename(file.id, file.filename)}
                    className="btn btn-primary btn-sm"
                  >
                    Rename
                  </button>
                )}
                <button
                  onClick={() => handleDelete(file.id, file.filename)}
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>

  );





};

export default FileList;

