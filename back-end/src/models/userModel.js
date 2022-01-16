// External Libraries import
import mongoose from 'mongoose';

// Local libraries imports
import { util } from '../util/helpers.js';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      index: { unique: true },
      minlength: 3,
      validate: {
        validator: util.validateEmail,
      },
    },

    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      validate: {
        validator: util.validatePassword,
      },
    },

    info: {
      hairColour: {
        type: String,
        required: false,
        trim: true,
      },
      favouriteFood: {
        type: Object,
        required: false,
        trim: true,
      },
      bio: {
        type: Object,
        required: false,
        trim: true,
      },
    },

    isVerified: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

// Before saveing a new user
userSchema.pre('save', function (next) {
  const user = this;
  try {
    // Hash user password
    const hash = util.hash(user.password);
    user.password = hash;
    return next();
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// Create a password compare function to use to compare passwords inputted by the user during login
// This method will be available on every document that comes back from the database
userSchema.methods.comparePassword = function (inputPassw) {
  // Only accept strings
  if (typeof inputPassw === 'string') {
    return util.hash(inputPassw) === this.password;
  } else {
    return false;
  }
};

export const UserModel = mongoose.model('User', userSchema);
