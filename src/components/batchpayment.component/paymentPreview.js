import React, { Component } from "react";
import {
  Drawer,
  Typography,
  Button,
  Modal,
  Tooltip,
   Select} from "antd";
import { connect } from "react-redux";
import Translate from "react-translate-component";
import { withRouter } from "react-router-dom";
import PaymentSummary from "./paymentSummary";
//import { Spreadsheet } from '@progress/kendo-spreadsheet-react-wrapper';
import Spreadsheet from "react-spreadsheet";

const { Paragraph } = Typography
const { Option } = Select;
class paymentPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      showModal:false,
      paymentSummary: false,
      insufficientModal: false,
      data: [
        [{ value: "File Name" }, { value: "Relationship to Benficiary" },{ value: "Address Line1" }, { value: "Transfer Type" },{ value: "Amount in USD" }, { value: "Account Number/IBAN" },{ value: "ABA Routing/Swift/BIC Code" }, { value: "Bank Name" },{ value: "Bank Address" }, { value: "Reason For Transfer" }],
        [{ value: "" }, { value: "" }],
        [{ value: "" }, { value: "" }],
        [{ value: "" }, { value: "" }],
        [{ value: "" }, { value: "" }],
        [{ value: "" }, { value: "" }],
        [{ value: "" }, { value: "" }],
        [{ value: "" }, { value: "" }],
        [{ value: "" }, { value: "" }],
        [{ value: "" }, { value: "" }],
        [{ value: "" }, { value: "" }],
        [{ value: "" }, { value: "" }],
        [{ value: "" }, { value: "" }],
        [{ value: "" }, { value: "" }],
        [{ value: "" }, { value: "" }],

      ]
    };
  }

handleCancel=()=>{
  this.setState({ ...this.state, showModal:false})
}

closeDrawer = () => {
  this.setState({ ...this.state, paymentSummary:false})
}

  render() {
    const { Title } = Typography;
    debugger
    return (
      <>
        <Drawer
          title={[<div className="side-drawer-header">
            <span></span>
             <div className="text-center">
                <div className='text-white fs-24 fw-500'>Preview</div>
                </div>
           
            <span onClick={this.props.onClose} className="icon md close-white c-pointer" />
          </div>]}
          placement="right"
          closable={false}
          width="100%"
          onClose={this.props.onClose}
          visible={this.props.showDrawer}
          className="side-drawer-full custom-gridresponsive transctns-grid"
        >
           <Translate content="bathch_payments_preview" component={Title} className="fs-26 fw-400 mb-0 text-white-30" />
          <div>
            <Spreadsheet data={this.state.data} />
          </div>
                <div className="text-right mt-12">
                    <Button className="text-white-30 fw-400 pop-btn custom-send mb-12 cancel-btn mr-8 ml-0 primary-btn pop-cancel"
                        style={{ width: 100, height: 50 }}
                        onClick={this.props.onClose}>Back</Button>
                    <Button className="pop-btn custom-send sell-btc-btn ml-8"
                        style={{ width: 100, height: 50 }}
                        onClick={() => this.setState({ ...this.state, paymentSummary: false, insufficientModal: true}, () => { })}>Confirm</Button>
                
                </div>
                <Modal
                     visible={this.state.insufficientModal}
                     title="Insufficient Balance"
                     closeIcon={
                        <Tooltip title="Close">
                          <span
                            className="icon md close-white c-pointer"
                            onClick={() =>  this.setState({ ...this.state, paymentSummary: false, insufficientModal: false}, () => { })}
                          />
                        </Tooltip>
                      }
                      destroyOnClose={true}
                   
                    footer={ <Button className="primary-btn pop-btn"
                    style={{ width: 100, height: 50 }}
                    onClick={() => { this.props.history.push('/cockpit') }}>Return</Button>}>
                        <>
                        <div className='text-center pt-16'>
                            <Paragraph className='text-white fs-18'><div>You do not have enough balance.</div>
                            <div>Total amount including fees: EUR X, XXX.XX</div>
                            <div> Balance available: EUR X,XXX.XX</div>
                            <div> Shortfall: EUR X,XXX.XX</div>
                            <div> Please top up.</div>
                            <div>   A draft has been saved.</div>
                            </Paragraph>
                        </div>
                        </>
                </Modal>
                {this.state.paymentSummary &&
                       <PaymentSummary
                        showDrawer={this.state.paymentSummary}
                        onClose={() => {
                            this.closeDrawer();
                        }}
                    />
                       }
        </Drawer>

      </>

    );
  }
}
const connectStateToProps = ({ userConfig }) => {
  return { customer: userConfig.userProfileInfo };
};
const connectDispatchToProps = dispatch => {
  return {
    dispatch
  }
}
export default connect(connectStateToProps, connectDispatchToProps)(withRouter(paymentPreview));
