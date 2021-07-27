import React, { Component } from 'react';
import snsWebSdk from '@sumsub/websdk';
import apicalls from './../../api/apiCalls';
import { connect } from 'react-redux';
import { userInfo, getmemeberInfo } from './../../reducers/configReduser';

class SumSub extends Component {
    componentDidMount() {

        this.launchWebSdk('https://api.sumsub.com', 'basic-kyc', 'prd:osQlWfTRIpgzY3mkz4kX8AdD.tKWT0GeplFeE69kLD8SpWpJoMWd6LiBA');

    }
    launchWebSdk = async (apiUrl, flowName, accessToken, applicantEmail, applicantPhone, customI18nMessages) => {
        applicantEmail = "test@example.org"
        applicantPhone = "+491758764512"
        apicalls.sumsubacesstoken(this.props.userConfig.userId).then((res) => {
        let snsWebSdkInstance = snsWebSdk.Builder("https://api.sumsub.com", this.props.userConfig.isbusines? "SuisseBase KYB":"SuisseBase KYC")
            .withAccessToken(res.data.token, (newAccessTokenCallback) => {
                    newAccessTokenCallback(res.data.token)

            })
            .withConf({
                lang: "en",
                email: this.props.userConfig.email,
                phone: this.props.userConfig.phoneNo, // if available
                // firstName:'NARESH',
                // fixedInfo: {
                //     "firstName": "London",
                //     "lastName": "GBR"
                // },
                onMessage: (type, payload) => {
                    console.log('WebSDK onMessage', type, payload)
                    if (type === 'idCheck.applicantStatus' && payload.reviewStatus == "completed")
                        apicalls.updateKyc(this.props.userConfig.userId).then((res) => {
                            this.props.getmemeberInfoa(this.props.userConfig.email)
                        })
                },
                onError: (error) => {
                    console.log('WebSDK onError', error)
                },
                uiConf: {
                    customCssStr: ":root {--bgYellow: #FFDB1A;--textWhite: #FFFFFF;--textWhite30: #FAFCFE;--bgGloom: #243540;--bgGrey: #515A64;--grey-darker: #B2B2B2;--border: #9797AA;--textDark: #0E0E2C;--textYellow: #FFDB1A;--bgDark: #0E0E2C;--textBlack: #000000;--textRed: #FF2400;}a, a:hover, a:focus{color: var(--textYellow);}p, .error-message-popup .message-content{color: var(--textWhite30) !important;font-size: 14px !important;font-weight: 200;line-height: 24px;}section {margin: 40px auto;}input {color: var(--textWhite30);font-weight: 600;outline: none;padding: 0 16px;}section.content{background: var(--bgGrey);color: var(--black);padding: 40px 40px 16px}.desc h4{font-size:16px}.content div .row:first-child{margin-top:0 !important}.desc p{font-size:14px}h1, h2, .desc h4, .mobile-tabs .tab.active .ss-icon, .mobile-tabs .tab, .mobile-tabs .tab .fa-icon, .mobile-tabs .tab .ss-icon, .tab-content h5, .or h4, .input-field .calling-code, .show-hide{color: #FFFFFF !important;}box-shadow: none;border-radius: 30px;}button.submit{width: 300px !important;}h2{font-size: 36px !important;}button.submit, button.blue{text-transform: uppercase;border-radius: 40px;height: 57px;font-size: 14px;font-weight: 500;background-image: none !important;background-color: var(--bgYellow);box-shadow: none !important;color: var(--textDark) !important;min-width: 300px !important;font-weight: 700 !important;transform: none !important;}button.submit span, button.alt-back .ss-icon, button .arrow{display: none;}.round-icon {background-color: var(--bgGloom) !important;background-image: none !important;}.input-field input, select, textarea{height: 49px !important;border-radius: 39px;color:#fff;background-color: transparent;border: 1px solid var(--border) !important;box-shadow: none !important;padding: 0 16px !important;}select option{color:#243540 !important}.required, .input-field span{color: var(--textRed) !important;box-shadow: none !important;}.input-field h3{font-size: 12px !important;margin-bottom: 8px;font-weight: 500;color: var(--textWhite30);text-transform: capitalize !important;margin-left: 12px;}.country-selector .country{height: 49px;border-radius: 39px;background-color: transparent;border: 1px solid var(--border);}.country-selector .value-flag{top: 20px;left: 18px;}.country.filled{padding-left: 45px !important;}input,input::placeholder{font-size: 16px;color: var(--textWhite30) !important;font-weight: 300;}.country-selector .current-value{top: 17px;right: 40px;color: var(--textWhite30) !important;line-height: 16px;}.country-selector .show-hide{top: 16px;right: 20px;color: var(--textWhite30)}h2.desktop p, .markdown-instructions h2, .tutorial-title p, h2.desktop{text-transform: capitalize;font-size: 36px !important;font-weight: 200;margin-bottom: 30px;color: var(--textWhite)!important;line-height: 42px;} .row h3{color: var(--textWhite);font-size: 16px;text-transform: uppercase;}.checkbox, .radio-item{color: var(--textWhite30);}.radio-item .checkmark:after{background-color: var(--bgYellow);}.markdown-instructions ul li, .requiredDoc, .sumsub-logo, .mobile-button .fa-icon{color: var(--textWhite)}.upload-item .drag-drop, .upload-payment-item .upload-item,.country-selector .value-flag{top: 12px;left: 4px;} .mobile-button, .mobile-button:hover, .upload, .upload-item .drag-drop{background-color: var(--bgGloom);box-shadow: none;}.upload-payment-item .upload-item{background-color: var(--bgGloom)}.upload, .mobile-button{border-radius: 16px;} .mobile-button h3{text-transform: capitalize !important;font-weight: 500;}.checkbox .checkmark{width: 34px; height: 34px;top: 4px;}.invalid-icon .ss-icon, .success-icon .ss-icon{margin-top: 10px;margin-right: 5px;}.checkbox input:checked~.checkmark{background-color: transparent;border-color: transparent;}.step.active .title, .step .title, .ident-steps .ident-step{color: var(--textWhite)}.step.active .bullet{box-shadow: none;background-color: var(--bgDark)!important;}.step .bullet{border-color: var(--bgDark) !important}.step.active .line, .step.success .line, .step .bullet, .step .line{background-color: var(--bgDark) !important}select {background-image:linear-gradient(45deg, transparent 50%, white 50%),linear-gradient(135deg, white 50%, transparent 50%);background-position:calc(100% - 20px) calc(1em + 2px),calc(100% - 15px) calc(1em + 2px),100% 0;background-size:5px 5px,5px 5px,5em 5em;background-repeat: no-repeat;background-position-y: center;-webkit-appearance: none;}select:focus {background-image:linear-gradient(45deg, white 50%, transparent 50%),linear-gradient(135deg, transparent 50%, white 50%);background-position:calc(100% - 15px) 1em,calc(100% - 20px) 1em,100% 0;background-size:5px 5px,5px 5px,2.5em 2.5em;background-repeat: no-repeat;background-position-y: center;-webkit-appearance: none;}.country-selector .list{background-color: var(--bgGloom);border: none;box-shadow: 0 5px 20px rgba(0,0,0,0.25)}.select-placeholder{top: 15px;left: 15px;}.country-selector .list li{padding: 12px 10px;color: var(--textWhite)}.country-selector .list li i{margin-right: 12px}.country-selector .list li:hover{background-color: var(--bgGrey);}* { scrollbar-width: thin; scrollbar-color: var(--bgGrey) var(--bgDarkGrey);}*::-webkit-scrollbar { width: 12px;height: 10px;}*::-webkit-scrollbar-thumb {background-color: var(--bgDark);border-radius: 20px;}.error-message-popup .popup{background-color: var(--bgGrey);}.alt-back, .back{color: var(--textWhite30);font-size: 16px;font-weight: 200;text-transform: capitalize !important;height: 56px;background-color: transparent;box-shadow: none !important;}button:hover{transform: none !important;}.loader-overlay{background-color: var(--bgGrey);}.line-form-item input{margin-top: 0 !important;border: 1px solid var(--border);height: 49px;border-radius: 30px 0 0 30px;border-right: 0;}.step.success .bullet{background-color: var(--bgYellow) !important;border-color: var(--bgYellow) !important;}.step.success .line{background-color: var(--bgYellow) !important}.center, .center p{margin: 0;}.ident-steps .ident-step .bullet{background: transparent;border: none;top: 3px;}.status-steps{margin-top: 36px;}.ident-step{font-weight: 300 !important;}.ident-step.success .bullet i:before{color: var(--textYellow);}.start-phone{font-size: 14px !important;}.phone-input{align-items: center !important;border: 1px solid var(--border) !important;border-radius: 39px;}.phone-input input{border: none !important;padding-left: 10px !important;border-bottom-left-radius: 0;border-top-left-radius: 0;}.value-flag{margin: 8px 4px 0 16px !important;}.calling-code{padding: 0px 5px 0 !important;}.uppercase{text-transform: capitalize !important;}.spinner-container{background-color: var(--bgGrey)}.line-form .line-form-item>span{background-color: var(--bgYellow);border: none;padding: 0;height: 49px;line-height: 49px;font-weight: 600 !important;font-size: 14px; text-transform: uppercase;border-radius: 0 30px 30px 0;color: var(--textDark) !important;min-width: 80px;text-align: center;}.error-message{margin-top: 12px;border-radius: 8px;background-color: #ffffffd6 !important;}.error-message .message-content p{font-size: 14px !important;color: var(--textBlack) !important;} .checkbox .checkmark:after{border-color: var(--bgYellow)}.checkbox .checkmark{border-width: 1px;}.error-message .message-title{text-transform: capitalize !important;color: var(--textBlack) !important;}.error-message .fa-icon{width: 20px;height: 20px;}button.continue{background-color:var(--bgYellow) !important;height: 57px;border-radius: 40px;box-shadow: none !important;font-size: 14px;min-width: 300px !important;border: 0 !important;color: var(--textDark) !important;}.error-message .close-icon{right: 16px;color: var(--textBlack)}.upload-item h4{position: relative;width: auto;font-weight: 500;}.upload-item h4.requiredDoc:after{position: absolute;right: -10px;}.checkbox{padding-left: 50px;}.ss-icon{color: var(--textWhite30)}.step:first-child .title{text-align: center}.step:first-child .bullet{left: 50%;transform: translateX(-50%);}.step:first-child .line{left: 50%;}.step.pending .bullet{background-image:linear-gradient(90deg,transparent 50%,var(--bgYellow) 0),linear-gradient(270deg,var(--bgYellow) 50%,transparent 0);}.step.active .bullet:before{background-color: var(--bgYellow) !important;}.applicant-step .icon.yellow .fa-icon,.applicant-step .icon.yellow .ss-icon,.applicant-step .icon .fa-icon,.applicant-step .icon .ss-icon{color: var(--textWhite30) !important;}.applicant-step .icon.yellow .suffix-icon{background: var(--textWhite30) !important;stroke: #58585d;}.mobile-tabs .tab.active{color: #fff !important;border-bottom: 2px solid #fff !important;}.tab-content{background-color: #243540 !important;border:none !important} @media(max-width: 575px){section.content{margin: 15px;padding: 15px;}.steps-wizard-mobile h2{font-size: 24px;color: var(--textWhite30);font-weight: 300;text-transform: capitalize;}.steps.mobile .step.active, .steps.mobile .step.success{background-color: var(--bgYellow);}.phone-input>inputphone{height: 49px;border-radius: 39px;background-color: transparent;border: 1px solid var(--border);box-shadow: none;width: 1183px;padding-left: 15px;}.landing p{text-align:left;}}@media(min-width: 576px){.steps{width: 75%;margin: auto;}}"
                }
            }).build()
            
        snsWebSdkInstance.launch('#sumsub-websdk-container')
        })
    }
    
    render() {
        return (
            <>
                <div id="sumsub-websdk-container"></div>
            </>
        );
    }
}

const connectStateToProps = ({ userConfig }) => {
    return { userConfig: userConfig.userProfileInfo }
}
const connectDispatchToProps = dispatch => {
    return {
        userInformation: (info) => {
            dispatch(userInfo(info))
        },
        getmemeberInfoa:(useremail)=>{
            dispatch(getmemeberInfo(useremail));
        }
    }
}

export default connect(connectStateToProps, connectDispatchToProps)(SumSub);