import * as Yup from 'yup';
import { STATUS } from '../../lib/constants.js';

export const validateCreateOvertime = (data) => Yup.object().shape({
  lot_project: Yup.string().nullable(true).label('Project'),
  lot_date: Yup.mixed().nullable(true).label('Date'),
  lot_timein: Yup.mixed().nullable(true).label('Time In'),
  lot_timeout: Yup.mixed().nullable(true).label('Time Out'),
  lot_total_ot: Yup.number().nullable(true).label('Total OT'),
  lot_remarks: Yup.string().nullable(true).label('Remarks'),
  lot_ot_status: Yup.string().oneOf([STATUS.PENDING, STATUS.REJECTED, STATUS.REJECTED]).nullable(true).label('OT Status'),
  lot_approver_remarks: Yup.string().nullable(true).label('Approver Remarks'),
}).validate(data);

export const validateUpdateOvertime = (data) => Yup.object().shape({
  lot_id: Yup.string().required('OT ID as parameter is required').label('OT ID'),
  lot_project: Yup.string().nullable(true).label('Project'),
  lot_date: Yup.mixed().nullable(true).label('Date'),
  lot_timein: Yup.mixed().nullable(true).label('Time In'),
  lot_timeout: Yup.mixed().nullable(true).label('Time Out'),
  lot_total_ot: Yup.number().nullable(true).label('Total OT'),
  lot_remarks: Yup.string().nullable(true).label('Remarks'),
  lot_ot_status: Yup.string().oneOf([STATUS.PENDING, STATUS.APPROVED, STATUS.REJECTED]).nullable(true).label('OT Status'),
  lot_approver_remarks: Yup.string().nullable(true).label('Approver Remarks'),
}).validate(data);

export const validateApproveAll = (data) => Yup.object().shape({
  status: Yup.string().oneOf([STATUS.APPROVED, STATUS.REJECTED]).required('Status as parameter is required').label('Status'),
}).validate(data);

export const validateApprove = (data) => Yup.object().shape({
  ids: Yup.array().of(Yup.number()).required('OT Ids is/are required').label('OT Ids'),
  status: Yup.string().oneOf([STATUS.APPROVED, STATUS.REJECTED]).required('Status as parameter is required').label('Status'),
  lot_approver_remarks: Yup.string().when('status', {
    is: (value) => value && value === STATUS.REJECTED,
    then: (schema) => schema.required('As status is rejected, remarks is required'),
    otherwise: (schema) => schema.notRequired()
  }).label('Approver Remarks')
}).validate(data);