import React, { Component } from "react";
import { Typography, Button, Alert, Tooltip } from "antd";
import Translate from "react-translate-component";
import Loader from "../../Shared/loader";
import SuisseBtn from "../shared/butons";
import Currency from "../shared/number.formate";
import apicalls from "../../api/apiCalls";
import { connect } from 'react-redux';
import { setCurrentAction } from "../../reducers/actionsReducer";
import {setSellHeaderHide, setSelectedSellCoin} from "../../reducers/buysellReducer";

class Summary extends Component {
	
	state = {
		permissions: {},
		buyPermissions: {},
		sellPermissions: {},
		effectiveType:false,
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
		if(this.props.okBtnTitle === "buy"){ 
			this.props.dispatch(setSellHeaderHide(false));
			this.props.dispatch(setSelectedSellCoin(true));
			this.props.onCancel()
		}
		if(this.props.okBtnTitle === "sell") {
			this.props.dispatch(setSellHeaderHide(true));
			this.props.dispatch(setSelectedSellCoin(false));
			this.props.onCancel()
		}
    }
	handleEffectiveFee=()=>{
		if(this.state.effectiveType){
			this.setState({...this.state,effectiveType:false})
		}else {
			this.setState({...this.state,effectiveType:true})
		}
   
	}
	render() {
		if (this.props?.loading) {
			return <Loader />;
		}
		const { Paragraph, Text,Title } = Typography;
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
			sbCredit,
			tierDiscount,
			sbFee,
			totalFee
			
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
							suffixText={coin}
							decimalPlaces={decimalPlaces}
							defaultValue={amount}
							prefix={""}
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
					<div className="pay-list">
						<Translate
							className="summary-liststyle"
							content="exchange_rate"
							component={Text}
						/>
						<Currency
							defaultValue={oneCoinValue}
							decimalPlaces={decimalPlaces}
							prefix={""}
							className="summarybal"
							prefixText={`1 ${exchangeCoin || coin} = ${nativeCurrency}`}
						/>
					</div>
					{showConvert && (
						<div className="pay-list">
							<Translate
								className="summary-liststyle"
								content="convert"
								component={Text}
							/>
							<Currency
								defaultValue={convertValue}
								prefix={""}
								decimalPlaces={decimalPlaces}
								className="summarybal"
								suffixText={convertCoin}
							/>
						</div>
					)}
					<div className="pay-list">
						<Translate
							className="summary-liststyle"
							content={amountTitle || "amount"}
							component={Text}
						/>
						<Currency
							defaultValue={amount}
							decimalPlaces={decimalPlaces}
							prefix={""}
							type={"text"}
							className="summarybal"
							suffixText={coin}
						/>
					</div>
					 <div className="pay-list" style={{ alignItems: 'baseline' }}>
                                    <div className="summary-liststyle Effective-Fees" onClick={()=>this.handleEffectiveFee()}><span>Effective Fees</span><span className="icon lg down-arrow"></span></div>
                                    <div className="summarybal">
									<Currency
									defaultValue={sbFee}
									prefix={""}
								    decimalPlaces={decimalPlaces}
									className="summarybal"
									suffixText={coin}
						        	/>
				    </div>
                  </div>
				 {this.state.effectiveType && <> <div className="pay-list" style={{ alignItems: 'baseline' }}>
                                    <div className="summary-liststyle">Total Fees</div>
                                    <div className="summarybal">
									<Currency
									defaultValue={totalFee}
									prefix={""}
									decimalPlaces={decimalPlaces}
									className="summarybal"
									suffixText={coin}
								    />									
										 </div>
                     </div>
				 {tierDiscount !=0 && <div className="pay-list" style={{ alignItems: 'baseline' }}>
                                    <div className="summary-liststyle">Tire Discount</div>
                                    <div className="summarybal">
									<Currency
									defaultValue={tierDiscount}
									prefix={""}
								    decimalPlaces={decimalPlaces}
									className="summarybal"
									suffixText={coin}
						        	/> 
										 </div>
                     </div>}
					 {sbCredit !=0 &&<div className="pay-list" style={{ alignItems: 'baseline' }}>
                                    <div className="summary-liststyle">SuisseBase Credit Used</div>
                                    <div className="summarybal">
									<Currency
									defaultValue={sbCredit}
									prefix={""}
								    decimalPlaces={decimalPlaces}
									className="summarybal"
									suffixText={coin}
						        	/>
										 </div>
                  </div>}
				  </>}
					
					{showFee && (
						<div className="pay-list">
							<Translate
								className="summary-liststyle"
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
						<div className="pay-list">
							<Translate
								className="summary-liststyle"
								content="estimated_total"
								component={Text}
							/>
							<Currency
								defaultValue={amountNativeCurrency}
								prefix={""}
								className="summarybal"
								suffixText={nativeCurrency}
							/>
						</div>
					)}
				</div>
						<Translate
							className="text-style"
							content="final_Amount"
							component={Title}
						/>
					{permissions &&
					<div className="d-flex agree-check">
						<label>
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
							className="cust-agreecheck"
							style={{ flex: 1 }}>
							<Translate className="cust-agreecheck" content="agree_sell" component="Paragraph" />{" "}
							<a
								className="terms-link"
								href={process.env.REACT_APP_TERMS_AND_CONDITIONS}
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
					
					{(okBtnTitle === "sell" && permissions) &&<div className="sell-btc-btn">
					<SuisseBtn
						className={"pop-btn custom-send sell-btc-btn"}
						onRefresh={() => this.props.onRefresh()}
						title={okBtnTitle || "pay"}
						loading={isButtonLoad}
						autoDisable={true}
						onClick={() => this.props.onClick()}
					/></div>}
					
					<SuisseBtn
					title="cancel"
							content="cancel"
							component={Button}
							onClick={() => { this.onBackSell() }}
							type="text"
							size="large"
							className="cust-cancel-btn"
						/>
					
					</div>
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

