const { StatusCodes } = require('http-status-codes')

const errorHandler = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || `Something went wrong , please try again later`,
  }

  if (err.code === 11000) {
    customError.statusCode = StatusCodes.BAD_REQUEST
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field , please use another value`
  }

  if (err.name === 'ValidationError') {
    customError.statusCode = StatusCodes.BAD_REQUEST
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(',')
  }
  if (err.name === 'CastError') {
    customError.statusCode = StatusCodes.NOT_FOUND
    customError.msg = `No job with id : ${err.value}`
  }

  //return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(customError.statusCode).json({ msg: customError.msg })
}

module.exports = errorHandler
