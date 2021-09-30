import React from 'react';
import {Select} from 'antd'
export const Dropdown=({label,type,dropdownData,value,onValueChange,errors,name,...props})=>{
    const { Option } = Select;
    const handleChange=(value)=>{
        onValueChange(value)
    }
    return (

            <form className="form">
            <Select defaultValue="Select Wallet" className="cust-input" style={{ width: '100%' }} bordered={false} showArrow={false} suffixIcon={<span className="icon md uparrow"/>} onChange={(value)=>handleChange(value)}>
              {dropdownData.map((item,idx) =>
                  <Option value={item[name]}>{item[name]}</Option>
              )}
           </Select>
           </form>
    )
}