import React, { useEffect, useState } from 'react';
import { useThemeSwitcher } from 'react-css-theme-switcher';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import { saveSettingsData } from '../../../api/apiServer';
const TheamSwitch = ({customer,theamFlag}) => {
    const { switcher, themes } = useThemeSwitcher();
    const [theme, setTheme] = useState(customer?.theme === 'Light Theme' ? true : false);
    const [screenTheme,setScreenTheme]=useState("lightMode")
    const [settingsObj, setSettingsObj] = useState({ customerId: '', Language: customer?.language ? customer.language?.toUpperCase() : 'EN', currency: customer?.currency ? customer.currency : 'USD', Theme: customer?.theme ? customer.theme : null })
    
    useEffect(() => {
        switcher({ theme: customer?.theme === 'Light Theme' ? themes.LHT : themes.DRT });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const themeSwitch = async () => {
        setTheme(!theme)
        switcher({ theme: theme ? themes.DRT : themes.LHT });
        let settingsObj={};
        settingsObj.Theme = !theme ? 'Light Theme' : 'Dark Theme';
        settingsObj.Language = settingsObj.Language?.toLowerCase();
        settingsObj.customerId = customer?.id;
        if(theme ==true){
            setScreenTheme("lightMode")
        }else{
            setScreenTheme("darkMode") 
        }
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
         {screenTheme != 'lightMode' && 
                    <div className="theme-switch theme-active mobile-mb-16 c-pointer" onClick={() =>  themeSwitch() }>
                        <div className="d-flex align-center " >
                            {/* <p className="switch-circle" >{!theme && <span className="icon lg radio-check c-pointer"></span>}{theme && <span className='icon radio lg c-pointer'></span>}</p> */}
                            <p className="theme-txt"><span className="icon md theme-icon" />Dark Mode</p></div>
                    </div>}
         {screenTheme != 'darkMode' &&            
                    <div className={"theme-switch c-pointer" + (theme ? " themeSwitchOn " : " themeSwitchOff ")} onClick={() =>  themeSwitch() }>
                        <div className="d-flex align-center c-pointer" >
                            {/* <p className="switch-circle c-pointer" >{theme && <span className="icon lg radio-check c-pointer"></span>}{!theme && <span className='icon radio lg c-pointer'></span>}</p> */}
                            <p className="theme-txt"><span className="icon md theme-icon" />Light Mode</p>
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
