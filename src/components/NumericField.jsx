import { Field } from "formik"

export default function NumericField({id,setFieldValue}) {
  return (
    <Field
                type="text"
                id={id}
                name={id}
                placeholder='0'
                className="w-full px-4 py-2 border rounded-md"
                onFocus={e=>{
                  e.target.value == 0 && setFieldValue(id,'')
                }}
                onBlur={e=>{
                  e.target.value == '' && setFieldValue(id,0)
                }}
              />
    )
}
