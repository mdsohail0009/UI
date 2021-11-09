import React, { useEffect, useState } from 'react';
import { Typography, Select,Form,Button,message } from 'antd'
import {getSettingsLuData,saveSettingsData} from '../../api/apiServer'
import { connect } from 'react-redux';
import { getmemeberInfo } from '../../reducers/configReduser';
import { useThemeSwitcher } from 'react-css-theme-switcher';
import counterpart from 'counterpart';
import en from '../../lang/en';
import ch from '../../lang/ch';
import my from '../../lang/my';
import Translate from 'react-translate-component';
counterpart.registerTranslations('en', en);
counterpart.registerTranslations('ch', ch);
counterpart.registerTranslations('my', my);
const Settings =({member,getmemeberInfoa})=> {
    const { switcher, themes } = useThemeSwitcher();
  const [form] = Form.useForm();
    const [SettingsLu,setSettingsLu]=useState('')
    const [theme,setTheme]=useState(member?.theme=='Light Theme'?true:false);
    const [settingsObj,setSettingsObj]=useState({MemberId:'',Language:member?.language?member.language:'en',LCurrency:member?.lCurrency?member.lCurrency:'USD',Theme:member?.theme?member.theme:null})
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
                switcher({ theme: theme ? themes.LHT : themes.DRT });
            counterpart.setLocale(settingsObj.Language);
        } 
    }
    const themeSwitch=() =>{
        setTheme(!theme)
        switcher({ theme: theme ? themes.DRT : themes.LHT });
    }
    
    // render() {
        const { Option } = Select;
        const {  Text, Paragraph } = Typography;
        return (<><Form layout="vertical" initialValues={{ ...settingsObj }} onFinish={saveSettings} form={form}>
            <div className="box basic-info">
            <Translate content="settings" className="basicinfo"  />
                <Paragraph className="basic-decs"><Translate content="User_customized_settings" className="basic-decs"  /></Paragraph>
        
                <div className="pb-16 border-bottom">
                <Text className="input-label"><Translate content="language" className="input-label"  /></Text>
                <Form.Item
                  className="custom-forminput mb-24"
                  name="Language"
                  required
                  id="Language"
                  rules={[
                    { required: true, message: "Is required" },
                  ]}
                >
                    <Select placeholder="Select Language"  bordered={false}
                     className="cust-input cust-select mb-0"
                     dropdownClassName="select-drpdwn"
                     onChange={(e) => {settingsObj.Language=e; setSettingsObj(settingsObj);form.setFieldsValue({...settingsObj}) }}>
                        {SettingsLu.languageLookup?.map((item, idx) => <Option key={idx} value={item}>{item.toUpperCase()}
                        </Option>)}
                    </Select></Form.Item>
                </div>
                <div className="py-16 border-bottom">
                <Text className="input-label"><Translate content="currency" className="input-label" component={Text} /></Text>
                <Form.Item
                  className="custom-forminput mb-24"
                  name="LCurrency"
                  required
                  id="LCurrency"
                  rules={[
                    { required: true, message: "Is required" },
                  ]}
                >
                    <Select placeholder="Select Currency"  bordered={false}
                     className="cust-input cust-select mb-0"
                     dropdownClassName="select-drpdwn"
                     onChange={(e) => {settingsObj.LCurrency=e; setSettingsObj(settingsObj);form.setFieldsValue({...settingsObj}) }}>
                        {SettingsLu.currencyLookup?.map((item, idx) => <Option key={idx} value={item}>{item}
                        </Option>)}
                    </Select></Form.Item>
                </div>
                <div className="pt-16">
                    <Text className="input-label"><Translate content="theme" className="input-label" component={Text} /></Text>
                    <div className="d-flex">
                    <div className="theme-switch theme-active">
                        <div className="d-flex align-center">
                            <p className="switch-circle mb-0 c-pointer" onClick={()=>theme?themeSwitch():''}>{!theme&&<span className="icon md check-arrow c-pointer"></span>}{theme&&<span></span>}</p>
                            <p className="mb-0 ml-16 theme-txt"><Translate content="dark_theme" className="mb-0 ml-16 theme-txt" component={Text.p} /></p></div>
                    </div>
                    <div className={"theme-switch ml-24" +  (theme ? " themeSwitchOn " : " themeSwitchOff ")}>
                        <div className="d-flex align-center">
                            <p className="switch-circle mb-0 c-pointer" onClick={()=>!theme?themeSwitch():''}>{theme&&<span className="icon md check-arrow c-pointer"></span>}{!theme&&<span></span>}</p>
                            <p className="mb-0 ml-16 theme-txt"><Translate content="light_theme" className="mb-0 ml-16 theme-txt" component={Text.p} /></p></div>
                    </div>
                    </div>
                </div>
                <Button
                htmlType="submit"
                size="large"
                block
                className="pop-btn mt-36"
            >
                <Translate  content="Save_btn_text" />
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