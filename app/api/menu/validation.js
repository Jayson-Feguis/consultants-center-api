import * as Yup from 'yup';

export const validateCreateMenu = (data) => Yup.object().shape({
  parentId: Yup.mixed().nullable(true).label('Parent ID'),
  name: Yup.string().required('Menu name is required').label('Menu name'),
  icon: Yup.string().required('Icon is required').label('Icon'),
  component: Yup.string().nullable(true).label('Component'),
  path: Yup.string().nullable(true).label('Path'),
}).validate(data);