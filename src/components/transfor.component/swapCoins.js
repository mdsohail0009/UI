import React, { Component, useEffect, useState } from 'react';
import { Typography, Button, Input, Alert, Spin,Image,Row,Select,Col, Form } from 'antd';
import { gettransforLu, getCurrencyLu, getcurrencyBalance, saveTransfor } from './api';
import { connect } from 'react-redux';
import Translate from "react-translate-component";  
import apiCalls from '../../api/apiCalls'
import NumberFormat from 'react-number-format';
import {setStepcode,setTransforObj} from '../../reducers/tranfor.Reducer'
const { Option } = Select;

const  TranforCoins = ({userProfile,onClose,dispatch}) =>{
    useEffect(()=>{
        loadApis();
    },[])
    const [fromWalletLu,setFromWalletLu] = useState([])
    const [toWalletLu,setToWalletLu] = useState([])
    const [currencyLu,setCurrencyLu] = useState([])
    const [loader,setLoader] = useState(true)
    const [balance,setBalance] = useState(0)
    const [form] = Form.useForm();
    // const [transfordata,setTransfordata] = useState(null)

    const loadApis = async()=>{
        let luLoader=false;
        let currencyLoder=false;
        let res = await gettransforLu()
        if(res.ok){
            setFromWalletLu(res.data)
            luLoader=true;
            if(luLoader &&currencyLoder){
                setLoader(false);
            }
        }else{
            setLoader(false);
        }
        let currencylures = await getCurrencyLu()
        if(currencylures.ok){
            setCurrencyLu(currencylures.data)
            currencyLoder=true;
            if(luLoader &&currencyLoder){
                setLoader(false);
            }
        }else{
            setLoader(false);
        }
        
    }
    const showBalance = async(val) =>{
        const obj=form.getFieldValue()
        console.log(obj)
        let currencybalRes = await getcurrencyBalance();
        if(currencybalRes.ok){
            setBalance(currencybalRes.data)
        }
    }
    const handleFromchange = (val) =>{
       let towallet =  fromWalletLu.filter((type)=>type.name == val)
        setToWalletLu(towallet[0].toWalletTypes)
        const obj=form.getFieldValue()
        if(obj.walletCode){
            showBalance()
        }
    }
    const showSummary= async(values) =>{
        let selectedWallet =  currencyLu.filter((type)=>type.walletCode == values.walletCode)
        values.memberWalletId = selectedWallet[0].walletId;
        values.membershipId = userProfile.id;
        // console.log(values)
        // const res = saveTransfor(values);
        // if(res.ok){
        //     onClose()
        // }
        dispatch(setTransforObj(values))
        dispatch(setStepcode('tranforsummary'))
    }

    return (<>
    <Spin spinning={loader}>
        <div>
            <Form form={form} onFinish={showSummary}>
                <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                        className="custom-forminput custom-label mb-0"
                        label={
                            <Translate content="tranfor_fromwlt" component={Form.label} />
                        }
                        name="fromWalletType"
                        required
                        rules={[
                            {
                                required: true,
                                message: apiCalls.convertLocalLang("is_required"),
                            },
                        ]}>
                        <Select
                            dropdownClassName="select-drpdwn"
                            placeholder={apiCalls.convertLocalLang("tranfor_fromwlt")}
                            className="cust-input"
                            style={{ width: "100%" }}
                            bordered={false}
                            showArrow={true}
                            optionFilterProp="children"
                            onChange={(e) => handleFromchange(e)}
                        >
                          {  fromWalletLu.map((wallet)=>{
                                return <Option value={wallet.name}>{wallet.name}</Option>
                            })}
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                        className="custom-forminput custom-label mb-0"
                        label={
                            <Translate content="tranfor_towlt" component={Form.label} />
                        }
                        name="ToWalletType"
                        required
                        rules={[
                            {
                                required: true,
                                message: apiCalls.convertLocalLang("is_required"),
                            },
                        ]}>
                        <Select
                            dropdownClassName="select-drpdwn"
                            placeholder={apiCalls.convertLocalLang("tranfor_towlt")}
                            className="cust-input"
                            style={{ width: "100%" }}
                            bordered={false}
                            showArrow={true}
                            optionFilterProp="children"
                            // onChange={(e) => handleFromchange(e)}
                        >
                          {  toWalletLu.map((wallet)=>{
                                return <Option value={wallet.name}>{wallet.name}</Option>
                            })}
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                        className="custom-forminput custom-label mb-0"
                        label={
                            <Translate content="tranfor_currencywlt" component={Form.label} />
                        }
                        name="walletCode"
                        required
                        rules={[
                            {
                                required: true,
                                message: apiCalls.convertLocalLang("is_required"),
                            },
                        ]}>
                        <Select
                            dropdownClassName="select-drpdwn"
                            placeholder={apiCalls.convertLocalLang("tranfor_currencywlt")}
                            className="cust-input"
                            style={{ width: "100%" }}
                            bordered={false}
                            showArrow={true}
                            optionFilterProp="children"
                            // onChange={(e) => handleFromchange(e)}
                        >
                          {  currencyLu.map((wallet)=>{
                                return <Option value={wallet.walletCode}>{wallet.walletName}</Option>
                            })}
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                        className="custom-forminput custom-label mb-0"
                        label={
                            <Translate content="tranfor_Amount" component={Form.label} />
                        }
                        name="transferAmount"
                        rules={[
                            {
                                required: true,
                                message: apiCalls.convertLocalLang("is_required"),
                            },
                        ]}
                    >
                        <NumberFormat
                            className="cust-input mb-0"
                            customInput={Input}
                            thousandSeparator={true}
                            prefix={""}
                            placeholder="0.00"
                            decimalScale={8}
                            allowNegative={false}
                            maxlength={13}
                            style={{ height: 44 }}
                            onValueChange={({ e, value }) => {
                                showBalance(value)
                            }}
                        />
                    </Form.Item>
                </Col>
                <Form.Item className="mb-0 mt-16">
                    <Button
                      htmlType="submit"
                      size="large"
                      block
                      className="pop-btn"
                      loading={false}
                    >
                      <Translate content="transfor_btn_cnftransfor" style={{marginLeft:"15px"}} component={Form.label} />
                    </Button>
                  </Form.Item>
            </Form>
        </div>
        </Spin>
    </>)

} 
const connectStateToProps = ({ userConfig }) => {
    return { userProfile: userConfig.userProfileInfo }
}
const connectDispatchToProps = dispatch => {
    return {
        // changeStep: (stepcode) => {
        //     dispatch(setStepcode(stepcode))
        // },
        dispatch
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(TranforCoins);
