import React, { Component } from 'react';
import { Typography, message, Menu, Alert } from 'antd';
import { setStep, setWalletAddress } from '../../reducers/sendreceiveReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import QRCodeComponent from '../qr.code.component';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Loader from '../../Shared/loader';
import apicalls from '../../api/apiCalls';
import { getNetworkLu } from './api';
import {
    EmailShareButton, EmailIcon,
    WhatsappShareButton, WhatsappIcon
} from "react-share";
import { createCryptoDeposit } from '../deposit.component/api';
import { Link } from 'react-router-dom';
class QRScan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            netWorkData: [],
            isnetworktrigger:false,
            isLoading: false
        }
    }
    success = () => {
        message.success('Address was copied!');
    };
    componentDidMount() {
        this.trackevent();
        
    }
    componentWillUnmount() {
        this.props.dispatch(setWalletAddress(null))
    }
    trackevent = () => {
        apicalls.trackEvent({
            "Type": 'User', "Action": 'Deposit Crypto Scan page view', "Username": this.props.userProfile.userName, "customerId": this.props.userProfile.id, "Feature": 'Deposit Crypto', "Remarks": "Deposit Crypto Scan page view", "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Deposit Crypto'
        });
    }
    getNetworkObj = async () => {
        this.setState({isnetworktrigger:true});
        const response = await getNetworkLu(this.props?.sendReceive?.depositWallet?.walletCode);
        if (response.ok) {
            this.setState({ netWorkData: response.data });
        } else {
            this.setState({ error: response.data });
        }
    }
    networkTypeNames = (type) => {
		const stepcodes = {
			"BTC": "BTC",
			"ERC-20": "ERC - 20",
			"TRC-20": "TRC - 20",
		};
		return stepcodes[type];
	};
    onNetworkView = async (netWork) => {
        this.setState({...this.state, isLoading: true})
        const response = await createCryptoDeposit({customerId: this.props.userProfile?.id,walletCode:this.props?.sendReceive?.depositWallet?.walletCode, network: netWork?.code});
        if (response.ok) {
            this.setState({...this.state, error: null, isLoading: false})
            this.props.dispatch(setWalletAddress(response.data));
        } else {
            this.setState({...this.state, error: response.data, isLoading: false });
        }
    }

    get walletAddress() {
        return this.props?.sendReceive?.depositWallet?.walletAddress
    }
    get walletCode() {
        let selectedWalletCode = this.props?.sendReceive?.depositWallet?.walletCode;
        if((selectedWalletCode === "USDT" || selectedWalletCode === "ETH" || selectedWalletCode === "USDC") && this.props?.sendReceive?.depositWallet?.network ){
            return `${this.props?.sendReceive?.depositWallet?.walletCode}` + " " + "(" + `${this.props?.sendReceive?.depositWallet?.network}`  + ")";
        }
        else {
            return this.props?.sendReceive?.depositWallet?.walletCode;
        }

    }
    get shareMenu() {
        return <Menu className="share-adrs">
            <Menu.Item>
                <WhatsappShareButton te url={process.env.REACT_APP_WEB_URL} title={`Hello, I would like to share my ${this.walletCode} address for receiving  ${this.walletAddress}. Note: Please make sure you are using the correct protocol otherwise you are risking losing the funds. I am using Suissebase. Thank you.`} >
                    <WhatsappIcon size={32} round={true} />
                </WhatsappShareButton>
            </Menu.Item>
            <Menu.Item>
                <EmailShareButton url={process.env.REACT_APP_WEB_URL} subject={"Wallet Address"} body={`Hello, I would like to share my ${this.walletCode} address for receiving  ${this.walletAddress}. Note: Please make sure you are using the correct protocol otherwise you are risking losing the funds. I am using Suissebase. Thank you.`}  >
                    <EmailIcon size={32} round={true} />
                </EmailShareButton>
            </Menu.Item>
        </Menu>
    }
    render() {
        const { Paragraph, Text } = Typography;
        if (!this.props?.sendReceive?.depositWallet?.walletAddress || this.state.isLoading) {
            return <Loader />
        }
        const {netWorkData, isnetworktrigger}=this.state;
        if(netWorkData.length<1 && !isnetworktrigger && this.props?.sendReceive?.depositWallet){
            this.getNetworkObj()
        }
        return ( <>
        {this.state.error !== null && (
                <Alert
                  type="error"
                  description={this.state.error}
                  //onClose={() => seterrorMsg(null)}
                  showIcon
                />
              )}
        
            <div>
               <div className="network-display">
                    {netWorkData && netWorkData.map((network) => {
                        return <>
                       
                            <div className=  {network.code === this.props?.sendReceive?.depositWallet?.network ? "cust-networkstyle" : "network" }>
                               {netWorkData.length>1 &&<Link onClick={() => this.onNetworkView(network)}>
                                    <div className='swap-fontsize'>
                                        {this.networkTypeNames(network.code)}
                                        </div>
                                </Link>}
                                {netWorkData.length === 1 &&  `${this.networkTypeNames(network.code)}`}
                            </div>
                           
                        </>
                    })}
                </div>
                <div className="scanner-img">
                    <QRCodeComponent value={this.props?.sendReceive?.depositWallet?.walletAddress} size={150} />
                </div>
                <div className="recive-lable">
                    <Translate className="recive-lable" content="address" component={Text} />{" "}
                  <span className='recive-copy'>  ({this.networkTypeNames(this.props?.sendReceive?.depositWallet?.network)})</span>

                    <div className="recive-copy">{this.props?.sendReceive?.depositWallet?.walletAddress}
                        <CopyToClipboard text={this.props?.sendReceive?.depositWallet?.walletAddress} options={{ format: 'text/plain' }}>
                            <Text copyable={{ tooltips: [apicalls.convertLocalLang('copy'), apicalls.convertLocalLang('copied')] }} className="fs-20 text-white-30 custom-display custom-copy"></Text>
                        </CopyToClipboard>
                    </div>
                </div>

                {this.props?.sendReceive?.depositWallet?.tag && <div className="crypto-address mt-36">
                    <Translate className="mb-0 fw-400 text-secondary" content="tag" component={Text} />
                    <div className="mb-0 fs-14 fw-500 text-white-30">{this.props?.sendReceive?.depositWallet?.tag}
                        <CopyToClipboard text={this.props?.sendReceive?.depositWallet?.tag} options={{ format: 'text/plain' }}>
                            <Text copyable={{ tooltips: [apicalls.convertLocalLang('copy'), apicalls.convertLocalLang('copied')] }} className="fs-20 text-white-30 custom-display"></Text>
                        </CopyToClipboard></div>
                </div>}
                <Paragraph>
                    <ul className="recive-text">
                        <li className="list-dot"><Translate className="recive-runtext" content="address_hint_text" component={Text} /></li>
                        <li className="list-dot"><Translate className="recive-runtext" content="address_hint_text_1" component={Text} /></li>
                        <li className="list-dot"><Text className="recive-runtext">{this.props?.sendReceive?.depositWallet?.note} </Text></li>
                        <li className="list-dot"></li>
                    </ul>
                </Paragraph>
                <div className='recive-share'>Share</div>
                <div>
                <WhatsappShareButton te url={process.env.REACT_APP_WEB_URL} title={`Hello, I would like to share my ${this.walletCode} address for receiving  ${this.walletAddress}. Note: Please make sure you are using the correct protocol otherwise you are risking losing the funds. I am using Suissebase. Thank you.`} >
                <span className='icon lg whats-app c-pointer'/>
                </WhatsappShareButton>
                <EmailShareButton url={process.env.REACT_APP_WEB_URL} subject={"Wallet Address"} body={`Hello, I would like to share my ${this.walletCode} address for receiving  ${this.walletAddress}. Note: Please make sure you are using the correct protocol otherwise you are risking losing the funds. I am using Suissebase. Thank you.`}  >
                <span className='icon lg mail-app c-pointer' />
                </EmailShareButton>
                </div>
            </div>
            </>
        )
    }
}

const connectStateToProps = ({ sendReceive, userConfig }) => {
    return { sendReceive, userProfile: userConfig.userProfileInfo }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        }, dispatch
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(QRScan);