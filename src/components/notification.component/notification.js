import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Loader from "../../Shared/loader";
import Translate from 'react-translate-component';
import { Space, Table, Tag, Select, Switch, Button ,message,Form, Alert} from 'antd';
import { getNotifications, saveNotification } from "./api"
import { setStep } from "../../reducers/buysellReducer";
import { async } from 'rxjs';


const { Option } = Select;
const children = [];

class NotificationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {isLoading: false,
      notification: [],
      notificationLu: [],
      notic: [],
      action:false,
      noticObject:{},
      errorMsg:null
    }
  }

  componentDidMount() {
    this.getNotificationData()
  }

  getNotificationData = async () => {
    this.setState({ ...this.state, isLoading: true });
    let respose = await getNotifications(this.props.userConfig.id);
    this.setState({ ...this.state, isLoading: false });
    let obj = respose.data;
    for(var i in obj){
      let selectedtypes=[];
      for(let j in obj[i].notificationTypes){
        if(obj[i].notificationTypes[j].values){
        selectedtypes.push(obj[i].notificationTypes[j].type)}
      }
      obj[i].selectedtypes=selectedtypes
    }
    this.setState({ ...this.state, notification: obj });
  }



   saveBankInfo = async()=>{
    console.log(this.state.notification)
    for(var y in this.state.notification){
      if(this.state.notification[y].isAction && this.state.notification[y].selectedtypes.length<1){
        return this.setState({...this.state, errorMsg:'Please select atleast one notification type'});
      }
    }
    let response= await saveNotification(this.state.notification);
    if(response.ok){
      this.setState({ ...this.state, btnDisabled: false, btnLoading: false, errorMsg: null });
        message.destroy();
        message.success({
          content: 'Notification details saved successfully',
          className: "custom-msg",
          duration: 3
        })
       this.setState({...this.state, errorMsg:null});
    }else{
      this.setState({...this.state, errorMsg:this.isErrorDispaly(response) });
    }
  }
  isErrorDispaly = (objValue) => {
		if (objValue.data && typeof objValue.data === "string") {
		  return objValue.data;
		} else if (
		  objValue.originalError &&
		  typeof objValue.originalError.message === "string"
		) {
		  return objValue.originalError.message;
		} else {
		  return "Something went wrong please try again!";
		}
	  };

  handleChange = (e,item) => {
    let notificationLu=this.state.notification
    item.selectedtypes=e
    if(e.length>0){
      for(var a in item.notificationTypes){
        // item.notificationTypes[a]=
       var data= e.filter((assign)=>assign==item.notificationTypes[a].type)
       item.notificationTypes[a].values=data.length>0?true:false
        // console.log(e.filter((assign)=>assign==item.notificationTypes[a].type))
      }
    }
    for(let i in notificationLu){
    if(item.id==notificationLu[i].id){
      notificationLu[i].selectedtypes=e;

    }
    }
    this.setState({...this.state,notification:notificationLu})
    // if(this.state.notification?.action==="Deposit Crypto"){
    //   console.log(e)
    // }
    // else if(this.state.notification.action=="Sell"){console.log(e)}
    // else if(this.state.notification.action=="Buy"){console.log(e)}
    // else if(this.state.notification.action=="Withdraw Crypto"){console.log(e)}
    // else if(this.state.notification.action=="Deposit Fiat"  ){console.log(e)}
    // else if(this.state.notification.action=="Withdraw Fiat"){console.log(e)}
 
  };


  enableAction=(event,item)=>{
    let notificationLu=this.state.notification
    for(let i in notificationLu){
    if(item.id==notificationLu[i].id){
      notificationLu[i].isAction=event
    }
    }
    this.setState({...this.state,notification:notificationLu})

  }

  render() {
    return (<>
    {this.state.errorMsg && <Alert type='error' description={this.state.errorMsg} />}
   
       <div className="box basic-info">
        <Translate content="notification" className="basicinfo" />
        <div className="mt-16  box basic-info">
          <Form
           name="advanced_search"
           initialValues={this.state.noticObject}
           className="ant-advanced-search-form"
           onFinish={this.saveBankInfo}
           ref={this.formRef}
           autoComplete="off"
          >
            
          {/* <Table columns={columns} dataSource={data} pagination={false} className="pay-grid view" /> */}
          {this.state.isLoading ? <Loader/> :
          <table className="pay-grid">
            <thead>
              <tr>
                <th style={{ width: 200 }}>Screen </th>
                <th style={{ width: 350 }}>Notification Type</th>
                <th style={{ width: 180 }}>Subscribe</th>
              </tr>
            </thead>
            <tbody>

              {this.state.notification?.map((item, i) => {
                return (
                  <>
                    <tr key={i}>
                      <td height="50"><span>{item.action}</span></td>

                      <td style={{ width: 350 }}>
                        <div className="multiselect-textbox">
                          <Form.Item
                            required
                            rules={[
                              {
                                validator: async (_, item) => {
                                  if ( item.selectedtypes.length < 1) {
                                    return Promise.reject(new Error('At least 2 passengers'));
                                  }
                                },
                              },
                            ]}> 
                            <Select
                              showSearch
                              mode="multiple"
                              className="cust-input multi-select"
                              style={{ width: "350px" }}
                              placeholder="Select Notification Type"
                              optionFilterProp="children"
                              onChange={(e) => this.handleChange(e, item)}
                              value={item.selectedtypes}
                              // onKeyUp={(e) => handleSearch(e, "AssignedTo")}
                              // disabled={indx < caseObject.assignedTo.length - 1}
                              disabled={(item.isAction === true) ? false : true}
                              
                            >
                              {item.notificationTypes?.map((assign, idx) => (
                                <Option key={idx} value={assign.type}>
                                  {assign.type}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </div>
                      </td>
                      <td style={{ width: 100 }}><div>
                        <Switch  onChange={(event) => this.enableAction(event,item)} checked={item.isAction} size="medium" className="custom-toggle" />
                      </div>
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          
          </table>}
          </Form>
          <div className="text-center">
                    <Button
                        htmlType="submit"
                         size="min"
                         className="pop-btn mt-36"
                         onClick={()=>{this.saveBankInfo()}}
                         style={{ minWidth: 200 , marginLeft:462}}>
                         <Translate content="Save_btn_text" />
                    </Button>
            </div>
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