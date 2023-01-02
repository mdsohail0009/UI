import React, { Component } from 'react';
import snsWebSdk from '@sumsub/websdk';
import apicalls from '../../api/apiCalls';
import { connect } from 'react-redux';
import { userInfo, getmemeberInfo } from '../../reducers/configReduser';
import { withRouter } from 'react-router-dom';
import success from '../../assets/images/success.svg';
import AccountStatus from '../../utils/account.status';
import { checkCustomerState } from '../../utils/service';

class SumSub extends Component {
    state = { loading: true, sumSubConfirm: false, isAccountApproved: checkCustomerState(this.props.userConfig) }
    componentDidMount() {
        if (this.props.userConfig.isKYC && this.state.isAccountApproved) {
            this.props.history.push("/cockpit")
        } else {
            if (!this.props.userConfig?.isKYC) {
                this.launchWebSdk();
            } else {
                this.setState({ ...this.state, loading: false })
            }
        }


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
                        customCssStr: ":root {--bgYellow: #FFDB1A;--textWhite: #FFFFFF;--textWhite30: #FAFCFE;--bgGloom: #243540;--bgGrey: #515A64;--grey-darker: #B2B2B2;--border: #9797AA;--textDark: #0E0E2C;--textYellow: #FFDB1A;--bgDark: #0E0E2C;--textBlack: #000000;--textRed: #FF2400;--drawerList:rgba(255, 255, 255, 0.1);--addressList:rgba(255, 255, 255, 0.1);--termsText:#CCC3FF;--inputBg:rgba(21, 21, 25,0.4); --white:#08090E;--subText: #74767D; --tableText: rgb(8, 9, 14, 0.5); --coinPrice: rgba(250, 252, 254 ,0.8);--checkText:rgba(255, 255, 255, 0.9);}body, h1, h2, h3, h4, h5, h6, a, p, div, input{font-family: 'Lato', sans-serif !important;}a.payment-method-add .icon{background: #243540;}a, a:hover, a:focus{color: var(--termsText) !important;}p, .error-message-popup .message-content{color: var(--textWhite30) !important;font-size: 14px !important;font-weight: 200;line-height: 24px;}body{background-color: transparent !important;}.fields-list-two-columns .phone-input .success-icon, .fields-list-two-columns .phone-input .invalid-icon{right: 8px !important;top: 13px !important;}section {margin: 30px 15px;}input {color: var(--textWhite30);.language-selector{width: 80px;text-align: right;};font-weight: 600;outline: none;padding: 0 16px;}section.content{background: var(--drawerList);color: var(--black);}.desc h4{font-size:16px;font-weight: 500 !important;}.content div .row:first-child{margin-top:0 !important}.content div .row:first-child .round-icon{margin-top:32px}.desc p{font-size:14px}h1, h2, .desc h4, .mobile-tabs .tab.active .ss-icon, .mobile-tabs .tab, .mobile-tabs .tab .fa-icon, .mobile-tabs .tab .ss-icon, .tab-content h5, .or h4, .input-field .calling-code, .show-hide{color: #FFFFFF !important;}box-shadow: none;border-radius: 30px;}button.submit{width: 300px !important;}h2{font-size: 28px !important;font-weight: 200;}.or h4{margin-bottom: 15px;}button.submit, button.blue{text-transform: uppercase;border-radius: 5px;height: 46px;font-size: 16px;font-weight: 600;background-image: none !important;background-color: #3653E4 ;box-shadow: none !important;color: # #FFFFFF !important;width: 100% !important;transform: none !important;}.stack button.submit{min-width: 100px !important;}button.submit span, button.alt-back .ss-icon, button .arrow{display: none;}.round-icon {background-color: var(--bgGloom) !important;background-image: none !important;}.input-field input, select, textarea{height: 50px !important;border-radius: 5px;color: #ffffff !important;background: var( --inputBg);box-shadow: none !important;padding: 0 16px !important;font-size: 16px;border: 1px solid var(--subText);text-align: left;}select option{color:#243540 !important;}.required, .input-field span{color: var(--textRed) !important;box-shadow: none !important;font-weight:600}.input-field h3{font-size: 14px !important;margin-bottom: 4px;font-weight: 500;color: var(--textWhite30);text-transform: capitalize !important;}.country-selector .country{height: 50px;border-radius: 5px;background-color: var( --inputBg);border: 1px solid var(--subText);}.country-selector .value-flag{top: 20px;left: 18px;}.country.filled{padding-left: 45px !important;}input,input::placeholder{font-size: 16px;color: var(--textWhite30) !important;font-weight: 300;}.country-selector .current-value{top: 17px;right: 40px;color: var(--textWhite30) !important;line-height: 16px;}.country-selector .show-hide{top: 16px;right: 20px;color: var(--textWhite30)}h2.desktop p, .markdown-instructions h2, .tutorial-title p, h2.desktop{text-transform: capitalize;font-size: 36px !important;font-weight: 200;margin-bottom: 30px;color: var(--textWhite)!important;line-height: 42px;} .row h3{color: #ffffff99;font-size: 14px;margin-top:10px;font-weight: 400;}.checkbox, .radio-item{color: var(--textWhite30);}.radio-item .checkmark:after{background-color: var(--bgYellow);}.markdown-instructions ul li, .requiredDoc, .sumsub-logo, .mobile-button .fa-icon{color: var(--textWhite)}.upload-item .drag-drop, .upload-payment-item .upload-item,.country-selector .value-flag{top: 10px;left: 4px;box-shadow: none !important;}.upload-payment-item .upload-item{top: -10px;left: 0;}button.submit.disabled, button.submit.disabled:active{background-color: #7087FF;border: 1px solid #7087FF; color: #FFFFFF;}.beneficial-buttons a{margin-bottom: 15px;}.mobile-button, .mobile-button:hover, .upload, .upload-item .drag-drop{background-color: #3c3c42;box-shadow: none;}.upload-payment-item .upload-item{background-color:#3c3c42 !important;}.upload, .mobile-button{border-radius: 10px;margin-top: 30px;} .mobile-button h3{text-transform: capitalize !important;font-weight: 600;font-size: 16px; color: #ffffff;}.checkbox .checkmark{width: 30px; height: 30px;top: 4px;border: 2px solid var(--border); border-radius:5px;}}.invalid-icon .ss-icon, .success-icon .ss-icon{margin-top: 10px;margin-right: 5px;}.checkbox input:checked~.checkmark{background-color: #7087FF;border-color: transparent;}.step.active .title, .step .title, .ident-steps .ident-step{color: var(--textWhite)}.step.active .bullet{box-shadow: none;background-color: #3653E4 !important;}.step .bullet{border-color: var(--drawerList) !important}.overlay-container .spinner-container{background: transparent;}.step.active .line, .step.success .line, .step .bullet, .step .line{background-color: #3653E4 !important}.country-selector svg{border: solid #fff;border-width: 0 2px 2px 0;display: inline-block;padding: 3px;transform: rotate(45deg);-webkit-transform: rotate(45deg);height: 0;width: 0;position: absolute;top: 4px;right: 0;}.country-selector .show-hide.open svg{border: solid #fff;border-width: 0 2px 2px 0;display: inline-block;padding: 3px; transform: rotate(227deg);-webkit-transform: rotate(227deg);height: 0;width: 0;position: absolute;top: 6px;right: 0;}.country-selector .show-hide{color:transparent !important} .country-selector .list{background-color: #4e505a;border: none;color:#ffffffe6;}.select-placeholder{top: 15px;left: 15px;}.country-selector .list li{padding: 12px 10px;color: var(--textWhite)}.country-selector .list li i{margin-right: 12px}.country-selector .list li.active,.country-selector .list li:hover{background-color: #ffffff26;}* { scrollbar-width: thin; scrollbar-color: var(--bgGrey) var(--bgDarkGrey);}*::-webkit-scrollbar { width: 12px;height: 10px;}*::-webkit-scrollbar-thumb {background-color: var(--bgDark);border-radius: 20px;}.error-message-popup .popup{background-color: #3c3c42;}.alt-back, .back{color: var(--textWhite30);font-size: 16px;font-weight: 600;text-transform: capitalize !important;height: 46px;background-color: transparent;box-shadow: none !important; border:1px solid #ffffff;width:100%; border-radius:5px;margin-bottom:20px;}button:hover{transform: none !important;}.loader-overlay{background-color: var(--bgGrey);}.line-form-item input{margin-top: 0 !important;border: 1px solid var(--border);height: 49px;border-radius: 30px 0 0 30px;border-right: 0;}.center, .center p{margin: 0;}.ident-steps .ident-step .bullet{background: transparent;border: none;top: 3px;}.status-steps{margin-top: 36px;}.ident-step{font-weight: 300 !important;}.ident-step.success .bullet i:before{color: #3653E4;}.start-phone{font-size: 14px !important;}.phone-input{align-items: center !important;border: 1px solid var(--subText) !important;border-radius: 5px;background: var( --inputBg) !important;}.phone-input input{border: none !important;border-bottom-left-radius: 0;border-top-left-radius: 0;}.calling-code{padding: 0px 5px 0 !important;}.uppercase{text-transform: capitalize !important;}.spinner-container{background-color: var(--bgGrey)}.status-text, .kyb-button.text-button:active{color:#fff !important}.line-form .line-form-item>span{padding: 14px 10px;background-color: #3653E4;border: none;font-weight: 600 !important;font-size: 14px; text-transform: uppercase;border-radius: 0 30px 30px 0;color: #ffffff!important;min-width: 100px;text-align: center;}.error-message{margin-top: 12px;border-radius: 8px;background-color: var(--drawerList) !important;}.error-message .message-content p{font-size: 14px !important;color: var(--textBlack) !important;}i.checkmark::after{background:#7087FF !important;}.checkbox .checkmark{border-width: 1px;}.error-message .message-title{text-transform: capitalize !important;color: var(--textBlack) !important;}.error-message .fa-icon{width: 20px;height: 20px;}.error-message .message-icon .fa-icon{width: 10px;height: 10px;}.payment-method .checkbox-text span{    margin-top: 10px;font-weight: 600}.payment-method-data h2, .payment-method-data p{color:#243540 !important}.payment-method-data h2{text-transform: capitalize;}button.continue{background-color:#3653E4!important;height: 46px;border-radius: 5px;box-shadow: none !important;font-size: 16px;width: 100% !important;border: 0 !important;color:     #ffffff !important; font-weight: 600;}.error-message .close-icon{right: 16px;color: var(--textBlack)}.upload-item h4{position: relative;width: auto;font-weight: 500;}.upload-item h4.requiredDoc:after{position: absolute;right: -10px;}.checkbox{padding-left: 50px;}.ss-icon{color: var(--textWhite30)}.step:first-child .title{text-align: center}.step:first-child .bullet{left: 50%;transform: translateX(-50%);}.step:first-child .line{left: 50%;}.step.pending .bullet{}.sub-steps .sub-step{border: 1px solid rgb(255 255 255 / 50%);}ul li, h3, h4{color: #ffffff;}h4{font-weight: 600 !important;}.fields-list ul li{color:#243540;}.doctype-selector select{color: var(--primary-color);}.sub-steps .sub-step.active{box-shadow: inset 0 0 1px 1px #3653E4;background-color:#3653E4;border: 1px solid #3653E4;}.checkbox .checkmark:after{left: 11px;top: 2px;width: 10px;height: 18px;}.step.active .bullet:before{background-color: #ffffff !important;}.upload-item a.cancel{color: #243540;}.upload-item .doctype-selector button:disabled i.upload-icon{color: #243540;font-size: 16px;}.payment-method .checkbox{padding-top: 12px;}.applicant-step .icon.yellow .fa-icon,.applicant-step .icon.yellow .ss-icon,.applicant-step .icon .fa-icon,.applicant-step .icon .ss-icon{color: var(--textWhite30) !important;}.applicant-step .icon.yellow .suffix-icon{background: var(--textWhite30) !important;stroke: #58585d;}.mobile-tabs .tab.active{color: #fff !important;border-bottom: 2px solid #fff !important;}.tab-content{background-color: rgba(255, 255, 255, 0.1) !important;border:none !important}.welcome-input, .welcome-input .phone{background: var( --inputBg);color: #41495b !important;height:50px;}.welcome-input input{background: transparent !important;box-shadow: unset !important;    color: #41495b !important;}.line-form input{background: transparent !important;box-shadow: unset !important;height: 48px !important;}.email-input input, .confirm-code input{background: transparent !important;} .line-form .phone-input .success-icon{top: 16px;right: 14px;}.line-form .line-form-item>.phone-input, .line-form .line-form-item>input{margin-top: 0;margin-right: 10px;}.accent{color:#ffdb1a !important}.questionnaire-step select{background-position: right 19px top 21px !important;}.questionnaire-step{color:#fff !important}.send-sms-button{color: #CCC3FF !important;}.sub-steps .sub-step.pending{box-shadow: inset 0 0 1px 1px #ffffff;background-color: #ffffff;border: 1px solid #ffffff;}select {-webkit-appearance: none;-moz-appearance: window;border: none;background-image: url(https://prduximagestorage.blob.core.windows.net/suissebaseimages/white-down.png);background-repeat: no-repeat;background-position: 264px;background-size: 12px;cursor: pointer;}select:focus {-webkit-appearance: none;-moz-appearance: window;border: none;background-image: url(https://prduximagestorage.blob.core.windows.net/suissebaseimages/white-up.png);background-repeat: no-repeat;background-position: 264px;background-size: 12px;cursor: pointer;}.doctype-selector select {-webkit-appearance: none;-moz-appearance: window;border: none;background-image: url(https://cdn1.iconfinder.com/data/icons/cc_mono_icon_set/blacks/16x16/br_down.png);background-repeat: no-repeat;background-position: 264px;background-size: 12px;cursor: pointer;}.doctype-selector select:focus {-webkit-appearance: none;-moz-appearance: window;border: none;background-image: url(https://prduximagestorage.blob.core.windows.net/suissebaseimages/up.png);background-repeat: no-repeat;background-position: 264px;background-size: 12px;cursor: pointer;}box-shadow: none;width: 1183px;padding-left: 15px;} @media(max-width: 575px){section.content{margin: 15px;padding: 15px;}.steps-wizard-mobile h2{font-size: 24px;color: var(--textWhite30);font-weight: 300;text-transform: capitalize;}.steps.mobile .step.active, .steps.mobile .step.success{background-color: var(--bgYellow);}.phone-input>inputphone{height: 49px;border-radius: 39px;background-color: transparent;border: 1px solid var(--border)}.landing p{text-align:left;}}@media(min-width: 576px){.kyb-button{margin-top: 0px !important;}section{margin: 40px auto;}.steps{width: 75%;margin: auto;}}.liveness-step .direction-row{flex-direction: column !important;align-items: center;}.liveness-step .direction-row button.alt-back{margin-right: 0;}.line-form-item input{margin-right: 0 !important}.phone-input .success-icon[data-v-e3e6b47c], .phone-input .invalid-icon[data-v-e3e6b47c]{right: 10px; top: 14px;}select, select:focus{background-position: 95%}.identity-item{background: var(--drawerList) !important;}.identity-item-button.disabled{background: var(--bgYellow);color: var(--textBlack);border: none;text-transform: uppercase;}.identity-item-text-button{background: transparent;color: var(--textWhite) !important;}.dropdown-content{background: var(--bgGloom);}.lang-dropdown-button .fa-icon{margin-left: 5px;color: var(--textWhite) !important;}.dropdown-content ul li{color: var(--textWhite) !important;}.dropdown-content ul li:hover{background: var(--bgDarkGrey) !important}.input-field{margin-bottom: 15px !important;}.payment-method-data{background-color: transparent;padding: 0;}.payment-method-data h2, .payment-method-data p, .subitem-text, .actions-list .action-item{color: var(--textWhite) !important;}.review-data h2, .company-status h2.title{margin-top: 15px;}.company-status h2.title, .company-status ul li h2{text-transform: capitalize !important;font-weight: 300 !important;line-height: normal !important;}.kyb-button{color: var(--termsText) !important;margin-top: 15px;}.actions .content{background: #3C3C42 !important;;padding: 15px !important;border-radius: 12px !important;}.element-wrapper[data-v-6a2df10a], .subline[data-v-6a2df10a]{border-color: var(--border);}.[data-v-f77310b2] .ml-2{margin-left: 0;} .checkmark:hover{ background: #000000;border: 2px solid var(--termsText);}.upload-item h4{font-size:16px; font-weight: 600 !important;}button+button{margin-left:0 !important;}button{letter-spacing:0px}.stack.controls .spacer{width:100%;}.alt-back, .back{justify-content:center;}.stack.direction-column{width:100%}.stack.direction-column .start-phone{color: var(--termsText) !important; text-transform:capitalize;font-weight:700;text-decoration:none}ul,li{color: var(--subText);}a:hover{border:none}.review-data .uppercase{letter-spacing:0;font-size:18px !important;font-weight:700 !important; color:#ffffff;}.center.status-pending-title p:first-child{font-size:26px !important; font-weight:800;}h4 p:nth-child(2){margin-top:15px !important;color: var(--coinPrice) !important;}.center p{color:var(--coinPrice) !important;}.step.pending .bullet{background:none;}.steps.mobile .step.pending{background:#ffffff !important;}.steps.mobile .step.success{background:#3653E4 !important;}.identity-item-button, .identity-item-button.white{background-color: #3653E4;color:#ffffff;font-size:16;font-weight:600;}button:hover:not(:disabled):not(.disabled):not(:active){box-shadow:none;}.beneficial-buttons a:hover{border:none}.beneficial-buttons a{font-size:14px;font-weight:700; margin-top:10px;}.beneficial-buttons .submit{margin-bottom:10px}button:active:not(:disabled):not(.disabled){box-shadow:none;}.select-dropdown .show-hide{position: absolute;right: 10px;top: 18px;}.fields-list .item-desc-wrapper div{color: var(--subText);font-weight: 400;font-size: 14px;text-transform: capitalize;}.status-text.subline{font-weight: 700 !important;font-size: 18px !important;color: var(--checkText) !important;border-bottom:none;}.element-wrapper{background: var(--drawerList) !important;border:none !important;border-radius:20px;}.status-text.m.bold{font-size:16px !important;}.m-0.mt-2.mb-2.status-text.m.bold{font-size: 18px !important;}.company-status .title{font-size:36px !important; font-weight:800 !important;}.create-applicant-content .checkbox p:not(:second-child){margin-top:7px !important;}.create-applicant-content .checkbox{margin:10px 0;}.checkbox input:focus~.checkmark{border-color:#ccc3ff !important;}.country-list ul .country-item{color:#ffffffe6 !important;}.upload-item .remove{background-color: #3653E4; color:#ffffff !important;}.calling-code{color:#ffffff !important;font-weight:500 !important;font-size:16px !important;}.welcome-input.phone-input>input[data-v-7350abeb]{background:transparent !important; color:#ffffff !important; font-size:16px;font-weight:500;}.success-icon{top:14px !important;}.phone-form div:nth-child(2){margin-top:5px;}.line-form .phone-input{padding-left:10px;}.line-form .value-flag{margin: 3px 4px 0 4px;}.line-form .phone-input .calling-code{padding-top:2px !important;}button.submit:hover,button.submit:active,button.submit:active,button.continue:hover,button.continue:focus,button.continue:active,button.blue:hover,button.blue:active,button.blue:focus{background-color: #7087FF; color: #FFFFFF; border-color: #7087FF;}.desktop-country-select-wrapper .value-flag.flag{top:20px;left:14px;}.error-message-popup .overlay{background:transparent;}.upload-item .remove:hover{background-color: #7087FF;}.fields-list-two-columns .phone-input{padding-left:10px;}.fields-list-two-columns .value-flag,.fields-list-two-columns .show-hide{margin-top:2px;}.fields-list-two-columns .phone{pading-left:0;}#loader .message-content{font-size:12px;}"
   
   
                    }
                }).onMessage((type, payload) => {
                    if (type === 'idCheck.onResize') {
                        window.scrollTo(0, 0)
                    }
                    if (type === 'idCheck.applicantStatus' && payload.reviewStatus === "completed") {
                        this.setState({ sumSubConfirm: true })
                        apicalls.updateKyc(this.props.userConfig.userId).then((res) => {
                            this.props.getmemeberInfoa(this.props.user.profile.sub);
                            this.setState({ sumSubConfirm: this.state.isAccountApproved });
                            if (this.state.isAccountApproved) { this.props.history.push("/cockpit"); }

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
                {!this.state.loading && this.props?.userConfig?.isKYC && !this.state.isAccountApproved && <AccountStatus />}
                {(this.state.sumSubConfirm === true) ? <>({sumSubConfirms})</> : (<div id="sumsub-websdk-container"></div>)}
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