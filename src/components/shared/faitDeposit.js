import React, { Component } from 'react';
import { Drawer, Typography, Input, Button, label,Select } from 'antd';
import { Link } from 'react-router-dom';
import { setStep } from '../../reducers/buysellReducer';
import Translate from 'react-translate-component';
import { connect } from 'react-redux';


const LinkValue = (props) => {
    return (
        <Translate className="text-yellow text-underline c-pointer"
            content={props.content}
            component={Link}
            to="./#"
        />
    )
}
const { Option } = Select;
class FaitDeposit extends Component {
    state = {}
    render() {
        const { Paragraph,Title, Text } = Typography;
        const link = <LinkValue content="terms_service" />;
        return (
          <>
            <Translate
              className="mb-16 text-white fs-16 fw-200"
              content="desposite_text"
              component={Paragraph}
            />
            <form className="form">
              {/* <Translate
                content="Beneficiary_BankDetails"
                component={Paragraph}
                className="mb-0 mt-36 fs-14 text-white fw-500 text-upper"
              /> */}
              <div className="mt-36">
              <Translate
                className="input-label"
                content="currency"
                component={Text}
              />

              <Select
                defaultValue="USD"
                className="cust-input"
                style={{ width: "100%" }}
                bordered={false}
                showArrow={false}
                suffixIcon={<span className="icon md uparrow" />}
              >
                <Option value="philippines">USD</Option>
                <Option value="india">EUR</Option>
                <Option value="US">GBP</Option>
              </Select>
              </div>
             
              {/* <Translate
                className="mb-0 mt-36 fs-14 text-white fw-500 text-upper"
                content="wire_transfer_mthd"
                component={Paragraph}
              /> */}
              <div className="d-flex align-center mt-36 ">
                <span className="coin deposit-white" />
                <div className="ml-16">
                  <Translate
                    className="mb-0 fs-14 text-white-30 fw-300"
                    content="Beneficiary_Accountname"
                    component={Paragraph}
                  />
                  {/* <Paragraph className="mb-0 fs-12 text-white-30 fw-300">
                    EUR
                  </Paragraph> */}
                  <Translate
                    className="mb-0 fs-12 text-white-30 fw-300"
                    content="Innovative_Concepts"
                    component={Paragraph}
                  />
                  <div className="">
                    <Translate
                      className="mb-0 fs-14 text-white-30 fw-300"
                      content="Beneficiary_Accountaddress"
                      component={Paragraph}
                    />
                    {/* <Paragraph className="mb-0 fs-12 text-white-30 fw-300">
                    EUR
                  </Paragraph> */}
                    <Translate
                      className="mb-0 fs-12 text-white-30 fw-300"
                      content="PL_DU_BOURG_DE_FOUR"
                      component={Paragraph}
                    />
                  </div>
                  <div className="">
                    <Translate
                      className="mb-0 fs-14 text-white-30 fw-300"
                      content="Beneficiary_account"
                      component={Paragraph}
                    />
                    <Paragraph className="mb-0 fs-12 text-white-30 fw-300">
                      1504376717
                    </Paragraph>
                    {/* <Translate
                   className="mb-0 fs-12 text-white-30 fw-300"
                    content=""
                    component={Paragraph}
                  /> */}
                  </div>
                </div>

                {/* <Translate
                  className="recomnd-tag fs-12 text-white-30 fw-300 ml-auto text-upper"
                  content="recommended"
                  component={Text}
                /> */}
              </div>
              <Translate
                className="mb-0 mt-36 fs-14 text-white-30 fw-500 text-upper"
                content="for_Domestic_wires"
                component={Paragraph}
              />
            
            <div className="mt-16">
              <Translate
                  className="fw-200 text-white-30 mb-0 text-upper fs-16 "
                  content="Routing_number"
                  component={Text}
                />
                <div>
                <Text className="fw-300 text-white-30">026013576</Text>
                </div>
              
              </div>
           

              <div className="mb-24 mt-36">
              <Translate
                className="mb-0 mt-36 fs-14 text-white-30 fw-500 text-upper"
                content="for_international_wires"
                component={Paragraph}
              />
              <div className="mt-16">
              <Translate
                  className="fw-200 text-white-30 mb-0 text-upper fs-16 "
                  content="Swift_BICcode"
                  component={Text}
                />
                {/* <div className="fw-300 fs-24 text-white-30 l-height-normal">
                  Visa ....1453
                </div> */}
                <div>
                <Translate
                  className="fw-300 fs-24 text-white-30 l-height-normal"
                  content="SIGNU"
                  component={Text}
                />
                </div>
              
              </div>
              <div className="mt-16">
              <Translate
                  className="fw-200 text-white-30 mb-0 text-upper fs-16 "
                  content="beneficiaryBank"
                  component={Text}
                />
                {/* <div className="fw-300 fs-24 text-white-30 l-height-normal">
                  Visa ....1453
                </div> */}
                <div>
                <Translate
                  className="fw-300 fs-24 text-white-30 l-height-normal"
                  content="signature_bank"
                  component={Text}
                />
                </div>
              
              </div>
              <div className="mt-16">
              <Translate
                  className="fw-200 text-white-30 mb-0 text-upper fs-16 "
                  content="beneficiary_Bank_address"
                  component={Text}
                />
                {/* <div className="fw-300 fs-24 text-white-30 l-height-normal">
                  Visa ....1453
                </div> */}
                <div>
                <Translate
                  className="fw-300 fs-24 text-white-30 l-height-normal"
                  content="Fifth_Avenue"
                  component={Text}
                />
                </div>
              
              </div>
              </div>
              <div className="crypto-address mt-36" style={{margin:'0px 0px 12px'}}>
                <Translate
                  className="mb-0 fw-400 text-secondary"
                  content="reference"
                  component={Text}
                />
                <div className="mb-0 fs-14 fw-500 text-textDark">
                  wire_16_PKFPGATX
                </div>
              </div>
              <Translate
                className="text-left f-12 text-white"
                content="reference_hint_text"
                component={Paragraph}
              />
              {/* <Translate
                content="Beneficiary_Details"
                component={Paragraph}
                className="mb-0 mt-36 fs-14 text-white fw-500 text-upper"
              /> */}
            </form>
            <Translate
              content="confirm_btn_text"
              component={Button}
              size="large"
              block
              className="pop-btn"
              style={{ marginTop: "90px" }}
              onClick={() => this.props.changeStep("success")}
            />
          </>
        );
    }
}

const connectStateToProps = ({ buySell, oidc }) => {
    return { buySell }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        }
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(FaitDeposit);
