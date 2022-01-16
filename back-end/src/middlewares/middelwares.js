import { util } from '../util/helpers';
import jwt from 'jsonwebtoken';

export const validateUserAuthData = (req, res, next) => {
  // Check required data is provided and valid
  const email = util.validateEmail(req.body.email) ? req.body.email : false;
  const password = util.validatePassword(req.body.password)
    ? req.body.password
    : false;

  if (!email || !password) {
    res
      .status(400)
      .send('Invalid or missing fields. Please provide email and password');
  } else next();
};

export const validateUserInfoData = (req, res, next) => {
  // Check required data is provided and valid
  let { hairColour, favouriteFood, bio } = req.body;

  hairColour =
    typeof hairColour === 'string' && hairColour.length > 0 ? hairColour : '';
  favouriteFood =
    typeof favouriteFood === 'string' && favouriteFood.length > 0
      ? favouriteFood
      : '';
  bio = typeof bio === 'string' && bio.length > 0 ? bio : '';

  if (hairColour || favouriteFood || bio) {
    res.locals.userNewInfo = { hairColour, favouriteFood, bio };
    next();
  } else {
    res.status(400).send('Invalid Info Data Provided.');
  }
};

export const checkAuthenticatication = (req, res, next) => {
  const { authorization } = req.headers;

  if (authorization) {
    const token = authorization.split(' ')[1];
    // Verify the token is valid
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) res.status(401).send('User not authenticated');
      else {
        res.locals.user = decodedToken;
        next();
      }
    });
  } else res.status(401).send('User not authenticated');
};

export const checkAuthorisation = (req, res, next) => {
  const { userId: userIdFromParm } = req.params;
  // This is set by checkAuthentication middleware
  // after verifying that a valid token exists
  const { _id } = res.locals.user;

  if (userIdFromParm && _id) {
    if (userIdFromParm === _id) {
      next();
    } else res.status(403).send('User Not Authorised');
  } else {
    res.status(500).send('Something went wrong when elaborating your request.');
  }
};
