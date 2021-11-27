import React, { useEffect, useState } from 'react';
import { Typography, Select, Form, Button, message, Row, Col } from 'antd'
import { getSettingsLuData, saveSettingsData } from '../../api/apiServer'
import { connect } from 'react-redux';
import { getmemeberInfo } from '../../reducers/configReduser';
import { useThemeSwitcher } from 'react-css-theme-switcher';
import counterpart from 'counterpart';
import en from '../../lang/en';
import ch from '../../lang/ch';
import my from '../../lang/my';
import Translate from 'react-translate-component';
import apiCalls from '../../api/apiCalls';

counterpart.registerTranslations('en', en);
counterpart.registerTranslations('ch', ch);
counterpart.registerTranslations('my', my);
const Settings = ({ member, getmemeberInfoa }) => {
    const { switcher, themes } = useThemeSwitcher();
    const [form] = Form.useForm();
    const [SettingsLu, setSettingsLu] = useState('')
    const [theme, setTheme] = useState(member?.theme == 'Light Theme' ? true : false);
    const [settingsObj, setSettingsObj] = useState({ MemberId: '', Language: member?.language ? member.language : 'en', LCurrency: member?.lCurrency ? member.lCurrency : 'USD', Theme: member?.theme ? member.theme : null })
    useEffect(() => {
        getSettingsLu()
        switcher({ theme: member?.theme == 'Light Theme' ? themes.LHT : themes.DRT });
        settingsTrack();
    }, [])
    const settingsTrack = () => {
        apiCalls.trackEvent({ "Type": 'User', "Action": 'Settings page view', "Username": member?.userName, "MemeberId": member?.id, "Feature": 'Settings', "Remarks": 'Settings page view', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Settings' });
    }
    const getSettingsLu = async () => {
        let res = await getSettingsLuData();
        if (res.ok) {
            setSettingsLu(res.data)
        }
    }
    const saveSettings = async () => {
        settingsObj.Theme = theme ? 'Light Theme' : 'Dark Theme';
        settingsObj.MemberId = member?.id
        let res = await saveSettingsData(settingsObj);
        if (res.ok) {
            message.destroy()
            message.success({ content: <Translate content="settings_msg" />, className: 'custom-msg' });
            getmemeberInfoa(member.userId)
            switcher({ theme: theme ? themes.LHT : themes.DRT });
            counterpart.setLocale(settingsObj.Language);
        }
    }
    const themeSwitch = async () => {
        setTheme(!theme)
        switcher({ theme: theme ? themes.DRT : themes.LHT });
        settingsObj.Theme = !theme ? 'Light Theme' : 'Dark Theme';
        settingsObj.MemberId = member?.id
        let res = await saveSettingsData(settingsObj);
        if (res.ok) {
            message.destroy()
            getmemeberInfoa(member.userId)
            counterpart.setLocale(settingsObj.Language);
        }
    }

    // render() {
    const { Option } = Select;
    const { Text, Paragraph } = Typography;
    return (<><Form layout="vertical" initialValues={{ ...settingsObj }} onFinish={saveSettings} form={form}>
        <div className="box basic-info">
            <Translate content="settings" className="basicinfo" />
            <Paragraph className="basic-decs"><Translate content="User_customized_settings" className="basic-decs" /></Paragraph>
            <Row className="py-16 border-bottom add-custom">
                <Col sm={24} md={12} className="mr-4">
                    <Text className="input-label"><Translate content="language" /></Text>
                    <Form.Item
                        className="custom-forminput mb-24"

                        name="Language"
                        required
                        id="Language"
                        rules={[
                            { required: true, message: "Is required" },
                        ]}
                    >
                        <Select placeholder="Select Language" bordered={false}
                            className="cust-input cust-select mb-0"
                            dropdownClassName="select-drpdwn"
                            onChange={(e) => { settingsObj.Language = e; setSettingsObj(settingsObj); form.setFieldsValue({ ...settingsObj }) }}>
                            {SettingsLu.languageLookup?.map((item, idx) => <Option key={idx} value={item}>{item.toUpperCase()}
                            </Option>)}
                        </Select></Form.Item>
                </Col>
                <Col sm={24} md={12} className="ml-4">
                    <Text className="input-label"><Translate content="currency" /></Text>
                    <Form.Item
                        className="custom-forminput mb-24"
                        name="LCurrency"
                        required
                        id="LCurrency"
                        rules={[
                            { required: true, message: "Is required" },
                        ]}
                    >
                        <Select placeholder="Select Currency" bordered={false}
                            className="cust-input cust-select mb-0"
                            dropdownClassName="select-drpdwn"
                            onChange={(e) => { settingsObj.LCurrency = e; setSettingsObj(settingsObj); form.setFieldsValue({ ...settingsObj }) }}>
                            {SettingsLu.currencyLookup?.map((item, idx) => <Option key={idx} value={item}>{item}
                            </Option>)}
                        </Select></Form.Item>
                </Col>
            </Row>
            <div className="pt-16 border-bottom pb-36">
                <Translate content="theme" className="input-label" component={Text} />
                <div className="custom-theme-btn mb-36">
                    <div className="theme-switch theme-active mobile-mb-16 c-pointer" onClick={() => theme ? themeSwitch() : ''}>
                        <div className="d-flex align-center " >
                            <p className="switch-circle mb-0" >{!theme && <span className="icon md check-arrow c-pointer"></span>}{theme && <span></span>}</p>
                            <p className="mb-0 ml-16 theme-txt"><Translate content="dark_theme" className="mb-0 ml-16 theme-txt" component={Text.p} /></p></div>
                    </div>
                    <div className={"theme-switch c-pointer" + (theme ? " themeSwitchOn " : " themeSwitchOff ")} onClick={() => !theme ? themeSwitch() : ''}>
                        <div className="d-flex align-center c-pointer" >
                            <p className="switch-circle mb-0 c-pointer" >{theme && <span className="icon md check-arrow c-pointer"></span>}{!theme && <span></span>}</p>
                            <p className="mb-0 ml-16 theme-txt"><Translate content="light_theme" className="mb-0 ml-16 theme-txt" component={Text.p} /></p></div>
                    </div>
                </div>
            </div>
            <div className="text-center">
                <Button
                    htmlType="submit"
                    size="medium"
                    className="pop-btn mt-36"
                    style={{ width: 300 }}
                >
                    <Translate content="Save_btn_text" />
                </Button>
            </div>
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
export default connect(connectStateToProps, connectDispatchToProps)(Settings);