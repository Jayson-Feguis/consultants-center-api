import _ from "lodash";
import { NotFoundError, transformResponse, ValidationError } from "../../lib/utils.js";
import { getLeave, createLeave, updateLeave, deleteLeave, updateApprove, updateApproveAll, getLeaveForApprover, getLeaveDashboard } from "./query.js";
import { validateApprove, validateApproveAll, validateCreateLeave, validateUpdateLeave } from "./validation.js";
import { LEAVE_DURATION, LEAVE_TYPE, STATUS } from "../../lib/constants.js";
import moment from "moment";

export const getLeaves = async (req, res) => {
  const leaves = await getLeave(req.dbconnection, req.query)

  res.status(200).json(transformResponse(leaves));
};

export const getMyLeaves = async (req, res) => {
  const leaves = await getLeave(req.dbconnection, { ..._.omit(req.query, 'createdby'), createdby: `=${req.user.id}` })

  res.status(200).json(transformResponse(leaves));
};

export const getLeavesApprover = async (req, res) => {
  const leaves = await getLeaveForApprover(req.dbconnection, { ..._.omit(req.query, 'createdby') })

  res.status(200).json(transformResponse(leaves));
};

export const getMyLeavesDashboard = async (req, res) => {
  const currentYear = moment().format('YYYY-MM-DD')
  const sum = `
  SUM(
    CASE
      WHEN l_start = l_end THEN
          CASE
              WHEN l_duration = '${LEAVE_DURATION.HALF_DAY}' THEN 0.5
              ELSE 1
          END
      ELSE
          CASE
              WHEN l_duration = '${LEAVE_DURATION.HALF_DAY}' THEN DATEDIFF(l_end, l_start) * 0.5
              ELSE DATEDIFF(l_end, l_start)
          END
    END
  )`

  const emergencyLeavePending = await getLeaveDashboard(req.dbconnection, `${sum} AS emergency_leave`, { l_type: `=${LEAVE_TYPE.EMERGENCY_LEAVE}`, l_status: `=${STATUS.PENDING}`, 'YEAR(l_start)': `=${currentYear}`, 'YEAR(l_end)': `=${currentYear}`, createdby: `=${req.user.id}` })

  const emergencyLeaveApproved = await getLeaveDashboard(req.dbconnection, `${sum} AS emergency_leave`, { l_type: `=${LEAVE_TYPE.EMERGENCY_LEAVE}`, l_status: `=${STATUS.APPROVED}`, 'YEAR(l_start)': `=${currentYear}`, 'YEAR(l_end)': `=${currentYear}`, createdby: `=${req.user.id}` })

  const emergencyLeaveOverall = await getLeaveDashboard(req.dbconnection, `${sum} AS emergency_leave`, { l_type: `=${LEAVE_TYPE.EMERGENCY_LEAVE}`, 'YEAR(l_start)': `=${currentYear}`, 'YEAR(l_end)': `=${currentYear}`, createdby: `=${req.user.id}` })

  const sickLeavePending = await getLeaveDashboard(req.dbconnection, `${sum} AS sick_leave`, { l_type: `=${LEAVE_TYPE.SICK_LEAVE}`, l_status: `=${STATUS.PENDING}`, 'YEAR(l_start)': `=${currentYear}`, 'YEAR(l_end)': `=${currentYear}`, createdby: `=${req.user.id}` })

  const sickLeaveApproved = await getLeaveDashboard(req.dbconnection, `${sum} AS sick_leave`, { l_type: `=${LEAVE_TYPE.SICK_LEAVE}`, l_status: `=${STATUS.APPROVED}`, 'YEAR(l_start)': `=${currentYear}`, 'YEAR(l_end)': `=${currentYear}`, createdby: `=${req.user.id}` })

  const sickLeaveOverall = await getLeaveDashboard(req.dbconnection, `${sum} AS sick_leave`, { l_type: `=${LEAVE_TYPE.SICK_LEAVE}`, 'YEAR(l_start)': `=${currentYear}`, 'YEAR(l_end)': `=${currentYear}`, createdby: `=${req.user.id}` })

  const vacationLeavePending = await getLeaveDashboard(req.dbconnection, `${sum} AS vacation_leave`, { l_type: `=${LEAVE_TYPE.VACATION_LEAVE}`, l_status: `=${STATUS.PENDING}`, 'YEAR(l_start)': `=${currentYear}`, 'YEAR(l_end)': `=${currentYear}`, createdby: `=${req.user.id}` })

  const vacationLeaveApproved = await getLeaveDashboard(req.dbconnection, `${sum} AS vacation_leave`, { l_type: `=${LEAVE_TYPE.VACATION_LEAVE}`, l_status: `=${STATUS.APPROVED}`, 'YEAR(l_start)': `=${currentYear}`, 'YEAR(l_end)': `=${currentYear}`, createdby: `=${req.user.id}` })

  const vacationLeaveOverall = await getLeaveDashboard(req.dbconnection, `${sum} AS vacation_leave`, { l_type: `=${LEAVE_TYPE.VACATION_LEAVE}`, 'YEAR(l_start)': `=${currentYear}`, 'YEAR(l_end)': `=${currentYear}`, createdby: `=${req.user.id}` })

  res.status(200).json(transformResponse({
    emergencyLeave: {
      pending: Number(emergencyLeavePending?.[0]?.emergency_leave ?? 0),
      approved: Number(emergencyLeaveApproved?.[0]?.emergency_leave ?? 0),
      overall: Number(emergencyLeaveOverall?.[0]?.emergency_leave ?? 0),
    },
    sickLeave: {
      pending: Number(sickLeavePending?.[0]?.sick_leave ?? 0),
      approved: Number(sickLeaveApproved?.[0]?.sick_leave ?? 0),
      overall: Number(sickLeaveOverall?.[0]?.sick_leave ?? 0),
    },
    vacationLeave: {
      pending: Number(vacationLeavePending?.[0]?.vacation_leave ?? 0),
      approved: Number(vacationLeaveApproved?.[0]?.vacation_leave ?? 0),
      overall: Number(vacationLeaveOverall?.[0]?.vacation_leave ?? 0),
    }
  }));
};

export const createLeaves = async (req, res) => {
  await validateCreateLeave(req.body)

  const leave = await createLeave(req.dbconnection, { ..._.pick(req.body, ['l_type', 'l_duration', 'l_description', 'l_start', 'l_end']), created: new Date(), createdby: req.user.id, uid: req.user.id })

  res.status(201).json(leave);
};

export const updateLeaves = async (req, res) => {
  await validateUpdateLeave({ ...req.params, ...req.body })

  const leave = await updateLeave(req.dbconnection, _.pick(req.body, ['l_type', 'l_duration', 'l_description', 'l_start', 'l_end']), { l_id: `=${req.params.l_id}` })

  res.status(200).json(leave);
};

export const deleteLeaves = async (req, res) => {
  const { id } = req.params

  if (!id) throw Error(ValidationError('Leave ID as parameter is required'))

  const leave = await deleteLeave(req.dbconnection, id)

  if (leave.affectedRows <= 0) throw Error(NotFoundError('Leave is not found'))

  res.status(200).json({ message: 'Leave deleted successfully' });
};

export const approveAll = async (req, res) => {
  await validateApproveAll({ ...req.params })

  const { status } = req.params

  await updateApproveAll(req.dbconnection, { l_status: status, updatedby: req.user.id, updated: new Date() })

  res.status(201).json({ message: `Leave ${status.toString().toLowerCase()} successfully` });
};


export const approve = async (req, res) => {
  await validateApprove({ ...req.params, ...req.body })
  const { status } = req.params
  const { ids } = req.body

  await Promise.all(ids.map(async id => await updateApprove(req.dbconnection, { l_status: status, updatedby: req.user.id, updated: new Date() }, { l_status: STATUS.PENDING, l_id: id })))

  res.status(201).json({ message: `Leave ${status.toString().toLowerCase()} successfully` });
};