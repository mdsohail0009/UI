import React, { useEffect, useState } from 'react';
import { Button, Input, Alert, Spin, Select,Col, Form } from 'antd';
import { gettransforLu, getCurrencyLu, getcurrencyBalance } from './api';
import { connect } from 'react-redux';
import Translate from "react-translate-component";  
import apiCalls from '../../api/apiCalls'
import NumberFormat from 'react-number-format';
import {setStepcode,setTransforObj} from '../../reducers/tranfor.Reducer'
import Currency from '../shared/number.formate';
import { setCurrentAction } from '../../reducers/actionsReducer';
const { Option } = Select;

const  TranforCoins = ({userProfile,onClose,dispatch,transforObj,transferPermissions}) =>{
    useEffect(()=>{
        loadApis();
        if(transforObj){
            form.setFieldsValue(transforObj)
        }
    },[])
    
    const [fromWalletLu,setFromWalletLu] = useState([])
    const [toWalletLu,setToWalletLu] = useState([])
    const [currencyLu,setCurrencyLu] = useState([])
    const [loader,setLoader] = useState(true)
    const [balance,setBalance] = useState(0)
    const [errormsg,setErrorMsg] = useState(null)
    const [selectedwalletType,setSelectedwalletType] = useState(null)
    const useDivRef = React.useRef(null);
    const [form] = Form.useForm();
    const [permission,setPermission]=useState({});
    // const [transfordata,setTransfordata] = useState(null)
    useEffect(()=>{
        loadPermissions()
        if(transforObj && currencyLu.length>0){
            showBalance(transforObj.walletCode)
        }
    },[currencyLu])
    useEffect(()=>{
        if(transforObj && fromWalletLu.length>0){
            handleFromchange(transforObj.fromWalletType)
        }
    },[fromWalletLu])


   const loadPermissions = () => {
		if (transferPermissions) {
			let _permissions = {};
			for (let action of transferPermissions?.actions) {
				_permissions[action.permissionName] = action.values;
			}
            setPermission(_permissions)
		}
	}
    const loadApis = async()=>{
        let luLoader=false;
        let currencyLoder=false;
        let res = await gettransforLu()
        if(res.ok){
            setFromWalletLu(res.data)
                luLoader = true;
                if (luLoader && currencyLoder) {
                    setLoader(false);
                }
        }else{
            setLoader(false);
        }
        let currencylures = await getCurrencyLu(userProfile.id)
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
        const selectedList = currencyLu.filter((item)=>item.walletCode==val)
        if(selectedList.length>0){
            setSelectedwalletType(selectedList[0].walletType);
        }
        if (obj.walletCode && obj.fromWalletType) {
            let currencybalRes = await getcurrencyBalance(userProfile.id, obj.fromWalletType, obj.walletCode);
            if (currencybalRes.ok) {
                setBalance(currencybalRes.data)
            }
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
    const toFixed=(x)=> {
        if (Math.abs(x) < 1.0) {
          var e = parseInt(x.toString().split('e-')[1]);
          if (e) {
              x *= Math.pow(10,e-1);
              x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
          }
        } else {
          var e = parseInt(x.toString().split('+')[1]);
          if (e > 20) {
              e -= 20;
              x /= Math.pow(10,e);
              x += (new Array(e+1)).join('0');
          }
        }
        return x;
      }
    const showSummary= async(values) =>{
        values.transferAmount = toFixed(parseFloat(values.transferAmount.replace(',',''))).toString()
        if((!values.transferAmount)||values.transferAmount=='0'){
            useDivRef.current.scrollIntoView();
            return setErrorMsg('Amount must be greater than zero.');
        }
        if(parseFloat(values.transferAmount)>parseFloat(balance?.available)){
            useDivRef.current.scrollIntoView();
            return setErrorMsg('Insufficient funds');
        }
        let selectedWallet =  currencyLu.filter((type)=>type.walletCode == values.walletCode)
        values.memberWalletId = selectedWallet[0].walletId;
        values.customerId = userProfile.id;
        values.transferAmount = selectedwalletType=='Fiat'?( values.transferAmount.slice(0,(values.transferAmount.indexOf('.')>-1?(values.transferAmount.indexOf('.')+3):values.transferAmount.length)) ):values.transferAmount;
        if(values.transferAmount.indexOf('.')==0){
            values.transferAmount = '0'+values.transferAmount
        }
        // const res = saveTransfor(values);
        // if(res.ok){
        //     onClose()
        // }
        dispatch(setTransforObj(values))
        dispatch(setStepcode('tranforsummary'))
    }

    return (<>
    <Spin spinning={loader}>
    <div ref={useDivRef}></div>
    {errormsg !== null && (
              <Alert
                className="mb-12"
                description={errormsg}
                onClose={() => setErrorMsg(null)}
                showIcon
                type="error"
              />
            )}
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
                            onChange={(e) => showBalance(e)}
                        >
                          {  currencyLu.map((wallet)=>{
                                return <Option value={wallet.walletCode}>{wallet.walletName}</Option>
                            })}
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                        className="custom-forminput custom-label mb-0 min-max-btn"
                        label={
                            <>
                              <Translate
                                content="amount" component={Form.label} />
                              <div className="minmax">
                                {/* {"Available balance:"+(balance?.available||0) } */}
                                <Currency defaultValue={balance.available || 0} prefix={'Available balance: '} className={`fs-18 m-0 fw-600 ${balance.available < 0 ? 'text-red' : 'text-green'}`} />
                              </div>
                            </>
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
                            decimalScale={selectedwalletType=='Crypto'?8:2}
                            allowNegative={false}
                            maxlength={13}
                            style={{ height: 44 }}
                            // onValueChange={({ e, value }) => {
                            //     showBalance(value)
                            // }}
                        />
                    </Form.Item>
                </Col>
                <Form.Item className="mb-0 mt-16">
                  {permission?.Transfer&& <Button
                      htmlType="submit"
                      size="large"
                      block
                      className="pop-btn mt-24"
                      loading={false}
                    >
                      <Translate content="transfor_btn_cnftransfor" style={{marginLeft:"15px"}} component={Form.label} />
                    </Button>}
                  </Form.Item>
            </Form>
        </div>
        </Spin>
    </>)

} 


const connectStateToProps = ({ userConfig,TransforStore,menuItems }) => {
    return { userProfile: userConfig.userProfileInfo, transforObj:TransforStore.transforObj, transferPermissions:menuItems?.featurePermissions?.transfer }
}
const connectDispatchToProps = dispatch => {
    return {
        setAction: (val) => {
            dispatch(setCurrentAction(val))
          },
        dispatch
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(TranforCoins);
