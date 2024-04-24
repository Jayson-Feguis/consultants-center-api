import * as Yup from 'yup';

export const validateCreateAnnouncement = (data) => Yup.object().shape({
  title: Yup.mixed().required('Title is required').label('Title'),
  description: Yup.mixed().nullable(true).label('Description'),
  isActive: Yup.string().oneOf(['YES', 'NO']).required('Is active is required').label('Is active'),
}).validate(data);

export const validateUpdateAnnouncement = (data) => Yup.object().shape({
  title: Yup.mixed().required('Title is required').label('Title'),
  description: Yup.mixed().nullable(true).label('Description'),
  isActive: Yup.string().oneOf(['YES', 'NO']).required('Is active is required').label('Is active'),
}).validate(data);