// Local libraries imports
import { UserModel } from './userModel';

// Instantiate the user services object
export const userServices = {
  register: (userData) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Check if the user already exist
        const userExists = await UserModel.exists({ email: userData.email });

        // If it doesn't exists, go ahead and create it
        if (!userExists) {
          // Create starting info for the user
          userData.info = {
            hairColour: '',
            favouriteFood: '',
            bio: '',
            isVerified: false,
          };
          const newUser = new UserModel(userData);
          let savedUser = await newUser.save();

          const { _id, email, info, isverified } = savedUser;
          resolve({ _id, email, info, isverified });
        } else {
          resolve(false);
        }
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  },

  update: (id, userNewData) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Find the user with the provided Id
        const userUpdated = await UserModel.findOneAndUpdate(
          { _id: id },
          { $set: { info: userNewData } },
          { returnOriginal: false }
        );
        // If a user object is returned, the user was updated correctly
        if (userUpdated) resolve(userUpdated);
        else resolve(false);
      } catch (err) {
        reject(err);
      }
    });
  },

  delete: (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await UserModel.findByIdAndDelete(id);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  },

  authenticate: (userData) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { email, password: providedPassword } = userData;
        // Check if the user  exist
        const user = await UserModel.findOne({ email: email });
        // If it exists
        if (user) {
          const { _id, email, info, isverified } = user;

          // Check if the provided password match the saved password
          if (user.comparePassword(providedPassword)) {
            resolve({ _id, email, info, isverified });
          } else {
            resolve(false);
          }
        } else {
          resolve(false);
        }
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  },

  logout: (req) => {
    return new Promise((resolve, reject) => {
      try {
        // Passport automatically adds a function logout to the request object.
        // Calling it and it will log the user out clearing the login session
        req.logout();
        resolve(true);
      } catch (e) {
        reject(false);
      }
    });
  },
};
