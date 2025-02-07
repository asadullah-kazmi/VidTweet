import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from 'jsonwebtoken'
import { User } from "../models/user.model";


export const verifyJwt = asyncHandler( async (req, res, next) =>{
 try {
  const token =  req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")
 
  if(!token){
   throw new ApiError(404, "Unathorized Request")
  }
 
  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
 
  const user = await User.findById(decodedToken._id).select("-password -refreshToken")
 
  if(!user){
   throw new ApiError(405, "Invalid access token")
  }
 
  req.user = user
  next()
 } catch (error) {
  throw new ApiError(500, "Something went wrong while authorizing the user for logout")
 }

})