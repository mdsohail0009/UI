import React, { Component, createRef } from 'react';
import { Typography, Button, Form, Select, Col, message, Input, Alert, Popover } from 'antd';
import Translate from 'react-translate-component';
import { getCurrencyLu, getPaymentsData, savePayments, getBankData } from './api'
import NumberFormat from 'react-number-format';
import { connect } from "react-redux";
class PaymentDetails extends Component {
    formRef = createRef();
    constructor(props) {
        super(props);
        this.state = {
            // isChecked: false,
            currency: [],
            selectedObj: { data: null, amount: null, currency: null },
            paymentObj: {},
            currencyValue: "",
            paymentsData: [],
            paymentSavedata: [],
            btnDisabled: true,
            errorMessage: null,
            infoPopover: false,
            moreBankInfo: {}
        }
        this.gridRef = React.createRef();
    }
    backToPayments = () => {
        this.props.history.push('/payments')
    }
    componentDidMount() {
        this.getCurrencyLookup()
        this.getPayments()
    }

    handleCurrencyChange = (e) => {

        let { selectedObj } = this.state;
        selectedObj.currencyCode = e
        if (selectedObj.currencyCode == e) {
            this.state.selectedObj.currency = selectedObj.currencyCode;
        }
        console.log(selectedObj)
    }


    getCurrencyLookup = async () => {
        let response = await getCurrencyLu(this.props.userConfig?.id)
        if (response.ok) {
            console.log(response.data)
            this.setState({ ...this.state, currency: response.data });
        }
    }
    getPayments = async () => {
        let response = await getPaymentsData("00000000-0000-0000-0000-000000000000", this.props.userConfig?.id)
        if (response.ok) {
            console.log("ddddddd", response.data)
            this.setState({ ...this.state, paymentsData: response.data.paymentsDetails });
            console.log(this.state.paymentsData)
        }
    }
    handleCheckChange = (e, val) => {
        debugger
        const { paymentsData, paymentSavedata, selectedObj } = this.state;
        if (e.target.checked) {
            const payrecord = paymentsData.find(item => item.id === val.id);
            console.log(payrecord);
            payrecord.currency = this.state.selectedObj.currency;
            payrecord.amount = this.state.selectedObj.amount;
            paymentSavedata.push(payrecord);
        }
        else {
            const payrecord = paymentSavedata.filter(item => item.id !== val.id);
            const finalPays = paymentSavedata.splice(0, paymentSavedata.length, payrecord);
            console.log(paymentSavedata)
            this.setState({ paymentSavedata: finalPays })
        }
        console.log("Payments data==========", paymentSavedata)

    }
    // checkAllChange=(event,item)=>{
    //     console.log(item);
    //     this.setState({...this.state,isChecked:!this.state.isChecked})
    //     this.state.paymentObj=item;
    //     this.state.paymentObj.currency=this.state.selectedObj.currency
    //     this.state.paymentObj.amount=this.state.selectedObj.amount
    //     if( this.state.paymentObj.amount==item.amount){
    //         if(this.state.isChecked===false){  
    //             this.state.paymentSavedata.push(this.state.paymentObj);}
    //         else 
    //             this.state.paymentSavedata.pop(this.state.paymentObj);

    //     }
    //     console.log(this.state.isChecked)
    //     console.log(this.state.paymentSavedata)
    // }

    saveRolesDetails = async () => {
        debugger
        let obj = Object.assign({})
        obj.id = this.props.userConfig.id
        obj.currency = this.state.selectedObj.currency
        obj.memberId = this.props.userConfig.id
        obj.createdBy = new Date()
        obj.modifiedBy = new Date()
        obj.paymentsDetails = this.state.paymentSavedata
        console.log(obj)
        let response = await savePayments(obj);
        if (response.ok) {
            console.log(response.data)
            alert("data saved scuessfully")
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
    }
    moreInfoPopover = async (id) => {
        debugger
        let response = await getBankData(id);
        if (response.ok) {
            this.setState({ ...this.state, infoPopover: false })
        } else {
            this.setState({ ...this.state, infoPopover: false })
        }
    }

    render() {
        const Option = Select;
        const { currency, paymentsData, selectedObj, infoPopover } = this.state;
        const { Title, Text } = Typography;
        return (
            <>
                <div className="main-container">
                    <div className='mb-16'>
                        <Title className="basicinfo mb-0"><Translate content="menu_payments" component={Text} className="basicinfo" /></Title>
                    </div>
                    {this.state.errorMessage != null && (
                        <Alert
                            description={this.state.errorMessage}
                            type="error"
                            closable
                            onClose={() => this.setState({ errorMessage: null })}
                        />
                    )}
                    <div className="box basic-info text-white">
                        <Form
                            initialValues={{ ...selectedObj }}
                            // onFinish={this.saveRolesDetails}
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
                                                                    onChange={(e) => this.handleCheckChange(e, item)}
                                                                    className="grid_check_box"
                                                                />
                                                                <span></span>
                                                            </label>

                                                        </td>
                                                        <td>
                                                            <div className='d-flex align-center justify-content'>
                                                                <span>{item.bankname}</span>
                                                                <Popover
                                                                    content={<a>Close</a>}
                                                                    title="More Info"
                                                                    trigger="click"
                                                                    visible={infoPopover}
                                                                    onVisibleChange={() => this.moreInfoPopover(item.id)}
                                                                >
                                                                    <span className='icon md info c-pointer' />
                                                                </Popover>
                                                            </div>
                                                        </td>
                                                        <td>{item.accountnumber}</td>
                                                        <td>
                                                            <NumberFormat className="cust-input text-right mb-0"
                                                                customInput={Input} thousandSeparator={true} prefix={""}
                                                                required
                                                                placeholder="0.00"
                                                                decimalScale={2}
                                                                allowNegative={false}
                                                                style={{ height: 44 }}
                                                                onValueChange={({ e, value }) => {
                                                                    selectedObj.amount = value
                                                                }}

                                                            //   value={selectedObj.amount}
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