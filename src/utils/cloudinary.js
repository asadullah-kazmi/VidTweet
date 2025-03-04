import {v2 as cloudinary} from 'cloudinary'
import { unlinkSync } from 'node:fs';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath)=>{
  try {
    if(!localFilePath){
      console.log("Local file path does not exist")
      return null
    }
    const response = await cloudinary.uploader.upload(localFilePath,{
      resource_type: 'auto'
    })
    console.log("File is uploaded on cloudinary", response.url)
    unlinkSync(localFilePath)
    return response
  } catch (error) {
    unlinkSync(localFilePath)
    console.log("File cannot be uploaded on cloudinary", error) 
  }

}

export {uploadOnCloudinary}