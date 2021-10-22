import React, { useEffect, useState } from 'react';
import { Typography, Select,Form,Button,message } from 'antd'
import {getSettingsLuData,saveSettingsData} from '../../api/apiServer'
import { connect } from 'react-redux';
import { getmemeberInfo } from '../../reducers/configReduser';
import { useThemeSwitcher } from 'react-css-theme-switcher';
const Settings =({member,getmemeberInfoa})=> {
    const { switcher, themes, status } = useThemeSwitcher();
    const [isDarkMode, setIsDarkMode] = React.useState(true);
  const [form] = Form.useForm();
    const [SettingsLu,setSettingsLu]=useState('')
    const [theme,setTheme]=useState(member?.theme=='Light Theme'?true:false);
    const [settingsObj,setSettingsObj]=useState({MemberId:'',Language:member?.language?member.language:null,LCurrency:member?.lCurrency?member.lCurrency:null,Theme:member?.theme?member.theme:null})
    useEffect(()=>{
      getSettingsLu()
      switcher({ theme: member?.theme =='Light Theme'? themes.LHT : themes.DRT });
    },[])
    const getSettingsLu=async()=>{
        let res = await getSettingsLuData();
        if (res.ok) {
            setSettingsLu(res.data)
        } 
    }
    const saveSettings=async()=>{
        settingsObj.Theme=theme?'Light Theme':'Dark Theme';
        settingsObj.MemberId=member?.id
        let res = await saveSettingsData(settingsObj);
        if (res.ok) {
            message.destroy()
            message.success({ content: 'Settings saved successfully' , className:'custom-msg'});
            getmemeberInfoa(member.userId)
            setIsDarkMode(previous => {
                switcher({ theme: previous ? themes.LHT : themes.DRT });
                return !previous;
            });
        } 
    }
    const themeSwitch=() =>{
        setTheme(!theme)
    }
    const handleChange = (e, fn) => {
        let obj={...settingsObj}
        obj[fn] = e;
        setSettingsObj(obj)
        form.setFieldsValue({settingsObj:obj});
    }
    // render() {
        const { Option } = Select;
        const { Title, Text, Paragraph } = Typography;
        return (<><Form layout="vertical" initialValues={{ ...settingsObj }} onFinish={saveSettings} form={form}>
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
                     onChange={(e) => {settingsObj.Language=e; setSettingsObj(settingsObj);form.setFieldsValue({...settingsObj}) }}>
                        {SettingsLu.languageLookup?.map((item, idx) => <Option key={idx} value={item}>{item}
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
                     onChange={(e) => {settingsObj.LCurrency=e; setSettingsObj(settingsObj);form.setFieldsValue({...settingsObj}) }}>
                        {SettingsLu.currencyLookup?.map((item, idx) => <Option key={idx} value={item}>{item}
                        </Option>)}
                    </Select></Form.Item>
                </div>
                <div className="pt-16">
                    <Text className="input-label">Theme</Text>
                    <div className="d-flex">
                    <div className="theme-switch theme-active" onClick={()=>theme?themeSwitch(true):''}>
                        <div className="d-flex align-center">
                            <p className="switch-circle mb-0">{!theme&&<span className="icon md check-arrow c-pointer"></span>}{theme&&<span></span>}</p>
                            <p className="mb-0 ml-16 theme-txt">Dark Theme</p></div>
                    </div>
                    <div className="theme-switch ml-24" onClick={()=>!theme?themeSwitch(false):''}>
                        <div className="d-flex align-center">
                            <p className="switch-circle mb-0">{theme&&<span className="icon md check-arrow c-pointer"></span>}{!theme&&<span></span>}</p>
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
    // }
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