import React, { Component } from 'react';
import { Typography, message, Dropdown, Menu, Button } from 'antd';
import { setStep, setWalletAddress } from '../../reducers/sendreceiveReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import QRCodeComponent from '../qr.code.component';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Loader from '../../Shared/loader';
import { appInsights } from "../../Shared/appinsights";
import apicalls from '../../api/apiCalls';
import {
    EmailShareButton, EmailIcon,
    FacebookShareButton, FacebookIcon,
    TelegramShareButton, TelegramIcon,
    TwitterShareButton, TwitterIcon,
    WhatsappShareButton, WhatsappIcon
} from "react-share";
class QRScan extends Component {
    state = {}
    success = () => {
        message.success('Address was copied!');
    };

    componentWillUnmount() {
        this.props.dispatch(setWalletAddress(null))
        this.trackevent();
    }
    trackevent = () => {
        appInsights.trackEvent({
            name: 'Deposit Crypto', properties: { "Type": 'User', "Action": 'Page view', "Username": this.props.userProfile.userName, "MemeberId": this.props.userProfile.id, "Feature": 'WithDraw Crypto', "Remarks": "Deposit crypto scan page view", "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Deposit Crypto' }
        });
    }
    get walletAddress() {
        return this.props?.sendReceive?.depositWallet?.walletAddress
    }
    get shareMenu() {
        return <Menu className="share-adrs">
            <Menu.Item>
                <WhatsappShareButton te url={process.env.REACT_APP_WEB_URL} title={this.walletAddress} >
                    <WhatsappIcon size={32} round={true} />
                </WhatsappShareButton>
            </Menu.Item>
            <Menu.Item>
                <EmailShareButton url={process.env.REACT_APP_WEB_URL} subject={"Wallet Address"} body={this.walletAddress} separator={";"} >
                    <EmailIcon size={32} round={true} />
                </EmailShareButton>
            </Menu.Item>
            <Menu.Item>
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
            </Menu.Item>
        </Menu>
    }
    render() {
        const { Paragraph, Text} = Typography;
        if (!this.props?.sendReceive?.depositWallet?.walletAddress) {
            return <Loader />
        }
        return (
            <div>
                <div className="scanner-img">
                    <QRCodeComponent value={this.props?.sendReceive?.depositWallet?.walletAddress} size={150} />
                </div>
                <div className="crypto-address">
                    <Translate className="mb-0 fw-400 text-secondary" content="address" component={Text} />
                    <div className="mb-0 fw-700 text-white-30 walletadrs">{this.props?.sendReceive?.depositWallet?.walletAddress}
                        <CopyToClipboard text={this.props?.sendReceive?.depositWallet?.walletAddress}>
                            <Text copyable className="fs-20 text-white-30 custom-display"></Text>
                        </CopyToClipboard>
                    </div>
                </div>

                {this.props?.sendReceive?.depositWallet?.tag && <div className="crypto-address mt-36">
                    <Translate className="mb-0 fw-400 text-secondary" content="tag" component={Text} />
                    <div className="mb-0 fs-14 fw-500 text-white-30">{this.props?.sendReceive?.depositWallet?.tag}
                        <CopyToClipboard text={this.props?.sendReceive?.depositWallet?.tag}>
                            <Text copyable className="fs-20 text-white-30 custom-display"></Text>
                        </CopyToClipboard></div>
                </div>}
                <Translate className="text-center f-12 text-white fw-200 mt-16" content="address_hint_text" component={Paragraph} />
                <Dropdown overlay={this.shareMenu}>
                    {/* <Button className="pop-btn mt-36" block>Share</Button> */}
                    <Button className="pop-btn mt-36" block>{apicalls.convertLocalLang('button')}</Button>
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