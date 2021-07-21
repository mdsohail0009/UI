import React, { Component } from 'react';
import snsWebSdk from '@sumsub/websdk';
import apicalls from './../../api/apiCalls';
import { connect } from 'react-redux';

class SumSub extends Component {
    componentDidMount() {
        
        this.launchWebSdk('https://test-api.sumsub.com', 'basic-kyc', 'tst:N2Kvt7SOOVp1jMf7wyQy9BSO.KlnFBjZadRJWK1A0rHckzIlaHQqbRDTO');

    }
    launchWebSdk = async(apiUrl, flowName, accessToken, applicantEmail, applicantPhone, customI18nMessages) => {
        applicantEmail = "test@example.org"
        applicantPhone = "+491758764512"
        let snsWebSdkInstance = snsWebSdk.Builder("https://test-api.sumsub.com", (this.props.userConfig.isBusiness?"SuisseBase KYB":"SuisseBase KYC"))
            .withAccessToken(accessToken, (newAccessTokenCallback) => {
                apicalls.sumsubacesstoken(this.props.userConfig.id).then((res)=>{
                    newAccessTokenCallback(res.data.token)
                })
               
            })
            .withConf({
                lang: "en",
                email: applicantEmail,
                phone: applicantPhone, // if available
                // firstName:'NARESH',
                // fixedInfo: {
                //     "firstName": "London",
                //     "lastName": "GBR"
                // },
                onMessage: (type, payload) => {
                    console.log('WebSDK onMessage', type, payload)
                },
                onError: (error) => {
                    console.log('WebSDK onError', error)
                },
            }).build()

        snsWebSdkInstance.launch('#sumsub-websdk-container')
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
    return { userConfig:userConfig.userProfileInfo }
}
const connectDispatchToProps = dispatch => {
    return {
        // userInformation: (stepcode) => {
        //     dispatch(userInfo(stepcode))
        // }
    }
}

export default connect(connectStateToProps, connectDispatchToProps)(SumSub);