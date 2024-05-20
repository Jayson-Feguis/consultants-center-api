import * as Yup from 'yup';
import { LEAVE_DURATION, LEAVE_TYPE, STATUS } from '../../lib/constants.js';
import moment from 'moment';

export const validateCreateLeave = (data) => Yup.object().shape({
  l_type: Yup.string().oneOf([LEAVE_TYPE.VACATION_LEAVE, LEAVE_TYPE.SICK_LEAVE, LEAVE_TYPE.EMERGENCY_LEAVE]).required('Type is required').label('Type'),
  l_duration: Yup.string().oneOf([LEAVE_DURATION.HALF_DAY, LEAVE_DURATION.WHOLE_DAY]).required('Duration is required').label('Duration'),
  l_description: Yup.string().nullable(true).label('Description'),
  l_start: Yup.mixed().required('Start Date is required').label('Start Date'),
  l_end: Yup.mixed().test(
    'is-greater-than-start',
    "End Date can't be before Start Date",
    (value, ctx) => moment(ctx.parent.l_start).isSameOrBefore(moment(value), 'day'),
  ).required('End Date is required').label('End Date'),
}).validate(data);

export const validateUpdateLeave = (data) => Yup.object().shape({
  l_id: Yup.string().required('Leave ID as parameter is required').label('Leave ID'),
  l_type: Yup.string().oneOf([LEAVE_TYPE.VACATION_LEAVE, LEAVE_TYPE.SICK_LEAVE, LEAVE_TYPE.EMERGENCY_LEAVE]).required('Type is required').label('Type'),
  l_duration: Yup.string().oneOf([LEAVE_DURATION.HALF_DAY, LEAVE_DURATION.WHOLE_DAY]).required('Duration is required').label('Duration'),
  l_description: Yup.string().nullable(true).label('Description'),
  l_start: Yup.mixed().required('Start Date is required').label('Start Date'),
  l_end: Yup.mixed().test(
    'is-greater-than-start',
    "End Date can't be before Start Date",
    (value, ctx) => moment(ctx.parent.l_start).isSameOrBefore(moment(value), 'day'),
  ).required('End Date is required').label('End Date'),
}).validate(data);

export const validateApproveAll = (data) => Yup.object().shape({
  status: Yup.string().oneOf([STATUS.APPROVED, STATUS.REJECTED]).required('Status as parameter is required').label('Status'),
}).validate(data);

export const validateApprove = (data) => Yup.object().shape({
  status: Yup.string().oneOf([STATUS.APPROVED, STATUS.REJECTED]).required('Status as parameter is required').label('Status'),
  ids: Yup.array().of(Yup.number()).required('Ids is/are required').label(' Ids'),
}).validate(data);