import React, { useEffect, useRef, useState } from 'react';
import { Button, Row, Col, Form, Select, Input, Radio, Modal, Tooltip, Alert, Checkbox, SelectProps } from 'antd';
import { referalCode, saveCustomer } from './api';
import Countries from './countries.json';
import apicalls from '../../api/apiCalls';
// import { userInfo} from '../../reducers/configReduser';
import { getmemeberInfo } from '../../reducers/configReduser';
import { connect } from 'react-redux';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

const { Option } = Select;

const Auth0 = (props) => {
  const busssinessForm = useRef();
  const personalForm = useRef();
  const [form] = Form.useForm();
  const [value, setValue] = useState("bussiness");
  const [isBusinessAccount, setIsBusinessAccount] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [businessError, setBusinessError] = useState(null);
  const [filteredCountries, setFilteredCountries] = useState([...Countries]);
  const [filteredCodeCountries, setFilteredCodeCountries] = useState([...Countries]);
  const [phoneCode, setPhoneCode] = useState("");
  const [isChecked, setIsChecked] = useState(false)
  const [businessIsChecked, setBusinessIsChecked] = useState(false)
  const [referalError, setReferalError] = useState(null);
  const [checkBoxError, setCheckBoxError] = useState(false)
  const [referralVerified, setReferralVerified] = useState(false)
  const [referralWrong, setReferralWrong] = useState(false)
  const [referralRes, setReferralRes] = useState(null)

  useEffect(() => {
    phonecodeOptions()
  }, [])

  const checkBoxChecked = (e) => {
    console.log(e);
    setIsChecked(e.target.checked)
    setError(null)
    setCheckBoxError(false)
  }
  const BusinessCheckBoxChecked = (e) => {
    console.log(e);
    setBusinessIsChecked(e.target.checked)
    setError(null)
    setCheckBoxError(false)
  }
  const phonecodeOptions = () => {
    let optionsphone = [];
    let optionscountry = [];
    for (var i in Countries) {
      optionsphone.push({ label: `${Countries[i].name}(${Countries[i].dial_code})`, value: Countries[i].dial_code });
      optionscountry.push({ label: Countries[i].name, value: Countries[i].name });
    }
    setFilteredCountries([...optionscountry]);
    setFilteredCodeCountries([...optionsphone]);
    getIpStockLocation()
  }
  const onChange1 = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };
  const handlePhoneCodeSearch = (value) => {
    if (value) {
      let _filterredItems = Countries.filter(country => country.name?.toLowerCase().includes(value?.toLowerCase()))
      setFilteredCodeCountries(_filterredItems)
    } else {
      setFilteredCodeCountries(Countries);
    }
  }

  const handlePhoneCode = (value) => {
    console.log(value)
    setPhoneCode(value);
  }
  const handleSearch = (value) => {
    if (value) {
      let _filterredItems = Countries.filter(country => country.name?.toLowerCase().includes(value?.toLowerCase()))
      setFilteredCountries(_filterredItems)
    } else {
      setFilteredCountries(Countries);
    }
  }

  const onChange = (e) => {
    setError(null)
    setCheckBoxError(false)
    setReferalError(null)
    setReferralWrong(false)
    setBusinessIsChecked(false)
    setIsChecked(false)
    setSaveError(null)
    setReferralWrong(false)
    setReferralVerified(false)
    form.resetFields()
    getIpStockLocation()
    setValue(e.target.value);
    setIsBusinessAccount("bussiness" === e.target.value);
  };

  const handleSubmmit = async (values) => {
    let isUpdate = false;
    if (values.referralCode && referralVerified == false) {
      if (businessIsChecked === true || isChecked === true) {
        isUpdate = true;
      } else {
        setCheckBoxError(true)
        setError("Please click the checkbox above after reading and agreeing to the Terms of Service before proceeding")
      }
      return Promise.resolve(true);

    } else if (businessIsChecked === true || isChecked === true) {
      isUpdate = true;
    } else {
      setCheckBoxError(true)
      setError("Please click the checkbox above after reading and agreeing to the Terms of Service before proceeding")
    }

    if (isUpdate) {
      setLoading(true);
      setSaveError(null);
      setError(null)
      setCheckBoxError(false)
      let obj = {
        //  "userName": null,
        "firstName": null,
        "lastName": null,
        "phoneNumber": null,
        "country": null,
        "referralCode": null,
        "isBusiness": isBusinessAccount,
        "businessName": null
      }
      obj = { ...obj, ...values };
      if (obj.phoneNumber)
        console.log(phoneCode, obj.phoneNumber);
      obj.phoneNumber = phoneCode + obj.phoneNumber;
      obj.phoneNumber = apicalls.encryptValue(obj.phoneNumber, props?.userProfile?.sk);
      const response = await saveCustomer(obj);
      if (response.ok) {
      //  props.dispatch(userInfo(response.data))
      props?.getmemeberInfoa(props?.userProfile.userId)
        props.history.push("/sumsub");
      } else {
        setSaveError(apicalls.isErrorDispaly(response));
      }
      setLoading(false);
    }

  }

  const handleReferralValidation = async (_, referralCode) => {
    if (!referralCode) {
      setReferralWrong(false)
      setReferralVerified(false)
      return Promise.resolve(true);
    }
    if (referralCode?.length > 2) {
      const res = await referalCode(referralCode);
      if (!res.ok) {
        setReferalError(null)
        setReferralVerified(false)
        setReferralWrong(true)
        return Promise.reject("Invalid referral code"); //apicalls.isErrorDispaly(res);         
      } else {
        setReferralWrong(false)
        setReferralVerified(true)
        console.log(res.data.name);
        setReferralRes(res.data.name)
        return Promise.resolve(true);
      }
    } else {
      setReferralWrong(true)
      return Promise.reject("Invalid referral code")
    }
  }

  const getIpStockLocation = async () => {
    let res = await apicalls.getIpStock()
    if (res.ok) {
      form.setFieldsValue({ country: res.data.country_name })
      setPhoneCode('+' + res.data.location.calling_code)
    }
  }
  return (
    <>
      <div className='register-blockwid form-block'>
        <div>
          <h2 class="heading mob-center">Choose Account</h2>
          <Radio.Group onChange={onChange} value={value} className="new-custom-radiobtn mb-24">
            <Radio.Button value="bussiness" className=""><span className="lg icon" />Business Account</Radio.Button>
            <Radio.Button value="personal" className=""><span className="lg icon" />Personal Account</Radio.Button>
          </Radio.Group>
        </div>
        {saveError !== null && (
          <Alert
            type="error"
            description={saveError}
            onClose={() => setSaveError(null)}
            showIcon
          />
        )}
        {isBusinessAccount && <div>
          <h2 class="heading mob-center">Sign up for Business Account</h2>
          <Form name='busssinessForm'
            ref={busssinessForm}
            onFinish={handleSubmmit}
            form={form}
          >
            <Row className='formfields-block' gutter={24}>

              <Col xs={24} md={24} lg={12} xl={12} xxl={12}>
                <Form.Item
                  className=" mb-8 px-4 text-white-50 custom-forminput custom-label pt-8 sc-error"
                  name="businessName"
                  label="Legal Business Name"
                  required
                  rules={[
                    {
                      validator(_, value) {
                        if (!value) {
                          return Promise.reject('Please enter business name');
                        } else if (value.length < 2 || value.length > 80) {
                          return Promise.reject('Invalid business name')
                        } else if (!(/^[A-Za-z ]*$/.test(value))) {
                          return Promise.reject('Invalid business name')
                        } else {
                          return Promise.resolve();
                        }
                      }
                    },
                  ]}>
                  <Input
                    className="cust-input form-disable"
                    maxLength={80}
                    placeholder="Legal Business Name"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={12} xl={12} xxl={12}>
                <Form.Item
                  className=" mb-8 px-4 text-white-50 custom-forminput custom-label pt-8 sc-error form-arrowicon"
                  name="phoneNumber"
                  label="Phone"
                  required
                  rules={[
                    { required: true, message: "Is required", },
                    {
                      validator(_, value) {
                        if (Number(value) || !value) {
                          return Promise.resolve();
                        } else if (value && !(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(value))) {
                          return Promise.reject("Invalid phone number");
                        } else if (!Number(value)) {
                          return Promise.reject("Only numbers allowed");
                        }
                      },
                    },
                  ]}>
                  <Input
                    addonBefore={<Select
                      style={{ width: '150px' }}
                      className="cust-input Approved field-width"
                      showSearch
                      placeholder="Phone"
                      optionFilterProp="children"
                      onChange={handlePhoneCode}
                      value={phoneCode}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      options={filteredCodeCountries}


                    />}
                    className="cust-input form-disable phone-he c-pointer cust-phone"
                    maxLength={12}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={12} xl={12} xxl={12}>
                <Form.Item className=" mb-8 px-4 text-white-50 custom-forminput custom-label pt-8 sc-error form-arrowicon"
                  name="country" label="Country Of Business"
                  rules={[
                    {
                      required: true,
                      message: "Is required",
                    },
                  ]}>
                  <Select
                    className="cust-input Approved"
                    maxLength={15}
                    placeholder="Select Country"
                    optionFilterProp="children"
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={filteredCountries}
                  >

                  </Select>

                </Form.Item>
              </Col>
              {/* <Col xs={24} md={24} lg={12} xl={12} xxl={12}>
                <Form.Item
                  className=" mb-8 px-4 text-white-50 custom-forminput custom-label pt-8 sc-error"
                  name="userName"
                  label="Username"
                  required
                  rules={[
                    {
                      validator(_, value) {
                        if (!value) {
                          return Promise.reject('Please enter user name');
                        } else if (value.length < 2 || value.length > 80) {
                          return Promise.reject('Invalid user name')
                        } else if (!(/^[A-Za-z0-9 ]*$/.test(value))) {
                          return Promise.reject('Invalid user name')
                        } else {
                          return Promise.resolve();
                        }
                      }
                    },
                  ]}>
                  <Input
                    className="cust-input form-disable"
                    maxLength={100}
                    placeholder="Username"
                  />
                </Form.Item>
              </Col> */}
              <Col xs={24} md={24} lg={12} xl={12} xxl={12}>
                <Form.Item
                  className=" mb-8 px-4 text-white-50 custom-forminput custom-label pt-8 sc-error"
                  name="referralCode"
                  label="Referral Code"
                  rules={[
                    { validator: handleReferralValidation }
                  ]}
                >
                  <Input
                    className="cust-input form-disable"
                    maxLength={15}
                    placeholder="Referral Code"
                  />

                </Form.Item>
                {referralVerified === true ? (<span className='reffername'>{referralRes}</span>) : ("")}
                <span style={{ color: "red" }}>{referalError}</span>
                {referralVerified === true ? (<span className='icon lg greencheck'></span>) : ("")}
                {referralWrong === true ? (<span className='icon lg close'></span>) : ("")}
              </Col>
              <Col xs={24} md={24} lg={24} xl={24} xxl={24} className='px-0'>
                <div className='policy-content terms-text d-flex'>
                  <div>
                    <label
                      className={`${checkBoxError === true ? 'icon danger-alert' : "text-center custom-checkbox c-pointer cust-check-outline"}`}
                    >
                      <input
                        className="c-pointer"
                        name="isCheck"
                        type="checkbox"
                        checked={businessIsChecked}
                        // onChange1={(e) => this.handleInputChange(props, e)}
                        onChange={BusinessCheckBoxChecked}
                      />
                      <span ></span>
                    </label>
                  </div>
                  <div className='terms-text'>By clicking submit, I here by acknowledge that i agree to SuisseBase's <a target="_blank" href="https://www.iubenda.com/terms-and-conditions/42856099" className="blue-color">Terms of use agreement</a> and I've read the <a target="_blank" href="https://www.iubenda.com/privacy-policy/42856099" className="blue-color">Privacy policy</a>.</div>
                </div>
                {error != null && <Alert className="pa-alert" type='error' closable={false} message={error} />}
              </Col>
            </Row>
            <div className="text-right view-level-btn">
              <Form.Item>
                <Button
                  loading={loading}
                  type='primary'
                  className='pop-btn'
                  htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>}

        {!isBusinessAccount && <div>
          <h2 class="heading mob-center">Sign up for  Personal  Account</h2>
          <Form name='persionalAccount' ref={personalForm} onFinish={handleSubmmit} form={form}>
            <Row className='formfields-block' gutter={24}>
              <Col xs={24} md={24} lg={12} xl={12} xxl={12}>
                <Form.Item
                  className=" mb-8 px-4 text-white-50 custom-forminput custom-label pt-8 sc-error"
                  name="firstName"
                  label="First Name"
                  required
                  rules={[
                    {
                      validator(_, value) {
                        if (!value) {
                          return Promise.reject('Please enter first name');
                        } else if (value.length < 2 || value.length > 80) {
                          return Promise.reject('Invalid first name')
                        } else if (!(/^[A-Za-z ]*$/.test(value))) {
                          return Promise.reject('Invalid first name')
                        } else {
                          return Promise.resolve();
                        }
                      }
                    },
                  ]}>
                  <Input
                    className="cust-input"
                    maxLength={80}
                    placeholder="First Name"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={12} xl={12} xxl={12}>
                <Form.Item
                  className=" mb-8 px-4 text-white-50 custom-forminput custom-label pt-8 sc-error"
                  name="lastName"
                  label="Last Name"
                  required
                  rules={[
                    {
                      validator(_, value) {
                        if (!value) {
                          return Promise.reject('Please enter last name');
                        } else if (value.length < 2 || value.length > 80) {
                          return Promise.reject('Invalid last name')
                        } else if (!(/^[A-Za-z ]*$/.test(value))) {
                          return Promise.reject('Invalid last name')
                        } else {
                          return Promise.resolve();
                        }
                      }
                    },
                  ]}>
                  <Input
                    className="cust-input"
                    maxLength={80}
                    placeholder="Last Name"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={12} xl={12} xxl={12}>
                <Form.Item
                  className=" mb-8 px-4 text-white-50 custom-forminput custom-label pt-8 sc-error"
                  name="phoneNumber"
                  label="Phone"
                  required
                  rules={[
                    { required: true, message: "Is required", },
                    {
                      validator(_, value) {
                        if (Number(value) || !value) {
                          return Promise.resolve();
                        } else if (value && !(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(value))) {
                          return Promise.reject("Invalid phone number");
                        } else if (!Number(value)) {
                          return Promise.reject("Only numbers allowed");
                        }
                      },
                    },
                  ]}>
                  <Input
                    addonBefore={<Select
                      style={{ width: '150px' }}
                      className="cust-input Approved field-width"
                      showSearch
                      placeholder="Phone"
                      optionFilterProp="children"
                      onChange={handlePhoneCode}
                      value={phoneCode}
                      // onSearch={onSearch}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      options={filteredCodeCountries}


                    />}
                    className="cust-input phone-he cust-phone"
                    maxLength={12}
                  // placeholder="Phone"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={12} xl={12} xxl={12}>
                <Form.Item className="mb-8 px-4 text-white-50 custom-forminput custom-label pt-8 sc-error"
                  name="country" label="Country Of Residence"
                  rules={[
                    {
                      required: true,
                      message: "Is required",
                    },
                  ]}>
                  <Select
                    className="cust-input Approved"
                    maxLength={100}
                    placeholder="Select Country"
                    optionFilterProp="children"
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={filteredCountries}
                  >

                  </Select>
                </Form.Item>
              </Col>
              {/* <Col xs={24} md={24} lg={12} xl={12} xxl={12}>
                <Form.Item
                  className=" mb-8 px-4 text-white-50 custom-forminput custom-label pt-8 sc-error"
                  name="userName"
                  label="Username"
                  required
                  rules={[
                    {
                      validator(_, value) {
                        if (!value) {
                          return Promise.reject('Please enter user name');
                        } else if (value.length < 2 || value.length > 80) {
                          return Promise.reject('Invalid user name')
                        } else if (!(/^[A-Za-z0-9 ]*$/.test(value))) {
                          return Promise.reject('Invalid user name')
                        } else {
                          return Promise.resolve();
                        }
                      }
                    },
                  ]}>
                  <Input
                    className="cust-input "
                    maxLength={100}
                    placeholder="Username"
                  />
                </Form.Item>
              </Col> */}
              <Col xs={24} md={24} lg={12} xl={12} xxl={12}>
                <Form.Item
                  className=" mb-8 px-4 text-white-50 custom-forminput custom-label pt-8 sc-error"
                  name="referralCode"
                  label="Referral Code"
                  rules={[
                    { validator: handleReferralValidation }

                  ]}
                >
                  <Input
                    className="cust-input "
                    maxLength={15}
                    placeholder="Referral Code"
                  />
                </Form.Item>
                {referralVerified === true ? (<span className='reffername'>{referralRes}</span>) : ("")}
                <span style={{ color: "red" }}>{referalError}</span>
                {referralVerified === true ? (<span className='icon lg greencheck'></span>) : ("")}
                {referralWrong === true ? (<span className='icon lg close'></span>) : ("")}
              </Col>
              <Col xs={24} md={24} lg={24} xl={24} xxl={24} className='px-0'>
                <div className='policy-content terms-text d-flex'>
                  <div>
                    <label
                      className={`${checkBoxError === true ? 'icon danger-alert' : "text-center custom-checkbox c-pointer cust-check-outline"}`}
                    >
                      <input
                        className="c-pointer"
                        name="isCheck"
                        type="checkbox"
                        checked={isChecked}
                        // onChange1={(e) => this.handleInputChange(props, e)}
                        onChange={checkBoxChecked}
                      />
                      <span></span>{" "}
                    </label>
                  </div>
                  <div className='terms-text'>By clicking submit, I here by acknowledge that i agree to SuisseBase's <a target="_blank" href="https://www.iubenda.com/terms-and-conditions/42856099" className="blue-color">Terms of use agreement</a> and I've read the <a target="_blank" href="https://www.iubenda.com/privacy-policy/42856099" className="blue-color">Privacy policy</a>.</div>
                </div>
                {error != null && <Alert className="pa-alert" type='error' closable={false} message={error} />}
              </Col>
            </Row>
            <div className="text-right view-level-btn">
              <Button
                loading={loading}
                type='primary'
                className='pop-btn'
                htmlType='submit'
              // onClick={handleSubmmit}
              >
                Submit
              </Button>
            </div>
          </Form>
        </div>}
      </div>
    </>
  );
};
const connectStateToProps = ({ userConfig }) => {
  return { userProfile: userConfig?.userProfileInfo }
}
const connectDispatchToProps = dispatch => {
  return { dispatch,
    getmemeberInfoa: (useremail) => {
      dispatch(getmemeberInfo(useremail));
    }, }
}
export default connect(connectStateToProps, connectDispatchToProps)(Auth0);