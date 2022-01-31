import React, { Component } from 'react';
import { Typography, Button, Tooltip, Modal, Alert, Form, Select, Col, Input } from 'antd';
import Translate from 'react-translate-component';
import List from "../grid.component";
import { getCurrencyLu, getPaymentsData } from './api'
import NumberFormat from 'react-number-format';
import { connect } from "react-redux";
class PaymentDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currency: [],
            selectedObj: {},
            currencyValue: "",
            paymentsData: [],
            paymentSavedata: [],
            loading: false
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

    handleChange = () => {

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
    handleInputChange = (prop, e) => {
        const rowChecked = prop.dataItem;
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        let { selection } = this.state;
        let idx = selection.indexOf(rowChecked.id);
        if (selection) {
            selection = [];
        }
        if (idx > -1) {
            selection.splice(idx, 1)
        }
        else {
            selection.push(rowChecked.id)
        }
        this.setState({ ...this.state, [name]: value, selectedObj: rowChecked, selection });
        console.log(this.state.selectedObj)
    }
    // gridColumns = [
    //     {
    //         field: "", title: "", width: 50,
    //         customCell: (props) => (
    //             <td className="text-center">
    // <label className="text-center custom-checkbox">
    //     <input
    //         id={props.dataItem.id}
    //         name="check"
    //         type="checkbox"
    //         // checked={this.state.selection.indexOf(props.dataItem.id) > -1}
    //         onChange={(e) => this.handleInputChange(props, e)}
    //         className="grid_check_box"
    //     />
    //     <span></span>
    // </label>
    //             </td>
    //         )
    //     },
    //     { field: "bankname", title: 'Bank Name',width: 370 },
    //     { field: "accountnumber", title: 'Account Number',width: 370 },
    //     {field: "amount", title: "Amount",width: 360,
    //         customCell: (props) => (<td className="text-center" style={{color:"black"}}>
    //         <NumberFormat value=""
    //         style={{backgroundColor:"gray",border:"none",borderRadius:"5px"}}
    //         thousandSeparator={true}
    //         type="text"
    //         prefix={'$'} 
    //          renderText={(value, props) =>
    //              <div {...props}>{value}</div>} /> </td> )},

    //   ];

    render() {
        const Option = Select;
        const { currency, paymentsData } = this.state;
        const { Title, Paragraph, Text } = Typography;
        return (
            <>
                <div className="main-container hidden-mobile">
                    <div className='mb-16'>
                        <Title className="basicinfo mb-0"><Translate content="menu_payments" component={Text} className="basicinfo" /></Title>
                    </div>
                    <div className="box basic-info text-white">
                        <Form

                            onFinish={this.saveRolesDetails}
                            autoComplete="off">
                            <div className="d-flex " style={{ justifyContent: "flex-end" }}>
                                <Col xs={18} sm={18} md={9} lg={4} xxl={4} className='mb-0'>
                                    <Form.Item
                                        className='mb-16'
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Is required',
                                            },]}>
                                        <Select
                                            className="cust-input"
                                            placeholder="Select Currency"
                                            onChange={() => this.handleChange()}
                                            dropdownClassName='select-drpdwn'
                                        >
                                            {currency?.map((item) => (
                                                <Option

                                                    className="btns-primarys ants-btns "
                                                    value={item.currencyCode}
                                                > {item.currencyCode}</Option>))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </div>

                            {/* <List
                            showActionBar={true}
                            //onActionClick={(key) => this.onActionClick(key)}
                            // pKey={"payments"}
                            ref={this.gridRef}
                            url={process.env.REACT_APP_GRID_API + `MassPayments/CreatPayment/f8be2fd6-9778-4408-ba57-7502046e13a5/00000000-0000-0000-0000-000000000000`}
                            columns={this.gridColumns}
/> */}

                            {/* <div className="d-flex">
                            <label className="text-center custom-checkbox">
                                <input
                                    // id={props.dataItem.id}
                                    name="check"
                                    type="checkbox"
                                    // checked={this.state.selection.indexOf(props.dataItem.id) > -1}
                                    // onChange={(e) => this.handleInputChange(props, e)}
                                    className="grid_check_box"
                                />
                                <span></span>
                            </label>
                            {paymentsData?.map((item,idx)=>{
                                <div key={idx}>
                            <Text>
                                {item.bankname}HDFC
                            </Text>
                           <Text>
                                {item.accountnumber}HDFC
                            </Text>
                            </div>})}
                            <Input className="cust-input" style={{width:200}} placeholder="Amount" type="text" />
                        </div> */}
                            <div style={{ alignItems: "center" }}>
                                <table className='pay-grid'>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Bank Name</th>
                                            <th>Account Number</th>
                                            <th>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paymentsData?.map((item, i) => {
                                            return (
                                                <>
                                                    <tr key={i} >
                                                        <td>
                                                            <label className="text-center custom-checkbox">
                                                                <input
                                                                    // id={props.dataItem.id}
                                                                    name="check"
                                                                    type="checkbox"
                                                                    // checked={this.state.selection.indexOf(props.dataItem.id) > -1}
                                                                    // onChange={(e) => this.handleInputChange(props, e)}
                                                                    className="grid_check_box"
                                                                />
                                                                <span></span>
                                                            </label>
                                                        </td>
                                                        <td>{item.bankname}</td>
                                                        <td>{item.accountnumber}</td>
                                                        <td>
                                                            <Input className="cust-input" style={{ height: 44 }} placeholder="Amount" type="text" />
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
                            <Button className="pop-btn px-36" htmlType="submit">
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