import React from 'react';
import {useField} from 'formik'
import {Select, Col, Row} from 'antd'
export const Dropdown=({label,type,dropdownData,value,onValueChange,errors,name,...props})=>{
    // const [field,meta]=useField(props)
    const { Option } = Select;
    const handleChange=(value)=>{
        onValueChange(value)
    }
    return (

        // <div>
        //     <label className="label">{label}</label>

        //     <Select className="cust-input mb-0 w-100" {...props} {...field} value={value} onChange={(value)=>handleChange(value)}>
        //         <Select.Option value=''>select</Select.Option>
        //         {dropdownData.map((item,index)=><Select.Option value={item.value} key={index}>{item.name}</Select.Option>)}
        //     </Select>
        //     <div className="float-right z-invalid">{errors[field.name]}</div>
        // </div>
            <form className="form">
            <Select defaultValue="Select Wallet" className="cust-input" style={{ width: '100%' }} bordered={false} showArrow={false} suffixIcon={<span className="icon md uparrow"/>} onChange={(value)=>handleChange(value)}>
              {dropdownData.map((item,idx) =>
                  <Option value={item[name]}>{item[name]}</Option>
              )}
           </Select>
           </form>
    )
}