import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Translate from 'react-translate-component';
import { Space, Table, Tag,Select,Switch} from 'antd';

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

                  {children?.map((item, i) => {
                    return (
                      <>
                        <tr key={i}>
                          <td style={{ width: 200 }}> <span>{item.action}</span></td>
                          <td style={{ width: 350 }}>
                            <div className="multiselect-textbox"> <Select
                              mode="multiple"
                              allowClear
                              style={{
                                width: '100%',
                              }}
                              placeholder="Please select"
                              defaultValue={['Email', 'Notification']}
                              onChange={this.handleChange}
                            >
                              {children}
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

export default NotificationScreen;