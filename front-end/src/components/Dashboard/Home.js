import React, { useEffect, useState } from 'react'; // Import useState from 'react'
import { useDispatch } from 'react-redux';
import { fetchFiles, deleteFile } from '../../actions/fileActions';
import DashboardHeader from './Header';
import Cookies from 'js-cookie';

const FileList = () => {
  const dispatch = useDispatch();
  //const { files } = useSelector((state) => state.fileReducer);
  const [fetchedData, setFetchedData] = useState([]); // Use useState from 'react'
  const token = Cookies.get('token');
  useEffect(() => {
    // Fetch the files when the component mounts
    fetchfile();
  }, [dispatch]);
  const File_API ="http://107.172.21.30:3000/";

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
      {token ? (
        <div>
          <h2 className="mb-4">Your Files</h2>
          {fetchedData.length === 0 ? (
            <p className="alert alert-info">No files available.</p>
          ) : (
            <ul className="list-group">
              {fetchedData.map((file) => (
                <li className="list-group-item d-flex justify-content-between align-items-center" key={file.id}>
                  <a href={`${File_API}${file.filePath}`} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                    {file.filename}
                  </a>
                  <span>{formatDate(file.created_at)}</span>
                  <button
                    onClick={() => handleDelete(file.id, file.filename)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="alert alert-danger">
                <h4 className="alert-heading">Welcome Guest!</h4>
                <p>You are not logged in. Please log in to use the service</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileList;

