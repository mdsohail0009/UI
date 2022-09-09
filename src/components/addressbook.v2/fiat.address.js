import React, { Component } from "react";
import { Form, Radio, Row, Col, Typography } from 'antd'
import Translate from "react-translate-component";
import ConnectStateProps from "../../utils/state.connect";
import RecipientDetails from "./recipient.details";
const { Text } = Typography;
class AddressBookV2 extends Component {
    form;
    state = {
        addressOptions: { addressType: "myself", transferType: "sepa" },
    }
    componentDidMount() {
        this.form = React.createRef();
    }
    render() {
        const { addressOptions } = this.state;
        return <Form
            form={this.form}
            onFinish={() => { }}
            autoComplete="off"
            initialValues={{}}
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

                                this.setState({ ...this.state, addressOptions: { addressType: value.target.value } })
                            }}
                        >
                            <Radio.Button value="myself">{this.props.userProfile?.isBusiness ? "Own Business" : "My Self"}</Radio.Button>
                            <Radio.Button value="someoneelse">SomeOne Else</Radio.Button>
                            <Radio.Button value="business">Business</Radio.Button>
                        </Radio.Group>
                    </Col>
                </Row>

            </Form.Item>

            <Form.Item>
                <Translate
                    content="transfer_type"
                    component={Text}
                    className="text-white"
                />
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="">
                        <Radio.Group
                            defaultValue={addressOptions.transferType}
                            className="mb-16 custom-radio-btn buysell-toggle crypto-toggle"
                            onChange={(value) => {
                                this.setState({ ...this.state, addressOptions: { transferType: value.target.value } })
                            }}
                        >
                            <Radio.Button value="sepa">SEPA</Radio.Button>
                            <Radio.Button value="swift">SWIFT</Radio.Button>
                        </Radio.Group>
                    </Col>
                    <RecipientDetails transferType={this.state.transferType} />
                </Row>
            </Form.Item>
        </Form>
    }
}
export default ConnectStateProps(AddressBookV2);

{/* <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
<Form.Item
    className="custom-forminput custom-label mb-0"
    name="relation"
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
        {
            validator: validateContentRule,
        },
    ]}
    label={
        "Relation"
    }
>
    <Input
        className="cust-input"
        placeholder={"Relation"}
    />
</Form.Item>
</Col> */}