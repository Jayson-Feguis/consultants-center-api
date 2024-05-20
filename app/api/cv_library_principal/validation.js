import * as Yup from 'yup';

export const validateCreateCVLibraryPrincipal = (data) => Yup.object().shape({
  title: Yup.string().required('Title is required').label('Title'),
}).validate(data);

export const validateUpdateCVLibraryPrincipal = (data) => Yup.object().shape({
  id: Yup.string().required('Hiring Source ID as parameter is required').label('Hiring Source ID'),
  title: Yup.string().required('Title is required').label('Title'),
}).validate(data);