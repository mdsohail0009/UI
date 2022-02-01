import React, { Component, createRef } from 'react';
import { Typography, Button, Form, Select, message, Input, Alert } from 'antd';
import Translate from 'react-translate-component';
import { getCurrencyLu, getPaymentsData, savePayments } from './api'
import NumberFormat from 'react-number-format';
import { connect } from "react-redux";
class PaymentDetails extends Component {
    formRef = createRef();
    constructor(props) {
        super(props);
        this.state = {
            currency: [],
            selectedObj: { data: null, amount: null, currency: null },
            paymentObj: {},
            currencyValue: "",
            paymentsData: [],
            paymentSavedata: [],
            btnDisabled: true,
            errorMessage: null,
            visible: false,
            moreBankInfo: {}
        }
        this.gridRef = React.createRef();
        this.useDivRef = React.createRef();
    }
    backToPayments = () => {
        this.props.history.push('/payments')
    }
    componentDidMount() {
        this.getCurrencyLookup()
        this.getPayments()
        this.useDivRef.current.scrollIntoView()
    }
    handleAlert = () => {
        this.setState({ ...this.state, errorMessage: null })
    }
    handleCurrencyChange = (e) => {
        let { selectedObj } = this.state;
        selectedObj.currencyCode = e
        if (selectedObj.currencyCode == e) {
            this.state.selectedObj.currency = selectedObj.currencyCode;
        }
    }
    getCurrencyLookup = async () => {
        let response = await getCurrencyLu(this.props.userConfig?.id)
        if (response.ok) {
            this.setState({ ...this.state, currency: response.data });
        }
    }
    getPayments = async () => {
        let response = await getPaymentsData("00000000-0000-0000-0000-000000000000", this.props.userConfig?.id)
        if (response.ok) {
            this.setState({ ...this.state, paymentsData: response.data.paymentsDetails });
        }
    }

    saveRolesDetails = async () => {
        let objData = this.state.paymentsData.filter((item) => {
            return item.checked
        })
        let objAmount = this.state.paymentsData.some((item) => {
            return item.amount != null
        })
        let obj = Object.assign({});
        obj.id = this.props.userConfig.id;
        obj.currency = this.state.selectedObj.currency;
        obj.memberId = this.props.userConfig.id;
        obj.createdBy = new Date();
        obj.modifiedBy = new Date();
        obj.paymentsDetails = objData;
        if (obj.currency !== null && objAmount) {
            let response = await savePayments(obj);
            if (response.ok) {
                message.success('Data Saved successfully')
                this.props.history.push('/payments')
            } else {
                this.setState({ btnDisabled: false });
                message.destroy();
                message.error({
                    content: response.data,
                    className: "custom-msg",
                    duration: 0.5
                });
            }
        } else {
            this.setState({ ...this.state, errorMessage: "Please fill the details" })
            this.useDivRef.current.scrollIntoView()
        }
    }
    moreInfoPopover = async (id, index) => {
        debugger
        let response = await getBankData(id);
        if (response.ok) {
            this.setState({ ...this.state, moreBankInfo: response.data, visible: this.state.paymentsData[index].visible = true })
        } else {
            this.setState({ ...this.state, visible: false })
        }
    }
    handleVisibleChange = () => {
        this.setState({ visible: false })
    }
    render() {
        const Option = Select;
        const { currency, paymentsData, selectedObj } = this.state;
        const { Title, Text } = Typography;
        return (
            <>
                <div ref={this.useDivRef}></div>
                <div className="main-container">
                    <div className='mb-16'>
                        <Title className="basicinfo mb-0"><Translate content="menu_payments" component={Text} className="basicinfo" /></Title>
                    </div>
                    <div className="box basic-info text-white">
                        {this.state.errorMessage != null && (
                            <Alert
                                description={this.state.errorMessage}
                                type="error"
                                closable
                                onClose={() => this.handleAlert()}
                            />
                        )}
                        <Form
                            initialValues={{ ...selectedObj }}
                            autoComplete="off">
                            <Form.Item
                                label="Select Wallet"
                                className='mb-16 input-label'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Is required',
                                    },]}>
                                <Select
                                    className="cust-input"
                                    placeholder="Select Currency"
                                    onChange={(e) => this.handleCurrencyChange(e)}
                                    value={selectedObj.currencyCode}
                                    style={{ width: 200 }}
                                    dropdownClassName='select-drpdwn'
                                >
                                    {currency?.map((item, idx) => (
                                        <Option
                                            key={idx}
                                            className="btns-primarys ants-btns "
                                            value={item.currencyCode}
                                        > {item.currencyCode}</Option>))}
                                </Select>
                            </Form.Item>
                            <div>
                                <table className='pay-grid'>
                                    <thead>
                                        <tr>
                                            <th style={{ width: 50 }}></th>
                                            <th>Bank Name</th>
                                            <th>Account Number</th>
                                            <th>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="mb-0">
                                        {paymentsData?.map((item, i) => {

                                            return (
                                                <>
                                                    <tr key={i} >
                                                        <td style={{ width: 50 }}>
                                                            <label className="text-center custom-checkbox p-relative">
                                                                <Input
                                                                    name="check"
                                                                    type="checkbox"
                                                                    checked={item.checked}
                                                                    className="grid_check_box"
                                                                />
                                                                <span></span>
                                                            </label>

                                                        </td>
                                                        <td>
                                                            <div className='d-flex '>
                                                                <span>{item.bankname}</span>
                                                                <Popover
                                                                    className='more-popover'
                                                                    content={this.popOverContent}
                                                                    title="More Info"
                                                                    trigger="click"
                                                                    visible={item.visible}
                                                                    onVisibleChange={this.handleVisibleChange}
                                                                >
                                                                    <span className='icon md info c-pointer' onVisibleChange={() => this.moreInfoPopover(item.addressId, i)} />
                                                                </Popover>
                                                            </div>
                                                        </td>
                                                        <td>{item.accountnumber}</td>
                                                        <td>
                                                            <NumberFormat className="cust-input text-right"
                                                                customInput={Input} thousandSeparator={true} prefix={""}
                                                                placeholder="0.00"
                                                                decimalScale={2}
                                                                allowNegative={false}
                                                                style={{ height: 44 }}
                                                                onValueChange={({ e, value }) => {

                                                                    let paymentData = this.state.paymentsData;
                                                                    paymentData[i].amount = value;

                                                                    paymentData[i].checked = (value && value > 0) ? true : false;
                                                                    this.setState({ ...this.state, paymentData })
                                                                }}

                                                                onBlur={() => console.log(item)}
                                                            />
                                                        </td>
                                                    </tr>
                                                </>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </Form>
                        <div className="text-right mt-36">
                            <Button
                                className="pop-cancel mr-36"
                                style={{ margin: "0 8px" }}
                                onClick={this.backToPayments}
                            >
                                Cancel
                            </Button>
                            <Button className="pop-btn px-36" onClick={() => { this.saveRolesDetails() }} >
                                Pay Now
                            </Button>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
const connectStateToProps = ({ userConfig }) => {
    return { userConfig: userConfig.userProfileInfo };
};
export default connect(connectStateToProps, null)(PaymentDetails);