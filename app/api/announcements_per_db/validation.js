import * as Yup from 'yup';

export const validateCreateAnnouncementPerDb = (data) => Yup.object().shape({
  title: Yup.mixed().required('Title is required').label('Title'),
  description: Yup.mixed().nullable(true).label('Description'),
  isCustom: Yup.bool().label('Is Custom'),
  receiver: Yup.array().when('isCustom', {
    is: (value) => value,
    then: (schema) => schema.of(Yup.number())
      .test(
        'selectedReceiver',
        'At least one receiver must be selected',
        (value) => value && value.length > 0,
      )
      .min(1, 'At least one receiver must be selected',)
      .required('At least one receiver is required'),
    otherwise: (schema) => schema.notRequired()
  })
}).validate(data);

export const validateUpdateAnnouncementPerDb = (data) => Yup.object().shape({
  title: Yup.mixed().required('Title is required').label('Title'),
  description: Yup.mixed().nullable(true).label('Description'),
  isActive: Yup.string().oneOf(['YES', 'NO']).required('Is active is required').label('Is active'),
  isCustom: Yup.bool().label('Is Custom').required('Is Custom is required'),
  receiver: Yup.array().when('isCustom', {
    is: (value) => value,
    then: (schema) => schema.of(Yup.number())
      .test(
        'selectedReceiver',
        'At least one receiver must be selected',
        (value) => value && value.length > 0,
      )
      .min(1, 'At least one receiver must be selected',)
      .required('At least one receiver is required'),
    otherwise: (schema) => schema.notRequired()
  })
}).validate(data);