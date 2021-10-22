import React, { Component,createRef } from 'react';
import { Typography, Select,Form,Button,message } from 'antd'
import {getSettingsLuData,saveSettingsData} from '../../api/apiServer'
import { connect } from 'react-redux';
import { getmemeberInfo } from '../../reducers/configReduser';
class Settings extends Component {
    formRef = createRef();
    state = {
        SettingsLu: '',theme:this.props.member?.Theme=='Light Theme'?true:false,settingsObj:{MemberId:'',Language:this.props.member?.Language?this.props.member?.Language:null,LCurrency:this.props.member?.LCurrency?this.props.member?.LCurrency:null,Theme:this.props.member?.Theme?this.props.member?.Theme:null}
    }
    componentDidMount(){
      this.getSettingsLu()
    }
    getSettingsLu=async()=>{
        let res = await getSettingsLuData();
        if (res.ok) {
           this.setState({...this.state,SettingsLu:res.data})
        } 
    }
    saveSettings=async()=>{
        let {settingsObj}=this.state;
        settingsObj.Theme=this.state.theme?'Light Theme':'Dark Theme';
        settingsObj.MemberId=this.props.member?.id
        let res = await saveSettingsData(settingsObj);
        if (res.ok) {
            message.destroy()
            message.error({ content: 'Settings saved successfully' , className:'custom-msg'});
            this.props.getmemeberInfoa(this.props.member.userId)
        } 
    }
    themeSwitch=() =>{
        this.setState({...this.state,theme:!this.state.theme})
    }
    handleChange = (e, fn) => {
        let { settingsObj } = this.state;
        settingsObj[fn] = e;
        this.setState({...this.state,settingsObj:settingsObj})
        this.formRef.current.setFieldsValue({ ...settingsObj })
    }
    render() {
        const { Option } = Select;
        const { Title, Text, Paragraph } = Typography;
        const {  settingsObj } = this.state;
        return (<><Form layout="vertical" initialValues={{ ...settingsObj }} onFinish={() => this.saveSettings()} ref={this.formRef} >
            <div className="box basic-info">
                <Title className="basicinfo">Settigns</Title>
                <Paragraph className="basic-decs">User customized settings</Paragraph>
        
                <div className="pb-16 border-bottom">
                <Form.Item
                  className="custom-forminput mb-24"
                  name="Language"
                  required
                  id="Language"
                  rules={[
                    { required: true, message: "Is required" },
                  ]}
                ><Text className="input-label">Language</Text>
                    <Select placeholder="Select Language"  bordered={false}
                     className="cust-input cust-select mb-0"
                     dropdownClassName="select-drpdwn"
                     onChange={(e) => { this.handleChange(e,'Language') }} value={settingsObj.Language}>
                        {this.state.SettingsLu.languageLookup?.map((item, idx) => <Option key={idx} value={item}>{item}
                        </Option>)}
                    </Select></Form.Item>
                </div>
                <div className="py-16 border-bottom">
                <Form.Item
                  className="custom-forminput mb-24"
                  name="LCurrency"
                  required
                  id="LCurrency"
                  rules={[
                    { required: true, message: "Is required" },
                  ]}
                ><Text className="input-label">Currency</Text>
                    <Select placeholder="Select Currency"  bordered={false}
                     className="cust-input cust-select mb-0"
                     dropdownClassName="select-drpdwn"
                     onChange={(e) => { this.handleChange(e,'LCurrency') }} value={settingsObj.LCurrency}>
                        {this.state.SettingsLu.currencyLookup?.map((item, idx) => <Option key={idx} value={item}>{item}
                        </Option>)}
                    </Select></Form.Item>
                </div>
                <div className="pt-16">
                    <Text className="input-label">Theme</Text>
                    <div className="d-flex">
                    <div className="theme-switch theme-active" onClick={()=>this.state.theme?this.themeSwitch(true):''}>
                        <div className="d-flex align-center">
                            <p className="switch-circle mb-0">{!this.state.theme&&<span className="icon md check-arrow c-pointer"></span>}{this.state.theme&&<span></span>}</p>
                            <p className="mb-0 ml-16 theme-txt">Dark Theme</p></div>
                    </div>
                    <div className="theme-switch ml-24" onClick={()=>!this.state.theme?this.themeSwitch(false):''}>
                        <div className="d-flex align-center">
                            <p className="switch-circle mb-0">{this.state.theme&&<span className="icon md check-arrow c-pointer"></span>}{!this.state.theme&&<span></span>}</p>
                            <p className="mb-0 ml-16 theme-txt">Light Theme</p></div>
                    </div>
                    </div>
                </div>
                <Button
                htmlType="submit"
                size="large"
                block
                className="pop-btn mt-36"
            >
                Save
            </Button>
            </div>
            </Form>
        </>)
    }
}
const connectStateToProps = ({ userConfig }) => {
    return { member: userConfig.userProfileInfo }
}
const connectDispatchToProps = dispatch => {
    return {
        getmemeberInfoa: (useremail) => {
            dispatch(getmemeberInfo(useremail));
        }
    }
}
export default  connect(connectStateToProps,connectDispatchToProps)(Settings);