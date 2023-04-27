import React, { useEffect, useRef, useState } from 'react';
import { Button, Row, Col, Form, Select, Input, Radio, Modal, Tooltip, Alert, Checkbox, SelectProps } from 'antd';
import { referalCode, saveCustomer } from './api';
import Countries from './countries.json';
import apicalls from '../../api/apiCalls';

import { connect } from 'react-redux';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

const { Option } = Select;

const Auth0 = (props) => {
  const busssinessForm = useRef();
  const personalForm = useRef();
  const [value, setValue] = useState("bussiness");
  const [isBusinessAccount, setIsBusinessAccount] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [businessError, setBusinessError] = useState(null);
  const [filteredCountries, setFilteredCountries] = useState([...Countries]);
  const [filteredCodeCountries, setFilteredCodeCountries] = useState([...Countries]);
  const [phoneCode, setPhoneCode] = useState("");
  const [isChecked, setIsChecked] = useState(null)
  const [businessIsChecked, setBusinessIsChecked] = useState(null)
  const [referalError, setReferalError] = useState(null);
  const [referralVerified, setReferralVerified] = useState(false)
  const [referralWrong, setReferralWrong] = useState(false)


  useEffect(() => {
    phonecodeOptions()
  }, [])

  const checkBoxChecked = (e) => {
    console.log(e);
    setIsChecked(e.target.checked)
    setError(null)
  }
  const BusinessCheckBoxChecked = (e) => {
    console.log(e);
    setBusinessIsChecked(e.target.checked)
    setError(null)
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
    setReferalError(null)  
    setReferralWrong(false)
    setValue(e.target.value);
    setIsBusinessAccount("bussiness" === e.target.value);
  };

  const handleSubmmit = async (values) => {
    if(values.referralCode && referralVerified == false ){
      return setReferalError("Invalid referral code");
    }
        
      if (isChecked == false || businessIsChecked == false) {
        setError("Please check the terms and conditions")
      } else {
        setLoading(true);
        setError(null);
        let obj = {
          "userName": null,
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
          obj.phoneNumber = phoneCode + obj.phoneNumber;
        obj.phoneNumber = apicalls.encryptValue(obj.phoneNumber, props?.userProfile?.sk);
        const response = await saveCustomer(obj);
        if (response.ok) {
          props.history.push("/sumsub");
        } else {
          setError(response.data?.message || response.data || response.originalError?.message);
        }
        setLoading(false);
      }
      
  }

 const ReferralCode= async(e) =>{
  setReferalError(null)
  setReferralWrong(false)
  if(e.target.value != null && e.target.value.length > 2){
    const response = await referalCode(e.target.value)
    if (response.ok) {
       setReferalError(null)
       setReferralVerified(true)
       setReferralWrong(false)
     } else {
       setReferralVerified(false)
       setReferralWrong(true)
       setReferalError(apicalls.isErrorDispaly(response))      
     }
  }else if(e.target.value.length == 1 || e.target.value.length == 2 ){
    setReferalError("Invalid referral code")   
    setReferralVerified(false)
       setReferralWrong(true)
  }
   
}
  return (
    <>
      <div className='register-blockwid form-block'>
        <div>
          <h2 class="heading mob-center">Choose Account</h2>
          <Radio.Group onChange={onChange} value={value} className="new-custom-radiobtn mb-24">
            <Radio.Button value="bussiness" className=""><span className="lg icon" />Bussiness Account</Radio.Button>
            <Radio.Button value="personal" className=""><span className="lg icon" />Personal Account</Radio.Button>
          </Radio.Group>
        </div>
        {error != null && <Alert type='error' closable={false} showIcon message={error} />}
        {isBusinessAccount && <div>
          <h2 class="heading mob-center">Sign Up For Business Account</h2>
          <Form name='busssinessForm' ref={busssinessForm} onFinish={handleSubmmit}>
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
                        } else if (value.length < 2 || value.length > 20) {
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
                    maxLength={100}
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
                        } else if (!Number(value)) {
                          return Promise.reject("Only numbers allowed");
                        }
                      },
                    },
                  ]}>
                  <Input
                    addonBefore={<Select
                      style={{ width: '150px', border: "0" }}
                      className="cust-input Approved"
                      showSearch
                      placeholder="Phone"
                      optionFilterProp="children"
                      onChange={handlePhoneCode}
                      // onSearch={onSearch}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      options={filteredCodeCountries}


                    />}
                    className="cust-input form-disable phone-he"
                    maxLength={100}
                  // placeholder="Phone"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={12} xl={12} xxl={12}>
                <Form.Item className=" mb-8 px-4 text-white-50 custom-forminput custom-label pt-8 sc-error form-arrowicon"
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
                    //onSearch={handleSearch}
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={filteredCountries}
                  >
                    {/* <Option value={""}>Select</Option>
                    {filteredCountries.map((country) => <Option key={country.code} value={country.name}>{country.name}</Option>)} */}

                  </Select>

                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={12} xl={12} xxl={12}>
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
                        } else if (value.length < 2 || value.length > 20) {
                          return Promise.reject('Invalid user name')
                        } else if (!(/^[A-Za-z ]*$/.test(value))) {
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
              </Col>
              <Col xs={24} md={24} lg={12} xl={12} xxl={12}>
                <Form.Item
                  className=" mb-8 px-4 text-white-50 custom-forminput custom-label pt-8 sc-error"
                  name="referralCode"
                  label="Referral Code"
                >
                  <Input
                    className="cust-input form-disable"
                    maxLength={100}
                    placeholder="Referral Code"
                    onChange={(e)=>ReferralCode(e)}
                  />                 
                </Form.Item>
                <span style={{ color: "red" }}>{referalError}</span>
                  {referralVerified === true ? (<span>right</span>) : ("")}
                  {referralWrong === true ? (<span>wrong</span>) : ("")}
              </Col>
              <Col xs={24} md={24} lg={24} xl={24} xxl={24} className='px-0'>
                <div className='policy-content terms-text d-flex'>
                  <div>
                    <label className="text-center custom-checkbox c-pointer cust-check-outline">
                      <input
                        className="c-pointer"
                        name="isCheck"
                        type="checkbox"
                        // onChange1={(e) => this.handleInputChange(props, e)}
                        onChange={BusinessCheckBoxChecked}
                      />
                      <span></span>{" "}
                    </label>
                  </div>
                  <div className='terms-text'>By Clicking Sign Up, I Here By Acknowledge That I Agree To Suissebase's <a target="_blank" href="https://www.iubenda.com/terms-and-conditions/42856099" className="blue-color">Term Of Use Agreement</a> And I've Read The <a target="_blank" href="https://www.iubenda.com/privacy-policy/42856099" className="blue-color">Privacy Policy</a>.</div>
                </div>
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
          <h2 class="heading mob-center">Sign Up For Personal Account</h2>
          <Form name='persionalAccount' ref={personalForm} onFinish={handleSubmmit}>
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
                        } else if (value.length < 2 || value.length > 20) {
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
                    maxLength={100}
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
                        } else if (value.length < 2 || value.length > 20) {
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
                    maxLength={100}
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
                        } else if (!Number(value)) {
                          return Promise.reject("Only numbers allowed");
                        }
                      },
                    },
                  ]}>
                  <Input
                    addonBefore={<Select
                      style={{ width: '150px' }}
                      className="cust-input Approved"
                      showSearch
                      placeholder="Phone"
                      optionFilterProp="children"
                      onChange={handlePhoneCode}
                      // onSearch={onSearch}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      options={filteredCodeCountries}


                    />}
                    className="cust-input phone-he"
                    maxLength={100}
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
                    //onSearch={handleSearch}
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={filteredCountries}
                  >
                    {/* <Option value={""}>Select</Option>
                    {filteredCountries.map((country) => <Option key={country.code} value={country.name}>{country.name}</Option>)} */}

                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={12} xl={12} xxl={12}>
                <Form.Item
                  className=" mb-8 px-4 text-white-50 custom-forminput custom-label pt-8 sc-error"
                  name="userName"
                  label="User Name"
                  required
                  rules={[
                    {
                      validator(_, value) {
                        if (!value) {
                          return Promise.reject('Please enter user name');
                        } else if (value.length < 2 || value.length > 20) {
                          return Promise.reject('Invalid user name')
                        } else if (!(/^[A-Za-z ]*$/.test(value))) {
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
                    placeholder="User Name"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={12} xl={12} xxl={12}>
                <Form.Item
                  className=" mb-8 px-4 text-white-50 custom-forminput custom-label pt-8 sc-error"
                  name="referralCode"
                  label="Referral Code"
                >
                  <Input
                    className="cust-input "
                    maxLength={100}
                    placeholder="Referral Code"
                    onChange={(e)=>ReferralCode(e)}
                  />                  
                </Form.Item>
                <span style={{ color: "red" }}>{referalError}</span>
                  {referralVerified === true ? (<span>right</span>) : ("")}
                  {referralWrong === true ? (<span>wrong</span>) : ("")}
              </Col>
              <Col xs={24} md={24} lg={24} xl={24} xxl={24} className='px-0'>
                <div className='policy-content terms-text d-flex'>
                  <div>
                    <label className="text-center custom-checkbox c-pointer cust-check-outline">
                      <input
                        className="c-pointer"
                        name="isCheck"
                        type="checkbox"
                        // onChange1={(e) => this.handleInputChange(props, e)}
                        onChange={checkBoxChecked}
                      />
                      <span></span>{" "}
                    </label>
                  </div>
                  <div className='terms-text'>By Clicking Sign Up, I Here By Acknowledge That I Agree To Suissebase's <a target="_blank" href="https://www.iubenda.com/terms-and-conditions/42856099" className="blue-color">Term Of Use Agreement</a> And I've Read The <a target="_blank" href="https://www.iubenda.com/privacy-policy/42856099" className="blue-color">Privacy Policy</a>.</div>
                </div>
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
  return { dispatch }
}
export default connect(connectStateToProps, connectDispatchToProps)(Auth0);