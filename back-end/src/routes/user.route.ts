import express from 'express';
import { UserController } from '../controller/user/user.controller';
import { UserService } from '../service/user/user.service';
import { UserRepository } from '../repository/user/user.repository';
import { upload } from '../middleware/upload';
import { UserPdfReposiory } from '../repository/userPdf/userPdf.repository';

const router = express.Router();
const userRepository = new UserRepository();
const userPdfRepository = new UserPdfReposiory();
const userService = new UserService(userRepository,userPdfRepository);
const userController = new UserController(userService);

router.route('/singup')
.post(userController.signup.bind(userController));

router.route('/login')
.post(userController.login.bind(userController));


router.route('/extract/:userId')
.post(upload.single('pdf'),userController.extractPdf.bind(userController));


router.route('/history/:userId')
.get(userController.getHistory.bind(userController));
export default router;