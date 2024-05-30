import * as Yup from 'yup';
import { TICKET_CLASSIFICATION, TICKET_STATUS, TICKET_TYPE } from '../../lib/constants.js';

export const validateCreateTicket = (data) => Yup.object().shape({
  t_cid: Yup.number().required('Client ID is required').label('Client ID'),
  t_title: Yup.string().required('Title is required').label('Title'),
  t_desc: Yup.string().nullable(true).label('Description'),
  t_status: Yup.string().oneOf([TICKET_STATUS.CANCEL, TICKET_STATUS.CHANGE, TICKET_STATUS.CLOSED, TICKET_STATUS.NEW, TICKET_STATUS.ONHOLD, TICKET_STATUS.PENDING, TICKET_STATUS.VOID]).required('Ticket Status is required').label('Ticket Status'),
  t_module: Yup.number().required('Module is required').label('Module'),
  t_priority: Yup.number().required('Priority is required').label('Priority'),
  t_tickettype: Yup.string().oneOf([TICKET_TYPE.CUSTOMIZATION, TICKET_TYPE.ENHANCEMENT, TICKET_TYPE.FIX, TICKET_TYPE.OTHERS]).required('Ticket Type is required').label('Ticket Type'),
  t_targetdate: Yup.date().required('Target Date is required').label('Target Date'),
  t_classification: Yup.string().oneOf([TICKET_CLASSIFICATION.CHANGE_REQUEST, TICKET_CLASSIFICATION.CLOUD, TICKET_CLASSIFICATION.CRET, TICKET_CLASSIFICATION.INCIDENT]).required('Classification is required').label('Classification'),
}).validate(data);

export const validateUpdateTicket = (data) => Yup.object().shape({
  t_id: Yup.string().required('Ticket ID as parameter is required').label('Ticket ID'),
  t_cid: Yup.number().required('Client ID is required').label('Client ID'),
  t_title: Yup.string().required('Title is required').label('Title'),
  t_desc: Yup.string().nullable(true).label('Description'),
  t_status: Yup.string().oneOf([TICKET_STATUS.CANCEL, TICKET_STATUS.CHANGE, TICKET_STATUS.CLOSED, TICKET_STATUS.NEW, TICKET_STATUS.ONHOLD, TICKET_STATUS.PENDING, TICKET_STATUS.VOID]).required('Ticket Status is required').label('Ticket Status'),
  t_module: Yup.number().required('Module is required').label('Module'),
  t_priority: Yup.number().required('Priority is required').label('Priority'),
  t_tickettype: Yup.string().oneOf([TICKET_TYPE.CUSTOMIZATION, TICKET_TYPE.ENHANCEMENT, TICKET_TYPE.FIX, TICKET_TYPE.OTHERS]).required('Ticket Type is required').label('Ticket Type'),
  t_targetdate: Yup.date().required('Target Date is required').label('Target Date'),
  t_classification: Yup.string().oneOf([TICKET_CLASSIFICATION.CHANGE_REQUEST, TICKET_CLASSIFICATION.CLOUD, TICKET_CLASSIFICATION.CRET, TICKET_CLASSIFICATION.INCIDENT]).required('Classification is required').label('Classification'),
}).validate(data);