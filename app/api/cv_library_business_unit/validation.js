import * as Yup from 'yup';

export const validateCreateCVLibraryBusinessUnit = (data) => Yup.object().shape({
  title: Yup.string().required('Title is required').label('Title'),
}).validate(data);

export const validateUpdateCVLibraryBusinessUnit = (data) => Yup.object().shape({
  id: Yup.string().required('Hiring Source ID as parameter is required').label('Hiring Source ID'),
  title: Yup.string().required('Title is required').label('Title'),
}).validate(data);