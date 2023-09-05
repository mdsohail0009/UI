import React, { useEffect, useState } from 'react';
import { useThemeSwitcher } from 'react-css-theme-switcher';
import { connect } from 'react-redux';
import { getmemeberInfo } from '../../../reducers/configReduser';
import { saveSettingsData } from '../../../api/apiServer';
const TheamSwitch = ({customer,getmemeberInfoa}) => {
    const { switcher, themes } = useThemeSwitcher();
    const [theme, setTheme] = useState(customer?.theme === 'Light Theme' ? true : false);
    const [screenTheme,setScreenTheme]=useState("lightMode")
    
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
        if(theme){
            setScreenTheme("lightMode")
        }else{
            setScreenTheme("darkMode") 
        }
        let res = await saveSettingsData(settingsObj);
        if (res.ok) {
            getmemeberInfoa(customer.userId)
           
        }
    }
  return (
    <div>
        
      <div className="custom-theme-btn">
         {screenTheme != 'lightMode' && 
                    <div className="theme-switch newSpace theme-active mobile-mb-16 c-pointer" onClick={() =>  themeSwitch() }>
                        <div className="d-flex align-center " >
                            <p className="theme-txt"><span className="icon md theme-icon" /><span className='theme-text'>Light Mode</span></p></div>
                    </div>}
         {screenTheme != 'darkMode' &&            
                    <div className={"theme-switch c-pointer newSpace" + (theme ? " themeSwitchOn " : " themeSwitchOff ")} onClick={() =>  themeSwitch() }>
                        <div className="d-flex align-center c-pointer" >
                            <p className="theme-txt"><span className="icon md theme-icon" /><span className='theme-text'>Dark Mode</span></p>
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
        getmemeberInfoa: (useremail) => {
            dispatch(getmemeberInfo(useremail));
        }
    }
}

export default connect(connectStateToProps, connectDispatchToProps) (TheamSwitch)
