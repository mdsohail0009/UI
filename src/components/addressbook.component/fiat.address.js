import React, { useState } from "react";
import { Form, Row, Col, Radio } from 'antd';
import { useForm } from "antd/lib/form/Form";
import ConnectStateProps from "../../utils/state.connect";
import OthersBusiness from "../onthego.transfer/others.business/others.business.component";
import MyselfNewTransfer from '../onthego.transfer/Myself'
import SomeoneComponent from "../onthego.transfer/others.SomeOneElse/someone.component"
import { useEffect } from "react";

const FiatAddress = ({ onSubmit, onAddressOptionsChange, selectedAddress, onContinue, PayeeLu = [], emailExist = false, countries = [], states = [], fiatAddress, onTheGoObj, ...props }) => {
    const [form] = useForm();
    const addrType = selectedAddress?.addressType ? selectedAddress?.addressType?.toLowerCase() : props.userProfile?.isBusiness ? "ownbusiness" : "myself";
    const [addressOptions, setAddressOptions] = useState({ addressType: addrType, transferType: props.currency === "EUR" ? "sepa" : "domestic" });
    const [isEdit, setIsEdit] = useState(false);
    const [showHeading,setShowHeading]=useState(false);
    const [hideTabs,setHideTabs]=useState(true)
    useEffect(() => {
    }, [])


   const headingChange=(data)=>{
		setShowHeading(data)
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
                className="custom-label text-center mb-0"
            >
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    {showHeading!=true&&(
                        <Radio.Group
                            defaultValue={addressOptions.addressType}
                            className="mb-16 custom-radio-btn buysell-toggle crypto-toggle"
                            onChange={(value) => {
                                setAddressOptions({ ...addressOptions, addressType: value.target.value });
                                onAddressOptionsChange({ ...addressOptions, addressType: value.target.value });
                            }}
                            disabled={isEdit}
                        >
                            <Radio.Button
                            className="custom-btn sec mt-8" value={props.userProfile?.isBusiness ? "ownbusiness" : "myself"}>{props.userProfile?.isBusiness ? "My Company" : "My Self"}</Radio.Button>
                            <Radio.Button
                                className="custom-btn sec mt-8" value="individuals">INDIVIDUALS</Radio.Button>
                            <Radio.Button
                                className="custom-btn sec mt-8" value="otherbusiness">OTHER BUSINESS</Radio.Button>
                        </Radio.Group>)}
                    </Col>
                </Row>
            </Form.Item>
        </Form>}
        {(addressOptions.addressType === "ownbusiness" || addressOptions.addressType === "myself") && <MyselfNewTransfer currency={props.currency} type={props.type} onContinue={(obj) => onContinue(obj)} {...props} isBusiness={props.userProfile?.isBusiness}
          headingUpdate={headingChange}    onTheGoObj={{ amount: props.amount }} selectedAddress={selectedAddress} onEdit={(val) => {
                setIsEdit(val);
            }} isHideTabs={(value)=>setHideTabs(value)}></MyselfNewTransfer>}
        {addressOptions.addressType === "otherbusiness" && <OthersBusiness ontheGoType={props.typeOntheGo} 
         headingUpdate={headingChange} selectedAddress={selectedAddress} type={props.type} isUSDTransfer={props.currency === "USD" ? true : false} onContinue={(obj) => onContinue(obj)} amount={props.amount} onEdit={(val) => {
            setIsEdit(val);
        }} isHideTabs={(value)=>setHideTabs(value)}/>}
        {addressOptions.addressType === "individuals" && <SomeoneComponent ontheGoType={props.typeOntheGo}
         headingUpdate={headingChange}  selectedAddress={selectedAddress} addressType={addressOptions.addressType} type={props.type} currency={props.currency} onContinue={(obj) => onContinue(obj)} onTheGoObj={{ amount: props.amount }} onEdit={(val) => {
            setIsEdit(val);
        }} isHideTabs={(value)=>setHideTabs(value)}/>}
    </>
}

export default ConnectStateProps(FiatAddress);