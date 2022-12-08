import React, { Component } from 'react';
import { Drawer, Typography, Col, List,Empty, Image,Button,Modal} from 'antd';
import Translate from 'react-translate-component';
import { connect } from 'react-redux';
import Search from "antd/lib/input/Search";
import { fetchMemberWallets } from "../dashboard.component/api";
import NumberFormat from "react-number-format";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import PaymentPreview from './paymentPreview';
const { Title,Paragraph } = Typography

class paymentSummary extends Component {
   


    render() {
        return (<>
    <div>
    <div >
                <div className='text-center'>
                <Title className='mb-8 text-white-30 fw-600 text-captz fs-24'>Payment Summary</Title>
                </div>
                <div>
                  <Title className='sub-heading text-center mb-16'>Transfer Details</Title>
                </div>
                <div className='pay-list fs-14'>
                  <div><label className='fw-500 text-white'> Payment</label></div>
                  <div><Text className='fw-500 text-white-30'>560,000 USD</Text></div>
                </div>
                <div className='pay-list fs-14'>
                  <div><label className='fw-500 text-white'> Fee</label></div>
                  <div><Text className='fw-500 text-white-30'>5,600 USD</Text></div>
                </div>
                <div className='pay-list fs-14'>
                  <div><label className='fw-500 text-white'> Total Amount</label></div>
                  <div><Text className='fw-500 text-white-30'>565,600 USD</Text></div>
                </div>
                <div className='pay-list fs-14'>
                  <div><label className='fw-500 text-white'>Balance Before</label></div>
                  <div><Text className='fw-500 text-white-30'>570,000 USD</Text></div>
                </div>
                <div className='pay-list fs-14'>
                  <div><label className='fw-500 text-white'>Balance After Payment</label></div>
                  <div><Text className='fw-500 text-white-30'>4,400 USD</Text></div>
                </div>

               <div> <Title className='sub-heading my-16'>Recipients Details</Title></div>

                <div className='pay-list fs-14'>
                  <div><label className='fw-500 text-white'>File Name</label></div>
                  <div><Text className='fw-500 text-white-30'>xxx Payments</Text></div>
                </div>
                <div className='pay-list fs-14'>
                  <div><label className='fw-500 text-white'>Number of Recipients</label></div>
                  <div><Text className='fw-500 text-white-30'>45</Text></div>
                </div>
                <Form
							className="mt-36"
							name="advanced_search"
							autoComplete="off">

							<Text className="fs-14 mb-8 text-white d-block fw-500 code-lbl">
              Email Verification*
								</Text>
																																	
								<Form.Item
									name="code"
									className="input-label otp-verify"
									extra={
										<div>
											<Text className="fs-12 text-white-30 fw-200">
											
											</Text>
											<Text
												className="fs-12 text-red fw-200"
												style={{ float: "right", color: "var(--textRed)" }}>
												
											</Text>
										</div>
									}
									rules={[{ required: true, message: "Is required" }]}
								>
									<div className="p-relative d-flex align-center">
                     <Input
											className="cust-input custom-add-select mb-0"
											placeholder={"Enter code"}
											maxLength={6}
											style={{ width: "100%" }}
											
										/>
										
											
											
											
                 
										<div className="new-add get-code text-yellow hy-align">
										<Button
												type="text" 
											style={{ margin: "0 auto" }}
											>
												Click here to get code
                        </Button>
										</div>
									</div>
								</Form.Item>
                <Text className="fs-14 mb-8 text-white d-block fw-500 code-lbl">
                2FA*
								</Text>

								<Form.Item
									name="authenticator"
									className="input-label otp-verify"
									extra={
										<div>
											<Text
												className="fs-12 text-red fw-200"
												style={{ float: "right", color: "var(--textRed)" }}>
												
											</Text>
										</div>
									}
									
								>
									<div className="p-relative d-flex align-center">
										<Input
											type="text"
											className="cust-input custom-add-select mb-0"
											placeholder={"Enter code"}
											maxLength={6}
											
											style={{ width: "100%" }}
										
										/>
										<div className="new-add get-code text-yellow hy-align" >
											<Button
												type="text"
												
												style={{ color: "black", margin: "0 auto" }}
												>
											
													
												
													Click here to get code
												
											</Button>
										</div>
									</div>
								</Form.Item>
                <div className="cust-pop-up-btn crypto-pop text-right">									
										<Button
											className="primary-btn pop-cancel btn-width"
											style={{ margin: "0 8px" }}
											

										>
											Back
										</Button>
										<Button
											className="primary-btn pop-btn btn-width"
											style={{ margin: "0 8px" }}
										
										>
											Continue
										</Button>
									</div>

							
							
						</Form>
              </div>
    </div>


        </>

        )}}
        export default ConnectStateProps(withRouter, connectDispatchToProps)(paymentSummary);
