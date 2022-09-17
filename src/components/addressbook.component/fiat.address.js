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
    useEffect(() => {
      debugger
    }, [])
    return <>
        <Form
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
                           // disabled={props?.selectedAddress?.id !== "00000000-0000-0000-0000-000000000000" && props?.selectedAddress?.addressType !== "ownbusiness"?true:false}
                            className="custom-btn sec mt-8" value={props.userProfile?.isBusiness ? "ownbusiness" : "myself"}>{props.userProfile?.isBusiness ? "My Company" : "My Self"}</Radio.Button>
                            <Radio.Button
                                  // disabled={props?.selectedAddress?.id !== "00000000-0000-0000-0000-000000000000" && props?.selectedAddress?.addressType !== "someoneelse"?true:false}
                                className="custom-btn sec mt-8" value="someoneelse">Someone Else</Radio.Button>
                            <Radio.Button
                             //  disabled={props?.selectedAddress?.id !== "00000000-0000-0000-0000-000000000000" && props?.selectedAddress?.addressType !== "business"?true:false}
                                className="custom-btn sec mt-8" value="business">Business</Radio.Button>
                        </Radio.Group>
                    </Col>
                </Row>
            </Form.Item>
        </Form>
        {(addressOptions.addressType === "ownbusiness" || addressOptions.addressType === "myself") && <MyselfNewTransfer currency={props.currency} type={props.type} onContinue={(obj) => onContinue(obj)} {...props} isBusiness={props.userProfile?.isBusiness}
            onTheGoObj={{ amount: props.amount }} selectedAddress={selectedAddress} onEdit={(val) => {
                setIsEdit(val);
            }}></MyselfNewTransfer>}
        {addressOptions.addressType === "business" && <OthersBusiness selectedAddress={selectedAddress} type={props.type} isUSDTransfer={props.currency === "USD" ? true : false} onContinue={(obj) => onContinue(obj)} amount={props.amount} onEdit={(val) => {
            setIsEdit(val);
        }} />}
        {addressOptions.addressType === "someoneelse" && <SomeoneComponent selectedAddress={selectedAddress} addressType={addressOptions.addressType} type={props.type} currency={props.currency} onContinue={(obj) => onContinue(obj)} onTheGoObj={{ amount: props.amount }} onEdit={(val) => {
            setIsEdit(val);
        }} />}
    </>
}

export default ConnectStateProps(FiatAddress);