const crypto = require("crypto");


function randomCodeString(length = 20) {

    return crypto.randomBytes(length).toString("hex").slice(0, length);
    
  }

  module.exports = randomCodeString