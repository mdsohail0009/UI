import React, { Component } from 'react';
import snsWebSdk from '@sumsub/websdk';
import apicalls from './../../api/apiCalls';
import { connect } from 'react-redux';
import { userInfo, getmemeberInfo } from './../../reducers/configReduser';

class SumSub extends Component {
    componentDidMount() {

        this.launchWebSdk('https://test-api.sumsub.com', 'basic-kyc', 'tst:N2Kvt7SOOVp1jMf7wyQy9BSO.KlnFBjZadRJWK1A0rHckzIlaHQqbRDTO');

    }
    launchWebSdk = async (apiUrl, flowName, accessToken, applicantEmail, applicantPhone, customI18nMessages) => {
        applicantEmail = "test@example.org"
        applicantPhone = "+491758764512"
        let snsWebSdkInstance = snsWebSdk.Builder("https://test-api.sumsub.com", "SuisseBase KYB")
            .withAccessToken(accessToken, (newAccessTokenCallback) => {
                apicalls.sumsubacesstoken(this.props.userConfig.userId).then((res) => {
                    newAccessTokenCallback(res.data.token)
                })

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