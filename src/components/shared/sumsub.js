import React, { Component } from 'react';
import snsWebSdk from '@sumsub/websdk';
import apicalls from './../../api/apiCalls';


class SumSub extends Component {
    componentDidMount() {
        console.log('trigger')
        this.launchWebSdk('https://test-api.sumsub.com', 'basic-kyc', 'tst:BeMRn4ZvgdIc4WXyfw7cA3tb');

    }

    launchWebSdk = (apiUrl, flowName, accessToken, applicantEmail, applicantPhone, customI18nMessages) => {
        console.log('trigger')
        let snsWebSdkInstance = snsWebSdk.Builder(apiUrl, flowName)
            .withAccessToken(
                accessToken,
                (newAccessTokenCallback) => {
                    // Access token expired
                    // get a new one and pass it to the callback to re-initiate the WebSDK
                    let newAccessToken = this.newAccessToken(); // get a new token from your backend
                    newAccessTokenCallback(newAccessToken)
                }
            )
            .withConf({
                lang: 'en', //languge of WebSDK texts and comments (ISO 639-1 format)
                email: 'naresh.yellowblock@gmail.com',
                phone: '+917382463951',
                i18n: { "document": { "subTitles": { "IDENTITY": "Upload a document that proves your identity" } } },
                onMessage: (type, payload) => {

                    console.log('WebSDK onMessage', type, payload)
                },
                uiConf: {
                    customCss: "https://url.com/styles.css"
                    // URL to css file in case you need change it dynamically from the code
                    // the similar setting at Applicant flow will rewrite customCss
                    // you may also use to pass string with plain styles `customCssStr:`
                },
                onError: (error) => {
                    console.error('WebSDK onError', error)
                },
            })
            .build();

        // you are ready to go:
        // just launch the WebSDK by providing the container element for it
        snsWebSdkInstance.launch('#sumsub-websdk-container')
    }
    newAccessToken=async()=>{
        let externalUserId = "naresh";
        let res=await apicalls.sumsubacesstoken();
        return {
            "token": "_act-b8ebfb63-5f24-4b89-9c08-5bbabeec986e",
            "userId": "JamesBond007"
          };
    }
    render() {
        return (
            <>
                <span onClick={() => this.launchWebSdk('https://test-api.sumsub.com', 'basic-kyc', 'tst:BeMRn4ZvgdIc4WXyfw7cA3tb')}>
                    Activate Lasers
                </span>

                <div id="sumsub-websdk-container"></div>
            </>
        );
    }
}

export default SumSub;