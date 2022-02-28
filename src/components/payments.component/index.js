import React, { useState, useEffect } from 'react';
import { Form, Typography, Input, Button, Alert, Spin, message, Drawer, Select } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { setStep } from '../../reducers/buysellReducer';
import Translate from 'react-translate-component';
import { connect } from 'react-redux';
import WalletList from '../shared/walletList';
import { saveAddress, favouriteNameCheck, getAddress } from './api';
import Loader from '../../Shared/loader';
import apiCalls from '../../api/apiCalls';
import { validateContentRule } from '../../utils/custom.validator'
import Moment from 'react-moment';
import moment from 'moment';
import List from "../grid.component";

const { Title, Text,Paragraph } = Typography;
const {Option} =Select;

const Payments = ( props, { userConfig} ) => {
    const gridRef = React.createRef();
    const [addBenifeciary, setaddBenifeciary] =useState(false);
    const [form] = Form.useForm();
    const [errorMsg, setErrorMsg] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [fiatAddress, setFiatAddress] = useState({});
    const useDivRef = React.useRef(null);
    const [btnDisabled, setBtnDisabled] = useState(false);

    const paymentsView = (prop) => {
        props.history.push(`/payments/${prop.dataItem.id}/view`)
    };
    
    const gridColumns = [
        {
            field: "createdDate", title: 'Date', filter: true, filterType: "date", customCell: (props) => (
                <td><div className="gridLink" onClick={() => paymentsView(props)}>
                    <Moment format="DD/MM/YYYY">{new Date(props.dataItem.createdDate).toLocaleDateString()}</Moment></div></td>)
        },
        { field: "currency", title: 'Currency', filter: true },
        { field: "totalAmount", title: 'Total Amount', filter: true },
        { field: "count", title: 'Count', filter: true },
        { field: "state", title: 'Status', filter: true },
    ];

    const addPayment = () => {
        props.history.push(`/payments/00000000-0000-0000-0000-000000000000/add`)
    }

    const hideBenificiaryDrawer = () => {
        setaddBenifeciary(false);
    }
    const showNewBenificiary = () => {
        setaddBenifeciary(true);
    }
    const savewithdrawal = () => {
        setaddBenifeciary(false);
    }
    const antIcon = <LoadingOutlined style={{ fontSize: 18, color: '#fff', marginRight: '16px' }} spin />;
    return (
        <>
            <div className="main-container">
                <div className='d-flex align-center justify-content mb-16'>
                    <Title className="basicinfo mb-0"><Translate content="menu_payments" component={Text} className="basicinfo" /></Title>
                    <div className="d-flex">
                        <Button
                            className="pop-btn px-24"
                            style={{ margin: "0 8px", height: 40 }}
                            onClick={showNewBenificiary}
                        >
                            Add New Beneficiary
                        </Button>
                        <Button
                            className="pop-btn px-24"
                            style={{ margin: "0 8px", height: 40 }}
                            onClick={addPayment}
                        >
                            New Bill Payment
                        </Button>
                    </div>
                </div>
                <div className="box basic-info text-white">
                    <List
                        showActionBar={false}
                        ref={gridRef}
                        url={process.env.REACT_APP_GRID_API + `MassPayments/UserPayments/${props.userConfig?.id}`}
                        columns={gridColumns}
                    />
                </div>
                <Drawer
                    title={[<div className="side-drawer-header">
                        <span />
                        <div className="text-center fs-16">
                            <Title className="text-white-30 fs-16 fw-600 text-upper mb-4 d-block">Add New Beneficiary</Title>
                        </div>
                        <span onClick={hideBenificiaryDrawer} className="icon md close-white c-pointer" />
                    </div>]}
                    placement="right"
                    closable={true}
                    visible={addBenifeciary}
                    closeIcon={null}
                    onClose={hideBenificiaryDrawer}
                    className="side-drawer"
                    destoryOnClose={true}
                >
                    <Form form={form} onFinish={savewithdrawal} autoComplete="off" initialValues={fiatAddress}>
                    <Translate
                            content="Beneficiary_Details"
                            component={Paragraph}
                            className="mb-16 fs-14 text-aqua fw-500 text-upper"
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
                            className="mb-16 fs-14 text-aqua fw-500 text-upper"
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
                            <WalletList hideBalance={true} valueFeild={'currencyCode'} selectedvalue={fiatAddress?.toCoin} placeholder={apiCalls.convertLocalLang('selectcurrency')}  />
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
                        <Form.Item
                            className="custom-forminput custom-label mb-24"
                            name="documents"
                            label={<Translate content="Bank_address1" component={Form.label} />}
                            required
                            rules={[
                                {
                                    required: true,
                                    message: apiCalls.convertLocalLang('is_required')
                                },
                                // {
                                //     whitespace: true,
                                //     message: apiCalls.convertLocalLang('is_required')
                                // },
                                {
                                    validator: validateContentRule
                                }
                            ]}>
                            <Select placeholder="Select Documents" className='cust-input' mode="multiple">
                                <Option value='AML'>AML</Option>
                                <Option value='Address Proof'>Address Proof</Option>
                            </Select>
                        </Form.Item>

                        
                        <Form.Item className="mb-0 mt-16">
                            <Button disabled={isLoading}
                                htmlType="submit"
                                size="large"
                                block
                                className="pop-btn"
                                disabled={btnDisabled}
                            >
                                {isLoading && <Spin indicator={antIcon} />}  <Translate content="Save_btn_text" />
                            </Button>
                        </Form.Item>
                    </Form>
                </Drawer>
            </div>
        </>
    )
}


const connectStateToProps = ({ userConfig }) => {
    return { userConfig: userConfig.userProfileInfo };
};

export default connect(connectStateToProps, null)(Payments);