import _ from "lodash";
import { generateCutOff, NotFoundError, transformResponse, ValidationError } from "../../lib/utils.js";
import { getOvertime, createOvertime, updateOvertime, deleteOvertime, getOvertimeDashboard, updateApprove, updateApproveAll, getOvertimeForApprover } from "./query.js";
import { validateApprove, validateApproveAll, validateCreateOvertime, validateUpdateOvertime } from "./validation.js";
import moment from "moment";
import { STATUS } from "../../lib/constants.js";

export const getOvertimes = async (req, res) => {
  const overtimes = await getOvertime(req.dbconnection, req.query)

  res.status(200).json(transformResponse(overtimes));
};

export const getMyOvertimes = async (req, res) => {
  const overtimes = await getOvertime(req.dbconnection, { ..._.omit(req.query, 'lot_createdby'), lot_createdby: `=${req.user.id}` })

  res.status(200).json(transformResponse(overtimes));
};

export const getOvertimesApprover = async (req, res) => {
  const overtimes = await getOvertimeForApprover(req.dbconnection, { ..._.omit(req.query, 'lot_createdby') })

  res.status(200).json(transformResponse(overtimes));
};

export const getMyOvertimesDashboard = async (req, res) => {
  const cutoff = generateCutOff(new Date(), 1)[0]
  const pending = await getOvertimeDashboard(req.dbconnection, 'SUM(lot_total_ot) as pending_total_ot', { lot_ot_status: STATUS.PENDING, lot_date: `${cutoff.fromDate},${cutoff.toDate}`, lot_createdby: `=${req.user.id}` })
  const approved = await getOvertimeDashboard(req.dbconnection, 'SUM(lot_total_ot) as approved_total_ot', { lot_ot_status: STATUS.APPROVED, lot_date: `${cutoff.fromDate},${cutoff.toDate}`, lot_createdby: `=${req.user.id}` })
  const overall = await getOvertimeDashboard(req.dbconnection, 'SUM(lot_total_ot) as overall_total_ot', { lot_date: `${cutoff.fromDate}, ${cutoff.toDate}`, lot_createdby: `=${req.user.id}` })

  res.status(200).json(transformResponse({ pending: Number(pending?.[0].pending_total_ot ?? 0), approved: Number(approved?.[0].approved_total_ot ?? 0), overall: Number(overall?.[0].overall_total_ot ?? 0) }));
};

export const createOvertimes = async (req, res) => {
  await validateCreateOvertime(req.body)

  const overtime = await createOvertime(req.dbconnection, { ..._.pick({ ...req.body, lot_total_ot: moment(req.body?.lot_timeout).diff(moment(req.body?.lot_timein), 'minutes') / 60, lot_created: new Date() }, ['lot_project', 'lot_date', 'lot_timein', 'lot_timeout', 'lot_remarks', 'lot_total_ot', 'lot_created', 'lot_createdby']), lot_createdby: req.user.id })

  res.status(201).json(overtime);
};

export const updateOvertimes = async (req, res) => {
  await validateUpdateOvertime({ ...req.params, ...req.body })

  const overtime = await updateOvertime(req.dbconnection, req.body, req.params)

  res.status(200).json(overtime);
};

export const deleteOvertimes = async (req, res) => {
  const { id } = req.params

  if (!id) throw Error(ValidationError('Overtime ID as parameter is required'))

  const overtime = await deleteOvertime(req.dbconnection, id)

  if (overtime.affectedRows <= 0) throw Error(NotFoundError('Overtime is not found'))

  res.status(200).json({ message: 'Overtime deleted successfully' });
};

export const approveAll = async (req, res) => {
  await validateApproveAll({ ...req.params })

  const { status } = req.params


  await updateApproveAll(req.dbconnection, { lot_ot_status: status, lot_updatedby: req.user.id, lot_updated: new Date() })

  res.status(201).json({ message: `Overtime ${status.toString().toLowerCase()} successfully` });
};


export const approve = async (req, res) => {
  await validateApprove({ ...req.params, ...req.body })
  const { status } = req.params
  const { ids } = req.body

  await Promise.all(ids.map(async id => await updateApprove(req.dbconnection, { ..._.pick(req.body, ['lot_approver_remarks']), lot_ot_status: status, lot_updatedby: req.user.id, lot_updated: new Date() }, { lot_ot_status: STATUS.PENDING, lot_id: id })))

  res.status(201).json({ message: `Overtime ${status.toString().toLowerCase()} successfully` });
};