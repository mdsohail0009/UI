import React, { Component } from 'react';
import { Typography, message, Dropdown, Menu, Button } from 'antd';
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
    FacebookShareButton, FacebookIcon,
    TelegramShareButton, TelegramIcon,
    TwitterShareButton, TwitterIcon,
    WhatsappShareButton, WhatsappIcon
} from "react-share";
class QRScan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: '',
            netWorkData: [],
            isnetworktrigger:false
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
        console.log("HHHHHHHHH", response)
        if (response.ok) {
            this.setState({ netWorkData: response.data });
        } else {
            this.setState({ error: response.data });
        }
    }

    get walletAddress() {
        return this.props?.sendReceive?.depositWallet?.walletAddress
    }
    get shareMenu() {
        return <Menu className="share-adrs">
            <Menu.Item>
                <WhatsappShareButton te url={process.env.REACT_APP_WEB_URL} title={`Hello, I would like to share my ${this.props?.sendReceive?.depositWallet?.walletCode} address for deposit ${this.walletAddress}.Note:(Please make sure you are using the correct protocal otherwise you are risking of loosing the funds).I am using Suissebase. Thank you.`} >
                    <WhatsappIcon size={32} round={true} />
                </WhatsappShareButton>
            </Menu.Item>
            <Menu.Item>
                <EmailShareButton url={process.env.REACT_APP_WEB_URL} subject={"Wallet Address"} body={`Hello, I would like to share my ${this.props?.sendReceive?.depositWallet?.walletCode} address for deposit ${this.walletAddress}.Note:(Please make sure you are using the correct protocal otherwise you are risking of loosing the funds).I am using Suissebase. Thank you.`}  >
                    <EmailIcon size={32} round={true} />
                </EmailShareButton>
            </Menu.Item>
            {/* <Menu.Item>
                <TwitterShareButton url={process.env.REACT_APP_WEB_URL} title={this.walletAddress} >
                    <TwitterIcon size={32} round={true} />
                </TwitterShareButton>
            </Menu.Item>
            <Menu.Item>
                <FacebookShareButton url={process.env.REACT_APP_WEB_URL} quote={this.walletAddress} >
                    <FacebookIcon size={32} round={true} />
                </FacebookShareButton>
            </Menu.Item>
            <Menu.Item>
                <TelegramShareButton url={process.env.REACT_APP_WEB_URL} title={this.walletAddress} >
                    <TelegramIcon size={32} round={true} />
                </TelegramShareButton>
            </Menu.Item> */}
        </Menu>
    }
    render() {
        const { Paragraph, Text } = Typography;
        if (!this.props?.sendReceive?.depositWallet?.walletAddress) {
            return <Loader />
        }
        const {netWorkData, isnetworktrigger}=this.state;
        if(!netWorkData && !isnetworktrigger && this.props?.sendReceive?.depositWallet){
            this.getNetworkObj()
        }
        return (
            <div>
                <div className="text-center f-12 text-white custom-crypto-btns">
                    {netWorkData&& netWorkData.map((network)=>{
                        return <>
                        <Button className="mr-16 cutom-bnt text-white-30">{network.code}</Button>
                        </>
                    })}
                </div>
                <div className="scanner-img">
                    <QRCodeComponent value={this.props?.sendReceive?.depositWallet?.walletAddress} size={150} />
                </div>
                <div className="crypto-address">
                    <Translate className="mb-0 fw-400 text-secondary" content="address" component={Text} />
                    <div className="mb-0 fw-600 text-white-30 walletadrs mb-copy">{this.props?.sendReceive?.depositWallet?.walletAddress}
                        <CopyToClipboard text={this.props?.sendReceive?.depositWallet?.walletAddress} options={{ format: 'text/plain' }}>
                            <Text copyable={{ tooltips: [apicalls.convertLocalLang('copy'), apicalls.convertLocalLang('copied')] }} className="fs-20 text-white-30 custom-display"></Text>
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
                    <ul className="text-white">
                        <li><Translate className=" f-12 text-white fw-200 mt-16" content="address_hint_text" component={Paragraph} /></li>
                        <li><Translate className="f-12 text-white fw-200 mt-16" content="address_hint_text_1" component={Paragraph} /></li>
                        <li><Paragraph className=" f-12 text-yellow fw-200 mt-16">Note: {this.props?.sendReceive?.depositWallet?.note} </Paragraph></li>
                    </ul>
                </Paragraph>
                <Dropdown overlay={this.shareMenu}>
                    {/* <Button className="pop-btn mt-36" block>Share</Button> */}
                    <Button
                        style={{ borderRadius: 25, height: 50 }}
                        className="mt-36 text-upper share-btn fw-600 fs-14" block>{apicalls.convertLocalLang('button')}</Button>
                </Dropdown>
            </div>
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