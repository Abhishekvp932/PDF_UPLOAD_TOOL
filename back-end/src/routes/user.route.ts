import express from 'express';
import { UserController } from '../controller/user/user.controller';

const router = express.Router();
const userController = new UserController();

router.route('/users')
.post(userController.signup.bind(userController));



export default router;