import React, { Component } from 'react';
import { Typography, Button, Tooltip, Modal, Alert,Form,Select,Col } from 'antd';
import Translate from 'react-translate-component';
import List from "../grid.component";
import FormItem from 'antd/lib/form/FormItem';
class PaymentDetails extends Component {
    constructor(props) {
        super(props);
   this.state = {     
    }
    this.gridRef = React.createRef();
}
    backToPayments = () => {
        this.props.history.push('/payments')
    }
    gridColumns = [
        { field: "firstName", title:' Bank name', filter: true, isShowTime: true, filterType: "date", width: 380 },
        { field: "lastName", title: 'Account Number', filter: true, width: 370 },
        {field: "amount", title: "Amount",width: 400,
            customCell: (props) => (<td className="text-center">
            <input />  </td> )},
        
      ];
      
    render() {
        const Option = Select;
        const { Title, Paragraph, Text } = Typography;
        return (
            <>
                <div className="main-container hidden-mobile">
                    <div className='mb-16'>
                        <Title className="basicinfo mb-0"><Translate content="menu_payments" component={Text} className="basicinfo" /></Title>
                    </div>
                    <div className="box basic-info text-white">
                        <Form>
                        <Col xs={18} sm={18} md={9} lg={6} xxl={4}>
                        <Form.Item
                            label="Add payments grid"
                            // className="input-label"
                            rules={[
                            {
                            required: true,
                            message: 'Is required',
                            },]}>
                            <Select
                            className="cust-input"
                            placeholder="Select Currency"
                            >
                           <Option value="1">USD</Option>
                           <Option value="2">GBP</Option>
                           <Option value="3">EUR</Option>
                            </Select>
                            </Form.Item>
                            </Col>
                        </Form>
                        <List
                            showActionBar={true}
                            //onActionClick={(key) => this.onActionClick(key)}
                            // pKey={"payments"}
                            ref={this.gridRef}
                            url={process.env.REACT_APP_GRID_API + "MassPayments/UserPayments/85c6f93c-bcdf-4609-817f-1218f5ac32d0"}
                            columns={this.gridColumns}
/>
                            <div className="text-right mt-24">
                                        <Button  className="pop-btn mt-36" htmlType="submit">
                                            Pay Now
                                        </Button>
                                        <Button
                                           
                                            className="pop-btn mt-36"
                                            style={{ margin: "0 8px" }}
                                            onClick={this.backToPayments}
                                        >
                                            Cancel
                                        </Button>
                                        </div>
                           
                    </div>
                </div>
            </>
        )
    }
}

export default PaymentDetails;