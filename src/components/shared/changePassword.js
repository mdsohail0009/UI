import React, { Component } from 'react';
import { Drawer, Typography, Input, Button, label,Select, Switch } from 'antd';
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
class ChangePassword extends Component {
    state = {}
    render() {
        const { Paragraph,Title, Text } = Typography;
        const link = <LinkValue content="terms_service" />;
        return (
          <>
          <div className="custom-formcard mt-36">
          <form className="form">
              <Translate
                content="Change_password"
                component={Title}
                className="mb-0  fs-24 text-white-30 fw-400 "
              />
              <Translate
                content="Choose_a_unique_password_to_protect_your_account"
                component={Paragraph}
                className="mt-36 mb-8 fs-14 text-white-30 fw-400 "
              />

              <Input
                className="cust-input mb-8"
                placeholder="Type your current password"
              />

              <Input
                className="cust-input mb-8"
                placeholder="Type your new password"
              />

              <Input
                className="cust-input mb-8"
                placeholder="Retype your new password"
              />

              {/* <div className="d-flex p-16 mb-36 agree-check">
                <label>
                  <input type="checkbox" id="agree-check" />
                  <span for="agree-check" />
                </label>
                <Translate
                  content="agree_to_suissebase"
                  with={{ link }}
                  component={Paragraph}
                  className="fs-16 text-white-30 ml-16"
                  style={{ flex: 1 }}
                />
              </div> */}
              <div className="pay-list custom-switch p-0">
                <div >
                  <Translate
                  className="fw-400 fs-16 text-white-30"
                  content="Require_all_devices_to_signin"
                  component={Text}
                />
                <Translate
                  content="with_new_password"
                  component={Paragraph}
                  className="fs-14 text-white-30 fw-500 "
                />
                </div>
               <div>
               <Translate
                  className="fw-400 fs-16 text-white-30 mr-4"
                  content="Yes"
                  component={Text}
                  style={{verticalAlign: "middle"}}
                />
                <Switch
                  size="small"
                  defaultChecked
                  className="custom-toggle ml-12 custom-switch-toggle"
                />
               </div>
               
              </div>
            </form>
            <Translate
              content="Save_btn_text"
              component={Button}
              size="large"
              block
              className="pop-btn fw-400 fs-16"
            //   style={{ marginTop: "5px" }}
              onClick={() => this.props.changeStep("success")}
            />

            <Translate
              type="text"
              size="large"
              className="text-center fs-16 text-white-30 pop-cancel fw-400 text-captz "
              block
              content="forgot_your_password"
              onClick={() => this.props.changeStep("step1")}
              component={Button}
            />
          </div>
          
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
export default connect(connectStateToProps, connectDispatchToProps)(ChangePassword);
