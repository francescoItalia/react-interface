import { userControllers } from '../controllers/userControllers';
import {
  validateUserAuthData,
  validateUserInfoData,
  checkAuthenticatication,
  checkAuthorisation,
} from '../middlewares/middelwares';

export const signupRoute = {
  path: '/api/user/signup',
  method: 'post',
  handlers: [
    validateUserAuthData,
    (req, res) => userControllers.signup(req, res),
  ],
};

export const loginRoute = {
  path: '/api/user/login',
  method: 'post',
  handlers: [
    validateUserAuthData,
    (req, res) => userControllers.login(req, res),
  ],
};

export const updateUserDataRoute = {
  path: '/api/user/:userId',
  method: 'put',
  handlers: [
    checkAuthenticatication,
    checkAuthorisation,
    validateUserInfoData,
    (req, res) => userControllers.update(req, res),
  ],
};
