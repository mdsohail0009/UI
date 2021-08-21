import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
class NotKyc extends Component {
 
  render() {
   
    return <>
    <div className="loader">Your Kyc Is Not Done, Please complete your kyc</div>
    </>
  }
}

export default connect(withRouter(NotKyc));