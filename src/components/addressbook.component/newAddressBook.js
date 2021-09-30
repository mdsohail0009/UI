import React, { useState ,useEffect} from 'react';
import { Form, Input, Button, Alert,Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { rejectCoin } from '../../reducers/addressBookReducer';
import { connect } from 'react-redux';
import { saveAddress, favouriteNameCheck } from './api';
import SelectCrypto from './selectCrypto';



const NewAddressBook = ({changeStep, addressBookReducer, userConfig, onCancel,rejectCoinWallet }) => {
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
        let getvalues = form.getFieldsValue()
        setObj(getvalues)
        setIsSelect(true)
    }
    const saveAddressBook = async (values) => {
       setIsLoading(true)
        const type = 'crypto';
        values['membershipId'] = userConfig.id;
        values['beneficiaryAccountName'] = userConfig.firstName + " " + userConfig.lastName;
        values['type'] = type;
        values['toCoin'] = addressBookReducer.coinWallet.coin;
        let namecheck = values.favouriteName.trim();
        let responsecheck = await favouriteNameCheck(userConfig.id, namecheck);
        if (responsecheck.data != null) {
            setIsLoading(false)
            return setErrorMsg('Address label already existed');
        } else {
            setErrorMsg('')
            let response = await saveAddress(values);
            if (response.ok) {
                message.success({ content: 'Address saved successfull', className: 'custom-msg' });
                //setSuccessMsg('Address saved successfully');
                form.resetFields();
                rejectCoinWallet();
                //setTimeout(() => { onCancel(); }, 1500)
                onCancel();
                setIsLoading(false)
            }
            else{ setIsLoading(false)}
        }
    }
    const onCoinSelected =(selectedCoin) =>{
        let coinObj = obj;
        coinObj.toCoin = selectedCoin.coin
        setIsSelect(false)
        setTimeout(() => {
            form.setFieldsValue(coinObj);
        }, 500)
        
    }
    const antIcon = <LoadingOutlined style={{ fontSize: 18, color:'#fff', marginRight:'16px' }} spin />;
    return (
        <>
     
           {!isSelect  ? <div className="mt-16">
                {errorMsg  && <Alert closable type="error" description={errorMsg} onClose={() => setErrorMsg(null)} showIcon />}
                {/* {successMsg  && <Alert closable type="success" description={successMsg} onClose={() => setSuccessMsg(null)} showIcon />} */}
                <Form
                    form={form}
                    onFinish={saveAddressBook} autoComplete="off" >
                    <Form.Item
                        className="custom-forminput custom-label  mb-24 pr-0"
                        label="Address Label"
                        name="favouriteName"
                        required
                        rules={[
                            {
                                type: "favouriteName", validator: async (rule, value, callback) => {
                                    if (value === null || value.trim() === "") {
                                        throw new Error("Is required")
                                    }
                                    else {
                                        callback();
                                    }
                                }
                            }
                        ]} 
                        // rules={[
                        //     { required: true, message: "Is required" },
                        // ]} 
                        
                        >
                            <Input className="cust-input"  maxLength="20" placeholder="Enter address label" />
                    </Form.Item>
                    <Form.Item
                        className="custom-forminput custom-label mb-24 pr-0"
                        name="toCoin"
                        label="Coin"
                        rules={[
                            { required: true, message: "Is required" },
                        ]}
                    >
                            {/* {addressBookReducer.coinWallet.coinFullName ? <Input  value={addressBookReducer.coinWallet.coinFullName + '-' + addressBookReducer.coinWallet.coin} className="cust-input cust-adon c-pointer" placeholder="Select from Coin"
                                addonAfter={<i className="icon md rarrow-white c-pointer" onClick={selectCrypto} />} /> :
                                <Input disabled className="cust-input cust-adon" placeholder="Select from Coins"
                                    addonAfter={<i className="icon md rarrow-white c-pointer" onClick={selectCrypto} />}
                                />} */}
                              {addressBookReducer.coinWallet.coinFullName ? <div className="cust-input p-relative">
                                    <p className=" text-center mb-0" style={{ lineHeight:'46px'}}>{addressBookReducer.coinWallet.coinFullName + '-' + addressBookReducer.coinWallet.coin} </p>
                                    <span className="icon md rarrow-white c-pointer coin-select" onClick={selectCrypto} />
                                </div>:
                                 <div className="cust-input  p-relative">
                                 <p className="text-center mb-0  " style={{color:'#bfbfbf', lineHeight:'46px'}}>Select coin</p>
                                 <span className="icon md rarrow-white c-pointer coin-select" onClick={selectCrypto} />
                                 
                             </div>}
                    </Form.Item>
                    <Form.Item
                        className="custom-forminput custom-label mb-24 pr-0"
                        name="toWalletAddress"
                        label="Address"
                        rules={[
                            {
                                type: "toWalletAddress", validator: async (rule, value, callback) => {
                                    if (value === null || value.trim() === "") {
                                        throw new Error("Is required")
                                    }
                                    else {
                                        callback();
                                    }
                                }
                            }
                        ]} >
                            <Input className="cust-input" maxLength="30" placeholder="Enter address" />
                    </Form.Item>
                    <div style={{ marginTop: '50px' }} className="">
                        <Button disabled={isLoading}
                            htmlType="submit"
                            size="large"
                            block
                            className="pop-btn"
                        >
                          { isLoading  && <Spin indicator={antIcon} />} Save
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