import React, { Component } from "react";
import { Typography, Button, Alert, Tooltip } from "antd";
import { Link } from "react-router-dom";
import Translate from "react-translate-component";
import Loader from "../../Shared/loader";
import SuisseBtn from "../shared/butons";
import Currency from "../shared/number.formate";
import apicalls from "../../api/apiCalls";
import { connect } from 'react-redux';
import { setCurrentAction } from "../../reducers/actionsReducer";
import {setSellHeaderHide, setSelectedSellCoin} from "../../reducers/buysellReducer";
const LinkValue = (props) => {
	return (
		<Translate
			className="textpure-yellow text-underline c-pointer"
			content={props.content}
			component={Link}
			onClick={() =>
				window.open(
					"https://www.iubenda.com/terms-and-conditions/42856099",
					"_blank"
				)
			}
		/>
	);
};
class Summary extends Component {
	
	state = {
		permissions: {},
		buyPermissions: {},
		sellPermissions: {}
	};
	
	componentDidMount() {
		this.permissionsInterval = setInterval(this.loadPermissions, 200);
	}
	loadPermissions = () => {
		if (this.props.buyPermissions) {
			clearInterval(this.permissionsInterval);
			let _permissions = {};
			for (let action of this.props.buyPermissions?.actions) {
				_permissions[action.permissionName] = action.values;
			}
			this.setState({ ...this.state, buyPermissions: _permissions });
		}
		if (this.props.sellPermissions) {
			clearInterval(this.permissionsInterval);
			let _permissions = {};
			for (let action of this.props.sellPermissions?.actions) {
				_permissions[action.permissionName] = action.values;
			}
			this.setState({ ...this.state, sellPermissions: _permissions });
		}
	}
	onBackSell = () => {
		if(this.props.okBtnTitle == "buy"){ 
			this.props.dispatch(setSellHeaderHide(false));
			this.props.dispatch(setSelectedSellCoin(true));
			this.props.onCancel()
		}
		if(this.props.okBtnTitle == "sell") {
			this.props.dispatch(setSellHeaderHide(true));
			this.props.dispatch(setSelectedSellCoin(false));
			this.props.onCancel()
		}
    }
	render() {
		if (this.props?.loading) {
			return <Loader />;
		}
		const { Paragraph, Text } = Typography;
		const {
			coin,
			oneCoinValue,
			amount,
			amountTitle,
			amountNativeCurrency,
			nativeCurrency,
			error,
			isButtonLoad,
			showFee,
			feeAmount,
			feeCurrency,
			okBtnTitle,
			permissions,
			showEstimatedTotal = true,
			showConvert = false,
			convertValue,
			convertCoin,
			showEstimated = true,
			exchangeCoin,
			decimalPlaces,
			onErrorClose,
			onCheked,
		} = this.props;
		
		return (
			<>
				{!error?.valid && (
					<Alert
						showIcon
						type="error"
						message={error?.title || apicalls.convertLocalLang("buy_crypto")}
						description={error?.message}
						onClose={() => (onErrorClose ? onErrorClose() : "")}
					/>
				)}

				<div className="cryptosummary-container">					
					<div
						className="cust-coin-value"
						>
						<Currency
							prefix={coin}
							decimalPlaces={decimalPlaces}
							defaultValue={amount}
							suffixText={""}
						/>{" "}
					</div>
					{showEstimated && (
						<div className="faitcurrency-style">
							<Currency
								defaultValue={amountNativeCurrency}
								prefix={""}
								decimalPlaces={decimalPlaces}
								type={"text"}
								suffixText={nativeCurrency}
							/>
						</div>
					)}
					<div className="cust-summary-new">
					<div className="pay-list fs-14">
						<Translate
							className="fw-400 text-white"
							content="exchange_rate"
							component={Text}
						/>
						<Currency
							defaultValue={oneCoinValue}
							decimalPlaces={decimalPlaces}
							prefix={""}
							className="fw-500 text-white-50"
							prefixText={`1 ${exchangeCoin || coin} = ${nativeCurrency}`}
						/>
					</div>
					{showConvert && (
						<div className="pay-list fs-14">
							<Translate
								className="fw-400 text-white"
								content="convert"
								component={Text}
							/>
							<Currency
								defaultValue={convertValue}
								prefix={""}
								decimalPlaces={decimalPlaces}
								className="fw-400 text-white-30"
								suffixText={convertCoin}
							/>
						</div>
					)}
					<div className="pay-list fs-14">
						<Translate
							className="fw-400 text-white"
							content={amountTitle || "amount"}
							component={Text}
						/>
						<Currency
							defaultValue={amount}
							decimalPlaces={decimalPlaces}
							prefix={""}
							type={"text"}
							className="fw-400 text-white-30"
							suffixText={coin}
						/>
					</div>
					{showFee && (
						<div className="pay-list fs-14">
							<Translate
								className="fw-400 text-white"
								content={`suissebase_fee`}
								component={Text}>
								<Tooltip title="Suissebase Fee">
									<span className="icon md info c-pointer ml-4" />
								</Tooltip>
							</Translate>
							<Currency
								defaultValue={feeAmount}
								prefix={""}
								className="text-darkgreen fw-400"
								suffixText={feeCurrency}
							/>
						</div>
					)}
					{showEstimatedTotal && (
						<div className="pay-list fs-14">
							<Translate
								className="fw-400 text-white"
								content="estimated_total"
								component={Text}
							/>
							<Currency
								defaultValue={amountNativeCurrency}
								prefix={""}
								className="fw-400 text-white-30"
								suffixText={nativeCurrency}
							/>
						</div>
					)}
				</div>
					<div className="cust-summary-text">
						<Translate
							className="text-style"
							content="final_Amount"
							component={Text}
						/>
					</div>
					{permissions &&
					<div className="d-flex p-16 mb-24 agree-check">
						<label
						>
							<input
								type="checkbox"
								id="agree-check"
								checked={onCheked}
								onChange={({ currentTarget: { checked } }) => {
									this.props.onTermsChange(checked);
								}}
							/>
							<span for="agree-check" className={`${error?.agreeRed===false ? "checkbox-red":""}`} />
						</label>
						<Paragraph
							className="fs-14 text-white-30 ml-16 mb-0"
							style={{ flex: 1 }}>
							<Translate content="agree_sell" component="Paragraph" />{" "}
							<a
								className="terms-link"
								href="https://www.iubenda.com/terms-and-conditions/42856099"
								target="_blank">
								<Translate content="terms" component="Text" />
							</a>{" "}
							
							<Translate content="refund_cancellation" component="Text" />
						</Paragraph>
					</div>}
					
					

					<div className="">
					{(okBtnTitle == "buy" && permissions) &&
					<SuisseBtn
						className={"pop-btn custom-send sell-btc-btn"}
						onRefresh={() => this.props.onRefresh()}
						title={okBtnTitle || "pay"}
						loading={isButtonLoad}
						autoDisable={true}
						onClick={() => this.props.onClick()}
					/>}
					
					<SuisseBtn
					title="cancel"
							content="cancel"
							component={Button}
							onClick={() => { this.onBackSell() }}
							type="text"
							size="large"
							className="cust-cancel-btn"
						/>
					
					{(okBtnTitle == "sell" && permissions) &&<div className="sell-btc-btn">
					<SuisseBtn
						className={"pop-btn custom-send sell-btc-btn"}
						onRefresh={() => this.props.onRefresh()}
						title={okBtnTitle || "pay"}
						loading={isButtonLoad}
						autoDisable={true}
						onClick={() => this.props.onClick()}
					/></div>}</div>
				</div>
			</>
		);
	}
}
const connectStateToProps = ({ menuItems }) => {
    return { buyPermissions: menuItems?.featurePermissions?.trade_buy, sellPermissions: menuItems?.featurePermissions?.trade_sell}
}
const connectDispatchToProps = dispatch => {
	return {
	  setAction: (val) => {
		dispatch(setCurrentAction(val))
	  },
	  dispatch
	}
  }
export default connect(connectStateToProps, connectDispatchToProps )(Summary);

