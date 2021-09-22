import React, { Component, useState, useRef, useEffect } from 'react';
import { Drawer, Form, Typography, Input, Button, label, Modal, Row, Col, Alert, Tooltip, Select } from 'antd';


const WithdrawalSummary = ({ userConfig, dispatch }) => {
    return (
        <div>
        <Text className="fs-14 text-white-50 fw-200">Amount</Text>
        <Currency className="fs-20 text-white-30 mb-36" prefix={""} defaultValue={saveObj?.totalValue} suffixText={saveObj.walletCode} />
        <Text className="fs-14 text-white-50 fw-200">Bank Account Number/IBAN</Text>
        <Text className="fs-20 text-white-30 d-block mb-36">{saveObj.accountNumber}</Text>
        <Text className="fs-14 text-white-50 fw-200">BIC/SWIFT/Routing Number</Text>
        <Text className="fs-20 text-white-30 d-block mb-36">{saveObj.swiftCode}</Text>
        <Text className="fs-14 text-white-50 fw-200">Bank Name</Text>
        <Text className="fs-20 text-white-30 d-block mb-36">{saveObj.bankName}</Text>
        <Text className="fs-14 text-white-50 fw-200">Recipient Full Name</Text>
        <Text className="fs-20 text-white-30 d-block mb-36">{saveObj.beneficiaryAccountName}</Text>
        <ul className="pl-0 ml-16 text-white-50 mb-0">
          <li>Ensure that the account details is correct</li>
          <li>Transaction can't be cancelled</li>
        </ul>
      </div>
    )
}

const connectStateToProps = ({ userConfig }) => {
  return { userConfig: userConfig.userProfileInfo }
}
const connectDispatchToProps = dispatch => {
  return {
    changeStep: (stepcode) => {
      dispatch(setStep(stepcode))
    },
    dispatch
  }

}
export default connect(connectStateToProps, connectDispatchToProps)(WithdrawalSummary);