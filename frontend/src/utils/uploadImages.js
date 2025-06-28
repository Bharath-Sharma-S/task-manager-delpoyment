import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosInstance";

const uploadImage = async (imageFile) => {
  const formData = new FormData();
  //Append image file to formm data
  formData.append('image',imageFile);

  try {
    const response = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE,formData,{
      headers:{
        'Content-Type':'multipart/form-data',//Set header for file upload
      },
    });

    return response.data; // Return response data
  }catch(error) {
    throw error; //Rethrow error gor handling
  }
}

export default uploadImage;