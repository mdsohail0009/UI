import React, { Component } from "react";
import {
  Drawer,
  Typography,
  Button,
   Alert} from "antd";
import { connect } from "react-redux";
import Translate from "react-translate-component";
import { withRouter } from "react-router-dom";
import PaymentSummary from "./paymentSummary";
import Spreadsheet from "react-spreadsheet";
import List from "../grid.component";
import {confirmGetDetails} from './api'
class paymentPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      showModal:false,
      paymentSummary: false,
      insufficientModal: false,
      errorMessage:null,
      onBack:this.props.isProceedBatchPayment,
      getPaymentDetails:[],
      isLoad:false,
      gridUrl:process.env.REACT_APP_GRID_API + `MassPayments/BatchPaymentsDetail/${this.props.id}`,
     
    };
    this.gridRef = React.createRef();

  }
componentDidMount=()=>{
}
handleCancel=()=>{
  this.setState({ ...this.state, showModal:false})
}
closeDrawer = () => {
  this.setState({ ...this.state, paymentSummary:false})
}
 gridColumns = [
  
  { field: "whiteListName", title: "Whitelist Name", filter: true,width: 200},
  { field: "beneficiaryName", title: "Beneficiary Name", filter: true,width: 200},
  {
field: "isWhitelisted",

title:"Whitelist Status",
filter: false,
width: 200,
},
  { field: "accountNumber", title: 'Account Number/IBAN', filter: true, width: 250, customCell: () => (<td className='text-center'></td>) },
  { field: "amount", title: 'Amount', filter: true, width: 200},
  { field: "transactionStatus", title: 'Transaction Status', filter: true, width: 200},
  { field: "uploadedDocuments", title: 'Uploaded Documents', filter: true, width: 220, },
 
];


confirmPreview = async () => {
  this.setState({...this.state,isLoad:true})
   this.setState({...this.state,errorMessage:null})
   let response = await confirmGetDetails(this.props?.id ||this.props?.fileData?.id)
   if(response.ok){
    this.setState({ ...this.state,isLoad:false, paymentSummary: true, insufficientModal: false ,getPaymentDetails:response.data})
  }else{
    this.setState({...this.state,isLoad:false,insufficientModal:false,errorMessage:this.isErrorDispaly(response), paymentSummary:false})
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
        {this.state.errorMessage !== null && (
          <Alert type="error" description={this.state.errorMessage} showIcon />
               )}
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
          </div>
          < div className='main-container'>
          
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
                        onClick={()=>this.confirmPreview()}>Confirm</Button>
                
                </div>
          </div>
         
                
                {this.state.paymentSummary &&
                       <PaymentSummary
                        showDrawer={this.state.paymentSummary}
                        onClose={() => {
                            this.closeDrawer();
                        }}
                        getPaymentDetails={this.state.getPaymentDetails}
                        id={this.props?.id}
                        transactionContinue={this.props?.transactionContinue}
                        fileData={this.props?.fileData}
                    />
                       }
        </Drawer>

      </>

    );
  }
}

export default (withRouter(paymentPreview));
