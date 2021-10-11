import React, { useState ,useEffect} from 'react';
import { Form, Input, Button, Alert,Spin,message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { rejectCoin, setAddressStep,fetchAddressCrypto } from '../../reducers/addressBookReducer';
import { connect } from 'react-redux';
import { saveAddress, favouriteNameCheck ,getAddress} from './api';
import SelectCrypto from './selectCrypto';
import Loader from '../../Shared/loader';

const NewAddressBook = ({changeStep, addressBookReducer, userConfig, onCancel,rejectCoinWallet, InputFormValues}) => {
    const [form] = Form.useForm();
    const [errorMsg, setErrorMsg] = useState(null);
    const[isLoading, setIsLoading] =useState(false);
    const [successMsg, setSuccessMsg] = useState(null);
    const[isSelect,setIsSelect] = useState(false);
    const[isShowWallets, setIsShowWallets] = useState(false)
    const [cryptoAddress, setCryptoAddress] = useState({});
    const[obj,setObj] =useState({});
    useEffect(() => {
        if(addressBookReducer?.cryptoValues){
            form.setFieldsValue({toCoin:addressBookReducer?.cryptoValues?.toCoin ,favouriteName:addressBookReducer?.cryptoValues.favouriteName,
             toWalletAddress: addressBookReducer?.cryptoValues.toWalletAddress })
        }else {
            if (addressBookReducer?.selectedRowData?.id != "00000000-0000-0000-0000-000000000000" ) {
                loadDataAddress();
               }
        }
    }, [])

    useEffect(() => {
     // if(addressBookReducer?.coinWallet){
        if(addressBookReducer?.cryptoValues){
            form.setFieldsValue({toCoin:addressBookReducer?.cryptoValues?.toCoin ,favouriteName:addressBookReducer?.cryptoValues.favouriteName,
             toWalletAddress: addressBookReducer?.cryptoValues.toWalletAddress })
        }
 //  } 
//  form.setFieldsValue({toCoin:addressBookReducer?.coinWallet?.coin })

    }, [addressBookReducer?.cryptoValues])

    const selectCrypto = () =>{
        let getvalues = form.getFieldsValue();
        setObj(getvalues);
        InputFormValues(getvalues);
        changeStep("step2");
    }
    const loadDataAddress = async () => {
        let response = await getAddress(addressBookReducer?.selectedRowData?.id, 'crypto');
        if (response.ok) {
            setIsLoading(true)
            setCryptoAddress(response.data)
            form.setFieldsValue({...response.data,toCoin:addressBookReducer?.selectedRowData?.coin});
            setIsLoading(false)
        }
    }
    const saveAddressBook = async (values) => {
       setIsLoading(true)
        const type = 'crypto';
        let Id = '00000000-0000-0000-0000-000000000000';
        values['id'] = addressBookReducer?.selectedRowData?.id;
        values['membershipId'] = userConfig.id;
        values['beneficiaryAccountName'] = userConfig.firstName + " " + userConfig.lastName;
        values['type'] = type;
        let namecheck = values.favouriteName.trim();
        let favaddrId = addressBookReducer?.selectedRowData ? addressBookReducer?.selectedRowData?.id : Id;
        let responsecheck = await favouriteNameCheck(userConfig.id, namecheck, 'crypto',favaddrId );
        if (responsecheck.data != null) {
            setIsLoading(false)
            return setErrorMsg('Address label already existed');
        } else {
            setErrorMsg('')
            let response = await saveAddress(values);
            if (response.ok) {
                message.success({ content: 'Address saved successfully ', className: 'custom-msg' });
                form.resetFields();
                rejectCoinWallet();
                InputFormValues(null);
                onCancel();
                setIsLoading(false)
            }
            else{ 
                message.error({
                    content: response.data,
                    className: 'custom-msg',
                    duration: 0.5
                });
                setIsLoading(false)
            }
        }
    }
    // const onCoinSelected =(selectedCoin) =>{
    //     let coinObj = obj;
    //     coinObj.toCoin = selectedCoin.coin
    //     setIsSelect(false)
    //     setTimeout(() => {
    //         form.setFieldsValue(coinObj);
    //     }, 500)
    // }
    const antIcon = <LoadingOutlined style={{ fontSize: 18, color:'#fff', marginRight:'16px' }} spin />;
    return (
        <>
           <div className="mt-16">
                {errorMsg  && <Alert closable type="error" description={errorMsg} onClose={() => setErrorMsg(null)} showIcon />}
                { isLoading && <Loader /> }
                <Form
                    form={form} initialValues={cryptoAddress}
                    onFinish={saveAddressBook} autoComplete="off" >
                    <Form.Item
                        className="custom-forminput custom-label  mb-24 pr-0"
                        label="Address Label"
                        name="favouriteName"
                        required
                        rules={[
                            {
                                type: "favouriteName", validator: async (rule, value, callback) => {
                                    if (value == null || value.trim() === "") {
                                        throw new Error("Is required")
                                    }
                                    else {
                                        callback();
                                    }
                                }
                            }
                        ]} 
                        >
                            <Input className="cust-input"  maxLength="20" placeholder="Enter address label" />
                    </Form.Item>
                    <Form.Item
                        className="custom-forminput custom-label mb-24 pr-0"
                        name="toCoin"
                        label="Coin"
                        rules={[
                            { required: true, message: "Is required" },
                        ]} >
                             <Input disabled placeholder="Select coin"  className="cust-input cust-adon c-pointer" 
                                addonAfter={<i className="icon md rarrow-white c-pointer" onClick={selectCrypto} />}/>
                    </Form.Item>
                    <Form.Item
                        className="custom-forminput custom-label mb-24 pr-0"
                        name="toWalletAddress"
                        label="Address"
                        required
                        rules={[
                           
                            {
                                type: "toWalletAddress", validator: async (rule, value, callback) => {
                                     debugger;
                                    if (value == null || value.trim() === "") {
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
            </div>
            {/* <SelectCrypto  onCoinClick ={(selectedCoin) => onCoinSelected(selectedCoin)} /> */}
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
        },
        InputFormValues: (cryptoValues) => {
            dispatch(fetchAddressCrypto(cryptoValues));
        },

    }
}
export default connect(connectStateToProps, connectDispatchToProps)(NewAddressBook);