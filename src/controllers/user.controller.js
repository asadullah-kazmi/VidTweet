import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.model.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import {ApiResponse}  from '../utils/ApiResponse.js'

const generateRefreshAndAccessToken = async (userId) =>{
  try {
    const user = await User.findById(userId)
  
    const refreshToken = user.generateAccessToken()
    const accessToken = user.generateRefreshToken()
  
    user.refreshToken = refreshToken
    await user.save({validateBeforeSave: false})
  
    return {refreshToken, accessToken}
  } catch (error) {
    throw new ApiError(500, "Could not generate refresh and access token")
  }
}


const registerUser = asyncHandler ( async (req, res) =>{
  // Get data from frontend
  // Fields authentication
  // Check if the user already exist
  // Check for uploaded file: Avatar required
  // Upload files on cloudinary
  // Create user on mongo db
  // Check if the user if created successfully
  // Remove the unnecessary fields from response
  // return response

  const {email, userName, fullName, password} = req.body

  console.log("User Name: ", userName)
  console.log(req.body)
  
  if(
    [email, userName, fullName, password].some((field)=> field.trim() === "")
  ){
    throw new ApiError(409, "All fields are required")
  }

  const userFound = await User.findOne({
    $or:[{userName}, {email}]
  }
  )
  if(userFound){
    throw new ApiError(401, "User with this email or username already exist")
  }

  const avatarLocalFilePath = req.files?.avatar[0]?.path
//  const coverImageLocalFilePath = req.files?.coverImage[0]?.path
  let coverImageLocalFilePath;
  if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
    coverImageLocalFilePath = req.files.coverImage[0].path
  }

  if(!avatarLocalFilePath){
    throw new ApiError(401, "Avatar is required")
  }

  const avatar = await uploadOnCloudinary(avatarLocalFilePath)
  const coverImage = await uploadOnCloudinary(coverImageLocalFilePath)

  if(!avatar){
    throw new ApiError(500, "Avatar file is not uploaded on cloudinary")
  }

  const user = User.create({
    email, 
    userName: userName.toLowerCase(),
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || '',
    password,
  })

  const createdUser = User.findById(user._id).select(
    "-password -refreshToken"
  )

  if(!createdUser){
    throw new ApiError(500, "User is not created in database")
  }

  return res.status(201).json(
    {
      'id': createdUser._id,
      'userName': userName,
      'email': email,
      'fullName': fullName,
      'message': "User is created successfully"
    }
  )
})

const loginUser = asyncHandler( async (req, res) =>{
  // req.body -> data
  // Search user in db
  // Validate password
  // generate refresh and access token 
  // return cookies

  const {email, userName, password} = req.body

  if(!email || !userName){
    throw new ApiError(401, "UserName or email is required to login")
  }

  const user = await User.findOne({
    $or:[{userName}, {email}]
  })

  if(!user){
    throw new ApiError(402, "User does not exist")
  }

  const validatePassword = await user.isPasswordCorrect(password)

  if(!validatePassword){
    throw new ApiError(403, "Incorrect password")
  }

  const {refreshToken, accessToken } = await generateRefreshAndAccessToken(user._id)

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

  const option = {
    httpOnly: true,
    secure: true
  }

  return res
  .status(200)
  .cookie("accessToken", accessToken, option)
  .cookie("refreshToken", refreshToken, option)
  .json(
    new ApiResponse(
      200,
      {
        user: loggedInUser, refreshToken, accessToken
      }, 
      "User logged in successfully"
    )
  )
})

const logoutUser = asyncHandler( async (req, res) =>{
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined
      },
    },
    {
      new: true
    }

  )

  const option = {
    httpOnly: true,
    secure: true
  }

  return res
  .status(200)
  .clearCookies("accessToken", option)
  .clearCookies("refreshToken", option)
  .json(
    new ApiResponse(200, {}, "logged out successfully")
  )

})

export {registerUser, loginUser, logoutUser}