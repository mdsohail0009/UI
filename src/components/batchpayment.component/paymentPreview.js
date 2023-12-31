import React, { Component } from "react";
import {
  Drawer,
  Typography,
  Button,
   Alert,Modal} from "antd";
import Translate from "react-translate-component";
import { withRouter } from "react-router-dom";
import PaymentSummary from "./paymentSummary";
import List from "../grid.component";
import NumberFormat from "react-number-format";
import {confirmGetDetails} from './api'
import apicalls from "../../api/apiCalls";
const { Paragraph,Text } = Typography
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
closeDrawer = () => {
  this.setState({ ...this.state, paymentSummary:false})
}
returnDashboard=()=>{
  this.props.history.push("/cockpit")
}
 gridUSDColumns = [
  { field: "whiteListName", title: "Whitelist Name", filter: true,width:300},
  { field: "beneficiaryName", title: "First & Last Name/Beneficiary Name", filter: true,width: 335},
  { field: "relationshipToBeneficiary", title: "Relationship To Beneficiary", filter: true,width: 270},
  { field: "address", title: "Address", filter: true,width: 250},
  { field: "addressType", title: "Address Type", filter: true,width: 250,
  customCell: (props) => (
    <td className="d-flex justify-content">
      <Text className="grid-content">
        {this.addressTypeNames(props?.dataItem?.addressType)}
      </Text>
    </td>
  ),},
  { field: "transferType", title: "Transfer Type", filter: true,width: 250,
  customCell: (props) => (
    <td>
      <Text className="text-upper grid-content">
        {((props?.dataItem?.transferType === "internationalIBAN") && "International USD IBAN") ||
															props?.dataItem?.transferType.toUpperCase()}
      </Text>
    </td>
  )
  },
  { field: "amount", title: "Amount", filter: true,width: 250,dataType: "number", filterType: "numeric"},
  { field: "accountNumber", title: 'Account Number/IBAN', filter: true, width: 260},
  { field: "abaShiftCode", title: 'ABA Routing/ Swift / BIC Code', filter: true, width: 300 },
  { field: "bankName", title: 'Bank Name', filter: true, width: 200},
  { field: "bankAddress", title: 'Bank Address', filter: true, width: 200},
  { field: "reasonforTransfer", title: 'Reason For Transfer', filter: true, width: 200},
  { field: "reference", title: 'Reference', filter: true, width: 200},
];
gridEURColumns = [
  { field: "whiteListName", title: "Whitelist Name", filter: true,width: 300},
  { field: "beneficiaryName", title: "Beneficiary Name", filter: true,width: 250},
  { field: "relationshipToBeneficiary", title: "Relationship To Beneficiary", filter: true,width: 250},
  { field: "address", title: "Address", filter: true,width: 250},
  { field: "addressType", title: "Address Type", filter: true,width: 250,
  customCell: (props) => (
    <td className="d-flex justify-content">
      
        {this.addressTypeNames(props?.dataItem?.addressType)}
    
    </td>
  )},
  { field: "transferType", title: "Transfer Type", filter: true,width: 250,
  customCell: (props) => (
    <td>
     
        {props?.dataItem?.transferType}
    
    </td>
  )},
  { field: "amount", title: "Amount", filter: true,width: 250,dataType: "number", filterType: "numeric"},
  { field: "accountNumber", title: "IBAN", filter: true,width: 250},
  { field: "reasonforTransfer", title: 'Reason For Transfer', filter: true, width: 200},
  { field: "reference", title: 'Reference', filter: true, width: 250 },
];

addressTypeNames = (type) => {
  const stepcodes = {
    "ownbusiness": "My Company",
    "individuals": "Individuals",
    "otherbusiness": "Other Business",
    "myself": "My Self"
  };
  return stepcodes[type];
};
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
    this.setState({...this.state,isLoad:false,errorMessage:apicalls.isErrorDispaly(response), paymentSummary:false})
  }

}

  render() {
    const { Title } = Typography;
    return (
      <>

        <Drawer
          title={[<div className="side-drawer-header">

             <div className="text-center">
                <div className='grid-title'>Preview</div>
                </div>
           
            <span onClick={this.props.onClose} className="icon md close-white c-pointer" />
          </div>]}
          placement="right"
          closable={false}
          width="100%"
          onClose={this.props.onClose}
          visible={this.props.showDrawer}
          className="side-drawer-full custom-gridresponsive transctns-grid preview-grid"
        >

          
          {this.state.errorMessage !== null && (
          <Alert type="error" description={this.state.errorMessage} showIcon />
               )}
               <div className="text-white" style={{ clear: 'both' }}>
               <Translate content="bathch_payments_preview" component={Title} className="sub-heading" />
                
                  {this.props?.currency === "EUR" ? (
						<List
							className="address-clear"
							columns={this.gridEURColumns}
							ref={this.gridRef}
              showActionBar={false}
              url={this.state.gridUrl}
						/>
					) : (
						<List
							className="address-clear preview-content"
							columns={this.gridUSDColumns}
              ref={this.gridRef}
              url={this.state.gridUrl}
              showActionBar={false}
						/>
					)}
            </div>
                <div className="text-right mt-12 batch-btns">
                    <Button className="cust-cancel-btn preview-back"
                        style={{ width: 148, height: 48 }}
                        onClick={this.props.onClose}>Back</Button>
                    <Button className="pop-btn custom-send sell-btc-btn ml-8" loading={this.state.isLoad}
                        style={{ width: 148, height: 48 }}
                        onClick={this.confirmPreview}>Confirm</Button>
                
                </div>
        </Drawer>
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
               <Modal
                    visible={this.state.showModal}
                    closeIcon={false}
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
