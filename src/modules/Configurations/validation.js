import * as Yup from "yup";


const configSchema = Yup.object({
  workHourlyRate: Yup.number().min(1,'Requerido'),
  profitMargin: Yup.number().min(1,'Requerido').max(100,'el máximo es 100%'),
  spendMargin: Yup.number().min(1,'Requerido').max(100,'el máximo es 100%'),
  });

export default configSchema;