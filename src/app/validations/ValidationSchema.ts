import * as yup from 'yup';

export const productSchema = yup.object().shape({
  id: yup.string()
    .required('ID es requerido')
    .min(3, 'ID debe tener al menos 3 caracteres')
    .max(10, 'ID no debe tener más de 10 caracteres'),
  name: yup.string()
    .required('Nombre es requerido')
    .min(5, 'Nombre debe tener al menos 5 caracteres')
    .max(100, 'Nombre no debe tener más de 100 caracteres'),
  description: yup.string()
    .required('Descripción es requerida')
    .min(10, 'Descripción debe tener al menos 10 caracteres')
    .max(200, 'Descripción no debe tener más de 200 caracteres'),
  logo: yup.string().required('Logo es requerido'),
  date_release: yup.date()
    .required('Fecha de liberación es requerida')
    .min(new Date(), 'Fecha de liberación debe ser igual o mayor a la fecha actual'),
  date_revision: yup.date()
    .required('Fecha de revisión es requerida')
    .test('is-one-year-later', 'Fecha de revisión debe ser exactamente un año posterior a la fecha de liberación', function(value) {
      const { date_release } = this.parent;
      return value && date_release && new Date(value).getTime() === new Date(date_release).setFullYear(new Date(date_release).getFullYear() + 1);
    })
});