import React, { useState} from 'react';
import { Typography, Button } from 'antd';
import Currency from '../shared/number.formate';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';


const WithdrawalSummary = ({ sendReceive, onConfirm,onCancel }) => {
  const { Text } = Typography;
  const [isLoding, setIsLoding] = useState(false);
  const saveWithdrwal = async() =>{
    setIsLoding(true)
    onConfirm()
  }
    return (
        <div className="mt-16">
        <Text className="fs-14 text-white-50 fw-200"> <Translate content="amount" component={Text} className="fs-14 text-white-50 fw-200" /></Text>
        <Currency className="fs-20 text-white-30 mb-36" prefix={""} defaultValue={sendReceive.withdrawFiatObj?.totalValue} suffixText={sendReceive.withdrawFiatObj?.walletCode} />
        <Text className="fs-14 text-white-50 fw-200"> <Translate content="Bank_account" component={Text} className="fs-14 text-white-50 fw-200"   /></Text>
        <Text className="fs-20 text-white-30 d-block mb-36">{sendReceive.withdrawFiatObj?.accountNumber}</Text>
        <Text className="fs-14 text-white-50 fw-200"><Translate content="BIC_SWIFT_routing_number" component={Text} className="fs-14 text-white-50 fw-200"    /></Text>
        <Text className="fs-20 text-white-30 d-block mb-36">{sendReceive.withdrawFiatObj?.routingNumber}</Text>
        <Text className="fs-14 text-white-50 fw-200"><Translate content="Bank_name" component={Text} className="fs-14 text-white-50 fw-200"   /></Text>
        <Text className="fs-20 text-white-30 d-block mb-36">{sendReceive.withdrawFiatObj?.bankName}</Text>
        <Text className="fs-14 text-white-50 fw-200"><Translate content="Recipient_full_name" component={Text} className="fs-14 text-white-50 fw-200"   /></Text>
        <Text className="fs-20 text-white-30 d-block mb-36">{sendReceive.withdrawFiatObj?.beneficiaryAccountName}</Text>
        <ul className="pl-0 ml-16 text-white-50 mb-24">
          <li> <Translate className="pl-0 ml-16 text-white-50" content="account_details" component={Text}/> </li>
          <li><Translate className="pl-0 ml-16 text-white-50" content="Cancel_select" component={Text}/></li>
        </ul>
        <Button
        disabled={isLoding}
              size="large"
              block
              className="pop-btn"
              onClick={saveWithdrwal}
            >
             <Translate content="Confirm" component={Text}/>
             </Button>
            <div className="text-center">
        <Translate content="back" component={Button} onClick={() => onCancel()} type="text" size="large" className="text-center text-white-30 pop-cancel fw-400 text-captz text-center"/>
      </div>
      </div>
    )
}

const connectStateToProps = ({ userConfig, sendReceive }) => {
  return { userConfig: userConfig.userProfileInfo,sendReceive }
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