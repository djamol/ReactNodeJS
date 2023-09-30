// fileActions.js
import axiosInstance from '../api';
import Cookies from 'js-cookie';

// Action Types
export const UPLOAD_SUCCESS = 'UPLOAD_SUCCESS';
export const FETCH_FILES_SUCCESS = 'FETCH_FILES_SUCCESS';
export const DELETE_FILE_SUCCESS = 'DELETE_FILE_SUCCESS';
export const RENAME_FILE_SUCCESS = 'RENAME_FILE_SUCCESS';

//const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
//const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const token = Cookies.get('token');
const headers = {
  Authorization: `${token}`,
};

// Action Creators
export const uploadFile = (formData) => async (dispatch) => {
  try {
    const token = Cookies.get('token');
    const headers = {
      'Content-Type': 'multipart/form-data',
      Authorization: `${token}`, //x
    };

    const response = await axiosInstance.post('/upload', formData, {
      headers
    });
    // Dispatch UPLOAD_SUCCESS action
    dispatch({ type: UPLOAD_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    console.error('File upload error:', error);
    if (error.response.data.message) {
      return { message: 'Error: File Upload ->' + error.response.data.message, data: error };
    } else if (error.response.data) {
      return { message: 'Error: File Upload ->' + error.response.data, data: error };
    } else {
      return { message: 'Error: File Upload', data: error };
    }

  }
};


export const renameFile = (id, filename, newFilename) => async (dispatch) => {
  try {
    const response = await axiosInstance.put(`/files/${id}/rename`, { newFilename }, { headers });
    // Dispatch RENAME_FILE_SUCCESS action
    dispatch({ type: RENAME_FILE_SUCCESS, payload: { id, newFilename } });
    return response.data;
  } catch (error) {
    console.error('Rename file error:', error);
    if (error.response.data.message) {
      return { message: 'Error: File Rename ->' + error.response.data.message, data: error };
    } else if (error.response.data) {
      return { message: 'Error: File Rename ->' + error.response.data, data: error };
    } else {
      return { message: 'Error: File Rename', data: error };
    }
  }
};

export const fetchFiles = () => async (dispatch) => {
  try {
    const response = await axiosInstance.get('/files', { headers });
    // Dispatch FETCH_FILES_SUCCESS action
    console.log("r", response);
    if (response.status == 200) {
      dispatch({ type: FETCH_FILES_SUCCESS, payload: response.data });
      return { payload: response.data };
    }
  } catch (error) {
    console.error('Fetch files error:', error);
  }
};

export const deleteFile = (id, filename) => async (dispatch) => {
  try {
    await axiosInstance.delete(`/files/${id}/${filename}`, { headers });
    // Dispatch DELETE_FILE_SUCCESS action
    dispatch({ type: DELETE_FILE_SUCCESS, payload: filename });
  } catch (error) {
    console.error('Delete file error:', error);
  }
};

