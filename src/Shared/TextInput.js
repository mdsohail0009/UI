import React from 'react';
import {useField} from 'formik'
import {Input} from 'antd'
export const TextInput=({label,type,value,errors,...props})=>{
    const [field]=useField(props)
    return (

        <div>
            <label className="label">{label}</label>
            <Input className="cust-input" type={{type}} {...props} value={value} placeholder={label}/>
            <div className="float-right z-invalid">{errors[field.name]}</div>
        </div>
    )
}