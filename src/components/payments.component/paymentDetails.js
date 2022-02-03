import React, { Component, createRef } from 'react';
import { Typography, Button, Form, Select, message, Input, Alert, Popover, Spin } from 'antd';
import Translate from 'react-translate-component';
import { getCurrencyLu, getPaymentsData, savePayments, getBankData } from './api'
import NumberFormat from 'react-number-format';
import { connect } from "react-redux";

const { Option } = Select;
const { Title, Text } = Typography;
class PaymentDetails extends Component {
    formRef = createRef();
    constructor(props) {
        super(props);
        this.state = {
            currency: [],
            Currency: null,
            paymentsData: [],
            paymentSavedata: [],
            btnDisabled: false,
            disabled: false,
            errorMessage: null,
            visible: false,
            moreBankInfo: {},
            loading: false,
            tooltipLoad: false,
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
    handleCurrencyChange = (val) => {
        this.setState({ ...this.state, Currency: val })
    }
    getCurrencyLookup = async () => {
        let response = await getCurrencyLu(this.props.userConfig?.id)
        if (response.ok) {
            this.setState({ ...this.state, currency: response.data });
        } else {
            message.destroy();
            this.setState({ ...this.state, errorMessage: response.data })
            this.useDivRef.current.scrollIntoView()
        }
    }
    getPayments = async () => {
        this.setState({ ...this.state, loading: true })
        let response = await getPaymentsData("00000000-0000-0000-0000-000000000000", this.props.userConfig?.id)
        if (response.ok) {
            this.setState({ ...this.state, paymentsData: response.data.paymentsDetails, loading: false });
        } else {
            message.destroy();
            this.setState({ ...this.state, errorMessage: response.data })
            this.useDivRef.current.scrollIntoView()
        }
    }

    saveRolesDetails = async () => {
        let objData = this.state.paymentsData.filter((item) => {
            return item.checked
        })
        let objAmount = this.state.paymentsData.some((item) => {
            return item.amount != null
            //return item.amount>0
        })
        let obj = Object.assign({});
        obj.id = this.props.userConfig.id;
        obj.currency = this.state.Currency;
        obj.memberId = this.props.userConfig.id;
        obj.createdBy = this.props.userConfig.userName;
        obj.modifiedBy = "";
        obj.paymentsDetails = objData;
        if (obj.currency != null) {
            if (!objAmount) {
                this.setState({ ...this.state, errorMessage: "Please enter amount ." })
                this.useDivRef.current.scrollIntoView()

            }
            else if (!objAmount > 0) {
                this.setState({ ...this.state, errorMessage: "Amount must be greater than zero." })
                this.useDivRef.current.scrollIntoView()
            } 
            // else if(obj==null){
            //     this.setState({ ...this.state, errorMessage: "No bank details available." })
            //     this.useDivRef.current.scrollIntoView()
            // } 
            else {
                this.setState({ btnDisabled: true });
                let response = await savePayments(obj);
                if (response.ok) {
                    this.setState({ btnDisabled: false });
                    message.destroy();
                    message.success({
                        content: 'Payment details saved successfully',
                        className: "custom-msg",
                        duration: 0.5
                    })
                    this.props.history.push('/payments')
                } else {
                    this.setState({ btnDisabled: false });
                    message.destroy();
                    this.setState({ ...this.state, errorMessage: response.data })
                    this.useDivRef.current.scrollIntoView()
                }
            }
        } else {
            this.setState({ ...this.state, errorMessage: "Please select currency" })
            this.useDivRef.current.scrollIntoView()
        }
    }
    moreInfoPopover = async (id, index) => {
        this.setState({ ...this.state, tooltipLoad: true });
        let response = await getBankData(id);
        if (response.ok) {
            this.setState({
                ...this.state, moreBankInfo: response.data, visible: true, tooltipLoad: false
            });
        } else {
            this.setState({ ...this.state, visible: false, tooltipLoad: false });
        }
    }
    handleVisibleChange = (index) => {
        this.setState({ ...this.state, visible: false });
    }
    popOverContent = () => {
        const { moreBankInfo, tooltipLoad } = this.state;
        if (tooltipLoad) {
            return <Spin />
        } else {
            return (<div className='more-popover'>
                <Text className='lbl'>Address Label</Text>
                <Text className='val'>{moreBankInfo?.favouriteName}</Text>
                <Text className='lbl'>Recipient Full Name</Text>
                <Text className='val'>{moreBankInfo?.beneficiaryAccountName}</Text>
                <Text className='lbl'>Recipient Address</Text>
                <Text className='val'>{moreBankInfo?.beneficiaryAccountAddress}</Text>
                <Text className='lbl'>BIC/SWIFT/Routing Number</Text>
                <Text className='val'>{moreBankInfo?.routingNumber}</Text>
                {/* <Text className='lbl'>Swift Code</Text>
                <Text className='val'>{moreBankInfo.swiftCode ? moreBankInfo.swiftCode : '--'}</Text> */}
                <Text className='lbl'>Bank Address</Text>
                <Text className='val'>{moreBankInfo?.bankAddress}</Text>
            </div>)
        }
    }
    render() {
        const { currency, paymentsData, loading } = this.state;
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
                            autoComplete="off">
                            <Form.Item
                                // label="Select Currency"
                                // className='mb-16 input-label'
                                // id='selectCurrency'
                            >
                                <Select
                                    className="cust-input"
                                    placeholder="Select Currency"
                                    onChange={(e) => this.handleCurrencyChange(e)}
                                    style={{ width: 250 }}
                                    dropdownClassName='select-drpdwn'
                                    bordered={false}
                                    showArrow={true}
                                >
                                    {currency?.map((item, idx) => (
                                        <Option
                                            key={idx}
                                            className="fw-400"
                                            value={item.currencyCode}
                                        > {item.currencyCode} Balance: {item.avilable} </Option>))}
                                </Select>
                            </Form.Item>
                            <div>
                                <table className='pay-grid'>
                                    <thead>
                                        <tr>
                                            <th style={{ width: 50 }}></th>
                                            <th>Bank Name</th>
                                            <th>Bank Account Number</th>
                                            <th>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="mb-0">
                                        {loading && <tr>
                                            <td colSpan='4' className='text-center p-16'><Spin size='default' /></td></tr>}
                                        {paymentsData?.map((item, i) => {
                                            return (
                                                <>
                                                   {paymentsData.length > 0? <tr key={i} >
                                                        <td style={{ width: 50 }} className='text-center'>
                                                            <label className="text-center custom-checkbox p-relative">
                                                                <Input
                                                                    style={{ cursor: "not-allowed" }}
                                                                    name="check"
                                                                    type="checkbox"
                                                                    disabled
                                                                    checked={item.checked}
                                                                    className="grid_check_box"
                                                                />
                                                                <span></span>
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <div className='d-flex align-center justify-content'>
                                                                <span>{item.bankname}</span>
                                                                <Popover
                                                                    className='more-popover'
                                                                    content={this.popOverContent}
                                                                    trigger="click"
                                                                    visible={item.visible}
                                                                    placement='top'
                                                                    onVisibleChange={() => this.handleVisibleChange(i)}
                                                                >
                                                                    <span className='icon md info c-pointer' onClick={() => this.moreInfoPopover(item.addressId, i)} />
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
                                                                maxlength={13}
                                                                style={{ height: 44 }}
                                                                onValueChange={({ e, value }) => {
                                                                    let paymentData = this.state.paymentsData;
                                                                    paymentData[i].amount = value;
                                                                    paymentData[i].checked = value > 0 ? true : false;
                                                                    this.setState({ ...this.state, paymentsData: paymentData })
                                                                }}
                                                            />
                                                        </td>
                                                    </tr>
                                        :"No bank details available." } </>
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
                            <Button className="pop-btn px-36" disabled={this.state.btnDisabled} onClick={() => { this.saveRolesDetails() }} >
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