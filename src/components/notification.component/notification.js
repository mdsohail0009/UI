import React, { Component } from "react";
import { connect } from "react-redux";
import Loader from "../../Shared/loader";
import Translate from "react-translate-component";
import Select from "antd/lib/select";
import Switch from "antd/lib/switch";
import Button from "antd/lib/button";
import { message } from "antd";
import Form from "antd/lib/form";
import Alert from "antd/lib/alert";
import { getNotifications, saveNotification } from "./api";
import { setStep } from "../../reducers/buysellReducer";

const { Option } = Select;

class NotificationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      notification: [],
      notificationLu: [],
      notic: [],
      action: false,
      noticObject: {},
      errorMsg: null,
      btnDisabled: false,
      btnLoader: false
    };
  }

  componentDidMount() {
    this.getNotificationData();
  }

  getNotificationData = async () => {
    this.setState({ ...this.state, isLoading: true });
    let response = await getNotifications(this.props.userConfig.id);
    if(response.ok) {
    this.setState({ ...this.state, isLoading: false });
    let obj = response.data;
    for (var i in obj) {
      let selectedtypes = [];
      for (let j in obj[i].notificationTypes) {
        if (obj[i].notificationTypes[j].values) {
          selectedtypes.push(obj[i].notificationTypes[j].type);
        }
      }
        obj[i].selectedtypes = selectedtypes;
    }
    this.setState({ ...this.state, notification: obj });
  }
  else {
    this.setState({ ...this.state, errorMsg: this.isErrorDispaly(response), isLoading: false });
  }
  };

  saveBankInfo = async () => {
    this.setState({ ...this.state, btnDisabled: true, btnLoader: true })
    for (var y in this.state.notification) {
      if (
        this.state.notification[y].isAction &&
        this.state.notification[y].selectedtypes.length < 1
      ) {
        window.scrollTo(0, 0)
        return this.setState({
          ...this.state,
          errorMsg: "At least one notification type is required", btnLoader: false,
        });
      }
    }

    let response = await saveNotification(this.state.notification);

    if (response.ok) {
      this.setState({
        ...this.state,
        btnDisabled: false,
        btnLoading: false,
        errorMsg: null,
        btnLoader: false
      });
      message.destroy();
      message.success({
        content: "Notification settings saved successfully",
        className: "custom-msg",
        duration: 3,
      });
      this.setState({ ...this.state, errorMsg: null });
    } else {

      this.setState({ ...this.state, errorMsg: this.isErrorDispaly(response), btnLoader: false });
    }
  };
  isErrorDispaly = ({ data }) => {
    return data?.message || data;
  };

  handleChange = (e, item) => {
    let notificationLu = this.state.notification;
    item.selectedtypes = e;
    if (e.length > 0) {
      for (var a in item.notificationTypes) {
        var data = e.filter(
          (assign) => assign == item.notificationTypes[a].type
        );
        item.notificationTypes[a].values = data.length > 0 ? true : false;
      }
    }
    for (let i in notificationLu) {
      if (item.id == notificationLu[i].id) {
        notificationLu[i].selectedtypes = e;
      }
    }
    this.setState({ ...this.state, notification: notificationLu });
  };

  enableAction = (event, item) => {
    let notificationLu = this.state.notification;
    for (let i in notificationLu) {
      if (item.id == notificationLu[i].id) {
        notificationLu[i].isAction = event;
      }
    }
    this.setState({ ...this.state, notification: notificationLu });
  };

  render() {
    return (
      <>
        {this.state.errorMsg && (
          <Alert type="error" showIcon description={this.state.errorMsg} />
        )}
        <div className="box basic-info">
          <Translate content="notifications" className="basicinfo" />
          <div className="mt-16  box basic-info">
            <Form
              name="advanced_search"
              initialValues={this.state.noticObject}
              className="ant-advanced-search-form"
              onFinish={this.saveBankInfo}
              ref={this.formRef}
              autoComplete="off"
            >
              {this.state.isLoading ? (<div colSpan="8" className="p-16 text-center">
                <Loader /></div>
              ) : (<>
                <table className="pay-grid">
                  <thead> 
                    <tr>
                      <th style={{ width: 200 }}>Screen </th>
                      <th style={{ width: 350 }}>Notification Type</th>
                      <th style={{ width: 180 }}>Subscribe</th>
                    </tr>
                  </thead>
                  {this.state.notification.length !== 0 ? <>
                    <tbody>
                      {this.state.notification?.map((item, i) => {
                        return (
                          <>

                            <tr key={i}>
                              <td height="50">
                                <span>{item.action}</span>
                              </td>
                              <td style={{ width: 350 }}>
                                <div className="multiselect-textbox" >
                                  <Form.Item
                                    required
                                    rules={[
                                      {
                                        validator: async (_, item) => {
                                          if (item.selectedtypes.length < 1) {
                                            return Promise.reject(
                                              new Error("At least 2 passengers")
                                            );
                                          }
                                        },
                                      },
                                    ]}
                                  >
                                    <Select
                                      showSearch
                                      mode="multiple"
                                      className={item.isAction ? "cust-input multi-select custom-notify" : "cust-input-light"}
                                      style={{ width: "350px", marginBottom: "-17px" }}
                                      placeholder={<div className={!item.isAction && "cust-light"}>Select Notification Type</div>}
                                      optionFilterProp="children"
                                      onChange={(e) => this.handleChange(e, item)}
                                      value={item.selectedtypes}
                                      disabled={
                                        item.isAction === true ? false : true
                                      }
                                    >
                                      {item.notificationTypes?.map(
                                        (assign, idx) => (
                                          <Option key={idx} value={assign.type}>
                                            {assign.type}
                                          </Option>
                                        )
                                      )}
                                    </Select>
                                  </Form.Item>
                                </div>
                              </td>
                              <td style={{ width: 100 }}>
                                <div>
                                  <Switch
                                    onChange={(event) =>
                                      this.enableAction(event, item)
                                    }
                                    checked={item.isAction}
                                    size="medium"
                                    className="custom-toggle"
                                  />
                                </div>
                              </td>
                            </tr>
                          </>

                        )
                      })}
                    </tbody> </> : <>
                    <tbody>
                      <tr>
                        <td
                          colSpan="8"
                          className="p-16 text-center"
                          style={{width: 300 }}
                        >
                          No notification settings available
                        </td>
                      </tr>{" "}
                    </tbody>
                  </>}
                </table>

                <div className="text-center">
                  {this.state.notification.length !== 0 && <Button
                    htmlType="submit"
                    size="large"
                    className="pop-btn mt-36"
                    loading={this.state.btnLoader}
                    style={{ minWidth: 200, marginLeft: 462 }}>
                    <Translate content="Save_btn_text" />
                  </Button>}
                </div></>)}
            </Form>
          </div>
        </div>
      </>
    );
  }
}

const connectStateToProps = ({ userConfig }) => {
  return {
    userConfig: userConfig.userProfileInfo,
  };
};

const connectDispatchToProps = (dispatch) => {
  return {
    changeStep: (stepcode) => {
      dispatch(setStep(stepcode));
    },
    dispatch,
  };
};

export default connect(
  connectStateToProps,
  connectDispatchToProps
)(NotificationScreen);
