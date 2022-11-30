
import React, { Component } from "react";
import { Typography, Drawer, Button, Radio, Tooltip, Modal, Alert, message, Spin } from "antd";
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
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import apiCalls from "../../api/apiCalls";
import Info from "../shared/info";
import { DownloadOutlined } from '@ant-design/icons';
import ActionsToolbar from "../toolbar.component/actions.toolbar";
import { fetchFeaturePermissions, setSelectedFeatureMenu } from "../../reducers/feturesReducer";
import {rejectWithdrawfiat } from '../../reducers/sendreceiveReducer';
import { getFeatureId } from "../shared/permissions/permissionService";
import { setCurrentAction } from '../../reducers/actionsReducer'
import AddressBookV3 from "../addressbook.v3";
import AddressCrypto from "./addressCrypto"
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

			gridUrlCrypto: process.env.REACT_APP_GRID_API + "Address/Crypto",
			gridUrlFiat: process.env.REACT_APP_GRID_API + "Address/Fiat",
		};
		this.gridFiatRef = React.createRef();
		this.gridCryptoRef = React.createRef();
		this.props.dispatch(fetchFeaturePermissions(getFeatureId("/addressBook"), this.props.userConfig.id))
		this.props.dispatch(setSelectedFeatureMenu(getFeatureId("/addressBook"), this.props.userConfig.id));
	}
	componentDidMount() {
		this.permissionsInterval = setInterval(this.loadPermissions, 200);
		if (!this.state.cryptoFiat) {
			apiCalls.trackEvent({
				Type: "User",
				Action: "Withdraw Crypto Address book grid view",
				Username: this.props.userProfileInfo?.userName,
				customerId: this.props.userProfileInfo?.id,
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
				Username: this.props.userProfileInfo?.userName,
				customerId: this.props.userProfileInfo?.id,
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
					<label className="text-center custom-checkbox c-pointer">
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
				<td className="d-flex justify-content">
					<div className="gridLink c-pointer	gridlink-data" onClick={() => this.addressFiatView(props)}>
					{props?.dataItem?.whiteListName}
					</div>
					<Text className="file-label ml-8 fs-12 add-lbl">
						{this.addressTypeNames(props?.dataItem?.addressType)}
					</Text>
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
			title: apiCalls.convertLocalLang("BIC_SWIFT_ABArouting_number"),
			filter: true,
			width: 310,
		},
		{
			field: "bankName",
			title: apiCalls.convertLocalLang("Bank_name"),
			filter: true,
			width: 200,
		},
		{
			field: "addressState",
			title: apiCalls.convertLocalLang("addressState"),
			filter: true,
			width: 180,
		},
		{
			field: "status",
			title: apiCalls.convertLocalLang("Status"),
			filter: true,
			width: 100,
		},
		{
			field: "isWhitelisted",
			customCell: (props) => (
				<td>
					{props.dataItem?.isWhitelisted && (this.state.selectedDeclaration != props?.dataItem.payeeAccountId) && <><a onClick={() => {
						if (!this.state.isDownloading)
							this.downloadDeclarationForm(props?.dataItem);
					}} ><DownloadOutlined /></a> Whitelisted</>}
					{!props.dataItem?.isWhitelisted && "Not whitelisted"}
					{this.state.isDownloading && this.state.selectedDeclaration == props?.dataItem.payeeAccountId && <Spin size="small" />}
				</td>
			),
			title: apiCalls.convertLocalLang("whitelist"),
			filter: false,
			width: 200,
		}
	];
	columnsCrypto = [
		{
			field: "",
			title: "",
			width: 50,
			customCell: (props) => (
				<td>
					{" "}
					<label className="text-center custom-checkbox c-pointer">
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
						<span className="gridLink c-pointer" onClick={() => this.addressCryptoView(props)}>{props.dataItem?.whiteListName}</span>
					</div>
				</td>
			),
		},
		{
			field: "coin",
			title: "Token",
			filter: true,
			width: 120,
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
			title: apiCalls.convertLocalLang("addressState"),
			filter: true,
			width: 180,
		},
		{
			field: "status",
			title: apiCalls.convertLocalLang("Status"),
			filter: true,
			width: 100,
		},
		{
			field: "isWhitelisted",
			customCell: (props) => (
				<td>
					{props.dataItem?.isWhitelisted && (this.state.selectedDeclaration != props?.dataItem.payeeAccountId) && <> <a onClick={() => {
						if (!this.state.isDownloading)
							this.downloadDeclarationForm(props?.dataItem);
					}} ><DownloadOutlined /></a> Whitelisted</>}
					{!props.dataItem?.isWhitelisted && "Not whitelisted"}
					{this.state.isDownloading && this.state.selectedDeclaration == props?.dataItem.payeeAccountId && <Spin size="small" />}
				</td>
			),
			title: apiCalls.convertLocalLang("whitelist"),
			filter: false,
			width: 200,
		}
	];
	async downloadDeclarationForm(dataItem) {
		this.setState({ ...this.state, isDownloading: true, selectedDeclaration: dataItem.payeeAccountId });
		const response = await downloadDeclForm(dataItem.payeeAccountId);
		if (response.ok) {
			window.open(response.data, "_blank");
			this.setState({ ...this.state, isDownloading: false, selectedDeclaration: null });
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
		statusObj.modifiedBy = this.props.oidc.user.profile.unique_name;
		if (this.state.selectedObj.status == "Active") {
			statusObj.status.push("Active")
		} else {
			statusObj.status.push("InActive")
		}
		// statusObj.status.push(this.state.selectedObj.status);
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
				errorWorning: response.data,
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
					Username: this.props.userProfileInfo?.userName,
					customerId: this.props.userProfileInfo?.id,
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
				Username: this.props.userProfileInfo?.userName,
				customerId: this.props.userProfileInfo?.id,
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
		else if(obj.status == "Inactive") {
			this.setState({ ...this.state, errorWorning: "Record is inactive so you can't edit" });
		}
		else if (
			obj.addressState === "Approved" ||
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
						Username: this.props.userProfileInfo?.userName,
						customerId: this.props.userProfileInfo?.id,
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
						Username: this.props.userProfileInfo?.userName,
						customerId: this.props.userProfileInfo?.id,
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
		};
		this.setState({ ...this.state, visible: showCrypto, fiatDrawer: showFiat, selectedObj: {}});
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
			
		};
		this.setState({ ...this.state, visible: showCrypto, selectedObj: {} });
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
			cryptoFiat: e.target.value === 2,
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
				Username: this.props.userProfileInfo?.userName,
				customerId: this.props.userProfileInfo?.id,
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
				Username: this.props.userProfileInfo?.userName,
				customerId: this.props.userProfileInfo?.id,
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
		const actions = {
			add: "addAddressBook",
			edit: "editAddressBook",
			disable: "statusUpdate"
		};
		this[actions[key]]();
	};

	render() {
		const { cryptoFiat, gridUrlCrypto, gridUrlFiat, customerId, btnDisabled } =
			this.state;

		return (
			<>
			<div className="main-container">
			<Translate
				content="address_book"
				component={Title}
				className="basicinfo mb-0"
			/>
			<Text className="fs-16 text-white fw-500 mb-12 d-block">Note: <span className="fs-14 text-white fw-400 mb-12">Whitelisting of Crypto Address and Bank Account is required, Please add below.</span></Text>
				<div className="box basic-info addressbook-grid">
					<div className="display-flex mb-16">
						<Radio.Group
							defaultValue={(this.props?.activeFiat||this.state.cryptoFiat) ? 2 : 1}
							onChange={this.handleWithdrawToggle}
							className="buysell-toggle mx-0"
							style={{ display: "inline-block" }}>
							<Translate
								content="withdrawCrypto"
								component={Radio.Button}
								value={1}
								className="buysell-toggle mx-0"
							/>
							<Translate
								content="withdrawFiat"
								component={Radio.Button}
								value={2}
								className="buysell-toggle mx-0"
							/>
						</Radio.Group>
						<span className="mb-right">
							<ActionsToolbar featureKey="addressbook" onActionClick={(key) => this.onActionClick(key)} />
						</span>
					</div>
					{this.state.errorWorning && (
						<div className="custom-alert">
							<Alert
								description={this.state.errorWorning}
								type="warning"
								showIcon
							/>
						</div>
					)}
					{cryptoFiat ? (
						<List
							className="address-clear"
							columns={this.columnsFiat}
							ref={this.gridFiatRef}
							key={gridUrlFiat}
							url={gridUrlFiat}
							additionalParams={{ customerId: customerId }}
						/>
					) : (
						<List
							className="address-clear"
							columns={this.columnsCrypto}
							key={gridUrlCrypto}
							ref={this.gridCryptoRef}
							url={gridUrlCrypto}
							additionalParams={{ customerId: customerId }}
						/>
					)}
				</div>
				</div>

				<Drawer
					destroyOnClose={true}
					title={[
						<div className="side-drawer-header">
							{this.renderTitle()}
							<div className="text-center fs-24">
								<Translate
									className="text-white-30 fw-600 text-captz "
									content={
										this.state.showHeading!=true&&(
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
					className="side-drawer w-50p">
					{this.renderContent()}
				</Drawer>
				<Drawer
					destroyOnClose={true}
					title={[
						<div className="side-drawer-header">
							<span />
							<div className="text-center fs-16">
								<Paragraph className="mb-0 text-white-30 fw-600 text-upper">
									<Translate
									content={this.state.hideFiatHeading !=true && "AddFiatAddress"}
										component={Paragraph}
										className="mb-0 text-white-30 fw-600 text-upper"
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
					className="side-drawer w-50p">
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
						<div className="cust-pop-up-btn">
						<Button
							style={{border: "1px solid #f2f2f2",width:'150px',height: '46px' }}
							className="primary-btn pop-cancel"
							onClick={this.handleCancel}>
							NO
						</Button>
						<Button
							className="primary-btn pop-btn"
							onClick={this.handleSatatuSave}
							style={{ width: '150px', height: '46px' }}
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