// Local libraries imports
import crypto from 'crypto';

export const util = {
  validateEmail: (email) => {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  },

  validatePassword: (password) => {
    const re =
      /^^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
    return re.test(String(password).toLowerCase());
  },

  // A function to hash a string
  hash: (str) => {
    const hashedStr = crypto
      .createHmac('sha256', process.env.PSW_SECRET)
      .update(str)
      .digest('hex');

    return hashedStr;
  },
};
