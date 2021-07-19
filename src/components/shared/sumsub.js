import React, { Component } from 'react';
import snsWebSdk from '@sumsub/websdk';
import apicalls from './../../api/apiCalls';

class SumSub extends Component {
    componentDidMount() {
        console.log('trigger')
        this.launchWebSdk('https://test-api.sumsub.com', 'basic-kyc', 'tst:N2Kvt7SOOVp1jMf7wyQy9BSO.KlnFBjZadRJWK1A0rHckzIlaHQqbRDTO');

    }
    launchWebSdk = async (apiUrl, flowName, accessToken, applicantEmail, applicantPhone, customI18nMessages) => {

        applicantEmail = "test@example.org"
        applicantPhone = "+491758764512"
        let snsWebSdkInstance = snsWebSdk.Builder("https://test-api.sumsub.com", "basic-kyc")
            .withAccessToken(accessToken, (newAccessTokenCallback) => {
                apicalls.sumsubacesstoken().then((res) => {
                    newAccessTokenCallback(res.data.token)
                })

            })
            .withConf({
                lang: "en",
                email: applicantEmail,
                phone: applicantPhone, // if available
                onMessage: (type, payload) => {
                    console.log('WebSDK onMessage', type, payload)
                },
                onError: (error) => {
                    console.log('WebSDK onError', error)
                },
                uiConf: {
                    customCssStr: ":root {--bgYellow: #FFDB1A;--textWhite: #FFFFFF;--textWhite30: #FAFCFE;--bgGloom: #243540;--bgGrey: #515A64;--grey-darker: #B2B2B2;--border: #9797AA;--textDark: #0E0E2C;--textYellow: #FFDB1A;--bgDark: #0E0E2C;}a, a:hover, a:focus{color: var(--textYellow);}p, .error-message-popup .message-content{color: var(--textWhite30) !important;font-size: 16px !important;font-weight: 200;line-height: 24px;}section {margin: 40px auto;}input {color: var(--textWhite30);font-weight: 600;outline: none;padding: 0 16px;}section.content{background: var(--bgGrey);color: var(--black);padding: 40px 40px 16px;box-shadow: none;border-radius: 30px;}button.submit, button.blue{text-transform: uppercase;border-radius: 40px;height: 57px;font-size: 14px;font-weight: 500;background-image: none !important;background-color: var(--bgYellow);box-shadow: none !important;color: var(--textDark) !important;min-width: 250px;font-weight: 700 !important;transform: none !important;}button.submit span, button.alt-back .ss-icon, button .arrow{display: none;}.round-icon {background-color: var(--bgGloom) !important;background-image: none !important;}.input-field h3{font-size: 12px !important;margin-bottom: 8px;font-weight: 500;color: var(--textWhite30);text-transform: capitalize !important;margin-left: 12px;}.country-selector .country{height: 49px;border-radius: 39px;background-color: transparent;border: 1px solid var(--border);}.country-selector .value-flag{top: 20px;left: 18px;}.country-selector .country.filled{padding-left: 45px;}input,input::placeholder{font-size: 16px;color: var(--textWhite30) !important;font-weight: 300;}.country-selector .current-value{top: 17px;right: 40px;}.country-selector .show-hide{top: 16px;right: 20px;color: var(--textWhite30)}h2.desktop p, .markdown-instructions h2, .tutorial-title p, h2.desktop{text-transform: capitalize;font-size: 36px !important;font-weight: 200;margin-bottom: 60px;color: var(--textWhite);!important} .row h3{color: var(--textWhite);font-size: 16px;text-transform: uppercase;}.checkbox, .radio-item{color: var(--textWhite30);}.radio-item .checkmark:after{background-color: var(--bgYellow);}.markdown-instructions ul li, .requiredDoc, .sumsub-logo, .mobile-button .fa-icon{color: var(--textWhite)}.upload-item .drag-drop, .upload-payment-item .upload-item, .mobile-button, .mobile-button:hover, .upload{background-color: var(--bgGloom);box-shadow: none;}.upload, .mobile-button{border-radius: 16px;} .mobile-button h3{text-transform: capitalize !important;}.checkbox .checkmark{top: 4px;}.checkbox input:checked~.checkmark{background-color: var(--bgYellow);border-color: var(--bgYellow);}.step.active .title, .step .title{color: var(--textWhite)}.step.active .bullet{box-shadow: none;background-color: var(--bgDark)!important;}.step .bullet{border-color: var(--bgDark) !important}.step.active .line, .step.success .line, .step .bullet, .step .line{background-color: var(--bgDark) !important}.country-selector .list{background-color: var(--bgGloom);border: none;box-shadow: 0 5px 20px rgba(0,0,0,0.25)}.country-selector .list li{padding: 12px 10px;color: var(--textWhite)}.country-selector .list li i{margin-right: 12px}.country-selector .list li:hover{background-color: var(--bgGrey);}* { scrollbar-width: thin; scrollbar-color: var(--bgGrey) var(--bgDarkGrey);}*::-webkit-scrollbar { width: 12px;height: 10px;}*::-webkit-scrollbar-thumb {background-color: var(--bgDark);border-radius: 20px;}.error-message-popup .popup{background-color: var(--bgGrey);}.alt-back, .back{color: var(--textWhite30);font-size: 16px;font-weight: 200;text-transform: capitalize !important;height: 56px;background-color: transparent;box-shadow: none !important;}button:hover{transform: none !important;}.loader-overlay{background-color: var(--bgGrey);}.line-form-item input{border: 1px solid var(--border);height: 49px;border-radius: 30px;}"
                }
            }).build()

        snsWebSdkInstance.launch('#sumsub-websdk-container')
    }
    render() {
        return (
            <>
                <span onClick={() => this.launchWebSdk('https://test-api.sumsub.com', 'basic-kyc', 'tst:N2Kvt7SOOVp1jMf7wyQy9BSO.KlnFBjZadRJWK1A0rHckzIlaHQqbRDTO')}>
                    Activate Lasers
                </span>

                <div id="sumsub-websdk-container"></div>
            </>
        );
    }
}

export default SumSub;