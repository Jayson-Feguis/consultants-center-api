import { transformResponse, ValidationError } from "../../lib/utils.js";
import { createLocationLog, getLocationLogsAdjustments, getLocationLogsByMonth, getOneCurrentLocationLogByUserId, updateApprove, updateApproveAll, updateLocationLog, updateLocationLogAdjustment } from "./query.js";
import { validateApprove, validateApproveAll, validateCheckIn, validateCheckOut, validateGetLocationLogsByMonth, validateLogAdjustment } from "./validation.js";

export const getLocationLogByMonth = async (req, res) => {
  await validateGetLocationLogsByMonth(req.params)
  const { year, month } = req.params

  const locationLogs = await getLocationLogsByMonth(req.dbconnection, year, month)

  res.status(200).json(transformResponse(locationLogs));
};

export const getCurrentLocationLog = async (req, res) => {
  const locationLogs = await getOneCurrentLocationLogByUserId(req.dbconnection, req.user.id)

  res.status(200).json(transformResponse(locationLogs));
};

export const getLocationLogAdjustments = async (req, res) => {
  const locationLogsAdjustments = await getLocationLogsAdjustments(req.dbconnection, req.query)

  res.status(200).json(transformResponse(locationLogsAdjustments));
};

export const checkIn = async (req, res) => {
  await validateCheckIn(req.body)
  const { checkedInLocation, checkedInCoordinates } = req.body

  let locationLogs = null

  const [latestLog] = await getOneCurrentLocationLogByUserId(req.dbconnection, req.user.id)

  if (!latestLog) locationLogs = await createLocationLog(req.dbconnection, checkedInLocation, checkedInCoordinates, req.user.id)
  else throw Error(ValidationError('You already checked in today'))

  res.status(201).json(locationLogs);
};

export const checkOut = async (req, res) => {
  await validateCheckOut(req.body)
  const { checkedOutLocation, checkedOutCoordinates } = req.body

  let locationLogs = null

  const [latestLog] = await getOneCurrentLocationLogByUserId(req.dbconnection, req.user.id)

  if (latestLog && !latestLog?.checkedout) locationLogs = await updateLocationLog(req.dbconnection, latestLog.id, checkedOutLocation, new Date(), checkedOutCoordinates, req.user.id)
  else throw Error(ValidationError('You already checked out today'))

  res.status(201).json(locationLogs);
};

export const updateLogAdjustment = async (req, res) => {
  await validateLogAdjustment({ ...req.params, ...req.body })
  const { id } = req.params
  const { date, timeIn, timeOut, remarks } = req.body

  const adjustment = await updateLocationLogAdjustment(req.dbconnection, id, `${date} ${timeIn}`, `${date} ${timeOut}`, remarks)

  res.status(201).json(adjustment);
};

export const approveAll = async (req, res) => {
  await validateApproveAll({ ...req.params })
  const { status } = req.params

  await updateApproveAll(req.dbconnection, status)

  res.status(201).json({ message: `Location Logs ${status.toString().toLowerCase()} successfully` });
};


export const approve = async (req, res) => {
  await validateApprove({ ...req.params, ...req.body })
  const { status } = req.params
  const { ids } = req.body

  await Promise.all(ids.map(async id => await updateApprove(req.dbconnection, id, status)))

  res.status(201).json({ message: `Location Logs ${status.toString().toLowerCase()} successfully` });
};
