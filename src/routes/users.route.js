import { Router } from "express";
import {loginUser, logoutUser, refreshAccessToken, registerUser, changeCurrentPassword, changeUserName, getCurrentUser} from '../controllers/user.controller.js'
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

router.route('/changeUserName').post(verifyJwt, changeUserName)

router.route('/getCurrentUser').post(verifyJwt, getCurrentUser)

router.route('/changeAvatar').post(
  upload.field()
)

export default router