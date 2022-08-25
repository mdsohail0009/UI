import React, { Component } from "react";
import { Input, Row, Col, Form, Button, Typography, List, Divider, Image } from 'antd';
import apicalls from "../../api/apiCalls";
import AddressDocumnet from "../addressbook.component/document.upload";
import oops from '../../assets/images/oops.png'
import FiatAddress from "../addressbook.component/fiat.address";
import BankDetails from "../addressbook.component/bank.details";
import alertIcon from '../../assets/images/pending.png';
import success from '../../assets/images/success.png'

const { Paragraph, Text, Title } = Typography;
const { Search } = Input;
class OnthegoFundTransfer extends Component {
    state = {
        step: "enteramount",
        //filterObj:[],
        filterObj: [{ accountHolderName: "SubbaRedy", lable: "Payee 100", address: "100032498902", type: "First_Party" }, { accountHolderName: "John Martin", lable: "Payee 100", address: "100032498902", type: "Third_Party" }],
        addressOptions: { addressType: "myself", transferType: "sepa" },
        isNewTransfer: false
    }
    chnageStep = (step) => {
        this.setState({ ...this.state, step });
        if (step === 'newtransfer') {
            this.setState({ ...this.state, step, isNewTransfer: true });
        }
    }
    renderStep = (step) => {
        const { filterObj } = this.state;
        const steps = {
            enteramount: <Form
                autoComplete="off"
                initialValues={{}}
            >
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                        <Form.Item
                            className="custom-forminput custom-label mb-0"
                            name="amount"
                            label={"Enter amount"}
                            required
                            rules={[
                                {
                                    required: true,
                                    message:
                                        apicalls.convertLocalLang("is_required"),
                                }
                            ]}
                        >
                            <Input
                                className="cust-input "
                                placeholder={"Enter amount"}
                                maxLength="500"
                            />
                        </Form.Item>

                    </Col>
                </Row>
                <Row gutter={[16, 16]}>

                    <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                        <br />
                        <Form.Item className="text-center">
                            <Button
                                htmlType="button"
                                size="large"
                                className="pop-btn mb-36"
                                style={{ minWidth: 300 }}
                                onClick={() => this.chnageStep("newtransfer")}
                            >
                                New Address
                            </Button>
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                        <br />
                        <Form.Item className="text-center">
                            <Button
                                htmlType="button"
                                size="large"
                                className="pop-btn mb-36"
                                style={{ minWidth: 300 }}
                                onClick={() => { this.setState({ ...this.state, isNewTransfer: false }, () => this.chnageStep("addressselection")) }}
                            >
                                Addressbook
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>,
            addressselection: <React.Fragment>
                <div className="text-center fs-16">
                    <Paragraph
                        className='text-white'>Who are you sending it to?</Paragraph>
                </div>
                <Search placeholder={apicalls.convertLocalLang('searchAddress')}
                    addonAfter={<span className="icon md search-white" />} onChange={({ currentTarget }) => { this.handleSearch(currentTarget.value) }} size="middle" bordered={false} className="my-16" />
                {(filterObj.length > 0) && <>
                    <ul style={{ listStyle: 'none', paddingLeft: 0, }} className="addCryptoList">
                        {filterObj?.map((item, idx) =>
                            <li onClick={() => this.chnageStep(item.type === "Third_Party" ? "reasonfortransfer" : "reviewdetails")} key={idx}
                                className={item.lable === this.props.sendReceive?.addressObj?.lable ? "select" : " "}
                            > <p className="fs-16 mb-0 "> <span className=" text-white-50 fs-12 fw-100 xxl-fs-16"> Account Holder:</span><span className=" text-white-50 fs-10 fw-500 xxl-fs"> {item.accountHolderName}</span></p>
                                <p className="fs-16 mb-0 "> <span className=" text-white-50 fs-12 fw-100 xxl-fs-16"> Label:</span><span className=" text-white-50 fs-10 fw-500 xxl-fs"> {item.lable}</span></p>
                                <p className="fs-16 mb-0 "> <span className=" text-white-50 fs-12 fw-100 xxl-fs-16"> Address: </span> <span className=" text-white-50 fs-10 fw-500 xxl-fs"> {item.address}</span></p>
                            </li>
                        )}
                    </ul> </>}
                {(!filterObj.length > 0) && <div className="success-pop text-center" style={{ marginTop: '20px' }}>
                    <img src={oops} className="confirm-icon" style={{ marginBottom: '10px' }} alt="Confirm" />
                    <h1 className="fs-36 text-white-30 fw-200 mb-0" > {apicalls.convertLocalLang('oops')}</h1>
                    <p className="fs-16 text-white-30 fw-200 mb-0"> {apicalls.convertLocalLang('address_available')} </p>
                    <a onClick={() => this.chnageStep("newtransfer")}>Click here to make New Transfer</a>
                </div>}
            </React.Fragment>,
            reasonfortransfer: <React.Fragment>
                <Form
                    autoComplete="off"
                    initialValues={{}}
                >
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item
                                className="custom-forminput custom-label mb-0"
                                name="reason"
                                label={"Reason for transfer"}
                                required
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            apicalls.convertLocalLang("is_required"),
                                    }
                                ]}
                            >
                                <Input.TextArea
                                    className="cust-input "
                                    placeholder={"Reason for transfer"}
                                    maxLength="500"
                                />
                            </Form.Item>

                        </Col>
                    </Row>

                    <AddressDocumnet title={"Upload supporting documents for transaction"} />

                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={6} lg={6} xl={6} xxl={6}></Col>
                        <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                            <br />
                            <Form.Item className="text-center">
                                <Button
                                    htmlType="button"
                                    size="large"
                                    className="pop-btn mb-36"
                                    style={{ minWidth: 300 }}
                                    onClick={() => this.chnageStep("reviewdetails")}
                                >
                                    Next
                                </Button>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={6} lg={6} xl={6} xxl={6}></Col>
                    </Row>
                </Form>
            </React.Fragment>,
            reviewdetails: <React.Fragment>,
                <Form
                    // initialValues={this.state.employeeData}
                    name="advanced_search"
                    ref={this.formRef}
                    onFinish={this.transferDetials}
                    autoComplete="off">
                    <Row gutter={24} className=" text-white mb-24">
                        <Text className="case-val mb-24">Transfer details</Text>
                        {"  "}
                        <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                            <div>
                                <span className='case-val'>You send exactly</span>
                                <span className='case-val ml-36'>1000 USD</span>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                            <div>
                                <span className='case-val'>Total fees</span>
                                <span className='case-val ml-36'>5.45 USD</span>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                            <div>
                                <span className='case-val'>Total we will convert</span>
                                <span className='case-val ml-36'>994.55 USD</span>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                            <div>
                                <span className='case-val'>Recipient gets</span>
                                <span className='case-val ml-36'>900 EUR</span>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                            <div>
                                <span className='case-val'>Description</span>
                                <span className='case-val ml-36'>Bike</span>
                            </div>
                        </Col>
                    </Row>
                    <br />
                    <Row gutter={24} className=" text-white">
                        <Text className="case-val mb-24">Recipient details</Text>
                        {"  "}
                        <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                            <div>
                                <span className='case-val'>Name</span>
                                <span className='case-val ml-36'>Min Blue Black</span>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                            <div>
                                <span className='case-val'>Email</span>
                                <span className='case-val ml-36'>coco@yopmail.com</span>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                            <div>
                                <span className='case-val'>IBAN </span>
                                <span className='case-val ml-36'>LT1234567890</span>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                            <div>
                                <span className='case-val'>Bank Code (BIC/SWIFT) </span>
                                <span className='case-val ml-36'>TG5T57XXX</span>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                            <div className="text-center mt-36 create-account">
                                <Form.Item className="mb-0 mt-16">
                                    <Button
                                        htmlType="button"
                                        onClick={() => this.chnageStep(this.state.isNewTransfer ? "declaration" : "successpage")}
                                        size="large"
                                        block
                                        className="pop-btn px-24"

                                    >
                                        Confirm
                                    </Button>
                                </Form.Item>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </React.Fragment>,
            newtransfer: <>
                <FiatAddress onAddressOptionsChange={(value) => this.setState({ ...this.state, addressOptions: value })} />
                <Paragraph className="mb-16 fs-14 fw-500 text-white  mt-16">Bank Details</Paragraph>
                <Divider />
                <BankDetails transferType={this.state.addressOptions?.transferType} onSubmit={() => this.chnageStep("reviewdetails")} />
            </>,
            declaration: <div className="text-center">
                <Image width={80} preview={false} src={alertIcon} />
                <Title level={2} className="text-white-30 my-16 mb-0">Declaration form sent successfully</Title>
                <Text className="text-white-30">{`Declaration form has been sent to ${"have123@yopmail.com"}. 
                       Please sign using link received in email to whitelist your address`}</Text>
                {/*<div className="my-25"><Button onClick={() => this.props.onBack()} type="primary" className="mt-36 pop-btn text-textDark">BACK TO DASHBOARD</Button> */}
            </div>,
            successpage: <div className="text-center">
                <Image width={80} preview={false} src={success} />
                <Title level={2} className="text-white-30 my-16 mb-0">Your transaction has been processed successfully</Title>
                {/* <Text className="text-white-30">{`Declaration form has been sent to ${"have123@yopmail.com"}. 
                   Please sign using link received in email to whitelist your address`}</Text> */}
                {/*<div className="my-25"><Button onClick={() => this.props.onBack()} type="primary" className="mt-36 pop-btn text-textDark">BACK TO DASHBOARD</Button> */}
            </div>
        }
        return steps[this.state.step];
    }
    render() {
        return <React.Fragment>
            {this.renderStep()}
        </React.Fragment>
    }
}
export default OnthegoFundTransfer;