import React, { useEffect, useState } from "react";
import { Form, Row, Col, Typography, Input, Tabs, Button,Alert,Spin,Image } from 'antd';
import NumberFormat from "react-number-format";
import apiCalls from "../../api/apiCalls";
import { validateContentRule } from "../../utils/custom.validator";
import Translate from "react-translate-component";
const { Paragraph,Title } = Typography;
const { TextArea } = Input;
const GBPReciepiantAddress=(props)=>{
    console.log(props.domesticType,'domesticType    ')
    console.log(props,'props')

    return(<>
     <Paragraph className="adbook-head" >Bank Details</Paragraph>
     <Row>
    {props.tabs !="internationalIBAN"  && <>  <Col xs={24} md={24} lg={24} xl={24} xxl={24} id="favoriteName" className="">
            <Form.Item
                className="custom-forminput custom-label"
                name="favouriteName"
                label={
                    "Save Whitelist Name As"
                }
                
                rules={[
                    {
                        required: true,
                        message: apiCalls.convertLocalLang("is_required"),
                    },
                    {
                        whitespace: true,
                        message: apiCalls.convertLocalLang("is_required"),
                    },
                    {
                        validator: validateContentRule,
                    },
                ]}
            >
               
                <Input
                    maxLength={100}
                        className="cust-input"
                        placeholder='Save Whitelist Name As'
                    />
            </Form.Item>
        </Col>
      { props.tabss != "Domestic GBP transfer" || "International GBP IBAN" && <><Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                <Form.Item
                    className="custom-forminput custom-label"
                    name="firstName"
                    label='Recipient first name' required
                    rules={[
                        {
                            required: true,
                            message: apiCalls.convertLocalLang("is_required"),
                        },
                      
                    ]}
                >
                    <Input
                        className="cust-input"
                        placeholder='Recipient first name'
                    maxLength={50}/>
                </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                <Form.Item
                    className="custom-forminput custom-label"
                    name="lastName"
                    label='Recipient last name' required
                    rules={[
                        {
                            required: true,
                            message: apiCalls.convertLocalLang("is_required"),
                        },

                    ]}
                >
                    <Input
                        className="cust-input"
                        placeholder='Recipient last name'
                    maxLength={50}/>
                </Form.Item>
            </Col></>}
           {(props.domesticType !="internationalIBAN" ||  props.tabss != "International GBP IBAN") && <> <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                <Form.Item
                    className="fw-300 mb-8 px-4 text-white-50  custom-forminput custom-label pt-8"
                    // name="uksortcode"
                   // name={["payeeAccountModels","ukSortCode"]}
                    name="ukSortCode"
                    label='UK SORT CODE' required
                    rules={[
                        {
                            required: true,
                           message: apiCalls.convertLocalLang("is_required"),
                        },
                    ]}
                >
                                            <NumberFormat
                        customInput={Input}
                        thousandSeparator={false}
                        prefix={""}
                        decimalScale={0}
                        allowNegative={false}
                        allowLeadingZeros={true}
                        className="cust-input"
                        placeholder={"Enter Uk Sort code"}
                        maxLength={6}
                        style={{ width: "100%"  }}
                      //  onValueChange={(e) => handleChange(e.value)}
                       // disabled={inputDisable}
                        />
                  
                </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                <Form.Item
                    className="fw-300 mb-8 px-4 text-white-50  custom-forminput custom-label pt-8"
                    // name={["payeeAccountModels","accountNumber"]}
                    name="accountNumber"
                    label='Account number' required
                    rules={[
                        {
                            required: true,
                            message: apiCalls.convertLocalLang("is_required"),
                        },
                    ]}
                >
                                            <NumberFormat
                        customInput={Input}
                        thousandSeparator={false}
                        prefix={""}
                        decimalScale={0}
                        allowNegative={false}
                        allowLeadingZeros={true}
                        className="cust-input"
                        placeholder={"Enter Account number"}
                        maxLength={6}
                        style={{ width: "100%"  }}
                      //  onValueChange={(e) => handleChange(e.value)}
                       // disabled={inputDisable}
                        />
                  
                </Form.Item>
            </Col></>} </>}

            <Paragraph className="mb-8 fw-500 text-white px-4 mt-36" style={{ fontSize: 18 }}>Recipient Address</Paragraph>
           
                         <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                <Form.Item
                    className="custom-forminput custom-label"
                    name="country"
                   //name={["payeeAccountModels","country"]}
                    label='Country' required
                    rules={[
                        {
                            required: true,
                            message: apiCalls.convertLocalLang("is_required"),
                        },

                    ]}
                >
                    <Input
                        className="cust-input"
                        placeholder='country'
                    maxLength={50}/>
                </Form.Item>
            </Col>
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item
                                className="custom-forminput custom-label fw-300 mb-8 px-4 text-white-50 py-4"
                               // name={["payeeAccountModels","city"]}
                               name="city"
                               required
                                rules={[
                                    {
                                        required: true,
                                        message: apiCalls.convertLocalLang("is_required"),
                                    },
                                    {
                                        whitespace: true,
                                        message: apiCalls.convertLocalLang("is_required"),
                                    },
                                   
                                ]}
                                label={
                                    "City"
                                }
                            >
                                <Input
                                    className="cust-input"
                                    // placeholder={apiCalls.convertLocalLang(
                                    //     "city"
                                    // )}
                                    maxLength={100}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item
                                className="custom-forminput custom-label fw-300 mb-8 px-4 text-white-50 py-4"
                               // name={["payeeAccountModels","address"]}
                               name="address" 
                               required
                                rules={[
                                    {
                                        required: true,
                                        message: apiCalls.convertLocalLang("is_required"),
                                    },
                                    {
                                        whitespace: true,
                                        message: apiCalls.convertLocalLang("is_required"),
                                    },
                                   
                                ]}
                                label={
                                    "Address"
                                }
                            >
                                <Input
                                    className="cust-input"
                                    // placeholder={apiCalls.convertLocalLang(
                                    //     "relationtobenificiary"
                                    // )}
                                    maxLength={100}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item
                                className="custom-forminput custom-label fw-300 mb-8 px-4 text-white-50 py-4"
                              //  name={["payeeAccountModels","postalCode"]}
                              name="postalCode"  
                              required
                                rules={[
                                    {
                                        required: true,
                                        message: apiCalls.convertLocalLang("is_required"),
                                    },
                                    {
                                        whitespace: true,
                                        message: apiCalls.convertLocalLang("is_required"),
                                    },
                                   
                                ]}
                                label={
                                    "Post code"
                                }
                            >
                                <Input
                                    className="cust-input"
                                    // placeholder={apiCalls.convertLocalLang(
                                    //     "postalCode"
                                    // )}
                                    maxLength={100}
                                />
                            </Form.Item>
                        </Col> 
                     { props.tabs !="internationalIBAN" && <>  <Paragraph className="adbook-head" >Compliance</Paragraph>
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                        className="custom-forminput custom-label"
                        name={"reasonOfTransfer"}
                        required
                        rules={[
                            {
                                required: true,
                                message: apiCalls.convertLocalLang("is_required"),
                            },
                            {
                                whitespace: true,
                                message: apiCalls.convertLocalLang("is_required"),
                            },
                          
                        ]}
                        label={
                            <Translate
                                content="reasiontotransfor"
                                component={Form.label}
                            />
                        }
                    >
                        <TextArea
                            placeholder={apiCalls.convertLocalLang(
                                "reasiontotransfor"
                            )}
                            className="cust-input cust-text-area address-book-cust"
                            autoSize={{ minRows: 1, maxRows: 2 }}
                            maxLength={100}
                        ></TextArea>
                    </Form.Item>
                </Col> </>}
    </Row>
    </>)
}
export default GBPReciepiantAddress;