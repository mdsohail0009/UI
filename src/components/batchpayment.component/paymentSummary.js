import React, { Component } from 'react';
import { Drawer, Typography, Col, List, Empty, Image, Button, Modal, Form, Input } from 'antd';
import Translate from 'react-translate-component';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";

const { Title, Paragraph, Text } = Typography

class paymentSummary extends Component {
	constructor(props) {
		super(props);
		this.state = {
		  
		}
	}


	render() {
		return (<>
			<div>
			<Modal
          title={[<div className="side-drawer-header">
            {/* <Translate content="bathch_payments_preview" component={Title} className="fs-26 fw-400 mb-0 text-white-30" /> */}
            <span></span><div className='text-center'><Title className='mb-8 text-white-30 fw-600 text-captz fs-24'>Payment Summary</Title></div><span onClick={this.props.onClose} className="icon md close-white c-pointer" />
          </div>]}
          placement="right"
          closable={false}
          width="100%"
          onClose={this.props.onClose}
          visible={this.props.showDrawer}
          className="side-drawer-full custom-gridresponsive transctns-grid"
        >
				<div >
					
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
				</Modal>
			</div>
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
export default connect(connectStateToProps, connectDispatchToProps)(withRouter(paymentSummary));
