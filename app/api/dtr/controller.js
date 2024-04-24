import { createDTR } from "./query.js";
import { validateCheckIn } from "./validation.js";

export const checkIn = async (req, res) => {
  await validateCheckIn(req.body)
  const { checkInLocation } = req.body

  const dtr = await createDTR(req.dbconnection, checkInLocation)

  res.status(201).json(dtr);
};