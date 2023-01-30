import React, { Component } from 'react';
import { Drawer, Typography, Button, Modal,Tooltip,Spin,Alert } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import pending from '../../assets/images/pending.png';
import NumberFormat from "react-number-format";
import Verifications from "../onthego.transfer/verification.component/verifications"
import {proceedTransaction} from './api'
const { Title, Paragraph, Text } = Typography

class PaymentSummary extends Component {
	myRef = React.createRef();
	constructor(props) {
		super(props);
		this.state = {
		  showDeclaration: false,
		  verifyData: null,
		  phBtn:false,
		  emailBtn:false,
		  authBtn:false,
		  isShowGreyButton: false,
		  reviewDetailsLoading: false,
		  insufficientModal:false,
		  errorMessage:null,
		  loading:false,
		}
	}
	showDeclaration=async()=>{	
		this.setState({...this.state,loading:true,errorMessage:null})
		if (this.state.verifyData?.verifyData) {
			if (this.state.verifyData.verifyData.isPhoneVerified) {
				if (!this.state.verifyData.isPhoneVerification) {
					this.setState({
						...this.state,
						errorMessage: "Please verify phone verification code",loading:false
					});
					this.myRef.current.scrollIntoView();
					return;
				}
			}
			if (this.state.verifyData.verifyData.isEmailVerification) {
				if (!this.state.verifyData.isEmailVerification) {
					this.setState({
						...this.state,
						errorMessage: "Please verify  email verification code",loading:false
					});
					this.myRef.current.scrollIntoView();
					return;
				}
			}
			if (this.state.verifyData.verifyData.twoFactorEnabled) {
				if (!this.state.verifyData.isAuthenticatorVerification) {
					this.setState({
						...this.state,
						errorMessage: "Please verify authenticator code",loading:false
					});
					this.myRef.current.scrollIntoView();
					return;
				}
			}
			if (
			  this.state.verifyData.verifyData.isPhoneVerified === "" &&
			  this.state.verifyData.verifyData.isEmailVerification === "" &&
			  this.state.verifyData.verifyData.twoFactorEnabled === ""
			) {
				this.setState({
					...this.state,
					errorMessage:
						"Without Verifications you can't send. Please select send verifications from security section",loading:false
				});
				this.myRef.current.scrollIntoView();
				return
			}
		} else {
			this.setState({
				...this.state,
				errorMessage:
					"Without Verifications you can't Proceed.",loading:false
			});
			this.myRef.current.scrollIntoView();
			return
		}
		let response= await proceedTransaction(this.props?.id || this.props?.fileData?.id)
		if(response.ok){
			if(response.data === true){
				this.setState({ ...this.state, showDeclaration:true,insufficientModal:false,errorMessage:null,loading:false}); 
			}else{
				this.setState({ ...this.state, showDeclaration:false,insufficientModal:true,loading:false});
			}
		}else{
			this.setState({ ...this.state,  errorMessage: this.isErrorDispaly(response) ,loading:false})

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
	handleBack=()=>{
		this.props.history.push('/cockpit');
	}
	changesVerification = (obj) => {
		if (obj.isPhoneVerification && obj.isEmailVerification && (obj.verifyData?.isPhoneVerified && obj.verifyData?.isEmailVerification && !obj.verifyData?.twoFactorEnabled)) {
			this.setState({ ...this.state, isShowGreyButton: true, verifyData: obj });
		}
		else if (obj.isPhoneVerification && obj.isAuthenticatorVerification && (obj.verifyData?.isPhoneVerified && obj.verifyData?.twoFactorEnabled && !obj.verifyData?.isEmailVerification)) {
			this.setState({ ...this.state, isShowGreyButton: true, verifyData: obj });
		}
		else if (obj.isAuthenticatorVerification && obj.isEmailVerification && (obj.verifyData?.twoFactorEnabled && obj.verifyData?.isEmailVerification && !obj.verifyData?.isPhoneVerified)) {
			this.setState({ ...this.state, isShowGreyButton: true, verifyData: obj });
		}
		else if (obj.isPhoneVerification && obj.isAuthenticatorVerification && obj.isEmailVerification && (obj.verifyData?.isPhoneVerified && obj.verifyData?.twoFactorEnabled && obj.verifyData?.isEmailVerification)) {
			this.setState({ ...this.state, isShowGreyButton: true, verifyData: obj });
		}
		else if (obj.verifyData?.isLiveVerification && obj.isEmailVerification && !obj.verifyData?.isPhoneVerified && !obj.verifyData?.twoFactorEnabled && obj.verifyData?.isEmailVerification) {
			this.setState({ ...this.state, isShowGreyButton: true, verifyData: obj });
		}
		else if (obj.verifyData?.isLiveVerification && obj.isPhoneVerification && !obj.verifyData?.twoFactorEnabled && !obj.verifyData?.isEmailVerification && obj.verifyData?.isPhoneVerified) {
			this.setState({ ...this.state, isShowGreyButton: true, verifyData: obj });
		}
		else {
			if (obj.verifyData?.isLiveVerification && obj.isAuthenticatorVerification && !obj.verifyData?.isPhoneVerified && !obj.verifyData?.isEmailVerification && obj.verifyData?.twoFactorEnabled) {
				this.setState({ ...this.state, isShowGreyButton: true, verifyData: obj });
			}
		}
	
	}
	onReviewDetailsLoading = (val) => {
		this.setState({ ...this.state, reviewDetailsLoading: val })
	  }
	render() {
		const {  errorMessage,loading } = this.state;
		return (<>
			<div>
			<Drawer destroyOnClose={true}
            title={[<div className="side-drawer-header"><span></span>
			{!this.state.showDeclaration &&<><div className='drawer-maintitle rec-bottom'>Payment Summary</div>
			 <span onClick={this.props.onClose} className="icon md close-white c-pointer" /></>}
			 {this.state.showDeclaration &&<span onClick={this.handleBack} className="icon md close-white c-pointer" />}
          </div>]}
          placement="right"
		  closable={true}
          visible={this.props.showDrawer}
		  className="side-drawer w-50p"
        >
			  <div ref={this.myRef}></div>
			<Spin spinning={this.state.reviewDetailsLoading}>
			{errorMessage && <Alert type="error" description={errorMessage} showIcon />}
				<div>
				{!this.state.showDeclaration && <>
				<div>
					<div className='adbook-head'>Transfer Details</div>
					<div className='alert-info-custom kpi-List'>
					<div className='pay-list fs-14'>
						<div><label className='summary-liststyle'> Payment</label></div>
						<div>
							
						<NumberFormat className='summarybal'
                                        value={`${this.props?.getPaymentDetails.amount}`}
                                        thousandSeparator={true} displayType={"text"} />
							</div>
					</div>
					<div className='pay-list fs-14'>
						<div><label className='summary-liststyle'> Fee</label></div>
						<div>
						<NumberFormat className='summarybal'
                                        value={`${this.props?.getPaymentDetails.commission}`}
                                        thousandSeparator={true} displayType={"text"} />
							
							</div>
					</div>
					<div className='pay-list fs-14'>
						<div><label className='summary-liststyle'> Total Amount</label></div>
						<div>
						<NumberFormat className='summarybal'
                                        value={`${this.props?.getPaymentDetails.totalAmonunt}`}
                                        thousandSeparator={true} displayType={"text"} />
							
							</div>
					</div>
					<div className='pay-list fs-14'>
						<div><label className='summary-liststyle'>Balance Before</label></div>
						<div>
						<NumberFormat className='summarybal'
                                        value={`${this.props?.getPaymentDetails.beforeAmount}`}
                                        thousandSeparator={true} displayType={"text"} />
							</div>
					</div>
					<div className='pay-list fs-14'>
						<div><label className='summary-liststyle'>Balance After Payment</label></div>
						<div>
						<NumberFormat className='summarybal'
                                        value={`${this.props?.getPaymentDetails.afterPaymentAmount}`}
                                        thousandSeparator={true} displayType={"text"} />
							</div>
					</div></div>

					<div> <Title className='adbook-head'>Recipients Details</Title></div>
					<div className='alert-info-custom kpi-List'>
					<div className='pay-list fs-14'>
						<div className='file-name'><label className='summary-liststyle'>File Name</label></div>
						<div><Text className='summarybal'>{this.props?.getPaymentDetails.fileName}</Text></div>
					</div>
					<div className='pay-list fs-14'>
						<div><label className='summary-liststyle'>Number of Recipients</label></div>
						<div><Text className='summarybal'>{this.props?.getPaymentDetails.noOfPayments}</Text></div>
					</div></div>
					
                           <Verifications onchangeData={(obj) => this.changesVerification(obj)} onReviewDetailsLoading={(val) => this.onReviewDetailsLoading(val)} />
					    
						   <div className="cust-pop-up-btn crypto-pop">
						   <Button block
								className="pop-btn"
                                // style={{ backgroundColor: !isShowGreyButton && '#ccc', borderColor: !isShowGreyButton && '#3d3d3d' }}
								onClick={this.showDeclaration}
								loading={loading}
							>
								Continue
							</Button>
							<Button
								className="cust-cancel-btn"
								onClick={this.props.onClose}
							>
								Back
							</Button>
							
						</div>
						</div> 
						</>}
						{this.state.showDeclaration && <>
					
							<div className="custom-declaraton"> <div className="text-center mt-36 declaration-content">
							<img src={pending} alt={`Processed`} className="confirm-icon"/>
							<Title level={2} className="success-title">Declaration form sent successfully</Title>
                <Text className="successsubtext">{`Declaration form has been sent to ${this.props.customer?.email}. 
                Please review and sign the document in your email to whitelist your address.
                Please note that your withdrawal will only be processed once the address has been approved by compliance. `}</Text>

      </div>
      </div>
						</>}
					</div>
					</Spin>
				</Drawer>				
			</div>			
			<Modal
                     visible={this.state.insufficientModal}
                     title="Insufficient Balance"
                     closeIcon={
                        <Tooltip title="Close">
                          <span
                            className="icon md close-white c-pointer"
                            onClick={() =>  this.setState({ ...this.state, paymentSummary: false, insufficientModal: false})}
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
                            <div>Total amount including fees: {this.props.getPaymentDetails?.totalAmonunt}</div>
                            <div> Balance available: {this.props.getPaymentDetails?.availableAmount}</div>
                            <div> Shortfall: {this.props.getPaymentDetails?.shortfallAmount}</div>
                            <div> Please top up.</div>
                            <div>   A draft has been saved.</div>
                            </Paragraph>
                        </div>
                        </>
                </Modal>
		</>
		)
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
export default connect(connectStateToProps, connectDispatchToProps)(withRouter(PaymentSummary));
