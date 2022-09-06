import React, { Component } from "react";
import { Input, Row, Col, Form, Button, Typography, List, Divider, Image, Select } from 'antd';
import apicalls from "../../api/apiCalls";
import AddressDocumnet from "../addressbook.component/document.upload";
import oops from '../../assets/images/oops.png'
import FiatAddress from "../addressbook.component/fiat.address";
import BankDetails from "../addressbook.component/bank.details";
import alertIcon from '../../assets/images/pending.png';
import success from '../../assets/images/success.png';
import Translate from "react-translate-component";
import { Link } from 'react-router-dom';
import Verification from "./verification.component/verification";
import NumberFormat from "react-number-format";
const { Paragraph, Text, Title } = Typography;
const { Search } = Input;

class OnthegoFundTransfer extends Component {
    enteramtForm = React.createRef();
    state = {
        step: "enteramount",
        // filterObj:[],
        filterObj: [{ lable: "Payee 100", address: "100032498902", type: "1st Party" }, { lable: "Payee 100", address: "100032498902", type: "3rd Party" }],
        addressOptions: { addressType: "myself", transferType: this.props.selectedCurrency === "EUR" ? "sepa" : "domestic" },
        isNewTransfer: false,
        amount: ""
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
                initialValues={{ amount: "" }}
                ref={this.enteramtForm}
                onFinish={() => this.chnageStep("newtransfer")}
            >
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                        <Form.Item
                            className="custom-forminput custom-label mb-0 fund-transfer-input"
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
                            <NumberFormat
                                customInput={Input}
                                className="cust-input custom-add-select "
                                placeholder={"Enter amount"}
                                maxLength="20"
                                decimalScale={8}
                                displayType="input"
                                allowNegative={false}
                                thousandSeparator={","}
                                addonBefore={this.props.selectedCurrency}
                                onValueChange={() => {
                                    this.setState({ ...this.state, amount: this.enteramtForm.current.getFieldsValue().amount })
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                        <Form.Item
                            className="custom-forminput custom-label mb-0"
                            name="description"
                            label={"Description"}
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
                                className="cust-input cust-text-area address-book-cust"
                                placeholder={"Description"}
                                maxLength={100}
                                autoSize={{ minRows: 1, maxRows: 1 }}
                            />
                        </Form.Item>

                    </Col>
                </Row>
                <Row gutter={[16, 16]}>

                    <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                        <br />
                        <Form.Item className="text-center">
                            <Button
                                htmlType="submit"
                                size="large"
                                className="pop-btn mb-36"
                                style={{ minWidth: 300 }}
                            >
                                New Transfer
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
                <div className="mb-16 text-left">
                    <text Paragraph
                        className='text-white fs-30 fw-600 px-4 '>Who are you sending money to?</text>
                </div>
                {/* <div className="d-flex cust-fund ml-24">
                <label className="text-white">Search for Payeee</label>
                <Search
                    placeholder=""
                    className="search-input"
                    style={{
                        width: 515,
                    }}
                      autoComplete
                     
                    /> */}
                {/* <Select className='text-black usr-add'> */}
                {/* </Select> */}
                {/* <span> <DownOutlined /></span> */}
                {/* </div> */}
                <Col xs={24} md={24} lg={24} xl={24} xxl={24}>

                    <Form.Item
                        className="custom-forminput custom-label mb-0 text-white-30 custom-placeholder"
                        name="lastName"
                        required
                        label={"Search for Payeee"}
                    >
                        {/* <Search placeholder="Search" 
                                addonAfter={<span className="icon md search-white" />}  size="middle" bordered={false} className="mt-24 mb-8 cust-input cust-select mb-0 text-white-30" />               */}
                        <Select placeholder="Select Language" bordered={false}
                            className="cust-input cust-select mb-0 text-white-30"
                            dropdownClassName="select-drpdwn"
                            addonAfter={<span className="icon md search-white" />}
                        >
                        </Select></Form.Item>
                </Col>

                {(filterObj.length > 0) && <>
                    <Title className="fs-24 fw-600 text-white mt-24">Address Book</Title>
                    <Divider className="cust-divide" />
                    <ul style={{ listStyle: 'none', paddingLeft: 0, }} className="addCryptoList">
                        {filterObj?.map((item, idx) =>
                            <Row className="fund-border c-pointer" onClick={() => this.chnageStep(item.type === "3rd Party" ? "reasonfortransfer" : "reviewdetails")}>
                                <Col xs={2} md={2} lg={2} xl={3} xxl={3} className="mb-16"><div class="fund-circle text-white">P</div></Col>
                                <Col xs={24} md={24} lg={24} xl={19} xxl={19} className="mb-16 small-text-align">
                                    <label className="fs-16 fw-400 text-purewhite">
                                        <strong>Payee100
                                            {/* <small>{item.type}</small> */}
                                        </strong>
                                    </label>
                                    <div><Text className="fs-14 fw-400 text-purewhite">USD acc ending in 4544</Text></div>

                                </Col>
                                <Col xs={24} md={24} lg={24} xl={2} xxl={2} className="mb-0 mt-8">
                                    <span class="icon md rarrow-white"></span>
                                </Col>
                            </Row>


                        )}
                        {/* <Title className="fs-16 fw-600 text-white text-center cust-address">If address not found,<a className="create-new">Create New Transfer</a></Title> */}
                    </ul>

                    <Title className="fs-24 fw-600 text-white">Past Recipients</Title>
                    <Divider className="cust-divide" />
                    <ul style={{ listStyle: 'none', paddingLeft: 0, }} className="addCryptoList">
                        {filterObj?.map((item, idx) =>
                            <Row className="fund-border c-pointer" onClick={() => this.chnageStep(item.type === "3rd Party" ? "reasonfortransfer" : "reviewdetails")}>
                                <Col xs={2} md={2} lg={2} xl={3} xxl={3} className="mb-16"><div class="fund-circle text-white">P</div></Col>
                                <Col xs={24} md={24} lg={24} xl={19} xxl={19} className="mb-16 small-text-align">
                                    <label className="fs-16 fw-400 text-purewhite">
                                        <strong>Payee100
                                            {/* <small>{item.type}</small> */}
                                        </strong>
                                    </label>
                                    <div><Text className="fs-14 fw-400 text-purewhite">USD acc ending in 4544</Text></div>

                                </Col>
                                <Col xs={24} md={24} lg={24} xl={2} xxl={2} className="mb-0 mt-8">
                                    <span class="icon md rarrow-white"></span>
                                </Col>



                            </Row>

                        )}
                    </ul>
                </>}
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
                    <div className="text-center"> <text Paragraph
                        className='text-white fs-24 fw-600 mb-16 px-4 '>Review Details Of Transfer</text></div>
                    <Row gutter={24}>
                        <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                            <div className="d-flex  justify-content" style={{ alignItems: 'baseline' }}>
                                <Text className="mb-8 fs-14 text-white fw-500 text-upper mt-16">Transfer details</Text>

                                {/* <div><Link >Edit
                                </Link>
                                </div> */}
                            </div>
                        </Col>
                        {"  "}
                        <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                            <div className="d-flex  justify-content" style={{ alignItems: 'baseline' }}>
                                <Title className="mb-4 fs-10 text-white fw-400 text-upper mt-16">How much you will receive</Title>
                                <Title className="mb-4 fs-10 text-white fw-500 text-upper mt-16  text-right">994.55 USD</Title>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                            <div className="d-flex  justify-content" style={{ alignItems: 'baseline' }}>
                                <Title className="mb-4 fs-10 text-white fw-400 text-upper ">Total fees</Title>
                                <Title className="mb-4 fs-10 text-white fw-500 text-upper  text-right">5.45 USD</Title>
                            </div>
                        </Col>
                        {/* <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                            <div className="d-flex  justify-content" style={{ alignItems: 'baseline' }}>
                                <Title className="mb-4 fs-10 text-white fw-400 text-upper ">Total we will convert</Title>
                                <Title className="mb-4 fs-10 text-white fw-500 text-upper  text-right"></Title>
                            </div>
                        </Col> */}
                        <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                            <div className="d-flex  justify-content" style={{ alignItems: 'baseline' }}>
                                <Title className="mb-4 fs-10 text-white fw-400 text-upper ">Withdrawal amount</Title>
                                <Title className="mb-4 fs-10 text-white fw-500 text-upper  text-right">1000 USD</Title>
                            </div>
                        </Col>
                        {/* <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                            <div className="d-flex  justify-content" style={{ alignItems: 'baseline' }}>
                                <Title className="mb-4 fs-10 text-white fw-400 text-upper ">Description</Title>
                                <Title className="mb-4 fs-10 text-white fw-500 text-upper  text-right">Bike</Title>
                            </div>
                        </Col> */}
                    </Row>

                    <Row gutter={24} className=" text-white mt-36">
                        <Col xs={24} sm={24} md={24} lg={24} xxl={24} >
                            <div className="d-flex  justify-content" style={{ alignItems: 'baseline' }}>
                                <Text className="mb-8 fs-14 text-white fw-500 text-upper mt-16">Recipient details</Text>

                                {/* <div><Link >Change
                                </Link>
                                </div> */}
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                            <div className="d-flex  justify-content" style={{ alignItems: 'baseline' }}>
                                <Title className="mb-4 fs-10 text-white fw-400 text-upper mt-16">Save Whitelist name as</Title>
                                <Title className="mb-4 fs-10 text-white fw-500 text-upper mt-16  text-right">MBB</Title>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                            <div className="d-flex  justify-content" style={{ alignItems: 'baseline' }}>
                                <Title className="mb-4 fs-10 text-white fw-400 text-upper ">Beneficiary Name</Title>
                                <Title className="mb-4 fs-10 text-white fw-500 text-upper  text-right">Min Blue Black</Title>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                            <div className="d-flex  justify-content" style={{ alignItems: 'baseline' }}>
                                <Title className="mb-4 fs-10 text-white fw-400 text-upper ">IBAN </Title>
                                <Title className="mb-4 fs-10 text-white fw-500 text-upper  text-right">LT1234567890</Title>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                            <div className="d-flex  justify-content" style={{ alignItems: 'baseline' }}>
                                <Title className="mb-4 fs-10 text-white fw-400 text-upper ">Reason for transfer </Title>
                                <Title className="mb-4 fs-10 text-white fw-500 text-upper  text-right">Payment</Title>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                            <div className="d-flex  justify-content" style={{ alignItems: 'baseline' }}>
                                <Title className="mb-4 fs-10 text-white fw-400 text-upper ">Bank Name </Title>
                                <Title className="mb-4 fs-10 text-white fw-500 text-upper  text-right">XXXX</Title>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                            <Verification />
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
                                        Continue to Verification
                                    </Button>
                                </Form.Item>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </React.Fragment>,
            newtransfer: <>
                <FiatAddress currency={this.props.selectedCurrency} onContinue={() => this.chnageStep("reviewdetails")} onAddressOptionsChange={(value) => this.setState({ ...this.state, addressOptions: value })} amount={this.state.amount} />
                {/* <Paragraph className="mb-16 fs-14 fw-500 text-white  mt-16">Bank Details</Paragraph> */}
                {/* <Divider />
                <BankDetails transferType={this.state.addressOptions?.transferType} />
                {(this.state.addressOptions.addressType !== "myself"||this.state.addressOptions.transferType==="international")&&(this.state.addressOptions.transferType!=="domestic") && <AddressDocumnet title={"please upload supporting documents for transaction "} />}
                <div className="text-right mt-12">
                    <Button
                        className="pop-btn px-36"
                        style={{ margin: "0 8px" }}
                        onClick={() => { }}
                    >
                        {apicalls.convertLocalLang("cancel")}
                    </Button>
                    <Button
                        htmlType="button"
                        size="large"
                        className="pop-btn px-36"
                        style={{ minWidth: 150 }}
                        onClick={() => this.chnageStep("reviewdetails")}
                    >
                        <Translate content="Save_btn_text" />
                    </Button>
                </div> */}
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