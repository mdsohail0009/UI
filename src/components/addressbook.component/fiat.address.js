import React, { useState } from "react";
import { Form, Row, Col, Radio, AutoComplete, Typography, Input, Select, Divider } from 'antd';
import { useForm } from "antd/lib/form/Form";
import Translate from "react-translate-component";
import apiCalls from "../../api/apiCalls";
import { validateContentRule } from "../../utils/custom.validator";
import AddressDocumnet from "./document.upload";

const { Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const FiatAddress = ({ onSubmit, onAddressOptionsChange, PayeeLu = [], emailExist = false, countries = [], states = [], fiatAddress, ...props }) => {
    const [form] = useForm();
    const [addressOptions, setAddressOptions] = useState({ addressType: "myself", transferType: "sepa" });
    return <Form
        form={form}
        onFinish={onSubmit}
        autoComplete="off"
        initialValues={fiatAddress}
    >
        <Form.Item
            name="addressType"

            className="custom-label text-center mb-0"
        >
            <Row gutter={[16, 16]}>
                <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Radio.Group
                        defaultValue={addressOptions.addressType}
                        className="mb-16 custom-radio-btn buysell-toggle crypto-toggle"
                        onChange={(value) => {

                            setAddressOptions({ ...addressOptions, addressType: value.target.value });
                            onAddressOptionsChange({ ...addressOptions, addressType: value.target.value });

                        }}
                    >
                        <Radio.Button value="myself">{props.userConfig?.isBusiness ? "Own Business" : "My Self"}</Radio.Button>
                        <Radio.Button value="someoneelse">SomeOne Else</Radio.Button>
                        <Radio.Button value="business">Business</Radio.Button>
                    </Radio.Group>
                </Col>
            </Row>

        </Form.Item>
        <Form.Item>
            <Translate
                content="transfer_type"
                component={Text}
                className="text-white"
            />
            <Row gutter={[16, 16]}>

                <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="">
                    <Radio.Group
                        defaultValue={addressOptions.transferType}
                        className="mb-16 custom-radio-btn buysell-toggle crypto-toggle"
                        onChange={(value) => {
                            setAddressOptions({ ...addressOptions, transferType: value.target.value })
                            onAddressOptionsChange({ ...addressOptions, transferType: value.target.value });

                        }}
                    >
                        <Radio.Button value="sepa">SEPA</Radio.Button>
                        <Radio.Button value="swift">SWIFT</Radio.Button>
                    </Radio.Group>
                </Col>
            </Row>
        </Form.Item>
        {addressOptions.addressType === "myself" && <div className="box basic-info alert-info-custom">

            <Row>
                <Col xs={24} md={24} lg={24} xl={8} xxl={8} className="mb-16">
                    <label className="fs-14 fw-400 ">
                        <strong>Name</strong>
                    </label>
                    <div><Text className="fs-14 fw-400 text-purewhite">{"john"}</Text></div>

                </Col>
                <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="mb-16">
                    <label className="fs-14 fw-400 ">
                        <strong> Address</strong>
                        <div><Text className="fs-14 fw-400 text-purewhite">Pl 19,FL 102,Rukmini nilayam,SP Nagar,JNTU,Hyderabad, Telangana - 500085</Text></div>
                    </label>
                    <div><Text className="fs-14 fw-400 text-purewhite">{props.userConfig?.email}</Text></div>
                </Col>
            </Row>
        </div>}
        {addressOptions.addressType !== "myself" && <React.Fragment>
            <Translate
                content="Beneficiary_Details"
                component={Paragraph}
                className="mb-16 fs-14 text-white fw-500"
            />
            <Divider />
            <Row gutter={[16, 16]}>
                <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                        className="custom-forminput custom-label mb-0"
                        name="favouriteName"
                        label={
                            <Translate
                                content="favorite_name"
                                component={Form.label}
                            />
                        }
                        required
                        rules={[
                            {
                                required: true,
                                message: apiCalls.convertLocalLang("is_required"),
                            },
                            {
                                whitespace: true,
                                message: apiCalls.convertLocalLang("is_required"),
                            },
                            {
                                validator: validateContentRule,
                            },
                        ]}
                    >
                        <AutoComplete
                            onChange={(e) => { }}
                            maxLength={20}
                            className="cust-input"
                            placeholder={apiCalls.convertLocalLang("favorite_name")}
                        >
                            {PayeeLu?.map((item, indx) => (
                                <Option key={indx} value={item.name}>
                                    {item.name}
                                </Option>
                            ))}
                        </AutoComplete>
                    </Form.Item>
                </Col>

                <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                        className="custom-forminput custom-label mb-0"
                        name="fullName"
                        required
                        rules={[
                            {
                                required: true,
                                message: apiCalls.convertLocalLang("is_required"),
                            },
                            {
                                whitespace: true,
                                message: apiCalls.convertLocalLang("is_required"),
                            },
                            {
                                validator: validateContentRule,
                            },
                        ]}
                        label={
                            <Translate content={addressOptions.addressType === "business" ? "buisiness_name" : "Fait_Name"} component={Form.label} />
                        }
                    >
                        <Input
                            className="cust-input"
                            placeholder={apiCalls.convertLocalLang("Fait_Name")}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                        name="email"
                        label={apiCalls.convertLocalLang("email")}
                        className="custom-forminput custom-label mb-0"
                        type="email"
                        rules={[
                            {
                                required: true,
                                message: apiCalls.convertLocalLang("is_required"),
                            },
                            {
                                validator(_, value) {
                                    if (emailExist) {
                                        return Promise.reject("Email already exist");
                                    } else if (
                                        value &&
                                        !/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,15}(?:\.[a-z]{2})?)$/.test(
                                            value
                                        )
                                    ) {
                                        return Promise.reject("Invalid email");
                                    } else {
                                        return Promise.resolve();
                                    }
                                },
                            },
                        ]}
                    >
                        <Input
                            placeholder={apiCalls.convertLocalLang("email")}
                            className="cust-input"
                            maxLength={100}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                        className="custom-forminput custom-label mb-0"
                        name="phoneNumber"
                        rules={[
                            {
                                required: true,
                                message: apiCalls.convertLocalLang("is_required"),
                            },
                            {
                                validator(_, value) {
                                    if (emailExist) {
                                        return Promise.reject("Phone number already exist");
                                    } else if (
                                        value &&
                                        !/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(
                                            value
                                        )
                                    ) {
                                        return Promise.reject("Invalid phone number");
                                    } else {
                                        return Promise.resolve();
                                    }
                                },
                            },
                        ]}
                        label={
                            <Translate content="Phone_No" component={Form.label} />
                        }
                    >
                        <Input
                            className="cust-input"
                            maxLength="20"
                            placeholder={apiCalls.convertLocalLang("Phone_No")}
                            allowNegative={false}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                        className="custom-forminput custom-label mb-0"
                        name="line1"
                        required
                        rules={[
                            {
                                required: true,
                                message: apiCalls.convertLocalLang("is_required"),
                            },
                            {
                                whitespace: true,
                                message: apiCalls.convertLocalLang("is_required"),
                            },
                            {
                                validator: validateContentRule,
                            },
                        ]}
                        label={
                            <Translate
                                content="Address_Line1"
                                component={Form.label}
                            />
                        }
                    >
                        <TextArea
                            placeholder={apiCalls.convertLocalLang("Address_Line1")}
                            className="cust-input cust-text-area address-book-cust"
                            autoSize={{ minRows: 1, maxRows: 2 }}
                            maxLength={100}
                        ></TextArea>
                    </Form.Item>
                </Col>
                <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                        className="custom-forminput custom-label mb-0"
                        name="line2"
                        rules={[

                            {
                                validator: validateContentRule,
                            }
                        ]}
                        label={
                            <Translate
                                content="Address_Line2"
                                component={Form.label}
                            />
                        }
                    >
                        <TextArea
                            placeholder={apiCalls.convertLocalLang("Address_Line2")}
                            className="cust-input cust-text-area address-book-cust"
                            autoSize={{ minRows: 1, maxRows: 1 }}
                            maxLength={100}
                        ></TextArea>
                    </Form.Item>
                </Col>
                <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                        className="custom-forminput custom-label mb-0"
                        name="line3"
                        rules={[
                            {
                                validator: validateContentRule,
                            },
                        ]}
                        label={
                            <Translate
                                content="Address_Line3"
                                component={Form.label}
                            />
                        }
                    >
                        <TextArea
                            placeholder={apiCalls.convertLocalLang("Address_Line3")}
                            className="cust-input cust-text-area address-book-cust"
                            autoSize={{ minRows: 1, maxRows: 2 }}
                            maxLength={100}
                        ></TextArea>
                    </Form.Item>
                </Col>
                <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                        className="custom-forminput custom-label mb-0"
                        name="line3"
                        required
                        rules={[
                            {
                                validator: validateContentRule,
                            },
                        ]}
                        label={
                            "Reason for transfer"
                        }
                    >
                        <TextArea
                            placeholder={"Reason for transfer"}
                            className="cust-input cust-text-area address-book-cust"
                            autoSize={{ minRows: 1, maxRows: 2 }}
                            maxLength={100}
                        ></TextArea>
                    </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                        className="custom-forminput custom-label mb-0"
                        name="country"
                        required
                        rules={[
                            {
                                required: true,
                                message: apiCalls.convertLocalLang("is_required"),
                            },
                            {
                                whitespace: true,
                                message: apiCalls.convertLocalLang("is_required"),
                            },
                            {
                                validator: validateContentRule,
                            },
                        ]}
                        label={
                            <Translate content="Country" component={Form.label} />
                        }
                    >
                        <Select
                            showSearch
                            placeholder={apiCalls.convertLocalLang(
                                "select_country"
                            )}
                            className="cust-input select-crypto cust-adon mb-0 text-center c-pointer"
                            dropdownClassName="select-drpdwn"
                            onChange={(e) => { }}
                            bordered={false}
                        >
                            {countries?.map((item, indx) => (
                                <Option key={indx} value={item.name}>
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
                        label={
                            <Translate content="state" component={Form.label} />
                        }
                    >
                        <Select
                            showSearch
                            placeholder={apiCalls.convertLocalLang("select_state")}
                            className="cust-input select-crypto cust-adon mb-0 text-center c-pointer"
                            dropdownClassName="select-drpdwn"
                            onChange={(e) => { }}
                            bordered={false}
                        >
                            {states?.map((item, indx) => (
                                <Option key={indx} value={item.name}>
                                    {item.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                        className="custom-forminput custom-label mb-0"
                        name="city"
                        required
                        rules={[
                            {
                                required: true,
                                message: apiCalls.convertLocalLang("is_required"),
                            },
                            {
                                whitespace: true,
                                message: apiCalls.convertLocalLang("is_required"),
                            },
                            {
                                validator: validateContentRule,
                            },
                        ]}
                        label={
                            <Translate content="city" component={Form.label} />
                        }
                    >
                        <Input
                            className="cust-input"
                            maxLength="20"
                            placeholder={apiCalls.convertLocalLang("city")}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                        className="custom-forminput custom-label mb-0"
                        name="postalCode"
                        required
                        rules={[
                            {
                                required: true,
                                message: apiCalls.convertLocalLang("is_required"),
                            },
                            {
                                whitespace: true,
                                message: apiCalls.convertLocalLang("is_required"),
                            },
                            {
                                validator: validateContentRule,
                            },
                        ]}
                        label={
                            <Translate content="Post_code" component={Form.label} />
                        }
                    >
                        <Input
                            className="cust-input"
                            maxLength="10"
                            placeholder={apiCalls.convertLocalLang("Post_code")}
                        />
                    </Form.Item>
                </Col>

            </Row>
        </React.Fragment>}

    </Form>
}

export default FiatAddress;