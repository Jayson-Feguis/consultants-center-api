import * as Yup from 'yup';

export const validateCreateTicket = (data) => Yup.object().shape({
  clientId: Yup.number().required('Client Id is required').label('Client Id'),
  code: Yup.string().required('Code is required').label('Code'),
  module: Yup.number().required('Module is required').label('Module'),
  priority: Yup.number().required('Priority is required').label('Priority'),
  dateCreated: Yup.number().required('Date Created is required').label('Date Created'),
  dateUpdated: Yup.number().required('Date Updated is required').label('Date Updated'),
  createdBy: Yup.string().required('Created By is required').label('Created By'),
  updatedBy: Yup.string().required('Updated By is required').label('Updated By'),
}).validate(data);

export const validateUpdateTicket = (data) => Yup.object().shape({
  id: Yup.string().required('Hiring Source ID as parameter is required').label('Hiring Source ID'),
  clientId: Yup.number().required('Client Id is required').label('Client Id'),
  code: Yup.string().required('Code is required').label('Code'),
  module: Yup.number().required('Module is required').label('Module'),
  priority: Yup.number().required('Priority is required').label('Priority'),
  dateCreated: Yup.number().required('Date Created is required').label('Date Created'),
  dateUpdated: Yup.number().required('Date Updated is required').label('Date Updated'),
  createdBy: Yup.string().required('Created By is required').label('Created By'),
  updatedBy: Yup.string().required('Updated By is required').label('Updated By'),
}).validate(data);