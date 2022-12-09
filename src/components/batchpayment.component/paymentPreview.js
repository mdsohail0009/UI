import React, { Component } from "react";
import {
  Drawer,
  Typography,
  Button,
   Select} from "antd";
import { connect } from "react-redux";
import Translate from "react-translate-component";
import { setCurrentAction } from "../../reducers/actionsReducer";
import { withRouter } from "react-router-dom";
import PaymentSummary from "./paymentSummary";
import { Spreadsheet } from '@progress/kendo-spreadsheet-react-wrapper';

const { Option } = Select;
class paymentPreview extends Component {
  formRef = React.createRef();
  formDateRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      showModal:false,
      paymentSummary: false,
      initialRender: true
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
            <Translate content="bathch_payments_preview" component={Title} className="fs-26 fw-400 mb-0 text-white-30" />
            <span onClick={this.props.onClose} className="icon md close-white c-pointer" />
          </div>]}
          placement="right"
          closable={false}
          width="100%"
          onClose={this.props.onClose}
          visible={this.props.showDrawer}
          className="side-drawer-full custom-gridresponsive transctns-grid"
        >
          <div>
        <Spreadsheet
          render={(e) => {
            var height = window.innerHeight;
            e.sender.element.innerHeight(height);
            e.sender.element.innerWidth(500);
            if (this.state.initialRender) {
              this.state.initialRender = false
              e.sender.refresh()
            }
          }} />
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
    setAction: (val) => {
      dispatch(setCurrentAction(val))
    },
    dispatch
  }
}
export default connect(connectStateToProps, connectDispatchToProps)(withRouter(paymentPreview));
