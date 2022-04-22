import React, { useState, useEffect } from 'react';
import {
    Form, Typography, Input, Button, Alert, Spin, message, Select, Checkbox, Tooltip, Upload, Modal, Radio,
    Row, Col
} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { setStep,setHeaderTab } from '../../reducers/buysellReducer';
import Translate from 'react-translate-component';
import { connect } from 'react-redux';
import WalletList from '../shared/walletList';
import { saveAddress, favouriteNameCheck, getAddress } from './api';
import Loader from '../../Shared/loader';
import apiCalls from '../../api/apiCalls';
import { validateContentRule } from '../../utils/custom.validator';
import { Link } from "react-router-dom";
import { bytesToSize, getDocObj } from '../../utils/service';
import { getCountryStateLu, getStateLookup } from "../../api/apiServer";
import apicalls from "../../api/apiCalls";
import { warning } from '../../utils/message';
import {addressTabUpdate} from '../../reducers/addressBookReducer'


const { Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;
const { confirm } = Modal;

const EllipsisMiddle = ({ suffixCount, children }) => {
    const start = children?.slice(0, children.length - suffixCount)?.trim();
    const suffix = children?.slice(-suffixCount)?.trim();
    return (
        <Text className="mb-0 fs-14 docname c-pointer d-block"
            style={{ maxWidth: '100% !important' }} ellipsis={{ suffix }}>
            {start}
        </Text>
    );
};
const LinkValue = (props) => {
    return (
        <Translate
            className="textpure-yellow text-underline c-pointer"
            content={props.content}
            component={Link}
            onClick={() =>
                window.open(
                    "https://www.iubenda.com/terms-and-conditions/42856099",
                    "_blank"
                )
            }
        />
    );
};
const link = <LinkValue content="terms_service" />;
const NewFiatAddress = (props) => {


    const [form] = Form.useForm();
    const [errorMsg, setErrorMsg] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [fiatAddress, setFiatAddress] = useState({});
    const useDivRef = React.useRef(null);
    const [btnDisabled, setBtnDisabled] = useState(false);
    const [addressFile, setAdressFile] = useState(null);
    const[identityFile,setIdentityFile] = useState(null);
    const[declarationFile,setDeclarationFile] = useState(null)
    const [uploadPercentage, setUploadPercentage] = useState(0);
    const [isUploading, setUploading] = useState(false);
    const [countryLu, setCountryLu] = useState([]);
    const [stateLu, setStateLu] = useState([]);
    const [addressState, setAddressState] = useState(null);
    const [saveObj, setSaveObj] = useState(null);
    const [isValidFile, setIsValidFile] = useState(true);
    const[selectParty,setSelectParty] = useState(props?.checkThirdParty);
    const[uploadingActive,setUploadingActive] = useState(false);
    const[withdrawEdit,setWithdrawValues] = useState();
    const[isEdit,setEdit] = useState(false);

    useEffect(() => {
       if(selectParty === true){
        form.setFieldsValue({addressType:"3rdparty"})
        
       }
       else{
        form.setFieldsValue({addressType:"1stparty"})
       }
    if (props?.addressBookReducer?.selectedRowData?.id != "00000000-0000-0000-0000-000000000000" && props?.addressBookReducer?.selectedRowData?.id) {
            loadDataAddress();
            setEdit(true);
        }
        addressbkTrack();
        getCountryLu();
        getStateLu();
    }, [])
    const addressbkTrack = () => {
        apiCalls.trackEvent({ "Type": 'User', "Action": 'Withdraw Fiat Address Book Details page view ', "Username": props?.userConfig?.id, "MemeberId": props?.userConfig?.id, "Feature": 'Withdraw Fiat', "Remarks": 'Withdraw Fiat Address book details view', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Withdraw Fiat' });
    }
    const loadDataAddress = async () => {
        debugger
        setIsLoading(true)
        let response = await getAddress(props?.addressBookReducer?.selectedRowData?.id, 'fiat');
        if (response.ok) {
     
    
        if(response.data.addressType === "3rdparty"){
            setSelectParty(true);
        }
        else{
            setSelectParty(false);
        }
            setFiatAddress(response.data);
            setWithdrawValues(response.data);
            setAddressState(response.data.addressState);
            if (props?.addressBookReducer?.selectedRowData && props?.buyInfo.memberFiat?.data) {
                handleWalletSelection(props?.addressBookReducer?.selectedRowData?.currency)
            }
          
            let fileInfo = response?.data?.documents?.details;
           
            if(response?.data?.addressType === "1stparty" &&  fileInfo?.length !=0){
                setDeclarationFile(response?.data?.documents?.details[0])
             
            }
            else{
                setIdentityFile(response?.data?.documents?.details[1]);
                 setAdressFile(response?.data?.documents?.details[0]);
              
            }
      
          getStateLu(response.data.country)
            form.setFieldsValue({ ...response.data, });
            setIsLoading(false)
        }
    }
    const handleWalletSelection = (walletId) => {
        setFiatAddress({ toCoin: walletId })
        form.setFieldsValue({ toCoin: walletId })
    }
    const getCountryLu = async () => {
        let objj = props?.sendReceive?.withdrawFiatObj;
        setSaveObj(objj);
        if (objj) {
            form.setFieldsValue({
                ...objj,
                walletCode: objj.walletCode,
                beneficiaryAccountName: props?.userConfig?.firstName + " " + props?.userConfig?.lastName
            });
        } else {
            form.setFieldsValue({
                beneficiaryAccountName:props?.userConfig?.firstName + " " + props?.userConfig?.lastName
            });
        }
        let recName = await getCountryStateLu();
        if (recName.ok) {
            setCountryLu(recName.data);
        }
    };

    const getStateLu = async (countryname, isChange) => {
        let recName = await getStateLookup(countryname);
        if (recName.ok) {
            setStateLu(recName.data);
        }
        if (isChange) form.setFieldsValue({ state: null });
    };
    const savewithdrawal = async (values) => {

        setIsLoading(false)
        setErrorMsg(null)
        setBtnDisabled(true);
       const type = 'fiat';
        values['id'] = props?.addressBookReducer?.selectedRowData?.id;
        values['membershipId'] = props?.userConfig?.id;
      
       if(!selectParty){
        values['beneficiaryAccountName'] =props?.userConfig?.firstName + " " + props?.userConfig?.lastName;
        }
        values['type'] = type;
        values['info'] = JSON.stringify(props?.trackAuditLogData);
        values['addressState'] = addressState;
        let Id = '00000000-0000-0000-0000-000000000000';
        let favaddrId = props?.addressBookReducer?.selectedRowData ? props?.addressBookReducer?.selectedRowData?.id : Id;
        let namecheck = values.favouriteName.trim();
        let responsecheck = await favouriteNameCheck(props?.userConfig?.id, namecheck, 'fiat', favaddrId);
        if (responsecheck.data != null) {
            setIsLoading(false);
            setBtnDisabled(false);
            useDivRef.current.scrollIntoView()
            return setErrorMsg('Address label already existed');
        }
         else {
            setBtnDisabled(true);
            let saveObj = Object.assign({}, values);
            
            saveObj.accountNumber = apiCalls.encryptValue(saveObj.accountNumber, props?.userConfig?.sk)
            saveObj.bankAddress = apiCalls.encryptValue(saveObj.bankAddress, props?.userConfig?.sk)
            saveObj.bankName = apiCalls.encryptValue(saveObj.bankName, props?.userConfig?.sk)
            saveObj.beneficiaryAccountAddress = apiCalls.encryptValue(saveObj.beneficiaryAccountAddress, props?.userConfig?.sk)
            saveObj.beneficiaryAccountName = apiCalls.encryptValue(saveObj.beneficiaryAccountName, props?.userConfig?.sk)
            saveObj.routingNumber = apiCalls.encryptValue(saveObj.routingNumber, props?.userConfig?.sk)
            saveObj.toWalletAddress = apiCalls.encryptValue(saveObj.toWalletAddress, props?.userConfig?.sk)
            saveObj.country = apiCalls.encryptValue(saveObj.country,props?. userConfig?.sk)
            saveObj.state = apiCalls.encryptValue(saveObj.state, props?.userConfig?.sk)
            saveObj.zipCode = apiCalls.encryptValue(saveObj.zipCode,props?.userConfig?.sk)
            saveObj.documents = {
                "id": withdrawEdit ? withdrawEdit?.documents?.id : "00000000-0000-0000-0000-000000000000",
                "transactionId": null,
                "adminId": "00000000-0000-0000-0000-000000000000",
                "date": null,
                "typeId": null,
                "memberId": props?.userConfig?.id,
                "caseTitle": null,
                "caseState": null,
                "remarks": null,
                "status": null,
                "state": null,
        "details" : [
          ]
    } 
   
                if(selectParty){
                   
                 if(identityFile){
               saveObj.documents.details.push(identityFile);
                 }
                     if(addressFile){
              saveObj.documents.details.push(addressFile);
                    }
                }
                else if (declarationFile){
              saveObj.documents.details.push(declarationFile);
                }
     
           let response = await saveAddress(saveObj);
        
            if (response.ok) {
                setBtnDisabled(false);
                setErrorMsg('')
                useDivRef.current.scrollIntoView();
                message.success({ content: apiCalls.convertLocalLang('address_msg'), className: 'custom-msg' });
                form.resetFields();
               props?.onCancel()
                setIsLoading(false)
                props?.dispatch(addressTabUpdate(true));
                props?.dispatch(setHeaderTab(''));
                props?.props?.history?.push('/userprofile');
                }
            else {
                setIsLoading(false);
                setBtnDisabled(false);
            }
        }
    }
    const getIbanData = async (val) => {
        form.setFieldsValue({routingNumber:"",bankName:"",bankAddress:""});
        if (val && val.length > 14) {
            let response = await apiCalls.getIBANData(val);
            if (response.ok) {
                const oldVal = form.getFieldValue();
                form.setFieldsValue({ routingNumber: response.data.routingNumber || oldVal.routingNumber, bankName: response.data.bankName || oldVal.bankName, bankAddress: response.data.bankAddress || oldVal.bankAddress })
            }
        }
    }
    const beforeUpload = (file,type) => {
   
        if(type === "IDENTITYPROOF" || type === "ADDRESSPROOF"){

            let fileType = { "image/png": true, 'image/jpg': true, 'image/jpeg': true, 'image/PNG': true, 'image/JPG': true, 'image/JPEG': true, 'application/pdf': true, 'application/PDF': true }
            if (fileType[file.type]) {
            setIsValidFile(true);
            return true;
            }
            else{
                warning('File is not allowed. You can upload jpg, png, jpeg and PDF files')
                setIsValidFile(false);
                return Upload.LIST_IGNORE;   
            }
        }
        else{
           let fileType = { "image/png": false, 'image/jpg': false, 'image/jpeg': false, 'image/PNG': false, 'image/JPG': false, 'image/JPEG': false, 'application/pdf': true, 'application/PDF': true }
        if (fileType[file.type]) {
            setIsValidFile(true);
            return true;
        } else {
            warning('File is not allowed. You can upload only PDF files')
            setIsValidFile(false);
            return Upload.LIST_IGNORE;
        }
    }
    }
    const radioChangeHandler = (e) => {
          setUploading(false);
          setUploadingActive(false);
          setIdentityFile(null);
          setAdressFile(null);
          setDeclarationFile(null);
      if(e.target.value === "1stparty"){
            form.setFieldsValue({addressType:"1stparty",beneficiaryAccountName:props?.userConfig?.firstName + " " + props?.userConfig?.lastName})
            setSelectParty(false);

        }
        else{
            form.setFieldsValue({addressType:"3rdparty"})
            setSelectParty(true);
        }

    }
  const upLoadFiles = ({file},type) =>  {

        if((file.name.split('.')).length > 2){
            warning("File don't allow double extension");
        }
       if (file?.status === "uploading") 
        { 
            setUploadPercentage(file?.percent)
            if(type === "IDENTITYPROOF" ){
                setUploadingActive(true);
            }
            else if(isValidFile === true){
                setUploading(true);
            }
         }
        else if (file?.status === "done" && isValidFile === true) {

             if(type === "IDENTITYPROOF"){
                 let obj = {
                    "documentId": identityFile !== null ? identityFile?.documentId : "00000000-0000-0000-0000-000000000000",
                    "documentName": `${file.name}`,
                    "id": identityFile !== null ? identityFile?.id : "00000000-0000-0000-0000-000000000000",
                    "isChecked": file.name == "" ? false : true,
                    "remarks": `${file.size}`,
                    "state": null,
                    "status": false,
                    "path": `${file.response}`,
                    "size":`${file.size}`,
                }

            setIdentityFile(obj);
            
        }
            else if(type === "ADDRESSPROOF"){
                setUploading(true);
                let obj = {
                    "documentId": addressFile!== null ? addressFile?.documentId : "00000000-0000-0000-0000-000000000000",
                    "documentName": `${file.name}`,
                    "id": addressFile!== null ? addressFile?.id :"00000000-0000-0000-0000-000000000000",
                    "isChecked": file.name == "" ? false : true,
                    "remarks": `${file.size}`,
                    "state": null,
                    "status": false,
                    "path": `${file.response}`,
                    "size":`${file.size}`,
                }
                setAdressFile(obj);
            }
            else {
                setUploading(true);
                let obj = {
                    "documentId": declarationFile!== null ? declarationFile?.documentId :"00000000-0000-0000-0000-000000000000",
                    "documentName": `${file.name}`,
                    "id": declarationFile!== null ? declarationFile?.id :"00000000-0000-0000-0000-000000000000",
                    "isChecked": file.name == "" ? false : true,
                    "remarks": `${file.size}`,
                    "state": null,
                    "status": false,
                    "path": `${file.response}`,
                    "size":`${file.size}`
                }
                setDeclarationFile(obj);
            }
            setUploadingActive(false);
         setUploading(false);
             }  }

  
    const antIcon = <LoadingOutlined style={{ fontSize: 18, color: '#fff', marginRight: '16px' }} spin />;
    return (
        <>

            {isLoading ? <Loader />:
            <div className="addbook-height">
                <div ref={useDivRef}></div>
                {errorMsg && <Alert closable type="error" description={errorMsg} onClose={() => setErrorMsg(null)} showIcon />}
                <Form form={form} onFinish={savewithdrawal} autoComplete="off" initialValues={fiatAddress}>
                    <Translate
                        content="Beneficiary_BankDetails"
                        component={Paragraph}
                        className="mb-16 fs-14 text-aqua fw-500 text-upper"
                    />
                    <Form.Item  name="addressType" label="Address Type" className="custom-label">
                        <Radio.Group size='large'  buttonStyle="solid" className="text-white ml-8"  onChange={radioChangeHandler}
                            defaultValue={selectParty === true ? "3rdparty" : "1stparty"}
                             value={selectParty === true ? "3rdparty" : "1stparty"}
                           >
                            <Radio value={"1stparty"} className="text-white" disabled={isEdit}>1st Party</Radio>
                            <Radio value={"3rdparty"} className="text-white" disabled={isEdit}>3rd Party</Radio>
                        </Radio.Group>

                    </Form.Item>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                            <Form.Item
                                className="custom-forminput custom-label mb-0"
                                name="favouriteName" required
                                label={<Translate content="AddressLabel" component={Form.label} />}
                                rules={[
                                    {
                                        required: true,
                                        message: apiCalls.convertLocalLang('is_required')
                                    },
                                    {
                                        whitespace: true,
                                        message: apiCalls.convertLocalLang('is_required')
                                    },
                                    {
                                        validator: validateContentRule
                                    }
                                ]} >
                                <Input className="cust-input" maxLength="20" placeholder={apiCalls.convertLocalLang('AddressLabel')} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                            <Form.Item
                                className="custom-forminput custom-label mb-0"
                                label={<Translate content="address" component={Form.label} />}
                                name="toWalletAddress" required
                                rules={[
                                    {
                                        required: true,
                                        message: apiCalls.convertLocalLang('is_required')
                                    },
                                    {
                                        whitespace: true,
                                        message: apiCalls.convertLocalLang('is_required')
                                    },
                                    {
                                        validator: validateContentRule
                                    }
                                ]}
                            >
                                <Input className="cust-input" maxLength="30" placeholder={apiCalls.convertLocalLang('address')} />
                            </Form.Item>
                        </Col>
                      
                        <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                            <Form.Item
                                className="custom-forminput custom-label mb-0"
                                name="toCoin"
                                label={<Translate content="currency" component={Form.label} />}
                                rules={[
                                    { required: true, message: apiCalls.convertLocalLang('is_required') },
                                ]}
                            >
                                <WalletList hideBalance={true} valueFeild={'currencyCode'} selectedvalue={fiatAddress?.toCoin} placeholder={apiCalls.convertLocalLang('selectcurrency')} onWalletSelect={(e) => handleWalletSelection(e)} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                            <Form.Item
                                className="custom-forminput custom-label mb-0"
                                name="accountNumber"
                               
                                label={apiCalls.convertLocalLang('Bank_account')}
                                required
                                rules={[
                                    { required: true, message: apiCalls.convertLocalLang('is_required') },
                                    {
                                        pattern: /^[A-Za-z0-9]+$/,
                                        message: 'Invalid account number'
                                    }
                                ]}
                            >
                                <Input className="cust-input" maxLength={100} placeholder={apiCalls.convertLocalLang('Bank_account')} onBlur={(val) => getIbanData(val.currentTarget.value)} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                            <Form.Item
                                className="custom-forminput custom-label mb-0"
                                name="routingNumber"
                                label={<Translate content="BIC_SWIFT_routing_number" component={Form.label} />}
                                required
                                rules={[
                                    { required: true, message: apiCalls.convertLocalLang('is_required') },
                                    {
                                        pattern: /^[A-Za-z0-9]+$/,
                                        message: 'Invalid BIC/SWIFT/Routing number'
                                    }
                                ]}
                            >
                                <Input className="cust-input" maxLength={100} placeholder={apiCalls.convertLocalLang('BIC_SWIFT_routing_number')} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                            <Form.Item
                                className="custom-forminput custom-label mb-0"
                                name="bankName"
                                label={<Translate content="Bank_name" component={Form.label} />}
                                required
                                rules={[
                                    {
                                        required: true,
                                        message: apiCalls.convertLocalLang('is_required')
                                    },
                                    {
                                        whitespace: true,
                                        message: apiCalls.convertLocalLang('is_required')
                                    },
                                    {
                                        validator: validateContentRule
                                    }
                                ]}
                            >
                                <Input className="cust-input" maxLength={200} placeholder={apiCalls.convertLocalLang('Bank_name')} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                            <Form.Item
                                className="custom-forminput custom-label mb-0"
                                name="bankAddress"
                                label={<Translate content="Bank_address1" component={Form.label} />}
                                required
                                rules={[
                                    {
                                        required: true,
                                        message: apiCalls.convertLocalLang('is_required')
                                    },
                                    {
                                        whitespace: true,
                                        message: apiCalls.convertLocalLang('is_required')
                                    },
                                    {
                                        validator: validateContentRule
                                    }
                                ]}>
                                <Input className="cust-input" maxLength={200} placeholder={apiCalls.convertLocalLang('Bank_address1')} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                            <Form.Item
                                className="custom-forminput custom-label mb-0"
                                name="country"
                                label={<Translate content="Country" component={Form.label} />}
                                rules={[
                                    {
                                        required: true,
                                        message: apiCalls.convertLocalLang("is_required")
                                    }
                                ]}
                            >
                                <Select
                                    dropdownClassName="select-drpdwn"
                                    placeholder={apicalls.convertLocalLang("Country")}
                                    className="cust-input"
                                    style={{ width: "100%" }}
                                    bordered={false}
                                    showArrow={true}
                                    optionFilterProp="children"
                                    showSearch
                                    onChange={(e) => getStateLu(e, true)}
                                >
                                    {countryLu?.map((item, idx) => (
                                        <Option key={idx} value={item.code}>
                                            {item.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                            <Form.Item
                                className="custom-forminput custom-label mb-0"
                                name="state"
                                label={<Translate content="state" component={Form.label} />}
                                rules={[
                                    {
                                        required: true,
                                        message: apicalls.convertLocalLang("is_required")
                                    }
                                ]}
                            >
                                <Select
                                    dropdownClassName="select-drpdwn"
                                    placeholder={apicalls.convertLocalLang("state")}
                                    className="cust-input"
                                    style={{ width: "100%" }}
                                    bordered={false}
                                    showArrow={true}
                                    optionFilterProp="children"
                                    showSearch
                                    onChange={(e) => ""}
                                >
                                    {stateLu?.map((item, idx) => (
                                        <Option key={idx} value={item.code}>
                                            {item.code}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                            <Form.Item
                                className="custom-forminput custom-label mb-0"
                                name="zipCode"
                                label={<Translate content="zipcode" component={Form.label} />}
                                required
                                rules={[
                                    {
                                        validator: (rule, value, callback) => {
                                            var regx = new RegExp(/^[A-Za-z0-9]+$/);
                                            if (value) {
                                                if (!regx.test(value)) {
                                                    callback("Invalid zip code");
                                                } else if (regx.test(value)) {
                                                    callback();
                                                }
                                            } else {
                                                callback();
                                            }
                                        }
                                    },
                                    {
                                        required: true,
                                        message: apiCalls.convertLocalLang("is_required")
                                    }
                                ]}
                            >
                                <Input
                                    className="cust-input"
                                    maxLength="6"
                                    placeholder={apiCalls.convertLocalLang("zipcode")}
                                />
                            </Form.Item>
                        </Col>
                        </Row>
                        <Translate
                                content="Beneficiary_Details"
                                component={Paragraph}
                                className="mb-16 mt-24 fs-14 text-aqua fw-500 text-upper"
                            />
                        <Row gutter={[16,16]}>
                        <Col xs={24} md={12} lg={12} xl={12} xxl={12}>

                            <Form.Item
                            className='custom-label mb-0'
                            name="beneficiaryAccountName"
                            label={                        
                            <Translate
                                content={props?.userConfig?.isBusiness ? "company_name" : "Recipient_full_name"}
                                component={Form.label}
                            />}
                            rules={[
                                {
                                    required: true,
                                    message: apicalls.convertLocalLang("is_required")
                                },
                                {
                                    whitespace: true,
                                    message: apiCalls.convertLocalLang('is_required')
                                },
                                {
                                    validator: validateContentRule
                                }
                            ]}
                            >
                 { selectParty ? <Input className="cust-input"  placeholder="Business Name"  /> :
                  <Input className="cust-input" value={props?.userConfig?.firstName + " " + props?.userConfig?.lastName} placeholder="Recipient full name" disabled={true} />}
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                            <Form.Item
                                className="custom-forminput custom-label mb-0"
                                name="beneficiaryAccountAddress"
                                label={<Translate content="Recipient_address1" component={Form.label} />}
                                required
                                rules={[
                                    {
                                        required: true,
                                        message: apiCalls.convertLocalLang('is_required')
                                    },
                                    {
                                        whitespace: true,
                                        message: apiCalls.convertLocalLang('is_required')
                                    },
                                    {
                                        validator: validateContentRule
                                    }
                                ]}>
                                <Input className="cust-input" maxLength={200} placeholder={apiCalls.convertLocalLang('Recipient_address1')} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item
                                className="custom-label"
                                name="remarks"
                                label={<Translate content="remarks" component={Form.label} />}
                                rules={[
                                    { required: true, message: apiCalls.convertLocalLang('is_required') },
                                    {
                                        validator: validateContentRule
                                    }
                                ]} >
                                <TextArea placeholder='Remarks' className='cust-input pt-16' autoSize={{ minRows: 3, maxRows: 3 }} maxLength={300}></TextArea>
                            </Form.Item>
                        </Col>
                    </Row>

                  
   {  selectParty === true ?<Row gutter={[12,12]}>
    <Col xs={24} md={24} lg={12}  xl={12} xxl={12}>
                         <Form.Item name={"file1"} rules={[{
                                validator: (_, value) => {
                                    if (identityFile) {
                                        return Promise.resolve();
                                    } else {
                                        return Promise.reject("Please upload identity document")
                                    }
                                }
                            }]}>
                                {<Dragger accept=".pdf,.jpg,.jpeg,.png, .PDF, .JPG, .JPEG, .PNG" className="upload mt-16" multiple={false} action={process.env.REACT_APP_UPLOAD_API + "UploadFile"} showUploadList={false} beforeUpload={(props) => { beforeUpload(props,"IDENTITYPROOF") }} onChange={(props) => upLoadFiles(props,"IDENTITYPROOF")

                                 }>
                                    <p className="ant-upload-drag-icon mb-16">
                                        <span className="icon xxxl doc-upload" />
                                    </p>
                                    <p className="ant-upload-text fs-18 mb-0">Please upload identity document here</p>
                                </Dragger>}
                                {identityFile != null && <div className="docfile mr-0">
                                <span className={`icon xl ${(identityFile.documentName?.slice(-3) === "zip" ? "file" : "") || (identityFile.documentName?.slice(-3) === "pdf" ? "file" : "image")} mr-16`} />

                        <div className="docdetails c-pointer" >
                            <EllipsisMiddle suffixCount={10}>{identityFile.documentName}</EllipsisMiddle>
                            <span className="fs-12 text-secondary">{bytesToSize(identityFile.remarks)}</span>
                                  </div>

                        {/* <span className="icon md close c-pointer" onClick={() => confirm({
                            content: <div className='fs-14 text-white-50'>Are you sure do you want to delete file?</div>,
                            title: <div className='fs-18 text-white-30'>Delete File ?</div>,
                            onOk: () => { setIdentityFile(null); }
                        })} /> */}
                    </div>}
                    { uploadingActive && <div className="text-center mt-16">
                        <Spin />
                    </div>
                    }
                            </Form.Item>
    </Col>
    <Col xs={24} md={24} lg={12}  xl={12} xxl={12}>
                         <Form.Item name={"file2"} className="mb-0" rules={[{
                                validator: (_, value) => {
                                    if (addressFile) {
                                        return Promise.resolve();
                                    } else {
                                        return Promise.reject("Please upload address proof")   
                                    }
                                }
                            }]}>
                                {<Dragger accept=".pdf,.jpg,.jpeg,.png, .PDF, .JPG, .JPEG, .PNG" className="upload mt-16" multiple={false} action={process.env.REACT_APP_UPLOAD_API + "UploadFile"} showUploadList={false} beforeUpload={(props) => { beforeUpload(props,"ADDRESSPROOF") }} onChange={(props) => upLoadFiles(props,"ADDRESSPROOF")}>
                                    <p className="ant-upload-drag-icon mb-16">
                                        <span className="icon xxxl doc-upload" />
                                    </p>
                                    <p className="ant-upload-text fs-18 mb-0">Please upload address proof here</p>
                                </Dragger>}
                            </Form.Item> 
                            {addressFile != null && <div className="docfile mr-0">
                            <span className={`icon xl ${(addressFile?.documentName?.slice(-3) === "zip" ? "file" : "") || (addressFile.documentName?.slice(-3) === "pdf" ? "file" : "image")} mr-16`} />
                        <div className="docdetails c-pointer" >
                            <EllipsisMiddle suffixCount={10}>{addressFile.documentName}</EllipsisMiddle>
                            <span className="fs-12 text-secondary">{bytesToSize(addressFile.remarks)}</span>
                        </div>
                        {/* <span className="icon md close c-pointer" onClick={() => confirm({
                            content: <div className='fs-14 text-white-50'>Are you sure do you want to delete file?</div>,
                            title: <div className='fs-18 text-white-30'>Delete File ?</div>,
                            onOk: () => { setAdressFile(null); }
                        })} /> */}
                    </div>}
                    { isUploading && <div className="text-center mt-16">
                        <Spin />
                    </div>
                   
                    }
                            </Col>
                            </Row>
                             :
                             <>
                             <Text className='fs-14 fw-400 text-white-30 l-height-normal d-block mb-16'>Declaration Form is required, Please download the form. Be sure the information is accurate, Complete and signed.</Text>
                             <Tooltip title="Click here to open file in a new tab to download"><Text className='file-label c-pointer' onClick={() => window.open('https://prdsuissebasestorage.blob.core.windows.net/suissebase/Declaration Form.pdf', "_blank")}>Declaration_Form.pdf</Text></Tooltip> <Row gutter={[12,12]}>
    <Col xs={24} md={24} lg={12}  xl={12} xxl={12}>
                         <Form.Item name={"file1"} rules={[{
                                validator: (_, value) => {
                                    if (declarationFile) {
                                        return Promise.resolve();
                                    } else {
                                        return Promise.reject("Please upload your signed PDF document")
                                    }
                                }
                            }]}>
                                {<Dragger accept=".pdf,.jpg,.jpeg,.png, .PDF, .JPG, .JPEG, .PNG" className="upload mt-16" multiple={false} action={process.env.REACT_APP_UPLOAD_API + "UploadFile"} showUploadList={false} beforeUpload={(props) => { beforeUpload(props,"DECLARATION") }} onChange={(props) => upLoadFiles(props,"DECLARATION")

                                
                            }>
                                    <p className="ant-upload-drag-icon mb-16">
                                        <span className="icon xxxl doc-upload" />
                                    </p>
                                    <p className="ant-upload-text fs-18 mb-0">Upload your signed PDF document here</p>
                                </Dragger>}
                                {declarationFile != null && <div className="docfile mr-0">
                                <span className={`icon xl ${(declarationFile?.documentName?.slice(-3) === "zip" ? "file" : "") || (declarationFile.documentName?.slice(-3) === "pdf" ? "file" : "image")} mr-16`} />
                        <div className="docdetails c-pointer" >
                            <EllipsisMiddle suffixCount={10}>{declarationFile.documentName}</EllipsisMiddle>
                            <span className="fs-12 text-secondary">{bytesToSize(declarationFile.remarks)}</span>
                        </div>
                        {/* <span className="icon md close c-pointer" onClick={() => confirm({
                            content: <div className='fs-14 text-white-50'>Are you sure do you want to delete file?</div>,
                            title: <div className='fs-18 text-white-30'>Delete File ?</div>,
                            onOk: () => { setDeclarationFile(null); }
                        })} /> */}
                    </div>}
                    {isUploading && <div className="text-center">
                        <Spin />
                    </div>
                   
                    }
                            </Form.Item>
    </Col></Row></>}
               
           <Form.Item
                        className="custom-forminput mt-36 agree"
                        name="isAgree"
                        valuePropName="checked"
                        rules={[
                            {
                                validator: (_, value) =>
                                    value
                                        ? Promise.resolve()
                                        : Promise.reject(
                                            new Error(
                                                apiCalls.convertLocalLang("agree_termsofservice")
                                            )
                                        )
                            }

                        ]}
                    >
                        <Checkbox className="ant-custumcheck">
                            <span className="withdraw-check"></span>
                            <Translate
                                content="agree_to_suissebase"
                                with={{ link }}
                                component={Paragraph}
                                className="fs-14 text-white-30 ml-16 mb-4"
                                style={{ flex: 1 }}
                            />
                        </Checkbox>
                    </Form.Item>
                    <Form.Item className='text-center'>
                        <Button
                            htmlType="submit"
                            size="large"
                            className="pop-btn mb-36"
                            disabled={btnDisabled}
                            style={{minWidth: 300}}
                        >
                            {isLoading && <Spin indicator={antIcon} />}  <Translate content="Save_btn_text" />
                        </Button>
                    </Form.Item>
                 
                </Form>
            </div>
}

        </>
    );
}

const connectStateToProps = ({
    buyInfo,
    userConfig,
    addressBookReducer,
    sendReceive,
    buySell
}) => {
    return {
        buyInfo,
        userConfig: userConfig.userProfileInfo,
        sendReceive,
        addressBookReducer,
        trackAuditLogData: userConfig.trackAuditLogData,
        buySell,
    };
};

const connectDispatchToProps = (dispatch) => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode));
        },
        dispatch
    };
};
export default connect(
    connectStateToProps,
    connectDispatchToProps
)(NewFiatAddress);
