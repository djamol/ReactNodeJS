import React, { useState } from 'react';
import { useDispatch /*useSelector*/ } from 'react-redux';
import { uploadFile } from '../../actions/fileActions';
//import Cookies from 'js-cookie';
import DashboardHeader from './Header';
const FileUpload = () => {
  const dispatch = useDispatch();
  //const state = useSelector((state) => state);
  //const token = Cookies.get('token');

  //  console.log('State variables:', state);

  const [file, setFile] = useState(null);
  const [status_msg, setStatus] = useState(null);
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append('file', file);
    dispatch(uploadFile(formData)).then((res) => {
      console.log("upload res", res);
      if (res.message) {
        setStatus(res.message); // Set error
      }
    });
  };

  return (
    <div >
      <DashboardHeader />
      {status_msg ? (
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="alert alert-danger">
                <h4 className="alert-heading">{status_msg}</h4>
              </div>
            </div>
          </div>
        </div>) : null}

      <div className="row mt-4">
        <div className="col-md-6 offset-md-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Upload File</h5>
              <div className="form-group">
                <input
                  name="file"
                  type="file"
                  className="form-control-file"
                  onChange={handleFileChange}
                />
              </div>
              <button
                className="btn btn-primary"
                onClick={handleUpload}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;


