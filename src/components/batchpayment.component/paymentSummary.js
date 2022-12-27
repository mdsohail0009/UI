import React, { Component } from 'react';
import { Drawer, Typography, Button, Modal,Tooltip,Spin,Alert } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import pending from '../../assets/images/pending.png';
import NumberFormat from "react-number-format";
import Verifications from "../onthego.transfer/verification.component/verifications"
import {proceedTransaction} from './api'
import { getVerificationFields } from "../onthego.transfer/verification.component/api"
import { Link } from "react-router-dom";
const { Title, Paragraph, Text } = Typography

class PaymentSummary extends Component {
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
		  isVerificationEnable:true,
		  isVarificationLoader: true,
		}
	}
	componentDidMount(){
		// this.verificationCheck();
	}
	verificationCheck = async () => {
		this.setState({ ...this.state, isVarificationLoader: true })
		const verfResponse = await getVerificationFields();
		let minVerifications = 0;
		if (verfResponse.ok) {
		  for (let verifMethod in verfResponse.data) {
			if (["isEmailVerification", "isPhoneVerified", "twoFactorEnabled", "isLiveVerification"].includes(verifMethod) && verfResponse.data[verifMethod] === true) {
				minVerifications = minVerifications + 1;
			}
		  }
		  if (minVerifications >= 2) {
			this.setState({ ...this.state, isVarificationLoader: false, isVerificationEnable: true })
				} else {
					this.setState({ ...this.state, isVarificationLoader: false, isVerificationEnable: false })
		  }
		} else {
			this.setState({ ...this.state, isVarificationLoader: false, errorMessage: this.isErrorDispaly(verfResponse) })
		}
	  }
	showDeclaration=async()=>{	
		debugger
		this.setState({...this.state,loading:true,errorMessage:null})
		if (this.state.verifyData?.verifyData) {
			if (this.state.verifyData.verifyData.isPhoneVerified) {
				if (!this.state.verifyData.isPhoneVerification) {
					this.setState({
						...this.state,
						errorMessage: "Please verify phone verification code",loading:false
					});
					return;
				}
			}
			if (this.state.verifyData.verifyData.isEmailVerification) {
				if (!this.state.verifyData.isEmailVerification) {
					this.setState({
						...this.state,
						errorMessage: "Please verify  email verification code",loading:false
					});
					return;
				}
			}
			if (this.state.verifyData.verifyData.twoFactorEnabled) {
				if (!this.state.verifyData.isAuthenticatorVerification) {
					this.setState({
						...this.state,
						errorMessage: "Please verify authenticator code",loading:false
					});
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
				return
			}
		} else {
			this.setState({
				...this.state,
				errorMessage:
					"Without Verifications you can't Proceed.",loading:false
			});
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
		const {  isShowGreyButton,errorMessage,loading,isVerificationEnable } = this.state;
		return (<>
		          

			<div>
			<Drawer destroyOnClose={true}
            title={[<div className="side-drawer-header"><span></span>
			{!this.state.showDeclaration &&<><Title className='mb-8 text-white-30 fw-600 text-captz fs-24'>Payment Summary</Title>
			 <span onClick={this.props.onClose} className="icon md close-white c-pointer" /></>}
			 {this.state.showDeclaration &&<span onClick={this.handleBack} className="icon md close-white c-pointer" />}
          </div>]}
          placement="right"
		  closable={true}
          visible={this.props.showDrawer}
		  className="side-drawer w-50p"
        >
			 {!isVerificationEnable && (
                  <Alert 
                  message="Verification alert !"
                  description={<Text>Without verifications you can't send. Please select send verifications from <Link onClick={() => {
                      this.props.history.push("/userprofile/2");
                      if (this.props?.onClosePopup) {
                          this.props?.onClosePopup();
                      }
                  }}>security section</Link></Text>}
                  type="warning"
                  showIcon
                  closable={false}
              />
              )}
			
			{errorMessage && <Alert type="error" description={errorMessage} showIcon />}
				<div>
				{!this.state.showDeclaration 
				// &&!this.state.reviewDetailsLoading && !isVerificationEnable &&
				&& <>
					<Spin spinning={this.state.reviewDetailsLoading}>
				<div>
					<div> <Title className='sub-heading p-0 mt-24'>Transfer Details</Title></div>
					<div className='pay-list fs-14'>
						<div><label className='fw-500 text-white'> Payment</label></div>
						<div>
							
						<NumberFormat className='fw-500 text-white-30'
                                        value={`${this.props?.getPaymentDetails.amount}`}
                                        thousandSeparator={true} displayType={"text"} />
							</div>
					</div>
					<div className='pay-list fs-14'>
						<div><label className='fw-500 text-white'> Fee</label></div>
						<div>
						<NumberFormat className='fw-500 text-white-30'
                                        value={`${this.props?.getPaymentDetails.commission}`}
                                        thousandSeparator={true} displayType={"text"} />
							
							</div>
					</div>
					<div className='pay-list fs-14'>
						<div><label className='fw-500 text-white'> Total Amount</label></div>
						<div>
						<NumberFormat className='fw-500 text-white-30'
                                        value={`${this.props?.getPaymentDetails.totalAmonunt}`}
                                        thousandSeparator={true} displayType={"text"} />
							
							</div>
					</div>
					<div className='pay-list fs-14'>
						<div><label className='fw-500 text-white'>Balance Before</label></div>
						<div>
						<NumberFormat className='fw-500 text-white-30'
                                        value={`${this.props?.getPaymentDetails.beforeAmount}`}
                                        thousandSeparator={true} displayType={"text"} />
							</div>
					</div>
					<div className='pay-list fs-14'>
						<div><label className='fw-500 text-white'>Balance After Payment</label></div>
						<div>
						<NumberFormat className='fw-500 text-white-30'
                                        value={`${this.props?.getPaymentDetails.afterPaymentAmount}`}
                                        thousandSeparator={true} displayType={"text"} />
							</div>
					</div>

					<div> <Title className='sub-heading p-0 mt-24'>Recipients Details</Title></div>

					<div className='pay-list fs-14'>
						<div><label className='fw-500 text-white'>File Name</label></div>
						<div><Text className='fw-500 text-white-30'>{this.props?.getPaymentDetails.fileName}</Text></div>
					</div>
					<div className='pay-list fs-14'>
						<div><label className='fw-500 text-white'>Number of Recipients</label></div>
						<div><Text className='fw-500 text-white-30'>{this.props?.getPaymentDetails.noOfPayments}</Text></div>
					</div>
					
                           <Verifications onchangeData={(obj) => this.changesVerification(obj)} onReviewDetailsLoading={(val) => this.onReviewDetailsLoading(val)} />
					    
						   <div className="cust-pop-up-btn crypto-pop text-right">
							<Button
								className="primary-btn pop-cancel btn-width"
								style={{ margin: "0 8px" }}
								onClick={this.props.onClose}
							>
								Back
							</Button>
							<Button
								className="pop-btn custom-send"
                                style={{ backgroundColor: !isShowGreyButton && '#ccc', borderColor: !isShowGreyButton && '#3d3d3d' }}
								onClick={this.showDeclaration}
								loading={loading}
							>
								Continue
							</Button>
						</div>
						</div> 
						</Spin></>}
						
						{this.state.showDeclaration && <>
					
	          <div className="custom-declaraton"> <div className="text-center mt-36 declaration-content">
								<img src={pending} width={80}/>
								<Title className='text-white'>Declaration form sent!</Title>
								<Paragraph className='text-white'>We sent declaration form to{":"}{" "}
									{this.props.customer?.email}. Please sign using the link
									received in email to whitelist your address. Note that
									your payments will only be processed once your
									whitelisted address has been approved. </Paragraph>
							</div></div>
						</>}
					</div>
					
				</Drawer>				
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
