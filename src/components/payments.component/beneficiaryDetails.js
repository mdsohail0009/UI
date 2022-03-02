import React, {useState} from 'react';
import { Form, Typography, Input, Button, Alert, Spin, message, Drawer, Select } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { setStep } from '../../reducers/paymentsReducer';
import Translate from 'react-translate-component';
import { connect } from 'react-redux';
import WalletList from '../shared/walletList';
import { saveAddress, favouriteNameCheck, getAddress } from './api';
import Loader from '../../Shared/loader';
import apiCalls from '../../api/apiCalls';
import { validateContentRule } from '../../utils/custom.validator'
import Moment from 'react-moment';
import moment from 'moment';

const { Paragraph } = Typography;
const {Option} = Select;


const BeneficiaryDetails = (props, {userConfig}) => {
    const gridRef = React.createRef();
    const [addBenifeciary, setaddBenifeciary] = useState(false);
    const [form] = Form.useForm();
    const [errorMsg, setErrorMsg] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [fiatAddress, setFiatAddress] = useState({});
    const useDivRef = React.useRef(null);
    const [btnDisabled, setBtnDisabled] = useState(false);
    const [beneficiaryDrawer, setBeneficiaryDrawer] = useState(false);

    const savewithdrawal = () => {
        setaddBenifeciary(false);
    }
    const antIcon = <LoadingOutlined style={{ fontSize: 18, color: '#fff', marginRight: '16px' }} spin />;
    return (
        <Form form={form} onFinish={savewithdrawal} autoComplete="off" initialValues={fiatAddress}>
            <Translate
                content="Beneficiary_Details"
                component={Paragraph}
                className="mb-16 fs-14 text-white fw-500 text-upper"
            />
            <Form.Item>
                <div className="d-flex">
                    <Translate
                        className="input-label"
                        content="Recipient_full_name"
                        component={Form.label}
                    />{" "}
                    <span style={{ color: "var(--textWhite30)", paddingLeft: "2px" }}></span></div>
                <Input className="cust-input" value={userConfig?.firstName + " " + userConfig?.lastName} placeholder="Recipient full name" />
            </Form.Item>
            <Form.Item
                className="custom-forminput custom-label mb-24"
                name="beneficiaryAccountAddress"
                label={<Translate content="Recipient_address1" component={Form.label} />}
                required
                rules={[
                    // {
                    //     required: true,
                    //     message: apiCalls.convertLocalLang('is_required')
                    // },
                    {
                        whitespace: true,
                        message: apiCalls.convertLocalLang('is_required')
                    },
                    {
                        validator: validateContentRule
                    }
                ]}>
                <Input className="cust-input" placeholder={apiCalls.convertLocalLang('Recipient_address1')} />
            </Form.Item>
            <Translate
                content="Beneficiary_BankDetails"
                component={Paragraph}
                className="mb-16 fs-14 text-white fw-500 text-upper"
            />
            <Form.Item
                className="custom-forminput  custom-label mb-24 pr-0"
                name="favouriteName" required
                label={<Translate content="AddressLabel" component={Form.label} />}
                rules={[
                    // {
                    //     required: true,
                    //     message: apiCalls.convertLocalLang('is_required')
                    // },
                    {
                        whitespace: true,
                        message: apiCalls.convertLocalLang('is_required')
                    },
                    {
                        validator: validateContentRule
                    }
                ]} >
                <Input className="cust-input" maxLength="20" placeholder={apiCalls.convertLocalLang('Enteraddresslabel')} />
            </Form.Item>
            <Form.Item
                className="custom-forminput custom-label mb-24 pr-0"
                label={<Translate content="address" component={Form.label} />}
                name="toWalletAddress" required
                rules={[
                    // {
                    //     required: true,
                    //     message: apiCalls.convertLocalLang('is_required')
                    // },
                    {
                        whitespace: true,
                        message: apiCalls.convertLocalLang('is_required')
                    },
                    {
                        validator: validateContentRule
                    }
                ]}
            >
                <Input className="cust-input" maxLength="30" placeholder={apiCalls.convertLocalLang('Enteraddress')} />
            </Form.Item>
            <Form.Item
                className="custom-forminput custom-label mb-24"
                name="toCoin"
                label={<Translate content="currency" component={Form.label} />}
            // rules={[
            //     { required: true, message: apiCalls.convertLocalLang('is_required') },
            // ]}
            >
                <WalletList hideBalance={true} valueFeild={'currencyCode'} selectedvalue={fiatAddress?.toCoin} placeholder={apiCalls.convertLocalLang('selectcurrency')} />
            </Form.Item>
            <Form.Item
                className="custom-forminput custom-label mb-24"
                name="accountNumber"
                // label={<Translate content="Bank_account" component={Form.label} />}
                label={apiCalls.convertLocalLang('Bank_account')}
                required
                rules={[
                    //{ required: true, message: apiCalls.convertLocalLang('is_required') },
                    {
                        pattern: /^[A-Za-z0-9]+$/,
                        message: 'Invalid account number'
                    }
                ]}
            >
                <Input className="cust-input" placeholder={apiCalls.convertLocalLang('Bank_account')} />
            </Form.Item>
            <Form.Item
                className="custom-forminput custom-label mb-24"
                name="routingNumber"
                label={<Translate content="BIC_SWIFT_routing_number" component={Form.label} />}
                required
                rules={[
                    //{ required: true, message: apiCalls.convertLocalLang('is_required') },
                    {
                        pattern: /^[A-Za-z0-9]+$/,
                        message: 'Invalid BIC/SWIFT/Routing number'
                    }
                ]}
            >
                <Input className="cust-input" placeholder={apiCalls.convertLocalLang('BIC_SWIFT_routing_number')} />
            </Form.Item>
            <Form.Item
                className="custom-forminput custom-label mb-24"
                name="bankName"
                label={<Translate content="Bank_name" component={Form.label} />}
                required
                rules={[
                    // {
                    //     required: true,
                    //     message: apiCalls.convertLocalLang('is_required')
                    // },
                    {
                        whitespace: true,
                        message: apiCalls.convertLocalLang('is_required')
                    },
                    {
                        validator: validateContentRule
                    }
                ]}
            >
                <Input className="cust-input" placeholder={apiCalls.convertLocalLang('Bank_name')} />
            </Form.Item>
            <Form.Item
                className="custom-forminput custom-label mb-24"
                name="bankAddress"
                label={<Translate content="Bank_address1" component={Form.label} />}
                required
                rules={[
                    // {
                    //     required: true,
                    //     message: apiCalls.convertLocalLang('is_required')
                    // },
                    {
                        whitespace: true,
                        message: apiCalls.convertLocalLang('is_required')
                    },
                    {
                        validator: validateContentRule
                    }
                ]}>
                <Input className="cust-input" placeholder={apiCalls.convertLocalLang('Bank_address1')} />
            </Form.Item>
            <Form.Item className="mb-0 mt-16">
                <Button disabled={isLoading}
                    htmlType="submit"
                    size="large"
                    block
                    className="pop-btn"
                    disabled={btnDisabled}
                    onClick={()=>props.dispatch(setStep('step2'))}
                >
                    {isLoading && <Spin indicator={antIcon} />}  <Translate content="confirm_beneficiary" />
                </Button>
            </Form.Item>
        </Form>
    )
}

const connectStateToProps = ({ userConfig }) => {
    return { userConfig: userConfig.userProfileInfo };
};
const connectDispatchToProps = (dispatch) => {
return {
    dispatch
}
}

export default connect(connectStateToProps, connectDispatchToProps)(BeneficiaryDetails);