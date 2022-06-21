import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Translate from 'react-translate-component';
import { Space, Table, Tag, Select, Switch } from 'antd';
import { getNotifications, saveNotification } from "./api"
import { setStep } from "../../reducers/buysellReducer";
import { async } from 'rxjs';


const { Option } = Select;
const children = [];

for (let i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

const handleChange = (value) => {
  console.log(`selected ${value}`);
};

const onChange = (checked) => {
  console.log(`switch to ${checked}`);
};


const columns = [
  {
    title: 'ScreenName',
    dataIndex: 'ScreenName',
    key: 'ScreenName',
  },

  {
    title: 'Notification Type',
    key: 'Notification Type',
    dataIndex: 'NotificationType',
  },
  {
    title: 'Action',
    key: 'action',
    dataIndex: 'Action',
  },
];



class NotificationScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      notification: [],
      notificationLu: [],
      notic: [],
      check:false
    }
  }

  componentDidMount() {
    this.getNotificationData()

  }

  getNotificationData = async () => {
    debugger
    let respose = await getNotifications(this.props.userConfig.id);
    let obj = respose.data;
    this.setState({ ...this.state, notification: obj });
    // for(let i in obj){ 
    //   this.state.notificationLu.push(obj[i].notificationTypes)
    // // this.setState({ ...this.state,notic:obj[i].notificationTypes})

    //   }
    // console.log(this.state.notificationLu)

  }


  handleChange = () => {

  };


  enableAction=(event)=>{
    debugger
    let data=event
    console.log(data)
  }

  render() {
    return (<>
      <div className="box basic-info">
        <Translate content="notification" className="basicinfo" />
        <div className="mt-16 box basic-info">
          {/* <Table columns={columns} dataSource={data} pagination={false} className="pay-grid view" /> */}
          <table className="pay-grid">
            <thead>
              <tr>
                <th style={{ width: 200 }}>Screen Name</th>
                <th style={{ width: 350 }}>Notification Type</th>
                <th style={{ width: 180 }}>Action</th>
              </tr>
            </thead>
            <tbody>

              {this.state.notification?.map((item, i) => {
                return (
                  <>
                    <tr key={i}>
                      <td style={{ width: 200 }}> <span>{item.action}</span></td>

                      <td style={{ width: 350 }}>
                        <div className="multiselect-textbox" >
                          <Select
                            showSearch
                            mode="multiple"
                            className="cust-input multi-select"
                            style={{ width: "350px" }}
                            placeholder="Select Assigned To"
                            optionFilterProp="children"
                          // onKeyUp={(e) => handleSearch(e, "AssignedTo")}
                          // disabled={indx < caseObject.assignedTo.length - 1}
                          // disabled={indx < caseObject.assignedTo.length - 1|| (props.match.params.type === "disabled" || caseObject.state !== "Submitted") ? true : false}
                          >

                            {item.notificationTypes?.map((assign, idx) => (
                              <Option key={idx} value={assign.type}>
                                {assign.type}
                              </Option>
                            ))}
                          </Select>
                        </div>
                      </td>
                      <td style={{ width: 100 }}><div>
                        <Switch  onChange={(event) => this.enableAction(event)} size="medium" className="custom-toggle" />
                      </div>
                      </td>

                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
    );
  }
}

const connectStateToProps = ({ userConfig
}) => {
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



export default connect(connectStateToProps, connectDispatchToProps)(NotificationScreen);