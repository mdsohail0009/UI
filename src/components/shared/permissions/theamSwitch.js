import React, { useEffect, useState } from 'react';
import { useThemeSwitcher } from 'react-css-theme-switcher';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import { saveSettingsData } from '../../../api/apiServer';
const TheamSwitch = ({customer,theamFlag}) => {
    const { switcher, themes } = useThemeSwitcher();
    const [theme, setTheme] = useState(customer?.theme === 'Light Theme' ? true : false);
    useEffect(() => {
        debugger
        switcher({ theme: customer?.theme === 'Light Theme' ? themes.LHT : themes.DRT });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const themeSwitch = async () => {
        debugger
        setTheme(!theme)
        switcher({ theme: theme ? themes.DRT : themes.LHT });
        let settingsObj={};
        settingsObj.Theme = !theme ? 'Light Theme' : 'Dark Theme';
        settingsObj.Language = settingsObj.Language?.toLowerCase();
        settingsObj.customerId = customer?.id;
        //settingsObj.info = JSON.stringify(trackAuditLogData)
        let res = await saveSettingsData(settingsObj);
        if (res.ok) {
            // message.destroy()
            // getmemeberInfoa(customer.userId)
            // counterpart.setLocale(settingsObj.Language);
        }
    }
  return (
    <div>
        
      <div className="custom-theme-btn">
        {theamFlag =="darkTheam" && 
                    <div className="theme-switch theme-active mobile-mb-16 c-pointer" onClick={() => theme ? themeSwitch() : ''}>
                        <div className="d-flex align-center " >
                            <p className="switch-circle" >{!theme && <span className="icon lg radio-check c-pointer"></span>}{theme && <span className='icon radio lg c-pointer'></span>}</p>
                            <p className="theme-txt">Dark Mode</p></div>
                    </div>}
         {theamFlag == "lightTheam" &&            
                    <div className={"theme-switch c-pointer" + (theme ? " themeSwitchOn " : " themeSwitchOff ")} onClick={() => !theme ? themeSwitch() : ''}>
                        <div className="d-flex align-center c-pointer" >
                            <p className="switch-circle c-pointer" >{theme && <span className="icon lg radio-check c-pointer"></span>}{!theme && <span className='icon radio lg c-pointer'></span>}</p>
                            <p className="theme-txt">Light mode</p>
                            </div>
                    </div>}
                </div>
    </div>
  )
}
const connectStateToProps = ({ userConfig }) => {
    return { customer: userConfig.userProfileInfo, trackAuditLogData: userConfig.trackAuditLogData }
}
const connectDispatchToProps = dispatch => {
    return {
        
        dispatch
    }
}
export default connect(connectStateToProps, connectDispatchToProps) (TheamSwitch)
