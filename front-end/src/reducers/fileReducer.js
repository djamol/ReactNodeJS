import { UPLOAD_SUCCESS, RENAME_FILE_SUCCESS, FETCH_FILES_SUCCESS, DELETE_FILE_SUCCESS } from '../actions/fileActions';

const initialState = {
  files: [],
  // other properties...
};

const fileReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPLOAD_SUCCESS:
      // Handle the UPLOAD_SUCCESS action here if needed
      // Update the state with the payload from the action
      return {
        ...state,
        // Update the relevant property in the state based on the action payload
      };
    case RENAME_FILE_SUCCESS:
      // Handle the RENAME_FILE_SUCCESS action here
      // Update the state by replacing the old filename with the new filename
      return {
        ...state,
        files: state.files.map((file) => {
          if (file.id === action.payload.id) {
            return { ...file, filename: action.payload.newFilename };
          }
          return file;
        }),
      };

    case FETCH_FILES_SUCCESS:
      // Handle the FETCH_FILES_SUCCESS action here
      // Update the state with the payload from the action
      console.log("fetch:", state);
      console.log("fetch:", action);
      return {
        ...state,
        files: action.payload, // Assuming payload is an array of files
      };

    case DELETE_FILE_SUCCESS:
      // Handle the DELETE_FILE_SUCCESS action here if needed
      // Update the state by removing the deleted file from the files array
      return {
        ...state,
        files: state.files.filter((file) => file !== action.payload),
      };

    // Handle other actions if needed...

    default:
      return state;
  }
};

export default fileReducer;

