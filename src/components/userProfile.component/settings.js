import React, { useEffect, useState } from 'react';
import { Typography, Select, Form, Button, message, Row, Col,Alert,Spin } from 'antd'
import { getSettingsLuData, saveSettingsData } from '../../api/apiServer'
import { connect } from 'react-redux';
import { getmemeberInfo } from '../../reducers/configReduser';
import counterpart from 'counterpart';
import en from '../../lang/en';
import ch from '../../lang/ch';
import my from '../../lang/my';
import Translate from 'react-translate-component';
import apiCalls from '../../api/apiCalls';
import { LoadingOutlined } from "@ant-design/icons";
const { Title } = Typography;
counterpart.registerTranslations('en', en);
counterpart.registerTranslations('ch', ch);
counterpart.registerTranslations('my', my);
const Settings = ({ customer, getmemeberInfoa, trackAuditLogData }) => {
    const [btnDisabled, setBtnDisabled] = useState(false);
    const [form] = Form.useForm();
    const [SettingsLu, setSettingsLu] = useState('')
    const [theme, setTheme] = useState(customer?.theme === 'Light Theme' ? true : false);
    const [settingsObj, setSettingsObj] = useState({ customerId: '', Language: customer?.language ? customer.language?.toUpperCase() : 'EN', currency: customer?.currency ? customer.currency : 'USD', Theme: customer?.theme ? customer.theme : null })
    const [errorMsg,setErrorMsg]=useState(null);
    const [isLoading,setIsLoading]=useState(false);
    useEffect(() => {
        getSettingsLu()
        settingsTrack();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const settingsTrack = () => {
        apiCalls.trackEvent({ "Type": 'User', "Action": 'Settings page view', "Username": customer?.userName, "customerId": customer?.id, "Feature": 'Settings', "Remarks": 'Settings page view', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Settings' });
    }
    const getSettingsLu = async () => {
        let res = await getSettingsLuData();
        if (res.ok) {
            setSettingsLu(res.data)
        }
        else
        {
            setErrorMsg(apicalls.isErrorDispaly(res))
        }
    }
    const saveSettings = async () => {
        setBtnDisabled(true);
        setIsLoading(false);
        settingsObj.Theme = theme ? 'Light Theme' : 'Dark Theme';
        settingsObj.Language = settingsObj.Language?.toLowerCase();
        settingsObj.customerId = customer?.id;
        settingsObj.info = JSON.stringify(trackAuditLogData);
        let res = await saveSettingsData(settingsObj);
        if (res.ok) {
            setBtnDisabled(false);
            setTimeout(() => setBtnDisabled(false), 2000);
            message.destroy()
            message.success({ content: <Translate content="settings_msg" />, className: 'custom-msg',duration:3 });
            getmemeberInfoa(customer.userId)
            counterpart.setLocale(settingsObj.Language);
            setErrorMsg(null);
            setIsLoading(false);
            
        }
        else{
            setErrorMsg(apicalls.isErrorDispaly(res))
            setIsLoading(false);
            setBtnDisabled(false);
        }
    }
   
        const antIcon = (
            <LoadingOutlined
                style={{ fontSize: 18, color: "#fff", marginRight: "16px" }}
                spin
            />
        );
    const { Option } = Select;
    const { Text, Paragraph } = Typography;
    return (<>
      {errorMsg !== null && (
        <Alert
          className="mb-12"
          type="error"
          description={errorMsg}
          showIcon
        />
      )}
    <Form layout="vertical" initialValues={{ ...settingsObj }} onFinish={saveSettings} form={form}>
        <div className="basicprofile-info">
            <Translate content="settings" className="basicinfo" component={Title}/>
            <Paragraph className="basic-decs"><Translate content="User_customized_settings" className="basic-decs" /></Paragraph>
            <Row className="order-bottom add-custom">
                <Col sm={24} md={24} xs={24} xl={24} className="">
                    <Text className="label-style"><Translate content="language" /></Text>
                    <Form.Item
                        className="custom-forminput custom-label"

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
                <Col sm={24} md={24} xs={24} xl={24} className="ml-4">
                    <Text className="label-style"><Translate content="currency" /></Text>
                    <Form.Item
                        className="custom-forminput custom-label"
                        name="currency"
                        required
                        id="currency"
                        rules={[
                            { required: true, message: "Is required" },
                        ]}
                    >
                        <Select placeholder="Select Currency" bordered={false}
                            className="cust-input cust-select mb-0"
                            dropdownClassName="select-drpdwn"
                            onChange={(e) => { settingsObj.currency = e; setSettingsObj(settingsObj); form.setFieldsValue({ ...settingsObj }) }}>
                            {SettingsLu.currencyLookup?.map((item, idx) => <Option key={idx} value={item}>{item.toUpperCase()}
                            </Option>)}
                        </Select></Form.Item>
                </Col>
            </Row>
            <div className="text-center">
                    <Button
                        htmlType="submit"
                        size="large"
                        className="pop-btn setting-btn"
                        loading={btnDisabled}
                        block
                        >
                        {isLoading && <Spin indicator={antIcon} />}{" "}
                        <Translate content="Save_btn_text" />
                    </Button>
            </div>
        </div>
    </Form>
    </>)
    // }
}
const connectStateToProps = ({ userConfig }) => {
    return { customer: userConfig.userProfileInfo, trackAuditLogData: userConfig.trackAuditLogData }
}
const connectDispatchToProps = dispatch => {
    return {
        getmemeberInfoa: (useremail) => {
            dispatch(getmemeberInfo(useremail));
        }
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(Settings);