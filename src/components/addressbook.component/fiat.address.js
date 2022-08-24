import { useForm } from "antd"
import { useState } from "react";

const FiatAddress = ({ onSubmit, fiatAddress }) => {
    const [form] = useForm();
    const [addreassOptions, setAddressOptions] = useState({ addressType: "sepa", transferType: "swift" });
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

                            setAddressOptions({ ...addressOptions, addressType: value.target.value })
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
                        }}
                    >
                        <Radio.Button value="sepa">SEPA</Radio.Button>
                        <Radio.Button value="swift">SWIFT</Radio.Button>
                    </Radio.Group>
                </Col>
            </Row>
        </Form.Item>
        {addreassOptions.addressType === "myself" && <div className="box basic-info alert-info-custom">

            <Row>
                <Col xs={24} md={24} lg={24} xl={8} xxl={8} className="mb-16">
                    <label className="fs-14 fw-400 ">
                        <strong>Name</strong>
                    </label>
                    <div><Text className="fs-14 fw-400 text-purewhite">{favouriteDetails.fullName}</Text></div>

                </Col>
                <Col xs={24} md={24} lg={24} xl={7} xxl={7} className="mb-16">
                    <label className="fs-14 fw-400 ">
                        <strong>Phone</strong>
                    </label>
                    <div><Text className="fs-14 fw-400 text-purewhite">{props.userConfig?.phoneNo}</Text></div>
                </Col>
                <Col xs={24} md={24} lg={24} xl={9} xxl={9} className="mb-16">
                    <label className="fs-14 fw-400">
                        <strong> Email</strong>
                    </label>
                    <div><Text className="fs-14 fw-400 text-purewhite">{props.userConfig?.email}</Text></div>
                </Col>
                <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="mb-16">
                    <label className="fs-14 fw-400 ">
                        <strong> Address</strong>
                    </label>
                    <div><Text className="fs-14 fw-400 text-purewhite">{props.userConfig?.email}</Text></div>
                </Col>
            </Row>
        </div>}
        {addressOptions.addressType !== "myself" && <React.Fragment>
            <Translate
                content="Beneficiary_Details"
                component={Paragraph}
                className="mb-16 fs-14 text-aqua fw-500 text-upper"
            />
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
                            onChange={(e) => handleChange(e)}
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
                {withdraeTab === "Fiat" && (
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
                            {/* <TextArea
              placeholder="Address Line1"
              className="cust-input  cust-text-area"
              autoSize={{ minRows: 2, maxRows: 2 }}
              maxLength={100}
            ></TextArea> */}
                            <TextArea
                                placeholder={apiCalls.convertLocalLang("Address_Line1")}
                                className="cust-input cust-text-area address-book-cust"
                                autoSize={{ minRows: 1, maxRows: 2 }}
                                maxLength={100}
                            ></TextArea>
                        </Form.Item>
                    </Col>
                )}
                {withdraeTab === "Fiat" && (
                    <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                        <Form.Item
                            className="custom-forminput custom-label mb-0"
                            name="line2"
                            // required
                            // rules={[
                            //   {
                            //     required: true,
                            //     message: apiCalls.convertLocalLang("is_required"),
                            //   },
                            //   {
                            //     whitespace: true,
                            //     message: apiCalls.convertLocalLang("is_required"),
                            //   },
                            //   {
                            //     validator: validateContentRule,
                            //   },
                            // ]}
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
                )}
                {withdraeTab === "Fiat" && (
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
                                onChange={(e) => handleCountry(e)}
                                bordered={false}
                            >
                                {country?.map((item, indx) => (
                                    <Option key={indx} value={item.name}>
                                        {item.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                )}
                {withdraeTab === "Fiat" && (
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
                                onChange={(e) => handleState(e)}
                                bordered={false}
                            >
                                {state?.map((item, indx) => (
                                    <Option key={indx} value={item.name}>
                                        {item.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                )}
                {withdraeTab === "Fiat" && (
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
                )}
                {withdraeTab === "Fiat" && (
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
                )}
            </Row>
        </React.Fragment>}
        <Row gutter={[16, 16]}>
            <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                <Translate
                    content={
                        "Beneficiary_BankDetails"
                    }
                    component={Paragraph}
                    className="mb-16 mt-24 fs-14 text-aqua fw-500 text-upper"
                />
                <Button
                    onClick={showModal}
                    style={{ height: "40px" }}
                    className="pop-btn mb-36 "
                >
                    <Translate
                        content={
                            "bankAddress"
                        }
                        component={Text}
                    />
                    <span className="icon md add-icon-black ml-8"></span>
                </Button>
            </Col>
            <Drawer
                title={apiCalls.convertLocalLang("bankAddressDetails")}
                visible={isModalVisible}
                onOk={handleOk}
                width={864}
                destroyOnClose={true}
                closeIcon={
                    <Tooltip title="Close">
                        <span
                            className="icon md close-white c-pointer"
                            onClick={() => handleDeleteCancel()}
                        />
                    </Tooltip>
                }
                className="side-drawer custom-drawer-width"
            >

                {(props?.cryptoTab == 2 || withdraeTab == "Fiat") && (
                    <Form
                        form={bankDetailForm}
                        onFinish={saveModalwithdrawal}
                        autoComplete="off"
                        initialValues={cryptoAddress}
                    >
                        <Row gutter={[16, 16]}>

                            <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                                <Form.Item
                                    className="custom-forminput custom-label mb-0"
                                    name="swiftCode"
                                    label={apiCalls.convertLocalLang(
                                        addressOptions.transferType === "sepa" ? "bicnumber" : "swiftcode"
                                    )}
                                    required
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                apiCalls.convertLocalLang("is_required"),
                                        },
                                        {
                                            validator(_, value) {
                                                if (emailExist) {
                                                    return Promise.reject(
                                                        "Invalid BIC/SWIFT/Routing number"
                                                    );
                                                } else if (
                                                    value &&
                                                    !/^[A-Za-z0-9]+$/.test(value)
                                                ) {
                                                    return Promise.reject(
                                                        "Invalid BIC/SWIFT/Routing number"
                                                    );
                                                } else {
                                                    return Promise.resolve();
                                                }
                                            },
                                        },
                                    ]}
                                >
                                    <Input
                                        className="cust-input "
                                        placeholder={apiCalls.convertLocalLang(
                                            addressOptions.transferType === "sepa" ? "bicnumber" : "swiftcode"
                                        )}
                                        maxLength="500"
                                    />
                                </Form.Item>
                            </Col>
                            {addressOptions.transferType === "swift" && <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                                <Form.Item
                                    className="custom-forminput custom-label mb-0"
                                    name="routingNumber"
                                    label={apiCalls.convertLocalLang(
                                        "Routing_number"
                                    )}
                                    required
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                apiCalls.convertLocalLang("is_required"),
                                        },
                                        {
                                            validator(_, value) {
                                                if (emailExist) {
                                                    return Promise.reject(
                                                        "Invalid ACH/Routing number"
                                                    );
                                                } else if (
                                                    value &&
                                                    !/^[A-Za-z0-9]+$/.test(value)
                                                ) {
                                                    return Promise.reject(
                                                        "Invalid ACH/Routing number"
                                                    );
                                                } else {
                                                    return Promise.resolve();
                                                }
                                            },
                                        },
                                    ]}
                                >
                                    <Input
                                        className="cust-input "
                                        placeholder={apiCalls.convertLocalLang(
                                            "Routing_number"
                                        )}
                                        maxLength="500"
                                    />
                                </Form.Item>
                            </Col>}
                            {bankChange == "IBAN" || addressOptions.transferType == "sepa" ? (
                                <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                                    <Form.Item
                                        className="custom-forminput custom-label mb-0"
                                        name="IBAN"
                                        label={apiCalls.convertLocalLang(
                                            "Bank_account_iban"
                                        )}
                                        required
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    apiCalls.convertLocalLang("is_required"),
                                            },
                                            {
                                                validator(_, value) {
                                                    if (emailExist) {
                                                        return Promise.reject(
                                                            "Invalid  IBAN Number"
                                                        );
                                                    } else if (
                                                        value &&
                                                        !/^[A-Za-z0-9]+$/.test(value)
                                                    ) {
                                                        return Promise.reject(
                                                            "Invalid  IBAN Number"
                                                        );
                                                    } else {
                                                        return Promise.resolve();
                                                    }
                                                },
                                            },
                                        ]}
                                        onBlur={(e) => handleIban(e.target.value)}
                                    >
                                        <Input
                                            className="cust-input"
                                            placeholder={apiCalls.convertLocalLang(
                                                "Bank_account_iban"
                                            )}
                                        />
                                    </Form.Item>
                                </Col>
                            ) : (
                                <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                                    <Form.Item
                                        className="custom-forminput custom-label mb-0"
                                        name="accountNumber"
                                        label={apiCalls.convertLocalLang("Bank_account")}
                                        required
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    apiCalls.convertLocalLang("is_required"),
                                            },
                                            {
                                                validator(_, value) {
                                                    if (emailExist) {
                                                        return Promise.reject(
                                                            "Invalid  Bank Account Number"
                                                        );
                                                    } else if (
                                                        value &&
                                                        !/^[A-Za-z0-9]+$/.test(value)
                                                    ) {
                                                        return Promise.reject(
                                                            "Invalid  Bank Account Number"
                                                        );
                                                    } else {
                                                        return Promise.resolve();
                                                    }
                                                },
                                            },
                                        ]}
                                    >
                                        <Input
                                            className="cust-input "
                                            placeholder={apiCalls.convertLocalLang(
                                                "Bank_account"
                                            )}
                                            maxLength="500"
                                        />
                                    </Form.Item>
                                </Col>
                            )}
                            <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                                <Form.Item
                                    className="custom-forminput custom-label mb-0"
                                    name="bankName"
                                    label={apiCalls.convertLocalLang("Bank_name")}
                                    required
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                apiCalls.convertLocalLang("is_required"),
                                        },
                                        {
                                            whitespace: true,
                                            message:
                                                apiCalls.convertLocalLang("is_required"),
                                        },
                                        {
                                            validator: validateContentRule,
                                        },
                                    ]}
                                >
                                    <Input
                                        className="cust-input"
                                        placeholder={apiCalls.convertLocalLang(
                                            "Bank_name"
                                        )}
                                        maxLength="500"
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                                <Form.Item
                                    className="custom-forminput custom-label mb-0"
                                    name="payeeAccountCountry"
                                    required
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                apiCalls.convertLocalLang("is_required"),
                                        },
                                        {
                                            whitespace: true,
                                        },
                                        {
                                            validator: validateContentRule,
                                        },
                                    ]}
                                    label={
                                        <Translate
                                            content="Country"
                                            component={Form.label}
                                        />
                                    }
                                >
                                    <Select
                                        showSearch
                                        placeholder={apiCalls.convertLocalLang(
                                            "select_country"
                                        )}
                                        className="cust-input select-crypto cust-adon mb-0 text-center c-pointer"
                                        dropdownClassName="select-drpdwn"
                                        onChange={(e) => handleCountryChange(e)}
                                        bordered={false}
                                    >
                                        {country.map((item, indx) => (
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
                                    name="payeeAccountState"
                                    required
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                apiCalls.convertLocalLang("is_required"),
                                        },
                                        {
                                            whitespace: true,
                                            message:
                                                apiCalls.convertLocalLang("is_required"),
                                        },
                                        {
                                            validator: validateContentRule,
                                        },
                                    ]}
                                    label={
                                        <Translate
                                            content="state"
                                            component={Form.label}
                                        />
                                    }
                                >
                                    <Select
                                        showSearch
                                        placeholder={apiCalls.convertLocalLang(
                                            "select_state"
                                        )}
                                        className="cust-input select-crypto cust-adon mb-0 text-center c-pointer"
                                        dropdownClassName="select-drpdwn"
                                        onChange={(e) => handleStateChange(e)}
                                        bordered={false}
                                    >
                                        {newStates?.map((item, indx) => (
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
                                    name="payeeAccountCity"
                                    required
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                apiCalls.convertLocalLang("is_required"),
                                        },
                                        {
                                            whitespace: true,
                                            message:
                                                apiCalls.convertLocalLang("is_required"),
                                        },
                                        {
                                            validator: validateContentRule,
                                        },
                                    ]}
                                    label={
                                        <Translate
                                            content="city"
                                            component={Form.label}
                                        />
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
                                    name="payeeAccountPostalCode"
                                    required
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                apiCalls.convertLocalLang("is_required"),
                                        },
                                        {
                                            whitespace: true,
                                            message:
                                                apiCalls.convertLocalLang("is_required"),
                                        },
                                        {
                                            validator: validateContentRule,
                                        },
                                    ]}
                                    label={
                                        <Translate
                                            content="Post_code"
                                            component={Form.label}
                                        />
                                    }
                                >
                                    <Input
                                        className="cust-input"
                                        maxLength="20"
                                        placeholder={apiCalls.convertLocalLang(
                                            "Post_code"
                                        )}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <div className="text-right mt-12">
                            <Button
                                className="pop-btn px-36"
                                style={{ margin: "0 8px" }}
                                onClick={() => handleCancel()}
                            >
                                {apiCalls.convertLocalLang("cancel")}
                            </Button>
                            <Button
                                htmlType="submit"
                                size="large"
                                className="pop-btn px-36"
                                loading={btnDisabled}
                                style={{ minWidth: 150 }}
                            >
                                {isLoading && <Spin indicator={antIcon} />}{" "}
                                <Translate content="Save_btn_text" />
                            </Button>
                        </div>
                    </Form>
                )}
            </Drawer>
        </Row>
        {bankmodalData?.map((item, indx) => {
            if (item.recordStatus !== "Deleted") {
                return (
                    <Row gutter={14} style={{ paddingBottom: "15px" }}>
                        <div
                            className="d-flex align-center kpi-List"
                            key={indx}
                            value={item}
                            style={{
                                marginLeft: "20px",
                                width: "100%",
                                height: "65px",
                                backgroundColor: "var(--bgDarkGrey)",
                                borderRadius: "20px",
                            }}
                        >
                            {props?.cryptoTab == 2 || withdraeTab == "Fiat" ? (
                                <Col
                                    className="mb-0"
                                    xs={20}
                                    sm={20}
                                    md={20}
                                    lg={20}
                                    xxl={20}
                                >
                                    <Row>
                                        <Col span={24} className="mb-0">
                                            <label
                                                className="kpi-label fs-16"
                                                style={{
                                                    fontSize: "20px",
                                                    marginLeft: "20px",
                                                }}
                                            >
                                                {item.walletCode}
                                                {","} {item.bankType}
                                                {","} {item.accountNumber}
                                                {","} {item.swiftCode}
                                                {","} {item.bankName}
                                            </label>
                                        </Col>
                                    </Row>
                                </Col>
                            ) : (
                                <Col
                                    className="mb-0"
                                    xs={20}
                                    sm={20}
                                    md={20}
                                    lg={20}
                                    xxl={20}
                                >
                                    <Row>
                                        <Col span={24} className="mb-0">
                                            <label
                                                className="kpi-label fs-16"
                                                style={{
                                                    fontSize: "20px",
                                                    marginLeft: "20px",
                                                }}
                                            >
                                                {item.label}
                                                {","} {item.walletCode}
                                                {","} {item.walletAddress}
                                            </label>
                                        </Col>
                                    </Row>
                                </Col>
                            )}

                            <Col
                                className="mb-0"
                                xs={4}
                                sm={4}
                                md={4}
                                lg={4}
                                xxl={4}
                            >
                                <div
                                    className="d-flex align-center "
                                    style={{
                                        marginTop: "22px",
                                        left: "5cm",
                                        width: "100%",
                                        top: "15px",
                                        justifyContent: "center",
                                        marginBottom: "24px",
                                    }}
                                >
                                    <div
                                        className="ml-12 mr-12"
                                        onClick={() => handleshowModal(item)}
                                    >
                                        <Tooltip
                                            placement="topRight"
                                            style={{
                                                fontSize: "23px",
                                                marginRight: "20px",
                                            }}
                                            title={<Translate content="edit" />}
                                        >
                                            <Link className="icon md edit-icon mr-0 fs-30"></Link>
                                        </Tooltip>
                                    </div>

                                    <div
                                        className="ml-12 mr-12"
                                        onClick={() => handleDelete(item)}
                                    >
                                        <Tooltip
                                            placement="topRight"
                                            style={{
                                                fontSize: "23px",
                                                marginRight: "10px",
                                            }}
                                            title={<Translate content="delete" />}
                                        >
                                            <Link className="icon md delete-icon mr-0"></Link>
                                        </Tooltip>
                                    </div>
                                </div>
                            </Col>
                        </div>
                    </Row>
                );
            }
        })}
        <Modal
            title={"Confirm Delete"}
            visible={isModalDelete}
            onOk={handleOk}
            width={400}
            destroyOnClose={true}
            closeIcon={
                <Tooltip title="Close">
                    <span
                        className="icon md close-white c-pointer"
                        onClick={() => handleDeleteCancel()}
                    />
                </Tooltip>
            }
            footer={
                <>
                    <Button
                        className="pop-btn px-36 pop-btn-46"
                        style={{ margin: "0 8px" }}
                        onClick={() => handleDeleteCancel()}
                    >
                        No
                    </Button>
                    <Button
                        className="pop-btn px-36 pop-btn-46"
                        style={{ margin: "0 8px" }}
                        onClick={() => handleDeleteModal()}
                    >
                        yes
                    </Button>
                </>
            }
        >
            <p className="fs-16 mb-0">Do you really want to delete ?</p>
        </Modal>
        <div style={{ position: "relative" }}>
            <div className="d-flex">
                <Form.Item
                    className="custom-forminput mt-36 agree"
                    name="isAgree"
                    valuePropName="checked"
                    required
                >
                    <Checkbox
                        className={`ant-custumcheck ${!agreeRed ? "check-red " : " "
                            }`}
                    />
                </Form.Item>
                <Translate
                    content="agree_to_suissebase"
                    with={{ link }}
                    component={Paragraph}
                    className="fs-14 text-white-30 ml-16  mt-36"
                    style={{
                        index: 50,
                        position: "absolute",
                        width: "600px",
                        top: 10,
                        left: 30,
                        paddingBottom: "10px",
                        marginBottom: "10px",
                    }}
                />
            </div>

            {!props?.addressBookReducer?.selectedRowData?.isWhitelisted && (
                <div className="whitelist-note">
                    <Alert
                        type="warning"
                        description={`${apiCalls.convertLocalLang("note")} : 
        ${apiCalls.convertLocalLang("declaration")} 
        ${props?.userConfig?.email || favouriteDetails?.email}. 
        ${apiCalls.convertLocalLang("whitelist_note")} `}
                        showIcon
                        closable={false}
                    />
                </div>
            )}
        </div>

        <Form.Item className="text-center">
            <Button
                htmlType="submit"
                size="large"
                className="pop-btn mb-36"
                loading={btnDisabled}
                style={{ minWidth: 300 }}
            >
                {isLoading && <Spin indicator={antIcon} />}{" "}
                <Translate content="Save_btn_text" />
            </Button>
        </Form.Item>
    </Form>
}

export default FiatAddress;