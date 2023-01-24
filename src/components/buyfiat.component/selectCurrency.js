import React, { Component } from 'react';
import { Typography, Select } from 'antd';
import { setStep } from '../../reducers/buysellReducer';
import Translate from 'react-translate-component';
import { connect } from 'react-redux';

const { Option } = Select;
class SelectCurrency extends Component {
  state = {}
  render() {
    const { Paragraph, Text } = Typography;
    return (
      <>
       
        <div className="suisfiat-container auto-scroll"><Translate
          className="mb-0 text-white-30 fs-14 fw-200"
          content="EUR_text"
          component={Paragraph}
        />
          <form className="form">
            <div className="my-36">
              <Translate
                className="input-label"
                content="currency"
                component={Text}
              />
              <Select
                defaultValue="EUR"
                className="cust-input mb-0"
                dropdownClassName="select-drpdwn"
                style={{ width: "100%" }}
                bordered={false}
                showArrow={false}
                suffixIcon={<span className="icon md uparrow" />}
              >
                <Option value="USD">USD</Option>
                <Option value="EUR">EUR</Option>
                <Option value="GBP">GBP</Option>
              </Select>
            </div>
            <div className="d-flex mb-24">
              <div style={{ flex: 1 }}>
                <Paragraph className="mb-0 fs-16 text-white fw-500">UAB epayblock</Paragraph>
                <Paragraph className="mb-0 fs-12 text-white-30 fw-300">
                  Upes str.23,LT-08128,vilnius
                </Paragraph>
                <Paragraph className="mb-0 fs-14 text-yellow fw-500"><Text className="text-white-30 fs-14">A/C </Text>LT41*** *** 1796</Paragraph>
              </div>
            </div>
            <Translate
              className=" "
              content="BICcode"
              component={Text}
            />
            <Translate
              className=" l-height-normal d-block "
              content="EPUALT"
              component={Text}
            />
            <Translate
              className=""
              content="account_holder_name"
              component={Text}
            />
            <Translate
              className="l-height-normal d-block"
              content="innovative_concepts"
              component={Text}
            />


            <div className="crypto-address">
              <Translate
                className=""
                content="reference"
                component={Text}
              />
              <div className="">
                wire_16_ZBPHXFHI
              </div>
            </div>
            <Paragraph
              className="l-height-normal"
            ><span className="textpure-yellow">IMPORTANT:</span> This code identifies your deposit include this code when submitting the wire transfer in the transaction description or purpose</Paragraph>
            <Translate className="text-white-30 f-12 " content="note" component={Paragraph} />
          </form>
        </div>
      </>
    );
  }
}

const connectDispatchToProps = dispatch => {
  return {
    changeStep: (stepcode) => {
      dispatch(setStep(stepcode))
    }
  }
}
export default connect(connectDispatchToProps)(SelectCurrency);
