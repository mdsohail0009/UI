import React, {  useEffect, useState } from 'react';
import { Typography, Button,  Alert,Row,Col, Form } from 'antd';
import { saveTransfor } from './api';
import { connect } from 'react-redux';
import Translate from "react-translate-component";  
import apiCalls from '../../api/apiCalls'
import Currency from "../shared/number.formate";
import {setStepcode} from '../../reducers/tranfor.Reducer'
import { fetchDashboardcalls, fetchMarketCoinData } from '../../reducers/dashboardReducer';
const { Text, Paragraph } = Typography;

const  TransforSummary = ({userProfile, transforObj,dispatch}) =>{
   const [errorMsg, setErrorMsg] = useState(null)
   const [onCheked, setChecked] = useState(null)
   const [btnLoader, setBtnLoader] = useState(false)
 
    const saveTransfordata = async (values) => {
        if (onCheked) {
            setBtnLoader(true)
            const res = await saveTransfor(values);
            if (res.ok) {
                dispatch(setStepcode('tranforsuccess'))
                dispatch(fetchDashboardcalls(userProfile.id))
                dispatch(fetchMarketCoinData(true))
                setBtnLoader(false)
            }else{
                setBtnLoader(false)
                setErrorMsg(isErrorDispaly(res))
            }
        } else {
            setBtnLoader(false)
            setErrorMsg(apiCalls.convertLocalLang("agree_terms"))
        }
    }
    const isErrorDispaly = (objValue) => {
        if (objValue.data && typeof objValue.data === "string") {
            return objValue.data;
        } else if (
            objValue.originalError &&
            typeof objValue.originalError.message === "string"
        ) {
            return objValue.originalError.message;
        } else {
            return "Something went wrong please try again!";
        }
    };
    return (<>
    {errorMsg !== null && (
              <Alert
                className="mb-12"
                description={errorMsg}
                onClose={() => setErrorMsg(null)}
                showIcon
                type="error"
              />
            )}
        <div>
            <Row className='my-8'>
                <Col xs={12} md={12} lg={12} xl={12} xxl={12} className='px-8 pb-8'>
                    <Text className="fs-14 text-white-50 fw-200">
                        <Translate
                            content="tranfor_fromwlt"
                            component={Text}
                            className="fs-14 text-white-50 fw-200"
                        />
                    </Text>
                    </Col>
                <Col xs={12} md={12} lg={12} xl={12} xxl={12} className='px-8 pb-8'>
                    <div>
                        
                    <Text className="fs-20 text-white-30 mb-36">
                        {transforObj?.fromWalletType}
                    </Text>
                    </div>
                </Col>
                <Col xs={12} md={12} lg={12} xl={12} xxl={12} className='px-8 pb-8'>
                    <Text className="fs-14 text-white-50 fw-200">
                        <Translate
                            content="tranfor_towlt"
                            component={Text}
                            className="fs-14 text-white-50 fw-200"
                        />
                    </Text>
                    </Col>
                <Col xs={12} md={12} lg={12} xl={12} xxl={12} className='px-8 pb-8'>
                    <div>
                    <Text className="fs-20 text-white-30 mb-36">
                    {transforObj?.ToWalletType}
                    </Text></div>
                </Col>
            </Row>

            <Row className='my-8'>
                <Col xs={12} md={12} lg={12} xl={12} xxl={12} className='px-8 pb-8'>
                    <Text className="fs-14 text-white-50 fw-200">
                        <Translate
                            content="tranfor_currencywlt"
                            component={Text}
                            className="fs-14 text-white-50 fw-200"
                        />
                    </Text>
                    </Col>
                <Col xs={12} md={12} lg={12} xl={12} xxl={12} className='px-8 pb-8'>
                    <div>
                    <Text className="fs-20 text-white-30 mb-36">
                    {transforObj?.walletCode}
                    </Text>
                    </div>
                </Col>
            <Col xs={12} md={12} lg={12} xl={12} xxl={12} className='px-8 pb-8 pb-8'>
                <Text className="fs-14 text-white-50 fw-200">
                    <Translate
                        content="tranfor_Amount"
                        component={Text}
                        className="fs-14 text-white-50 fw-200"
                    />
                </Text>
                </Col>
                <Col xs={12} md={12} lg={12} xl={12} xxl={12} className='px-8 pb-8'>
                <div>
                <Currency
                    className="fs-20 text-white-30 mb-36"
                    defaultValue={transforObj?.transferAmount}
                    prefix={''}
                />
                </div>
                </Col>
            </Row>
            <Row className='my-8'>
                <div className="d-flex p-16 mb-36 agree-check">
                    <label
                    >
                        <input
                            type="checkbox"
                            id="agree-check"
                        checked={onCheked}
                        onChange={({ currentTarget: { checked } }) => {
                        	setChecked(checked);
                        }}
                        />
                        <span for="agree-check" />
                    </label>
                    <Paragraph
                        className="fs-14 text-white-30 ml-16 mb-0"
                        style={{ flex: 1 }}>
                        <Translate content="agree_sell" component="Paragraph" />{" "}
                        <a
                            className="textpure-yellow"
                            href="https://www.iubenda.com/terms-and-conditions/42856099"
                            target="_blank">
                            <Translate content="terms" component="Text" />
                        </a>{" "}

                        <Translate content="refund_cancellation" component="Text" />
                    </Paragraph>
                </div>
            </Row>
                <Button
                    htmlType="submit"
                    size="large"
                    block
                    className="pop-btn"
                    loading={btnLoader}
                    onClick={() => saveTransfordata(transforObj)}
                >
                    <Translate content="transfor_btn_cnftransfor" style={{ marginLeft: "15px" }} component={Form.label} />
                </Button>
        </div>
    </>)

} 
const connectStateToProps = ({ userConfig,TransforStore }) => {
    return { userProfile: userConfig.userProfileInfo,transforObj:TransforStore.transforObj }
}
const connectDispatchToProps = dispatch => {
    return {
        dispatch
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(TransforSummary);
