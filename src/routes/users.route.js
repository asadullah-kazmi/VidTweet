import { Router } from "express";
import {loginUser, logoutUser, refreshAccessToken, registerUser, changeCurrentPassword, changeUserName, getCurrentUser , updateAvatar, updateCoverImage, getChannelDetails, getWatchHistory} from '../controllers/user.controller.js'
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";



const router = Router()

router.route('/register').post(
  upload.fields([
    {
      name: 'avatar',
      maxCount: 1
    },
    {
      name: 'coverImage',
      maxCount: 1
    }
  ]),
  registerUser
)

router.route('/login').post(loginUser)

router.route('/logout').post(verifyJwt, logoutUser)

router.route('/refreshtokens').post(refreshAccessToken)

router.route('/changePassword').post( verifyJwt, changeCurrentPassword )

router.route('/changeUserName').patch(verifyJwt, changeUserName)

router.route('/getCurrentUser').get(verifyJwt, getCurrentUser)

router.route('/avatar').post(verifyJwt, upload.single("avatar"), updateAvatar)

router.route('/coverImage').post(verifyJwt, upload.single("coverImage"))

router.route('/c/:userName').get(verifyJwt, getChannelDetails)

router.route('/watchHistory').get(verify, getWatchHistory)



export default router