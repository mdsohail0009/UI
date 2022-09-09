import React, { useState } from "react";
import { Form, Row, Col, Radio } from 'antd';
import { useForm } from "antd/lib/form/Form";
import ConnectStateProps from "../../utils/state.connect";
import OthersBusiness from "../onthego.transfer/others.business/others.business.component";
import MyselfNewTransfer from '../onthego.transfer/Myself'
import SomeoneComponent from "../onthego.transfer/others.SomeOneElse/someone.component"
const FiatAddress = ({ onSubmit, onAddressOptionsChange, onContinue, PayeeLu = [], emailExist = false, countries = [], states = [], fiatAddress, onTheGoObj, ...props }) => {
    const [form] = useForm();
    const [addressOptions, setAddressOptions] = useState({ addressType: "myself", transferType: props.currency === "EUR" ? "sepa" : "domestic" });
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
                        >
                            <Radio.Button value="myself">{props.userProfile?.isBusiness ? "My Company" : "My Self"}</Radio.Button>
                            <Radio.Button value="someoneelse">Someone Else</Radio.Button>
                            <Radio.Button value="business">Business</Radio.Button>
                        </Radio.Group>
                    </Col>
                </Row>

            </Form.Item>
        </Form>
        {addressOptions.addressType === "myself" && <MyselfNewTransfer currency={props.currency} onContinue={(obj) => onContinue(obj)} {...props} isBusiness={props.userProfile?.isBusiness}
            onTheGoObj={onTheGoObj} ></MyselfNewTransfer>}
        {addressOptions.addressType === "business" && <OthersBusiness type={props.type} isUSDTransfer={props.currency === "USD" ? true : false} onContinue={(obj) => onContinue(obj)} amount={props.amount} />}
        {addressOptions.addressType === "someoneelse" && <SomeoneComponent addressType={addressOptions.addressType} currency={props.currency} onContinue={(obj) => onContinue(obj)} onTheGoObj={onTheGoObj} />}
    </>
}

export default ConnectStateProps(FiatAddress);