import * as Yup from 'yup';

export const validateCreateMenu = (data) => Yup.object().shape({
  parentId: Yup.mixed().nullable(true).label('Parent ID'),
  name: Yup.string().required('Menu name is required').label('Menu name'),
  icon: Yup.string().required('Icon is required').label('Icon'),
  component: Yup.string().when('parentId', {
    is: (value) => !value,
    then: (schema) =>
      schema.required(`As parentId doesn't have value, component is required`),
    otherwise: (schema) => schema.nullable(true)
  }).label('Component'),
  path: Yup.string().when('parentId', {
    is: (value) => !value,
    then: (schema) =>
      schema.required(`As parentId doesn't have value, path is required`),
    otherwise: (schema) => schema.nullable(true)
  }).label('Path'),
}).validate(data);