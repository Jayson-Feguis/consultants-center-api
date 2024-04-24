import { transformResponse, ValidationError } from "../../lib/utils.js";
import { createLocationLog, getLocationLogsByMonth, getOneCurrentLocationLogByUserId, updateLocationLog, updateLocationLogAdjustment } from "./query.js";
import { validateCheckIn, validateCheckOut, validateGetLocationLogsByMonth, validateLogAdjustment } from "./validation.js";

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

export const checkIn = async (req, res) => {
  await validateCheckIn(req.body)
  const { checkedInLocation, checkedInCoordinates } = req.body

  let locationLogs = null

  // TODO: add validation if user is checked in and checked out, then the user checked in again in the same day, it should not create new data, instead, update the checked in to the earliest date
  const [latestLog] = await getOneCurrentLocationLogByUserId(req.dbconnection, req.user.id)

  if (!latestLog) locationLogs = await createLocationLog(req.dbconnection, checkedInLocation, checkedInCoordinates, req.user.id)
  else throw Error(ValidationError('You already checked in today'))

  res.status(201).json(locationLogs);
};

export const checkOut = async (req, res) => {
  await validateCheckOut(req.body)
  const { checkedOutLocation, checkedOutCoordinates } = req.body
  let locationLogs = null
  // TODO: add validation if user is checked in and checked out, then the user checked out again in the same day, it should not create new data, instead, update the checked out to the latest date
  const [latestLog] = await getOneCurrentLocationLogByUserId(req.dbconnection, req.user.id)

  if (latestLog && !latestLog?.checkedout) locationLogs = await updateLocationLog(req.dbconnection, latestLog.id, checkedOutLocation, new Date(), checkedOutCoordinates, req.user.id)
  else throw Error(ValidationError('You already checked out today'))

  res.status(201).json(locationLogs);
};

export const updateLogAdjustment = async (req, res) => {
  console.log(req.body)
  await validateLogAdjustment({ ...req.params, ...req.body })
  const { id } = req.params
  const { date, timeIn, timeOut, remarks } = req.body

  const adjustment = await updateLocationLogAdjustment(req.dbconnection, id, `${date} ${timeIn}`, `${date} ${timeOut}`, remarks)
  console.log(adjustment)
  res.status(201).json(adjustment);
};
