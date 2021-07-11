const path = require('path');

require('dotenv-safe').config({
    path: path.join(__dirname, '../.env'),
    sample: path.join(__dirname, '../.env.example'),
});
console.log('process.env.PORT: ', process.env.PORT);
module.exports = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    mongo: {
        uri: process.env.MONGO_URI,
  },
};