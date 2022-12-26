import React, { Component } from "react";
import {
  Drawer,
  Typography,
  Button,
   Alert,Modal,Tooltip} from "antd";
import Translate from "react-translate-component";
import { withRouter } from "react-router-dom";
import PaymentSummary from "./paymentSummary";
import List from "../grid.component";
import NumberFormat from "react-number-format";
import {confirmGetDetails} from './api'
const { Paragraph } = Typography
class PaymentPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      showModal:false,
      paymentSummary: false,
      errorMessage:null,
      getPaymentDetails:[],
      isLoad:false,
      gridUrl:process.env.REACT_APP_GRID_API + `MassPayments/BatchPaymentsDetail/${this.props.id}`,
     
    };
    this.gridRef = React.createRef();

  }
componentDidMount=()=>{
}
closeDrawer = () => {
  this.setState({ ...this.state, paymentSummary:false})
}
returnDashboard=()=>{
  this.props.history.push("/cockpit")
}
 gridColumns = [
  { field: "whiteListName", title: "Whitelist Name", filter: true,width: 400},
  { field: "beneficiaryName", title: "Beneficiary Name", filter: true,width: 250},
  { field: "accountNumber", title: 'Account Number/IBAN', filter: true, width: 250 },
  { field: "amount", title: 'Amount', filter: true, width: 200},
  { field: "transactionStatus", title: 'Transaction Status', filter: true, width: 200},
];


confirmPreview = async () => {
   this.setState({...this.state,errorMessage:null,isLoad:true})
   let response = await confirmGetDetails(this.props?.id ||this.props?.fileData?.id)
   if(response.ok){
    if(response.data.isSuccess===false){
      this.setState({ ...this.state,isLoad:false, showModal: true,getPaymentDetails:response.data})
    }else{
      this.setState({ ...this.state,isLoad:false, paymentSummary: true,getPaymentDetails:response.data})
    }
    
  }else{
    this.setState({...this.state,isLoad:false,errorMessage:this.isErrorDispaly(response), paymentSummary:false})
  }

}
isErrorDispaly = (objValue) => {
  if (objValue.data && typeof objValue.data === "string") {
    return objValue.data;
  } else if (
    objValue.originalError &&
    typeof objValue.originalError.message === "string"
  ) {
    return objValue.originalError.message;
  } else {
    return "Something went wrong please try again!";
  }
  };
  render() {
    const { Title } = Typography;
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

          < div className='main-container'>
          <Translate content="bathch_payments_preview" component={Title} className="fs-26 fw-400 mb-14 text-white-30" />
          {this.state.errorMessage !== null && (
          <Alert type="error" description={this.state.errorMessage} showIcon />
               )}
                  <List
                      showActionBar={false}
                      url={this.state.gridUrl}
                      columns={this.gridColumns}
                      ref={this.gridRef}
                     
                  />
            
                <div className="text-right mt-12">
                    <Button className="text-white-30 fw-400 pop-btn custom-send mb-12 cancel-btn mr-8 ml-0 primary-btn pop-cancel"
                        style={{ width: 100, height: 50 }}
                        onClick={this.props.onClose}>Back</Button>
                    <Button className="pop-btn custom-send sell-btc-btn ml-8" loading={this.state.isLoad}
                        style={{ width: 100, height: 50 }}
                        onClick={this.confirmPreview}>Confirm</Button>
                
                </div>
          </div>
         
                
                {this.state.paymentSummary &&
                       <PaymentSummary
                        showDrawer={this.state.paymentSummary}
                        onClose={this.closeDrawer }
                        getPaymentDetails={this.state.getPaymentDetails}
                        id={this.props?.id}
                        transactionContinue={this.props?.transactionContinue}
                        fileData={this.props?.fileData}
                    />
                       }
        </Drawer>
        <Modal
                    visible={this.state.showModal}
                    title="Proceed with Transactions"
                    closeIcon={
                        <Tooltip title="Close">
                            <span
                                className="icon md close-white c-pointer"
                                onClick={() => this.setState({ ...this.state, showModal: false, uploadErrorModal: false }, () => { })}
                            />
                        </Tooltip>
                    }
                    destroyOnClose={true}
                  
                    footer={null}
                    >
                    <>
                    
                        <div className='text-center pt-16'>
                            <Paragraph className='text-white fs-18'>
                            <div>You do not have enough balance.</div>
                            <div>Total amount including fees:{" "}
                            {this.state.getPaymentDetails?.walletCode}{" "}
                            <NumberFormat className='fw-500 text-white-30'
                                        value={`${this.state?.getPaymentDetails?.amount}`}
                                        thousandSeparator={true} displayType={"text"} />
                            </div>
                          <div>Balance available:{" "}
                          {this.state.getPaymentDetails?.walletCode}{" "}
                          <NumberFormat className='fw-500 text-white-30'
                                        value={`${this.state?.getPaymentDetails?.availableAmount}`}
                                        thousandSeparator={true} displayType={"text"} />
                           </div>
                          <div>Shortfall:{" "}{this.state.getPaymentDetails?.walletCode}{" "}
                          <NumberFormat className='fw-500 text-white-30'
                                        value={`${this.state?.getPaymentDetails?.shortfallAmount}`}
                                        thousandSeparator={true} displayType={"text"} />
                          
                          </div>
                          <div>Please top up.{" "}A draft has been saved. </div></Paragraph>
                            <div><Button className="primary-btn pop-btn"  onClick={this.returnDashboard}>Return</Button></div>
                        </div>
                    </>
                </Modal>
      </>

    );
  }
}

export default (withRouter(PaymentPreview));
