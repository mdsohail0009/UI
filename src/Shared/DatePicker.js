import React from "react";
import { useField, useFormikContext } from "formik";
import {DatePicker, Col, Row} from "antd";

export const DateField = ({ errors,label,...props }) => {
  const { setFieldValue } = useFormikContext();
  const [field] = useField(props);
  return (<>
    <label className="label">{label}</label>
    <DatePicker className="cust-input w-100"
      {...field}
      {...props}
      selected={(field.value && new Date(field.value)) || null}
      onChange={val => {
        setFieldValue(field.name, val);
      }}
    placeholder={label}/>
    <div className="float-right z-invalid">{errors[field.name]}</div>
  </>);
};