import React, { Component, useState } from 'react';
import { Drawer, Form, Typography, Input, Button, label, Select } from 'antd';
import { Link } from 'react-router-dom';
import { setStep } from '../../reducers/buysellReducer';
import Translate from 'react-translate-component';
import { connect } from 'react-redux';
import WalletList from '../shared/walletList';
import NumberFormat from 'react-number-format';
import {withdrawRecepientNamecheck,withdrawSave} from '../../api/apiServer';

const LinkValue = (props) => {
  return (
    <Translate className="text-yellow text-underline c-pointer"
      content={props.content}
      component={Link}
      to="./#"
    />
  )
}

const FaitWithdrawal = ({ buyInfo, userConfig }) => {
  const [form] = Form.useForm();
  const [selectedWallet, setSelectedWallet] = useState(null);

  const handleWalletSelection = (walletId) => {
    form.setFieldsValue({ memberWalletId: walletId })
    if (buyInfo.memberFiat?.data) {
      let wallet = buyInfo.memberFiat.data.filter((item) => {
        return walletId === item.id
      })
      setSelectedWallet(wallet[0])
    }
  }
  const checkRecipeantName=async(name)=>{
   let recName = await withdrawRecepientNamecheck(userConfig.id,name.target.value)
   if(recName.ok){
    console.log(recName)
   }else{

   }
  }

  const savewithdrawal = async(values) => {
    console.log(values)
    values['membershipId'] = userConfig.id
    values['walletCode'] = selectedWallet.currencyCode
    let withdrawal = await withdrawSave(values)
    if (withdrawal.ok) {
      console.log(withdrawal)
    } else {

   }
  }

  const { Paragraph, Title, Text } = Typography;
  const link = <LinkValue content="terms_service" />;

  return (
    <>
      <div className="suisfiat-height auto-scroll">
        <Form form={form} onFinish={savewithdrawal}>
          <Translate
            content="Beneficiary_BankDetails"
            component={Paragraph}
            className="mb-16 fs-14 text-aqua fw-500 text-upper"
          />
          <Form.Item
            className="custom-forminput mb-16"
            name="memberWalletId"
            required
            rules={[
              { required: true, message: "Please enter currency" },
            ]}
          >
           <div> <div className="d-flex"><Translate
              className="input-label"
              content="currency"
              component={Text}
            />
            <span style={{ color: "#fafcfe", paddingLeft: "2px" }}>*</span></div>
            <WalletList onWalletSelect={(e) => handleWalletSelection(e)} /></div>
          </Form.Item>
          <Form.Item
            className="custom-forminput mb-16"
            name="totalValue"
            required
            rules={[
              { required: true, message: "Please enter amount" },
            ]}
          >
            <div ><div className="d-flex">
              <Translate
                className="input-label"
                content="amount"
                component={Text}

              /><span style={{ color: "#fafcfe", paddingLeft: "2px" }}>*</span></div>
              <NumberFormat className="cust-input" customInput={Input} thousandSeparator={true} prefix={""}
                placeholder="0.00"
                decimalScale={8}
                allowNegative={false}
                maxlength={24}
              //value={}
              // onValueChange={({ value }) => {
              //     this.setReceiveAmount(value)
              // }}
              />

            </div>
          </Form.Item>
          <Form.Item
            className="custom-forminput mb-16"
            name="accountNumber"
            required
            rules={[
              { required: true, message: "Please enter bank account" },
            ]}
          >
            <div>
            <div className="d-flex">
              <Translate
                className="input-label"
                content="Bank_account"
                component={Text}
              />
              <span style={{ color: "#fafcfe", paddingLeft: "2px" }}>*</span></div>
              <Input className="cust-input" placeholder="Bank account" />
            </div>
          </Form.Item>
          <Form.Item
            className="custom-forminput mb-16"
            name="swiftCode"
            required
            rules={[
              { required: true, message: "Please enter BIC/SWIFT/routing number" },
            ]}
          >
            <div>
            <div className="d-flex">
              <Translate
                className="input-label"
                content="BIC_SWIFT_routing_number"
                component={Text}
              />
              <span style={{ color: "#fafcfe", paddingLeft: "2px" }}>*</span></div>
              <Input className="cust-input" placeholder="BIC/SWIFT/routing number"/>
            </div>

          </Form.Item>
          <Form.Item
            className="custom-forminput mb-16"
            name="bankName"
            required
            rules={[
              { required: true, message: "Please enter bank name" },
            ]}
          >
            <div>
            <div className="d-flex">
              <Translate
                className="input-label"
                content="Bank_name"
                component={Text}
              />
              <span style={{ color: "#fafcfe", paddingLeft: "2px" }}>*</span></div>
              <Input className="cust-input" placeholder="Bank name" />
            </div>

          </Form.Item>
          <Form.Item
            className="custom-forminput mb-16"
            name="bankAddress"
            required
            rules={[
              { required: true, message: "Please enter bank address1" },
            ]}
          >
            <div>
            <div className="d-flex">
              <Translate
                className="input-label"
                content="Bank_address1"
                component={Text}
              />
              <span style={{ color: "#fafcfe", paddingLeft: "2px" }}>*</span></div>
              <Input className="cust-input" placeholder="Bank address1" />
            </div>

          </Form.Item>

          <Form.Item
            className="custom-forminput mb-16"
            name="bankAddress1"
            required
            // rules={[
            //   { required: true, message: "Please enter bank address2" },
            // ]}
          >
            <div>
            <div className="d-flex">
              <Translate
                className="input-label"
                content="Bank_address2"
                component={Text}
              /></div>
              <Input className="cust-input" placeholder="Bank address2" />
            </div>
          </Form.Item>
          <Form.Item
            className="custom-forminput mb-16"
            name="bankAddress2"
            required
            // rules={[
            //   { required: true, message: "Please enter bank address3" },
            // ]}
          >
            <div>
            <div  className="d-flex">
              <Translate
                className="input-label"
                content="Bank_address3"
                component={Text}
              /></div>
              <Input className="cust-input" placeholder="Bank address3" />
            </div>
          </Form.Item>

          <Translate
            content="Beneficiary_Details"
            component={Paragraph}
            className="mb-16 fs-14 text-aqua fw-500 text-upper"
          />
          <Form.Item
            className="custom-forminput mb-16"
            name="beneficiaryAccountName"
            required
            rules={[
              { required: true, message: "Please enter recipient full name" },
            ]}
          >
            <div>
            <div className="d-flex">
              <Translate
                className="input-label"
                content="Recipient_full_name"
                component={Text}
              />{" "}
              <span style={{ color: "#fafcfe", paddingLeft: "2px" }}>*</span></div>
              <Input className="cust-input" placeholder="Recipient full name" onBlur={checkRecipeantName} />
            </div>

          </Form.Item>
          <Form.Item
            className="custom-forminput mb-16"
            name="beneficiaryAccountAddress"
            required
            rules={[
              { required: true, message: "Please enter recipient address" },
            ]}
          >
            <div>
            <div className="d-flex">
              <Translate
                className="input-label"
                content="Recipient_address1"
                component={Text}
              />{" "}
              <span style={{ color: "#fafcfe", paddingLeft: "2px" }}>
                {" * "}
              </span></div>
              <Input className="cust-input" placeholder="Recipient address" />
            </div>

          </Form.Item>
          <Form.Item
            className="custom-forminput mb-16"
            name="beneficiaryAccountAddress1"
            required
            // rules={[
            //   { required: true, message: "Please enter recipient address2" },
            // ]}
          >
            <div>
            <div className="d-flex">
              <Translate
                className="input-label"
                content="Recipient_address2"
                component={Text}
              /></div>
              <Input className="cust-input" placeholder="Recipient address2" />
            </div>
          </Form.Item>
          <Form.Item
            className="custom-forminput mb-16"
            name="beneficiaryAccountAddress2"
            required
            // rules={[
            //   { required: true, message: "Please enter recipient address3" },
            // ]}
          >
            <div>
            <div className="d-flex">
              <Translate
                className="input-label"
                content="Recipient_address3"
                component={Text}
              /></div>
              <Input className="cust-input" placeholder="Recipient address3" />
            </div>
          </Form.Item>
          <Form.Item
            className="custom-forminput mb-16"
            name="description"
            // rules={[
            //   { message: "Please enter reference" },
            // ]}
          >
            <div>
            <div className="d-flex">
              <Translate
                className="input-label"
                content="Reference"
                component={Text}
              /></div>
              <Input className="cust-input" placeholder="Reference" />
            </div>
          </Form.Item>
          <Form.Item
            className="custom-forminput mb-16"
            name="description"
            required
            // rules={[
            //   { required: true, message: "Please enter description" },
            // ]}
          >
            <div>
            <div className="d-flex">
              <Translate
                className="input-label"
                content="description"
                component={Text}
              /></div>
              <Input className="cust-input" placeholder="Description" />
            </div>
          </Form.Item>
          <Form.Item
            className="custom-forminput mb-16"
            name="isAccept"
            required
            rules={[
              { required: true, message: "Please enter isaccept" },
            ]}
          >
            <div className="d-flex p-16 mb-36 agree-check">
              <label>
                <input type="checkbox" id="agree-check" />
                <span for="agree-check" />
              </label>
              <Translate
                content="agree_to_suissebase"
                with={{ link }}
                component={Paragraph}
                className="fs-14 text-white-30 ml-16"
                style={{ flex: 1 }}
              />
            </div>
          </Form.Item>

          <Form.Item className="mb-0 mt-16">
            <Button
              htmlType="submit"
              size="large"
              block
              className="pop-btn"
            >
             Proceed
            </Button>
            <Translate size="large" block className="pop-btn mt-36" content="preview_swap" component={Button} onClick={() => { this.previewClick() }} />
          </Form.Item>
        </Form>
      </div>

    </>
  );
}

const connectStateToProps = ({ buyInfo, userConfig }) => {
  return { buyInfo,userConfig: userConfig.userProfileInfo }
}
const connectDispatchToProps = dispatch => {
  return {
    changeStep: (stepcode) => {
      dispatch(setStep(stepcode))
    }
  }
}
export default connect(connectStateToProps, connectDispatchToProps)(FaitWithdrawal);
