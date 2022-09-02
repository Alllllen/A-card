class AppError extends Error {
  constructor(message, statuscode) {
    super(message);
    this.statusCode = statuscode;
    this.status = `${statuscode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    // Error.captureStackTrace(this, this.contructor);
    // node 8以上會自動忽略 ><
  }
}

module.exports = AppError;
//https://stackoverflow.com/questions/27794750/node-js-with-express-throw-error-vs-nexterror
// https://gist.github.com/slavafomin/b164e3e710a6fc9352c934b9073e7216
