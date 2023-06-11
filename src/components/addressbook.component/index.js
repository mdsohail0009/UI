
import React, { Component } from "react";
import { Typography, Drawer, Button, Radio, Tooltip, Modal, Alert, message,Tabs, Spin } from "antd";
import {
	setAddressStep,
	rejectCoin,
	fetchUsersIdUpdate,
	selectedTab,
	clearValues,
	clearCryptoValues,
} from "../../reducers/addressBookReducer";
import Translate from "react-translate-component";
import { processSteps as config } from "./config";
import List from "../grid.component";
import { activeInactive, downloadDeclForm } from "./api";
import SelectCrypto from "./selectCrypto";
import {Link,  withRouter } from "react-router-dom";
import { connect } from "react-redux";
import apiCalls from "../../api/apiCalls";
import Info from "../shared/info";
import { DownloadOutlined } from '@ant-design/icons';
import ActionsToolbar from "../toolbar.component/actions.toolbar";
import { getScreenName, setSelectedFeatureMenu } from "../../reducers/feturesReducer";
import {rejectWithdrawfiat } from '../../reducers/sendreceiveReducer';
import { getFeatureId } from "../shared/permissions/permissionService";
import { setCurrentAction } from '../../reducers/actionsReducer'
import AddressBookV3 from "../addressbook.v3";
import AddressCrypto from "./addressCrypto"
import apicalls from "../../api/apiCalls";
const { Paragraph, Text, Title } = Typography;

class AddressBook extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
			cryptoFiat: (this.props?.activeFiat || new URLSearchParams(this.props.history?.location?.search).get("key") == 2) ? true : false,
			fiatDrawer: false,
			isCheck: false,
			selection: [],
			selectedObj: {},
			modal: false,
			alert: false,
			btnDisabled: false,
			cryptoModal: false,
			selectedModal: "",
			errorWorning: null,
			isDownloading: false,
			permissions: {},
			showHeading:false,
			hideFiatHeading: false,
			obj: {
				id: [],
				tableName: "Common.PayeeAccounts",
				modifiedBy: "",
				status: [],
				type: "",
			},
			customerId: this.props.userConfig.id,

			gridUrlCrypto: process.env.REACT_APP_GRID_API + "Address/AddressCrypto",
			gridUrlFiat: process.env.REACT_APP_GRID_API + "Address/AddressFiat",
		};
		this.gridFiatRef = React.createRef();
		this.gridCryptoRef = React.createRef();
		this.props.dispatch(setSelectedFeatureMenu(getFeatureId("/addressBook"), this.props.userConfig.id));
	}
	componentDidMount() {
		this.setState({...this.state,cryptoFiat:true})
		this.props.dispatch(getScreenName({getScreen:null}))
		this.permissionsInterval = setInterval(this.loadPermissions, 200);
		if (process.env.REACT_APP_ISTR=="true") {
			const obj=[{field: "walletSource", title: "Wallet Source", width: 180, filter:true}]
			this.columnsCrypto.splice(4,0,...obj)     
		 }
		if(!this.state.cryptoFiat){
			this.props.changeStep("step1");
		}
		if (!this.state.cryptoFiat) {
			apiCalls.trackEvent({
				Type: "User",
				Action: "Withdraw Crypto Address book grid view",
				Username: this.props.userConfig?.userName,
				customerId: this.props.userConfig?.id,
				Feature: "Address Book",
				Remarks: "Withdraw Crypto Address book grid view",
				Duration: 1,	
				Url: window.location.href,
				FullFeatureName: "Address Book",
			});
		} else {
			apiCalls.trackEvent({
				Type: "User",
				Action: "Withdraw Fiat Address book add view",
				Username: this.props.userConfig?.userName,
				customerId: this.props.userConfig?.id,
				Feature: "Address Book",
				Remarks: "Withdraw Fiat Address book add view",
				Duration: 1,
				Url: window.location.href,
				FullFeatureName: "Address Book",
			});
		}


	}
	loadPermissions = () => {
		if (this.props.addressBookPermissions) {
			this.props.dispatch(setSelectedFeatureMenu(this.props.addressBookPermissions?.featureId));
			clearInterval(this.permissionsInterval);
			let _permissions = {};
			for (let action of this.props.addressBookPermissions?.actions) {
				_permissions[action.permissionName] = action.values;
			}
			this.setState({ ...this.state, permissions: _permissions });
			if (!this.state.permissions?.view && !this.state.permissions?.View) {
				this.props.history.push("/accessdenied");
			}
		}
	}
	columnsFiat = [
		{
			field: "",
			title: "",
			width: 50,
			customCell: (props) => (
				<td>
					{" "}
					<label className="text-center custom-checkbox c-pointer cust-check-outline">
						<input
							id={props.dataItem.id}
							className="c-pointer"
							name="isCheck"
							type="checkbox"
							checked={this.state.selection.indexOf(props.dataItem.payeeAccountId) > -1}
							onChange={(e) => this.handleInputChange(props, e)}
						/>
						<span></span>{" "}
					</label>
				</td>
			),
		},
		{

			field: "whiteListName",
			title: "Whitelist Name",
			filter: true,
			width: 300,
			customCell: (props) => (
				<td >
					<div className="d-flex align-center text-wrap-style justify-content">
					<div className="wrap-text-width">
					<Tooltip title= {props?.dataItem?.whiteListName}>
					<Text className="gridLink c-pointer grid-level-style" onClick={() => this.addressFiatView(props)}>{props?.dataItem?.whiteListName}</Text>
					</Tooltip></div>
					<div>
						<span  className="file-label add-lbl">{this.addressTypeNames(props?.dataItem?.addressType)}</span>
					</div>
					</div>
				</td>
			),
		},
		{
			field: "currency",
			title: apiCalls.convertLocalLang("currency"),
			width: 150,
			filter: true,
			with: 150,
		},
		{
			field: "accountNumber",
			title: apiCalls.convertLocalLang("Bank_account_iban_name"),
			filter: true,
			width: 270,
		},
		{
			field: "routingNumber",
			title: "BIC/SWIFT/ABA Routing /UK Sort Code",
			filter: true,
			width: 360,
		},
		{
			field: "bankName",
			title: apiCalls.convertLocalLang("Bank_name"),
			filter: true,
			width: 200,
		},
		{
			field: "addressState",
			title: apiCalls.convertLocalLang("Whitelisting_Status"),
			filter: true,
			width: 200,
		},
		{
			field: "digitallySigned",
			customCell: (props) => (
				<td>
					{props.dataItem?.digitallySigned==="Signed"  && (this.state.selectedDeclaration !== props?.dataItem.payeeAccountId) && <> <Link onClick={() => {
						if (!this.state.isDownloading)
							this.downloadDeclarationForm(props?.dataItem);
					}} >{props?.dataItem?.bankAccountType!=="Personal" && <DownloadOutlined />}</Link>{props.dataItem?.digitallySigned}</>}
					{props.dataItem?.digitallySigned!=="Signed" && props.dataItem?.digitallySigned}
					{this.state.isDownloading && this.state.selectedDeclaration === props?.dataItem.payeeAccountId && <Spin size="small" />}
				</td>
			),
			title: apiCalls.convertLocalLang("whitelist"),
			filter: true,
			width: 200,
		},
		{
			field: "status",
			title: apiCalls.convertLocalLang("Status"),
			filter: true,
			width: 100,
		},
		{
			field: "rejectReason",
			title: apiCalls.convertLocalLang("Reason_For_Rejection"),
			filter: true,
			width: 200,
		},
	];
	columnsCrypto = [
		{
			field: "",
			title: "",
			width: 50,
			customCell: (props) => (
				<td>
					{" "}
					<label className="text-center custom-checkbox c-pointer cust-check-outline">
						<input
							id={props.dataItem.id}
							name="isCheck"
							type="checkbox"
							className="c-pointer"
							checked={this.state.selection.indexOf(props.dataItem.payeeAccountId) > -1}
							onChange={(e) => this.handleInputChange(props, e)}
						/>
						<span></span>{" "}
					</label>
				</td>
			),
		},
		
		{
			field: "whiteListName",
			title: "Whitelist Name",
			filter: true,
			width: 250,
			customCell: (props) => (
				<td>
					<div>
						<span className="gridLink c-pointer batch-filename" onClick={() => this.addressCryptoView(props)}><Tooltip title= {props?.dataItem?.whiteListName}>{props.dataItem?.whiteListName}</Tooltip></span>
					</div>
				</td>
			),
		},
		{
			field: "network",
			title: "Network",
			filter: true,
			width: 120,
		},
		{
			field: "address",
			title: "Wallet Address",
			filter: true,
			width: 380,
		},
		
		{
			field: "addressState",
			title: apiCalls.convertLocalLang("Whitelisting_Status"),
			filter: true,
			width: 200,
		},
		{
			field: "digitallySigned",
			customCell: (props) => (
				<td>
					{props.dataItem?.digitallySigned==="Signed" && (this.state.selectedDeclaration !== props?.dataItem.payeeAccountId) && <><Link onClick={() => {
						if (!this.state.isDownloading)
							this.downloadDeclarationForm(props?.dataItem);
					}} ><DownloadOutlined /></Link> {props.dataItem?.digitallySigned}</>}
					{props.dataItem?.digitallySigned!=="Signed" && props.dataItem?.digitallySigned}
					{this.state.isDownloading && this.state.selectedDeclaration === props?.dataItem.payeeAccountId && <Spin size="small" />}
				</td>
			),
			title: apiCalls.convertLocalLang("whitelist"),
			filter: true,
			width: 200,
		},
		{
			field: "status",
			title: apiCalls.convertLocalLang("Status"),
			filter: true,
			width: 100,
		},
		{
			field: "rejectReason",
			title: apiCalls.convertLocalLang("Reason_For_Rejection"),
			filter: true,
			width: 200,
		},
	];
	async downloadDeclarationForm(dataItem) {
		this.setState({ ...this.state, isDownloading: true, selectedDeclaration: dataItem.payeeAccountId });
		const response = await downloadDeclForm(dataItem.payeeAccountId);
		if (response.ok) {
			window.open(response.data, "_blank");
			this.setState({ ...this.state, isDownloading: false, selectedDeclaration: null });
		}else{
			this.setState({...this.state,errorWorning:apicalls.isErrorDispaly(response)})
		}
	}

	handleInputChange = (prop, e) => {
		this.setState({ ...this.state, errorWorning: null });
		const rowObj = prop.dataItem;
		const value =
			e.currentTarget.type === "checkbox"
				? e.currentTarget.checked
				: e.currentTarget.value;
		const name = e.currentTarget.name;
		let { selection } = this.state;
		let idx = selection.indexOf(rowObj.payeeAccountId);
		if (selection) {
			selection = [];
		}
		if (idx > -1) {
			selection.splice(idx, 1);
		} else {
			selection.push(rowObj.payeeAccountId);
		}
		this.setState({
			...this.state,
			[name]: value,
			selectedObj: rowObj,
			selection,
			errorWorning: null
		});
	};
	statusUpdate = () => {
		if (!this.state.isCheck) {
			this.setState({ ...this.state, errorWorning: "Please select the one record" });
		} else {
			this.setState({ modal: true });
		}
	};
	handleCancel = (e) => {
		this.setState({
			...this.state,
			modal: false,
			selection: [],
			isCheck: false,
		});
		if (this.state.cryptoFiat) {
			this.gridFiatRef.current.refreshGrid();
		} else {
			this.gridCryptoRef.current.refreshGrid();
		}
	};
	handleSatatuSave = async () => {
		this.setState({ ...this.state, isLoading: true, btnDisabled: true });
		let statusObj = this.state.obj;
		statusObj.id.push(this.state.selectedObj.payeeAccountId);
		statusObj.modifiedBy = this.props.userConfig?.userName
		if (this.state.selectedObj.status === "Active") {
			statusObj.status.push("Active")
		} else {
			statusObj.status.push("InActive")
		}
		statusObj.type = this.state.cryptoFiat ? "fiat" : "crypto";
		statusObj.info = JSON.stringify(this.props.trackLogs);
		let response = await activeInactive(statusObj);
		if (response.ok) {
			this.setState({
				...this.state,
				modal: false,
				selection: [],
				isCheck: false,
				isLoading: false,
				btnDisabled: false,
				obj: {
					id: [],
					tableName: "Common.PayeeAccounts",
					modifiedBy: "",
					status: [],
				},
			});
			message.success({
				content: "Record " +
					(this.state.selectedObj.status === "Active"
						? "deactivated"
						: "activated") +
					" successfully",
				className: "custom-msg",
				duration: 3,
			})
			if (this.state.cryptoFiat) {
				this.gridFiatRef.current.refreshGrid();
			} else {
				this.gridCryptoRef.current.refreshGrid();
			}
		} else {
			this.setState({
				...this.state,
				modal: false,
				selection: [],
				isCheck: false,
				btnDisabled: false,
				errorWorning: apicalls.isErrorDispaly(response),
				obj: {
					id: [],
					tableName: "Common.PayeeAccounts",
					modifiedBy: "",
					status: [],
				},

			});
		}
	};
	addAddressBook = () => {
		if (this.state.cryptoFiat) {
			this.setState({
				...this.state, fiatDrawer: true, errorWorning: null, selection: [], selectedObj: {},
				isCheck: false,
			});
			if (!this.state.fiatDrawer) {
				apiCalls.trackEvent({
					Type: "User",
					Action: "Withdraw Fiat Address book add view",
					Username: this.props.userConfig?.userName,
					customerId: this.props.userConfig?.id,
					Feature: "Address Book",
					Remarks: "Withdraw Fiat Address book add view",
					Duration: 1,
					Url: window.location.href,
					FullFeatureName: "Address Book",
				});
			}

			this.props.clearFormValues();
		} else {
			this.setState({
				...this.state, visible: true, errorWorning: null, selection: [],
				isCheck: false, selectedObj: {}
			});
			apiCalls.trackEvent({
				Type: "User",
				Action: "Withdraw Crypto Address book add view",
				Username: this.props.userConfig?.userName,
				customerId: this.props.userConfig?.id,
				Feature: "Address Book",
				Remarks: "Withdraw Crypto Address book add view",
				Duration: 1,
				Url: window.location.href,
				FullFeatureName: "Address Book",
			});
			this.props.clearFormValues();
		}
	};
	addressFiatView = ({ dataItem }) => {
		this.props.history.push(`/addressFiatView/${dataItem.id}/${dataItem.addressType}`);
	};
	addressCryptoView = ({ dataItem }) => {
		this.props.history.push(`/addressCryptoView/${dataItem.id}`);
	};
	editAddressBook = () => {
		this.setState({ ...this.state, errorWorning: null, selection: [] });
		let obj = this.state.selectedObj;
		if (!this.state.isCheck) {
			this.setState({ ...this.state, errorWorning: "Please select the one record" });
		} 
		else if(obj.status === "Inactive") {
			this.setState({ ...this.state, errorWorning: "Record is inactive so you can't edit" });
		}
		else if (this.state.selectedObj.type ==="Fiat" || this.state.selectedObj.type === "fiat" || (obj.walletSource !=null) || (obj.walletSource ===null && obj.addressState === "Approved" && process.env.REACT_APP_ISTR!=="true")||(obj.walletSource !==null && obj.addressState === "Approved" && process.env.REACT_APP_ISTR!=="true") ||(obj.walletSource ===null && obj.addressState === "Approved" && process.env.REACT_APP_ISTR!=="true")||( obj.walletSource !==null && obj.addressState === "Approved" && process.env.REACT_APP_ISTR!=="true")||( obj.walletSource ===null && obj.addressState === "Approved" && process.env.REACT_APP_ISTR!=="true")  ?
			obj.addressState === "Approved" ||
			obj.addressState === "Rejected" ||
			obj.addressState === "Reject" :
		   obj.addressState === "Rejected" ||
			obj.addressState === "Reject"
		) {
			this.setState({
				...this.state,
				visible: false,
				selection: [],
				selectedObj: {},
				isCheck: false,
				errorWorning: `Record is already ${obj.addressState} you can't modify`,
			});
		} else {
			obj.walletCode = obj.coin;
			this.props.rowSelectedData(obj);
			if (obj.isPrimary === false) {
				this.props.history.push(`/payments/newbeneficiary/${obj.id}`);
			} else {
				if (this.state.cryptoFiat) {
					this.setState({
						...this.state,
						fiatDrawer: true,
						selection: [],
						isCheck: false,
					});
					apiCalls.trackEvent({
						Type: "User",
						Action: "Withdraw Fait  Address edit view",
						Username: this.props.userConfig?.userName,
						customerId: this.props.userConfig?.id,
						Feature: "Address Book",
						Remarks: "Withdraw Fiat Address edit view",
						Duration: 1,
						Url: window.location.href,
						FullFeatureName: "Address Book",
					});
				} else {
					apiCalls.trackEvent({
						Type: "User",
						Action: "Withdraw Crypto  Address edit view",
						Username: this.props.userConfig?.userName,
						customerId: this.props.userConfig?.id,
						Feature: "Address Book",
						Remarks: "Withdraw Crypto Address edit view",
						Duration: 1,
						Url: window.location.href,
						FullFeatureName: "Address Book",
					});
					this.setState({
						...this.state,
						visible: true,
						selection: [],
						isCheck: false,
					});
				}
			}
		}
	};
	closeBuyDrawer = (obj) => {
		this.props.dispatch(rejectWithdrawfiat())
		let showCrypto = false, showFiat = false;
		if (obj) {
			if (obj.isCrypto)
				showCrypto = !obj?.close;
			else
				showFiat = !obj?.close;
		}
		this.setState({ ...this.state, visible: showCrypto, fiatDrawer: showFiat, selectedObj: {}})
		setTimeout(() => this.setState({ ...this.state,showHeading:false,hideFiatHeading:false}), 2000);
		
		this.props.rejectCoinWallet();
		this.props.clearFormValues();
		this.props.clearCrypto();
		if (this.state.cryptoFiat) {
			this.gridFiatRef.current.refreshGrid();
		} else {
			this.gridCryptoRef.current.refreshGrid();
			
		}
	};

	closeCryptoDrawer=(obj)=>{
		let showCrypto = false
		if (obj) {
			if (obj.isCrypto)
				showCrypto = !obj?.close;
			
		}
		this.setState({ ...this.state, visible: showCrypto, selectedObj: {} })
		this.props.rejectCoinWallet();
		this.props.clearFormValues();
		this.props.clearCrypto();
		this.gridCryptoRef.current.refreshGrid();
		
	}
	backStep = () => {
		this.props.changeStep("step1");
	};
	handleWithdrawToggle = (e) => {
		this.setState({
			...this.state,
			cryptoFiat: parseInt(e) === 2,
			selection: [],
			selectedObj: {},
			isCheck: false,
			errorWorning: null
		});
		this.props.tabSelectedData(this.state.cryptoFiat);
		if (this.state.cryptoFiat) {
			apiCalls.trackEvent({
				Type: "User",
				Action: "Withdraw Crypto Address book grid view",
				Username: this.props.userConfig?.userName,
				customerId: this.props.userConfig?.id,
				Feature: "Address Book",
				Remarks: "Withdraw Crypto Address book grid view",
				Duration: 1,
				Url: window.location.href,
				FullFeatureName: "Address Book",
			});
		} else {
			apiCalls.trackEvent({
				Type: "User",
				Action: "Withdraw Fiat Address book grid view",
				Username: this.props.userConfig?.userName,
				customerId: this.props.userConfig?.id,
				Feature: "Address Book",
				Remarks: "Withdraw Fiat Address book grid view",
				Duration: 1,
				Url: window.location.href,
				FullFeatureName: "Address Book",
			});
		}
	};
	addressTypeNames = (type) => {
		const stepcodes = {
			"ownbusiness": "My Company",
			"individuals": "Individuals",
			"otherbusiness": "Other Business",
			"myself": "My Self"
		};
		return stepcodes[type];
	};
	headingChange=(data)=>{
		this.setState({...this.state,showHeading:data})
	}
	isFiatHeading =(data)=>{
		this.setState({...this.state,hideFiatHeading:data})
	}
	renderContent = () => {
		const stepcodes = {
			cryptoaddressbook: (<>
				<AddressCrypto  type= "manual" onCancel={(obj) => this.closeCryptoDrawer(obj)} headingUpdate={this.headingChange} cryptoTab={1} selectedAddress={this.state.selectedObj}/>
			</>
			),
			selectcrypto: <SelectCrypto />,
		};
		return stepcodes[config[this.props.addressBookReducer.stepcode]];
	};
	renderTitle = () => {
		const titles = {
			cryptoaddressbook: <span />,
			selectcrypto: (
				<span
					onClick={this.backStep}
					className="icon md lftarw-white c-pointer"
				/>
			),
		};
		return titles[config[this.props.addressBookReducer.stepcode]];
	};
	renderIcon = () => {
		const stepcodes = {
			cryptoaddressbook: (
				<span
					onClick={() => this.closeBuyDrawer()}
					className="icon md close-white c-pointer"
				/>
			),
			selectcrypto: <span />,
		};
		return stepcodes[config[this.props.addressBookReducer.stepcode]];
	};

	onActionClick = (key) => {
		if(key==="add" || key==="edit"){
			if(!this.state.cryptoFiat){
				this.props.changeStep("step1");
			}
		}
		const actions = {
			add: "addAddressBook",
			edit: "editAddressBook",
			disable: "statusUpdate"
		};
		this[actions[key]]();
	};

	render() {
		const { cryptoFiat, gridUrlCrypto, gridUrlFiat, btnDisabled 	} =
			this.state;

		return (
			<>

			<div className="main-container grid-demo">
			<div className="backbtn-arrowmb"><Link  to="/cockpit"><span className="icon md leftarrow c-pointer backarrow-mr"></span><span className="back-btnarrow c-pointer">Back</span></Link></div>
			<div className="security-align adbs-mb">
				<Translate
					content="address_book"
					component={Title}
					className="addressbook-mb"
				/>
				<div className="mb-right">
					<ActionsToolbar featureKey="addressbook" onActionClick={(key) => this.onActionClick(key)} />
				</div>
			</div>
			<div className="imprt-bg"><span className="ab-note-style">Note:</span> <span className="note-cont">Whitelisting of Crypto Address and Bank Account is required, Please add below.</span></div>
			
				<div className="addressbook-grid">
					<Tabs className="cust-tabs-fait" 
					defaultValue={(this.props?.activeFiat||this.state.cryptoFiat) ? 2 : 1}
							onChange={this.handleWithdrawToggle}
							>					
                                <Tabs.TabPane tab="Send Fiat" content="withdrawFiat" key={2} className="" component={Radio.Button}/>
								<Tabs.TabPane tab="Send Crypto" content="withdrawCrypto" key={1} className=""  component={Radio.Button}/>

						    </Tabs>
							</div>
					</div>
					<div className="main-container grid-error">
					{this.state.errorWorning && (
						<div className="custom-alert">
							<Alert
								description={this.state.errorWorning}
								type="warning"
								showIcon
							/>
						</div>
					)}
					</div>
					<div className="cust-list main-containerz"> 
					{cryptoFiat ? (
						<List
							className="address-clear"
							columns={this.columnsFiat}
							ref={this.gridFiatRef}
							key={gridUrlFiat}
							url={gridUrlFiat}
						/>
					) : (
						<List
							className="address-clear"
							columns={this.columnsCrypto}
							key={gridUrlCrypto}
							ref={this.gridCryptoRef}
							url={gridUrlCrypto}
						/>
					)}
				
				</div>

				<Drawer
					destroyOnClose={true}
					title={[
						<div className="side-drawer-header">
							{this.renderTitle()}
							<div className="text-center">
								<Translate
									className="drawer-maintitle"
									content={
										!this.state.showHeading &&(
										this.props.addressBookReducer.stepTitles[
										config[this.props.addressBookReducer.stepcode]
										])
									}
									component={Paragraph}
								/>
								<Translate
									className="text-white-50 mb-0 fw-300 fs-14 swap-subtitlte"
									content={
										this.props.addressBookReducer.stepSubTitles[
										config[this.props.addressBookReducer.stepcode]
										]
									}
									component={Paragraph}
								/>
							</div>
							{this.renderIcon()}
						</div>,
					]}
					placement="right"
					closable={true}
					visible={this.state.visible}
					closeIcon={null}
					className="side-drawer">
					{this.renderContent()}
				</Drawer>
				<Drawer
					destroyOnClose={true}
					title={[
						<div className="side-drawer-header">
							<span />
							<div className="text-center">
								<Paragraph className="drawer-maintitle">
									<Translate
									content={!this.state.hideFiatHeading  && "AddFiatAddress"}
										component={Paragraph}
										className="drawer-maintitle"
									/>
								</Paragraph>
							</div>
							<span
								onClick={() => this.closeBuyDrawer()}
								className="icon md close-white c-pointer"
							/>
						</div>,
					]}
					placement="right"
					closable={true}
					visible={this.state.fiatDrawer}
					closeIcon={null}
					className="side-drawer">
					<AddressBookV3 type="manual" isFiat={this.state.cryptoFiat} selectedAddress={this.state.selectedObj} onContinue={(obj) => this.closeBuyDrawer(obj)} isFiatHeadUpdate={this.isFiatHeading}/>
				</Drawer>
				<Modal
					title={
						this.state.selectedObj.status === "Active"
							? apiCalls.convertLocalLang("confirm_deactivate")
							: apiCalls.convertLocalLang("confirm_activate")
					}
					visible={this.state.modal}
					closeIcon={
						<Tooltip title="Close">
							<span
								className="icon md close-white c-pointer"
								onClick={this.handleCancel}
							/>
						</Tooltip>
					}
					footer={
						<div className="cust-pop-up-btn crypto-pop">
							<Button
							className="cust-cancel-btn cust-cancel-btn pay-cust-btn detail-popbtn paynow-btn-ml"
							onClick={this.handleCancel}>
							No
						</Button>
							<Button
							className="primary-btn pop-btn detail-popbtn"
							block
							onClick={this.handleSatatuSave}
							loading={btnDisabled}>
							{apiCalls.convertLocalLang("Yes")}
						</Button>
						
						
					</div>
					}>
					<p className="fs-16 mb-0">
						{apiCalls.convertLocalLang("really_want")}{" "}
						{this.state.selectedObj.status === "Active"
							? apiCalls.convertLocalLang("deactivate")
							: apiCalls.convertLocalLang("activate")}?
					</p>
				</Modal>
				<Modal
					title="Info Detail"
					visible={this.state.cryptoModal}
					className="crypto-list"
					destroyOnClose
					closeIcon={
						<Tooltip title="Close">
							<span
								className="icon md close-white c-pointer"
								onClick={() =>
									this.setState({ ...this.state, cryptoModal: false })
								}
							/>
						</Tooltip>
					}
					footer={
						<Button
							className="primary-btn pop-btn"
							onClick={() =>
								this.setState({ ...this.state, cryptoModal: false })
							}>
							Close
						</Button>
					}>
					<Info id={this.state.selectedId} type={this.state.selectedModal} />
				</Modal>
			</>
		);
	}
}
const connectStateToProps = ({ addressBookReducer, sendReceive,userConfig, oidc, menuItems, }) => {
	return {
		addressBookReducer,
		userConfig: userConfig.userProfileInfo,
		oidc,
		sendReceive,
		trackLogs: userConfig.trackAuditLogData,
		addressBookPermissions: menuItems?.featurePermissions.addressBook,
	};
};
const connectDispatchToProps = (dispatch) => {
	return {
		rejectCoinWallet: () => {
			dispatch(rejectCoin());
		},
		rowSelectedData: (selectedRowData) => {
			dispatch(fetchUsersIdUpdate(selectedRowData));
		},
		tabSelectedData: (cryptoTab) => {
			dispatch(selectedTab(cryptoTab))
		},
		clearFormValues: () => {
			dispatch(clearValues());
		},
		clearCrypto: () => {
			dispatch(clearCryptoValues());
		},
		changeStep: (stepcode) => {
			dispatch(setAddressStep(stepcode));
		},
		setAction: (val) => {
			dispatch(setCurrentAction(val))
		},
		dispatch
	};
};
export default connect(
	connectStateToProps,
	connectDispatchToProps
)(withRouter(AddressBook));