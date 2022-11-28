import React, { Component } from 'react';
import snsWebSdk from '@sumsub/websdk';
import apicalls from '../../api/apiCalls';
import { connect } from 'react-redux';
import { userInfo, getmemeberInfo } from '../../reducers/configReduser';
import { withRouter } from 'react-router-dom';
import success from '../../assets/images/success.png';
import AccountStatus from '../../utils/account.status';

class SumSub extends Component {
    state = { loading: true, sumSubConfirm: false }
    componentDidMount() {
        if (this.props.userConfig.isKYC && this.props.customerState === "Approved") {
            this.props.history.push("/cockpit")
        }
        this.launchWebSdk();

    }
    launchWebSdk = async () => {
        apicalls.sumsubacesstoken(this.props.userConfig.userId, this.props.userConfig.isBusiness ? "SuisseBase_KYB_Flow" : "SuisseBase_KYC_Flow").then((res) => {
            let snsWebSdkInstance = snsWebSdk.init(
                res.data.token,
                () => res.data.token
            )
                .withConf({
                    lang: "en",
                    email: this.props.userConfig.email,
                    phone: this.props.userConfig.phoneNo, // if available
                    onError: (error) => {
                        console.log('WebSDK onError', error)
                    },
                    uiConf: {
                        customCssStr: ":root {--bgYellow: #FFDB1A;--textWhite: #FFFFFF;--textWhite30: #FAFCFE;--bgGloom: #243540;--bgGrey: #515A64;--grey-darker: #B2B2B2;--border: #9797AA;--textDark: #0E0E2C;--textYellow: #FFDB1A;--bgDark: #0E0E2C;--textBlack: #000000;--textRed: #FF2400;}a.payment-method-add .icon{background: #243540;}a, a:hover, a:focus{color: var(--textYellow) !important;}p, .error-message-popup .message-content{color: var(--textWhite30) !important;font-size: 14px !important;font-weight: 200;line-height: 24px;}body{background-color: transparent !important;}.fields-list-two-columns .phone-input .success-icon, .fields-list-two-columns .phone-input .invalid-icon{right: 8px !important;top: 13px !important;}section {margin: 30px 15px;}input {color: var(--textWhite30);.language-selector{width: 80px;text-align: right;};font-weight: 600;outline: none;padding: 0 16px;}section.content{background: var(--bgGrey);color: var(--black);}.desc h4{font-size:16px;font-weight: 500 !important;}.content div .row:first-child{margin-top:0 !important}.content div .row:first-child .round-icon{margin-top:32px}.desc p{font-size:14px}h1, h2, .desc h4, .mobile-tabs .tab.active .ss-icon, .mobile-tabs .tab, .mobile-tabs .tab .fa-icon, .mobile-tabs .tab .ss-icon, .tab-content h5, .or h4, .input-field .calling-code, .show-hide{color: #FFFFFF !important;}box-shadow: none;border-radius: 30px;}button.submit{width: 300px !important;}h2{font-size: 28px !important;font-weight: 200;}.or h4{margin-bottom: 15px;}button.submit, button.blue{text-transform: uppercase;border-radius: 40px;height: 57px;font-size: 14px;font-weight: 500;background-image: none !important;background-color: var(--bgYellow);box-shadow: none !important;color: var(--textDark) !important;min-width: 300px !important;font-weight: 700 !important;transform: none !important;}.stack button.submit{min-width: 100px !important;}button.submit span, button.alt-back .ss-icon, button .arrow{display: none;}.round-icon {background-color: var(--bgGloom) !important;background-image: none !important;}.input-field input, select, textarea{height: 49px !important;border-radius: 39px;color:#fff;background-color: transparent;border: 1px solid var(--border) !important;box-shadow: none !important;padding: 0 16px !important;}select option{color:#243540 !important}.required, .input-field span{color: var(--textRed) !important;box-shadow: none !important;font-weight:600}.input-field h3{font-size: 12px !important;margin-bottom: 8px;font-weight: 500;color: var(--textWhite30);text-transform: capitalize !important;margin-left: 12px;}.country-selector .country{height: 49px;border-radius: 39px;background-color: transparent;border: 1px solid var(--border);}.country-selector .value-flag{top: 20px;left: 18px;}.country.filled{padding-left: 45px !important;}input,input::placeholder{font-size: 16px;color: var(--textWhite30) !important;font-weight: 300;}.country-selector .current-value{top: 17px;right: 40px;color: var(--textWhite30) !important;line-height: 16px;}.country-selector .show-hide{top: 16px;right: 20px;color: var(--textWhite30)}h2.desktop p, .markdown-instructions h2, .tutorial-title p, h2.desktop{text-transform: capitalize;font-size: 36px !important;font-weight: 200;margin-bottom: 30px;color: var(--textWhite)!important;line-height: 42px;} .row h3{color: var(--textWhite);font-size: 16px;margin-top:10px;font-weight: 600;}.checkbox, .radio-item{color: var(--textWhite30);}.radio-item .checkmark:after{background-color: var(--bgYellow);}.markdown-instructions ul li, .requiredDoc, .sumsub-logo, .mobile-button .fa-icon{color: var(--textWhite)}.upload-item .drag-drop, .upload-payment-item .upload-item,.country-selector .value-flag{top: 10px;left: 4px;box-shadow: none !important;}.upload-payment-item .upload-item{top: 2px;left: 0;}button.submit.disabled, button.submit.disabled:active{background: #9797AA;border: 1px solid #9797AA;}.beneficial-buttons a{margin-bottom: 15px;}.mobile-button, .mobile-button:hover, .upload, .upload-item .drag-drop{background-color: var(--bgGloom);box-shadow: none;}.upload-payment-item .upload-item{background-color: var(--bgGloom) !important;}.upload, .mobile-button{border-radius: 16px;margin-top: 30px;} .mobile-button h3{text-transform: capitalize !important;font-weight: 500;}.checkbox .checkmark{width: 30px; height: 30px;top: 4px;border: 2px solid var(--border);}}.invalid-icon .ss-icon, .success-icon .ss-icon{margin-top: 10px;margin-right: 5px;}.checkbox input:checked~.checkmark{background-color: transparent;border-color: transparent;}.step.active .title, .step .title, .ident-steps .ident-step{color: var(--textWhite)}.step.active .bullet{box-shadow: none;background-color: var(--bgDark)!important;}.step .bullet{border-color: var(--bgDark) !important}.overlay-container .spinner-container{background: transparent;}.step.active .line, .step.success .line, .step .bullet, .step .line{background-color: var(--bgDark) !important}.country-selector svg{border: solid #fff;border-width: 0 2px 2px 0;display: inline-block;padding: 3px;transform: rotate(45deg);-webkit-transform: rotate(45deg);height: 0;width: 0;position: absolute;top: 4px;right: 0;}.country-selector .show-hide.open svg{border: solid #fff;border-width: 0 2px 2px 0;display: inline-block;padding: 3px; transform: rotate(227deg);-webkit-transform: rotate(227deg);height: 0;width: 0;position: absolute;top: 6px;right: 0;}.country-selector .show-hide{color:transparent !important} .country-selector .list{background-color: var(--bgGloom);border: none;box-shadow: 0 5px 20px rgba(0,0,0,0.25)}.select-placeholder{top: 15px;left: 15px;}.country-selector .list li{padding: 12px 10px;color: var(--textWhite)}.country-selector .list li i{margin-right: 12px}.country-selector .list li.active,.country-selector .list li:hover{background-color: var(--bgGrey);}* { scrollbar-width: thin; scrollbar-color: var(--bgGrey) var(--bgDarkGrey);}*::-webkit-scrollbar { width: 12px;height: 10px;}*::-webkit-scrollbar-thumb {background-color: var(--bgDark);border-radius: 20px;}.error-message-popup .popup{background-color: var(--bgGrey);}.alt-back, .back{color: var(--textWhite30);font-size: 16px;font-weight: 200;text-transform: capitalize !important;height: 56px;background-color: transparent;box-shadow: none !important;}button:hover{transform: none !important;}.loader-overlay{background-color: var(--bgGrey);}.line-form-item input{margin-top: 0 !important;border: 1px solid var(--border);height: 49px;border-radius: 30px 0 0 30px;border-right: 0;}.step.success .bullet{background-color: var(--bgYellow) !important;border-color: var(--bgYellow) !important;}.step.success .line{background-color: var(--bgYellow) !important}.center, .center p{margin: 0;}.ident-steps .ident-step .bullet{background: transparent;border: none;top: 3px;}.status-steps{margin-top: 36px;}.ident-step{font-weight: 300 !important;}.ident-step.success .bullet i:before{color: var(--textYellow);}.start-phone{font-size: 14px !important;}.phone-input{align-items: center !important;border: 1px solid var(--border) !important;border-radius: 39px;}.phone-input input{border: none !important;padding-left: 10px !important;border-bottom-left-radius: 0;border-top-left-radius: 0;}.value-flag{margin: 8px 4px 0 16px !important;}.calling-code{padding: 0px 5px 0 !important;}.uppercase{text-transform: capitalize !important;}.spinner-container{background-color: var(--bgGrey)}.status-text, .kyb-button.text-button:active{color:#fff !important}.line-form .line-form-item>span{padding: 15px 10px;background-color: var(--bgYellow);border: none;font-weight: 600 !important;font-size: 14px; text-transform: uppercase;border-radius: 0 30px 30px 0;color: var(--textDark) !important;min-width: 100px;text-align: center;}.error-message{margin-top: 12px;border-radius: 8px;background-color: #ffffffd6 !important;}.error-message .message-content p{font-size: 14px !important;color: var(--textBlack) !important;} .checkbox .checkmark:after{border-color: var(--bgYellow)}.checkbox .checkmark{border-width: 1px;}.error-message .message-title{text-transform: capitalize !important;color: var(--textBlack) !important;}.error-message .fa-icon{width: 20px;height: 20px;}.error-message .message-icon .fa-icon{width: 10px;height: 10px;}.payment-method .checkbox-text span{    margin-top: 10px;font-weight: 600}.payment-method-data h2, .payment-method-data p{color:#243540 !important}.payment-method-data h2{text-transform: capitalize;}button.continue{background-color:var(--bgYellow) !important;height: 57px;border-radius: 40px;box-shadow: none !important;font-size: 14px;min-width: 300px !important;border: 0 !important;color: var(--textDark) !important;}.error-message .close-icon{right: 16px;color: var(--textBlack)}.upload-item h4{position: relative;width: auto;font-weight: 500;}.upload-item h4.requiredDoc:after{position: absolute;right: -10px;}.checkbox{padding-left: 50px;}.ss-icon{color: var(--textWhite30)}.step:first-child .title{text-align: center}.step:first-child .bullet{left: 50%;transform: translateX(-50%);}.step:first-child .line{left: 50%;}.step.pending .bullet{background-image:linear-gradient(90deg,transparent 50%,var(--bgYellow) 0),linear-gradient(270deg,var(--bgYellow) 50%,transparent 0);}.sub-steps .sub-step{border: 1px solid rgb(255 255 255 / 50%);}ul li, h3, h4{color: #ffffff;}h4{font-weight: 600 !important;}.fields-list ul li{color:#243540;}.doctype-selector select{color: var(--primary-color);}.sub-steps .sub-step.active{box-shadow: inset 0 0 1px 1px yellow;background-color: yellow;border: 1px solid yellow;}.checkbox .checkmark:after{left: 11px;top: 2px;width: 10px;height: 18px;}.step.active .bullet:before{background-color: var(--bgYellow) !important;}.upload-item a.cancel{color: #243540;}.upload-item .doctype-selector button:disabled i.upload-icon{color: #243540;font-size: 16px;}.payment-method .checkbox{padding-top: 12px;}.applicant-step .icon.yellow .fa-icon,.applicant-step .icon.yellow .ss-icon,.applicant-step .icon .fa-icon,.applicant-step .icon .ss-icon{color: var(--textWhite30) !important;}.applicant-step .icon.yellow .suffix-icon{background: var(--textWhite30) !important;stroke: #58585d;}.mobile-tabs .tab.active{color: #fff !important;border-bottom: 2px solid #fff !important;}.tab-content{background-color: #243540 !important;border:none !important}.welcome-input, .welcome-input .phone{background: transparent !important;    color: #41495b !important;}.welcome-input input{background: transparent !important;box-shadow: unset !important;    color: #41495b !important;}.line-form input{background: transparent !important;box-shadow: unset !important;height: 48px !important;}.email-input input, .confirm-code input{background: transparent !important;} .line-form .phone-input .success-icon{top: 16px;right: 14px;}.line-form .line-form-item>.phone-input, .line-form .line-form-item>input{margin-top: 0;margin-right: 10px;}.accent{color:#ffdb1a !important}.questionnaire-step select{background-position: right 19px top 21px !important;}.questionnaire-step{color:#fff !important}.send-sms-button{color: #ffdb1a !important;}.sub-steps .sub-step.pending{box-shadow: inset 0 0 1px 1px var(--orange-color);background-color: var(--orange-color);border: 1px solid var(--orange-color);}select {-webkit-appearance: none;-moz-appearance: window;border: none;background-image: url(https://prduximagestorage.blob.core.windows.net/suissebaseimages/white-down.png);background-repeat: no-repeat;background-position: 264px;background-size: 12px;cursor: pointer;}select:focus {-webkit-appearance: none;-moz-appearance: window;border: none;background-image: url(https://prduximagestorage.blob.core.windows.net/suissebaseimages/white-up.png);background-repeat: no-repeat;background-position: 264px;background-size: 12px;cursor: pointer;}.doctype-selector select {-webkit-appearance: none;-moz-appearance: window;border: none;background-image: url(https://cdn1.iconfinder.com/data/icons/cc_mono_icon_set/blacks/16x16/br_down.png);background-repeat: no-repeat;background-position: 264px;background-size: 12px;cursor: pointer;}.doctype-selector select:focus {-webkit-appearance: none;-moz-appearance: window;border: none;background-image: url(https://prduximagestorage.blob.core.windows.net/suissebaseimages/up.png);background-repeat: no-repeat;background-position: 264px;background-size: 12px;cursor: pointer;}box-shadow: none;width: 1183px;padding-left: 15px;} @media(max-width: 575px){section.content{margin: 15px;padding: 15px;}.steps-wizard-mobile h2{font-size: 24px;color: var(--textWhite30);font-weight: 300;text-transform: capitalize;}.steps.mobile .step.active, .steps.mobile .step.success{background-color: var(--bgYellow);}.phone-input>inputphone{height: 49px;border-radius: 39px;background-color: transparent;border: 1px solid var(--border)}.landing p{text-align:left;}}@media(min-width: 576px){.kyb-button{margin-top: 0px !important;}section{margin: 40px auto;}.steps{width: 75%;margin: auto;}}.liveness-step .direction-row{flex-direction: column !important;align-items: center;}.liveness-step .direction-row button.alt-back{margin-right: 0;}.line-form-item input{margin-right: 0 !important}.phone-input .success-icon[data-v-e3e6b47c], .phone-input .invalid-icon[data-v-e3e6b47c]{right: 10px; top: 14px;}select, select:focus{background-position: 95%}.identity-item{background: var(--bgGloom) !important;}.identity-item-button.disabled{background: var(--bgYellow);color: var(--textBlack);border: none;text-transform: uppercase;}.identity-item-text-button{background: transparent;color: var(--textWhite) !important;}.dropdown-content{background: var(--bgGloom);}.lang-dropdown-button .fa-icon{margin-left: 5px;color: var(--textWhite) !important;}.dropdown-content ul li{color: var(--textWhite) !important;}.dropdown-content ul li:hover{background: var(--bgDarkGrey) !important}.input-field{margin-bottom: 15px !important;}.payment-method-data{background-color: transparent;padding: 0;}.payment-method-data h2, .payment-method-data p, .subitem-text, .actions-list .action-item{color: var(--textWhite) !important;}.review-data h2, .company-status h2.title{margin-top: 15px;}.company-status h2.title, .company-status ul li h2{text-transform: capitalize !important;font-weight: 300 !important;line-height: normal !important;}.kyb-button{color: var(--textYellow) !important;margin-top: 15px;}.actions .content{background-color: var(--bgGloom) !important;padding: 15px !important;border-radius: 12px !important;}.element-wrapper[data-v-6a2df10a], .subline[data-v-6a2df10a]{border-color: var(--border);}.[data-v-f77310b2] .ml-2{margin-left: 0;}"
                    }
                }).onMessage((type, payload) => {
                    // console.log('onMessage', type, payload)
                    if (type === 'idCheck.onResize') {
                        window.scrollTo(0, 0)
                    }
                    if (type === 'idCheck.applicantStatus' && payload.reviewStatus === "completed") {
                        this.setState({ sumSubConfirm: true })
                        apicalls.updateKyc(this.props.userConfig.userId).then((res) => {
                            this.props.getmemeberInfoa(this.props.user.profile.sub)
                            this.props.history.push("/cockpit")
                        })
                    }

                }).build()
            snsWebSdkInstance.launch('#sumsub-websdk-container')
            this.setState({ loading: false })
        })
    }

    render() {
        const sumSubConfirms = <div className='sumSub-confirm text-white text-center'><img src={success} className="confirm-icon" alt={"success"} /><br />
            <span className='sumSub-review'>Verification Completed,</span>
            <p className='p-0' style={{ wordBreak: 'break-all' }}>After Sumsub completed, Please refresh the page or reLogin</p></div>
        return (
            <>
                {this.state.loading && <div className="loader">Loading .....</div>}
                {(this.state.sumSubConfirm === true) ? (this.userConfig?.customerState == "Approved" ? <AccountStatus /> : <>({sumSubConfirms})</>) : (<div id="sumsub-websdk-container"></div>)}
                {/* <div id="sumsub-websdk-container"></div> */}
            </>
        );
    }
}

const connectStateToProps = ({ userConfig, oidc }) => {
    return { userConfig: userConfig.userProfileInfo, user: oidc.user }
}
const connectDispatchToProps = dispatch => {
    return {
        userInformation: (info) => {
            dispatch(userInfo(info))
        },
        getmemeberInfoa: (useremail) => {
            dispatch(getmemeberInfo(useremail));
        }
    }
}

export default connect(connectStateToProps, connectDispatchToProps)(withRouter(SumSub));