const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')
const Job = require('../models/Job')

const getAllJobs = async (req, res) => {
  const job = await Job.find({ createdBy: req.user.userId }).sort('createdAt')
  res.status(StatusCodes.OK).json({ job, count: job.length })
}
const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId
  const job = await Job.create(req.body)
  res.status(StatusCodes.CREATED).json({ job })
}
const getJob = async (req, res) => {
  const { id: jobId } = req.params
  const job = await Job.findOne({ _id: jobId, createdBy: req.user.userId })
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`)
  }
  res.status(StatusCodes.OK).json({ job })
}
const updateJob = async (req, res) => {
  const { id: jobId } = req.params
  const { company, position } = req.body
  if (company === '' || position === '') {
    throw new BadRequestError('Company or position field cannot be empty')
  }
  const job = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: req.user.userId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  )
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`)
  }
  res.status(StatusCodes.CREATED).json({ job })
}
const deleteJob = async (req, res) => {
  const { id: jobId } = req.params
  const job = await Job.findOneAndDelete({
    _id: jobId,
    createdBy: req.user.userId,
  })
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`)
  }
  res.status(StatusCodes.NO_CONTENT).json({ job })
}

module.exports = {
  getAllJobs,
  createJob,
  getJob,
  updateJob,
  deleteJob,
}
