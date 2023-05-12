import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class NotKyc extends Component {
    state = {loading:true}
    render() {
        return (
            <>
            <div className="notkyc">
             <div>Dear customer please complete your
            <Link  to="/sumsub" >{this.props?.userConfig?.isBusiness?' KYB ':' KYC '}</Link>
            to continue </div></div>
            </>
        );
    }
}

const connectStateToProps = ({ userConfig }) => {
    return { userConfig: userConfig.userProfileInfo }
}

export default connect(connectStateToProps)(NotKyc);