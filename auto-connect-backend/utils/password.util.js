const bcrypt = require("bcrypt");

async function validateUser(user, dbUser) {
  let res = await bcrypt.compare(user.password, dbUser.password);
  return res;
}

function generateRandomPassword(length) {
  // Generate a random password 8 characters long
  let password = "";
  let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_@!$";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    password += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return password;
}

module.exports = {
  validateUser,
  generateRandomPassword,
};
