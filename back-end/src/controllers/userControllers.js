// Local libraries imports
import { userServices } from '../models/userServices';
import jwt from 'jsonwebtoken';

// Instantiate the user controllers object
export const userControllers = {
  signup: async (req, res) => {
    const { email, password } = req.body;
    try {
      // If input are provided and valid, call the register service
      const registeredUser = await userServices.register({
        email,
        password,
      });

      if (registeredUser) {
        // If the user was registered correctly, create and sign a JWT
        jwt.sign(
          registeredUser,
          process.env.JWT_SECRET,
          { expiresIn: '2d' },
          (err, token) => {
            if (!err) res.status(200).json({ token });
            else
              res.status(500).send('Something went wrong signing the token!');
          }
        );
      } else
        res.status(400).send(
          `Something went wrong while saving the user! 
            It might already exists`
        );
    } catch (e) {
      res.status(500).send('Something went wrong while saving the user!');
    }
  },

  update: async (req, res) => {
    const { hairColour, favouriteFood, bio } = res.locals.userNewInfo;
    const { _id } = res.locals.user;

    const updatedUser = await userServices.update(_id, {
      hairColour,
      favouriteFood,
      bio,
    });
    // If a user object is returned, the user was correclty updated
    if (updatedUser) {
      const { _id, email, isVerified, info } = updatedUser;
      // Create and sign a JWT
      jwt.sign(
        { _id, email, isVerified, info },
        process.env.JWT_SECRET,
        { expiresIn: '2d' },
        (err, token) => {
          if (!err) res.status(200).json({ token });
          else res.status(500).send('Something went wrong signing the token!');
        }
      );
    } else res.status(500).send('Something went wrong updating the user');
  },

  delete: async (req, res) => {
    // Check required data is provided
    const id =
      typeof req.params.id === 'string' && req.params.id.length > 3
        ? req.params.id
        : false;

    if (id) {
      try {
        // If input are provided and valid, call the delete service
        const userDeleted = await userServices.delete(id);
        if (userDeleted) res.status(200).send('User Deleted!');
      } catch (err) {
        res
          .status(500)
          .send({ err: 'Something went wrong while deleting the user!' });
      }
    } else {
      res
        .status(400)
        .send({ err: 'Invalid or missing fields. Please provide user id' });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      // Call the login service, if no rejections, user is logged in
      const userAuthenticated = await userServices.authenticate({
        email,
        password,
      });
      if (userAuthenticated) {
        jwt.sign(
          userAuthenticated,
          process.env.JWT_SECRET,
          { expiresIn: '2d' },
          (err, token) => {
            if (!err) res.status(200).json({ token });
            else
              res.status(500).send('Something went wrong signing the token!');
          }
        );
      } else {
        res.status(401).send('User not found or wrong password!');
      }
    } catch (e) {
      res.status(e.status).send(e.message);
    }
  },

  logout: async (req, res) => {
    try {
      // Call the logout service, if no rejections, user is logged out
      await userServices.logout(req);
      res.status(200).send('User Logged out!');
    } catch (e) {
      res.status(500).send('Something went wrong while logginf the user out');
    }
  },
};
