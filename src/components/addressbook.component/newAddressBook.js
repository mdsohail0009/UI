import React, { useState ,useEffect} from 'react';
import { Form, Input, Typography, Button, Alert } from 'antd'
import { setAddressStep ,rejectCoin } from '../../reducers/addressBookReducer';
import { connect } from 'react-redux';
import { saveAddress, favouriteNameCheck } from './api';
import Loader from '../../Shared/loader';
import SelectCrypto from './selectCrypto';



const { Text } = Typography;
const NewAddressBook = ({ changeStep, addressBookReducer, userConfig, onCancel,rejectCoinWallet, onCoinClick  }) => {
    const [form] = Form.useForm();
    const [errorMsg, setErrorMsg] = useState(null);
    const[isLoading, setIsLoading] =useState(false);
    const [successMsg, setSuccessMsg] = useState(null);
    const[isSelect,setIsSelect] = useState(false);
    const[obj,setObj] =useState({});
    useEffect(() => {
       if(addressBookReducer?.coinWallet?.coin){
           form.setFieldsValue({toCoin:addressBookReducer?.coinWallet?.coin })
       }
    }, [addressBookReducer?.coinWallet?.coin])
    const selectCrypto = () =>{
        debugger
        let getvalues = form.getFieldsValue()
        setObj(getvalues)
        setIsSelect(true)
    }
    const saveAddressBook = async (values) => {
        debugger;
       setIsLoading(true)
        const type = 'crypto';
        values['membershipId'] = userConfig.id;
        values['beneficiaryAccountName'] = userConfig.firstName + " " + userConfig.lastName;
        values['type'] = type;
        values['toCoin'] = addressBookReducer.coinWallet.coin
        let namecheck = values.favouriteName;
        let responsecheck = await favouriteNameCheck(userConfig.id, namecheck);
        if (responsecheck.data != null) {
            return setErrorMsg('Address label already existed');
        } else {
            let response = await saveAddress(values);
            if (response.ok) {
              //  changeStep('step1');
              setSuccessMsg('Address saved sucessfully');
              form.resetFields();
                rejectCoinWallet();
                setIsLoading(false)
                setTimeout(() => {onCancel();}, 2000)
              //  onCancel();
            }
        }
    }
    const onCoinSelected =(selectedCoin) =>{
        debugger
        setIsSelect(false)
        setTimeout(() => {
            form.setFieldsValue(obj);
        }, 2000)
        
    }

    return (
        <>
     
           {!isSelect  ? <div className="mt-16">
                {errorMsg != null && <Alert closable type="error" message={"Error"} description={errorMsg} onClose={() => setErrorMsg(null)} showIcon />}
                {successMsg != null && <Alert closable type="success" message={"Success"} description={successMsg} onClose={() => setSuccessMsg(null)} showIcon />}
                <Form
                    form={form}
                    onFinish={saveAddressBook} autoComplete="off" >
                    <Form.Item
                        className="custom-forminput custom-label  mb-24 pr-0"
                        label="Address Label"
                        name="favouriteName"
                        rules={[
                            { required: true, message: "Is required" },
                        ]} 
                        
                        >
                            <Input className="cust-input"  maxLength="20" placeholder="Enter Address label" />
                    </Form.Item>
                    <Form.Item
                        className="custom-forminput custom-label mb-24 pr-0"
                        name="toCoin"
                        label="Coin"
                        rules={[
                            { required: true, message: "Is required" },
                        ]}
                    >
                            {addressBookReducer.coinWallet.coinFullName ? <Input value={addressBookReducer.coinWallet.coinFullName + '-' + addressBookReducer.coinWallet.coin} className="cust-input cust-adon c-pointer" placeholder="Select from Coin"
                                addonAfter={<i className="icon sm rightarrow c-pointer" onClick={selectCrypto} />} /> :
                                <Input disabled className="cust-input cust-adon" placeholder="Select from Coins"
                                    addonAfter={<i className="icon sm rightarrow c-pointer" onClick={selectCrypto} />}
                                />}
                    </Form.Item>
                    <Form.Item
                        className="custom-forminput custom-label mb-24 pr-0"
                        name="toWalletAddress"
                        label="Address"
                        rules={[
                            { required: true, message: "Is required" },
                        ]}>
                            <Input className="cust-input" maxLength="30" placeholder="Enter Address" />
                    </Form.Item>
                    <div style={{ marginTop: '50px' }} className="">
                        <Button disabled= {isLoading}
                            htmlType="submit"
                            size="large"
                            block
                            className="pop-btn"
                        >
                            Save
                        </Button>
                        {/* <Button
                                htmlType="cancel"
                                size="large"
                                block
                                onClick={ () => onCancel()}
                                className="pop-cancel"
                            >
                                Cancel
                            </Button> */}
                    </div>

                </Form>
            </div>:<SelectCrypto  onCoinClick ={(selectedCoin) => onCoinSelected(selectedCoin)} />}
        </>
    )
}


const connectStateToProps = ({ addressBookReducer, userConfig }) => {
    return { addressBookReducer, userConfig: userConfig.userProfileInfo }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setAddressStep(stepcode))
        },
        rejectCoinWallet: () => {
            dispatch(rejectCoin())
        }
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(NewAddressBook);