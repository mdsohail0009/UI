import React, { Component } from "react";
import {
  Drawer,
  Typography,
  Button,
   Select} from "antd";
import { connect } from "react-redux";
import Translate from "react-translate-component";
import { withRouter } from "react-router-dom";
import PaymentSummary from "./paymentSummary";
//import { Spreadsheet } from '@progress/kendo-spreadsheet-react-wrapper';
import Spreadsheet from "react-spreadsheet";


const { Option } = Select;
class paymentPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      showModal:false,
      paymentSummary: false,
      data: [
        [{ value: "A" }, { value: "A" },{ value: "A" }, { value: "A" },{ value: "A" }, { value: "A" },{ value: "A" }, { value: "A" },{ value: "A" }, { value: "A" },{ value: "A" }, { value: "A" },{ value: "A" }, { value: "A" },],
        [{ value: "B" }, { value: "B" }],
        [{ value: "C" }, { value: "C" }],
        [{ value: "D" }, { value: "D" }],
        [{ value: "E" }, { value: "E" }],
        [{ value: "F" }, { value: "F" }],
        [{ value: "G" }, { value: "G" }],
        [{ value: "H" }, { value: "H" }],
        [{ value: "I" }, { value: "I" }],
        [{ value: "J" }, { value: "J" }],
        [{ value: "K" }, { value: "K" }],
        [{ value: "L" }, { value: "L" }],
        [{ value: "M" }, { value: "M" }],
        [{ value: "N" }, { value: "N" }],

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
      {/* <div>
    <h4>SpreadSheet - GeeksforGeeks</h4>
    <Spreadsheet data={this.state.data} />
  </div>  */}
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
                        // onClick={() => this.props.history.push('/cockpit')}
                        onClick={this.props.onClose}>Back</Button>
                    <Button className="pop-btn custom-send sell-btc-btn ml-8"
                        style={{ width: 100, height: 50 }}
                        onClick={() => this.setState({ ...this.state, paymentSummary: true}, () => { })}>Confirm</Button>
                </div>
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
