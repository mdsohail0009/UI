import React, { useState } from "react";
import { Form, Row, Col, Radio } from 'antd';
import { useForm } from "antd/lib/form/Form";
import ConnectStateProps from "../../utils/state.connect";
import OthersBusiness from "../onthego.transfer/others.business/others.business.component";
import MyselfNewTransfer from '../onthego.transfer/Myself'
import SomeoneComponent from "../onthego.transfer/others.SomeOneElse/someone.component"

const FiatAddress = ({ onSubmit, onAddressOptionsChange, selectedAddress, onContinue, PayeeLu = [], emailExist = false, countries = [], states = [], fiatAddress,reasonAddress, onTheGoObj, ...props }) => {
    const [form] = useForm();
    const addrType = selectedAddress?.addressType ? selectedAddress?.addressType?.toLowerCase() : props.userProfile?.isBusiness ? "ownbusiness" : "myself";
    const [addressOptions, setAddressOptions] = useState({ addressType: addrType, transferType: props.currency === "EUR" ? "sepa" : "domestic" });
    const [isEdit, setIsEdit] = useState(false);
    const [showHeading,setShowHeading]=useState(false);
    const [hideTabs,setHideTabs]=useState(true)
   

   const headingChange=(data)=>{
		setShowHeading(data)
        if(props?.fiatHeadingUpdate){
        props?.fiatHeadingUpdate(data);}
	}
    return <>
         {hideTabs&&<Form
            form={form}
            onFinish={onSubmit}
            autoComplete="off"
            initialValues={fiatAddress}
        >
            <Form.Item
                name="addressType"
                className=""
            >
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="text-center">
                    {!showHeading&&(
                        <Radio.Group
                            defaultValue={addressOptions.addressType}
                            className="new-custom-radiobtn"
                            onChange={(value) => {
                                setAddressOptions({ ...addressOptions, addressType: value.target.value });
                                onAddressOptionsChange({ ...addressOptions, addressType: value.target.value });
                            }}
                            disabled={isEdit}
                        >
                            <Radio.Button
                            className="" value={props.userProfile?.isBusiness ? "ownbusiness" : "myself"}><span className="lg icon" />{props.userProfile?.isBusiness ? "My Company" : "My Self"}</Radio.Button>
                            <Radio.Button
                                className="" value="individuals"><span className="lg icon" />individuals</Radio.Button>
                            <Radio.Button
                                className="" value="otherbusiness"><span className="lg icon" />other business</Radio.Button>
                        </Radio.Group>)}
                    </Col>
                </Row>
            </Form.Item>
        </Form>}
        {(addressOptions.addressType === "ownbusiness" || addressOptions.addressType === "myself") && <MyselfNewTransfer currency={props.currency} type={props.type} onContinue={(obj) => onContinue(obj)} {...props} isBusiness={props.userProfile?.isBusiness}
          headingUpdate={headingChange}    onTheGoObj={{ amount: props.amount }} selectedAddress={selectedAddress} onEdit={(val) => {
                setIsEdit(val);
            }} isHideTabs={(value)=>setHideTabs(value)} selectedbankobj={props.selectedbankobj}></MyselfNewTransfer>}
        {addressOptions.addressType === "otherbusiness" && <OthersBusiness ontheGoType={props.typeOntheGo} currency={props.currency}
         headingUpdate={headingChange} selectedAddress={selectedAddress} type={props.type} isUSDTransfer={(props.currency === "USD" ||props.currency=== "GBP" || props.currency==="SGD"||props.currency=== "EUR")? true : false} onContinue={(obj) => onContinue(obj)} reasonAddress={reasonAddress}  amount={props.amount} onEdit={(val) => {
            setIsEdit(val);
        }} isHideTabs={(value)=>setHideTabs(value)} selectedbankobj={props.selectedbankobj}/>}
        {addressOptions.addressType === "individuals" && <SomeoneComponent ontheGoType={props.typeOntheGo}
         headingUpdate={headingChange}  selectedAddress={selectedAddress} addressType={addressOptions.addressType} type={props.type} currency={props.currency} onContinue={(obj) => onContinue(obj)} onTheGoObj={{ amount: props.amount }} onEdit={(val) => {
            setIsEdit(val);
        }} isHideTabs={(value)=>setHideTabs(value)} selectedbankobj={props.selectedbankobj} reasonAddress={reasonAddress}/>}
    </>
}

export default ConnectStateProps(FiatAddress);