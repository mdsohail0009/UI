import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Translate from 'react-translate-component';
import { Space, Table, Tag,Select,Switch} from 'antd';
import {getNotifications, saveNotification} from "./api"
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
      // render: (_, record) => (
      //   // <Space size="middle">
      //   //   <a>Invite {record.name}</a>
      //   //   <a>Delete</a>
      //   // </Space>
      // ),
      dataIndex: 'Action',
    },
  ];

  const data = [
    {
      key: '1',
      ScreenName: 'John Brown',
      NotificationType: (<div className="multiselect-textbox"> <Select
        mode="multiple"
        allowClear
        style={{
          width: '100%',
        }}
        placeholder="Please select"
        defaultValue={['Email', 'Notification']}
        onChange={handleChange}
      >
        {children}
      </Select></div>),
      Action:(<div><Switch defaultChecked onChange={onChange} size="medium" className="custom-toggle" /></div>)
    },
    // {
    //   key: '2',
    //   ScreenName: 'Jim Green',
    //   NotificationType: (
      // <div className="multiselect-textbox"> <Select
      //   mode="multiple"
      //   allowClear
      //   style={{
      //     width: '100%',
      //   }}
      //   placeholder="Please select"
      //   defaultValue={['Email', 'Notification']}
      //   onChange={handleChange}
      // >
      //   {children}
      // </Select></div>)
    // },
    // {
    //   key: '3',
    //   ScreenName: 'Joe Black',
    //   NotificationType: (<div className="multiselect-textbox"> <Select
    //   mode="multiple"
    //   allowClear
    //   style={{
    //     width: '100%',
    //   }}
    //   placeholder="Please select"
    //   defaultValue={['Email', 'Notification']}
    //   onChange={handleChange}
    // >
    //   {children}
    // </Select></div>)
    // },
  ];

class NotificationScreen extends Component {

  constructor(props){
    super(props);
    this.state={
      notification:[],
      notificationLu:[],
      notic:[]
    }
  }

  componentDidMount(){
    this.getNotificationData()
 
  }

  getNotificationData=async()=>{
    debugger
    let respose=await getNotifications(this.props.userConfig.id);
    console.log(respose.data)
    this.setState({ ...this.state,notification: respose.data });


  }
 
  
   handleChange = () => {
    
  };
  
  onChange = () => {
   
  };



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

                  {this.state.notic?.map((item, i) => {
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
                          style={{width:"350px"}}
                          placeholder="Select Assigned To"
                          optionFilterProp="children"
                          // onKeyUp={(e) => handleSearch(e, "AssignedTo")}
                          // disabled={indx < caseObject.assignedTo.length - 1}
                          // disabled={indx < caseObject.assignedTo.length - 1|| (props.match.params.type === "disabled" || caseObject.state !== "Submitted") ? true : false}
                        >
                          {this.state.notificationLu?.map((assign, idx) => (
                            <Option key={idx} value={assign}>
                              {assign.type}
                            </Option>
                          ))}
                        </Select></div>
                          </td>
                          <td style={{ width: 100 }}><div>
                            <Switch defaultChecked onChange={this.onChange()} size="medium" className="custom-toggle" />
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
return { userConfig: userConfig.userProfileInfo,
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



export default connect( connectStateToProps,connectDispatchToProps)(NotificationScreen);