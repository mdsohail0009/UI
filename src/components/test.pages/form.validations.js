import React, { useState } from 'react';
import { TextInput } from '../../Shared/TextInput';
import connectStateProps from '../../utils/state.connect';
import {Form, Formik} from 'formik'
import * as yup from 'yup'
import {formData} from '../../Shared/formValidations.js'
import {createYupSchema} from '../../Shared/yupSchema.js'
import { Dropdown } from '../../Shared/Dropdown';
import {ErrorMessage} from 'formik'
import TextArea from "antd/lib/input/TextArea";
import {Button, Row, Col} from 'antd'
import {DateField} from '../../Shared/DatePicker'

const Formvalidations=()=> {
     const yupSchema= formData.reduce(createYupSchema, {});
     const [LookupData]=useState([{name:'JNTUH',value:'JNTUH'},{name:'JNTUK',value:'JNTUK'},{name:'BVRIT',value:'BVRIT'},{name:'CMR',value:'CMR'},{name:'CMRIT',value:'CMRIT'},{name:'NMREC',value:'NMREC'}])
    const [createData, setData] = useState({ FirstName: "", LastName: "", Email: '', College: '', aboutme: '', Date: '', Phone: '',Country:'',State:'',City:'',PinCode:'' })
    const validatePhone = (value) => {
        let error;
        let regex = /^[0-9]*$/
        if (!regex.test(value)) {
            error = 'Enter valid Phone no.'
        }else if(value.length>12){
            error = 'Phone no. maxlength should be 12'
        }

        return error;
    }
        return (
            <Formik initialValues={createData} validationSchema={yup.object().shape(yupSchema)} onSubmit={(values)=>console.log(values)}>
                {({values, errors, handleSubmit, handleChange})=>(
                    
            <Form className="p-16 ">
                <Row>
                <Col span={12} className="form-group">
                    <label className="label">About me</label>
                    <TextArea className="cust-input" name="aboutme" onChange={handleChange('aboutme')} value={values.aboutme} placeholder='About me'></TextArea>
                    <div className="float-right z-invalid">{errors.aboutme}</div>
                </Col>
                <Col span={6} className="form-group">
                    <TextInput label="FirstName" name="FirstName" type="text" onChange={handleChange('FirstName')} value={values.FirstName} errors={errors}></TextInput>
                </Col>
                <Col span={6} className="form-group">
                    <TextInput label="LastName" name="LastName" type="text" onChange={handleChange('LastName')} value={values.LastName} errors={errors}></TextInput>
                </Col>
                <Col span={6} className="form-group">
                    <Dropdown label="University" name="College" type="College" dropdownData={LookupData} value={values.College} onValueChange={handleChange('College')} errors={errors}></Dropdown>
                </Col>
                <Col span={6} className="form-group">
                    <DateField name="Date"  errors={errors} label="Date"/>
                </Col>
                <Col span={6} className="form-group">
                    <TextInput label="Country" name="Country" type="text" onChange={handleChange('Country')} value={values.Country} errors={errors}></TextInput>
                </Col>
                <Col span={6} className="form-group">
                    <TextInput label="State" name="State" type="text" onChange={handleChange('State')} value={values.State} errors={errors}></TextInput>
                </Col>
                <Col span={6} className="form-group">
                    <TextInput label="City" name="City" type="text" onChange={handleChange('City')} value={values.City} errors={errors}></TextInput>
                </Col>
                <Col span={6} className="form-group">
                    <TextInput label="Pin Code" name="PinCode" type="text" onChange={handleChange('PinCode')} value={values.PinCode} errors={errors}></TextInput>
                </Col>
                <Col span={6} className="form-group">
                    <TextInput label="Phone" name="Phone" type="Phone" onChange={handleChange('Phone')} value={values.Phone} errors={errors}></TextInput>
                </Col>
                <Col span={6} className="form-group">
                    <TextInput label="Email" name="Email" type="email" onChange={handleChange('Email')} value={values.Email} errors={errors}></TextInput>
                </Col>
                
                </Row>
                {/* <Button type="submit" onClick={handleSubmit}>Sign Up</Button> */}
                <div className="float-right">
                    <Button className="btn-theme mt-16" type="primary" onClick={handleSubmit}>Save</Button>
                </div>
            </Form>
            )}

            </Formik>
            )
}

export default connectStateProps(Formvalidations);
