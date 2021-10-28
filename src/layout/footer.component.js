import React, { useState,useEffect } from 'react';
import { Layout, Typography, Button } from 'antd';
import counterpart from 'counterpart';
import en from '../lang/en';
import ch from '../lang/ch';
import my from '../lang/my';
import { useThemeSwitcher } from 'react-css-theme-switcher';
import { connect } from 'react-redux';
//import apicalls from '../../api/apiCalls';
import Translate from 'react-translate-component';


counterpart.registerTranslations('en', en);
counterpart.registerTranslations('ch', ch);
counterpart.registerTranslations('my', my);
// counterpart.setLocale('en');

const { Footer: AntFooter } = Layout


function Footer({member}) {
    const { switcher, themes, status } = useThemeSwitcher();
    const [isDarkMode, setIsDarkMode] = React.useState(true);
    //const [lang, setLang] = useState('en')
    const [theme, setTheme] = useState('LRT');


    useEffect(()=>{
        switcher({ theme: member?.theme =='Light Theme'? themes.LHT : themes.DRT });
        counterpart.setLocale(member?.language?member?.language:'en');
      },[])
    if (status == 'loading') {
        return <div>Loading styles...</div>;
    }

    const handleTheme = () => {
        setIsDarkMode(previous => {
            if(previous){
                setTheme('DRT');
            }
            else{
                setTheme('LRT');
            }
            switcher({ theme: previous ? themes.LHT : themes.DRT });
            return !previous;
        });
    };
    // const onLangChange = (e) => {
    //     setLang({ lang: e.target.value });
    //     counterpart.setLocale(e.target.value);
    // }


    return (<AntFooter style={{ backgroundColor: 'transparent', padding: 0 }}>


        <div className="main-container footer-links">
            <div className="d-flex justify-content align-center">
                
                {/* <a href="https://suissebase.ch/" target="_blank">Home</a> */}
                <a href="https://suissebase.ch/" target="_blank"><Translate content="home"/></a>
                {/* <a href="https://suissebase.ch/" target="_blank">Careers</a> */}
                <a href="https://suissebase.ch/" target="_blank"><Translate content="careers"/></a>
                {/* <a href="https://www.iubenda.com/privacy-policy/42856099" target="_blank">Legal & Policy</a> */}
                <a href="https://www.iubenda.com/privacy-policy/42856099" target="_blank"><Translate content="legal_policy"/></a>
                <Typography className="mobile-none text-white-30">Suissebase<sup className="fs-10">TM</sup> {new Date().getFullYear()}</Typography>
            </div>
            <div className="copyright-block">
                <Typography className="copyright text-white-30">Suissebase<sup className="fs-10">TM</sup> {new Date().getFullYear()}</Typography>
                <span>
                    <Button type="primary" shape="circle" size="large" className='darkTheme' onClick={handleTheme}> {theme}</Button>
                    
                    {/* <select value={lang} onChange={onLangChange} className="selct-lang ml-8 f-12" removeIcon={true}>
                        <option value="en">EN</option>
                        <option value="ch">英语</option>
                        <option value="my">MY</option>
                    </select> */}
                </span>
            </div>
        </div>
    </AntFooter>)


}
const connectStateToProps = ({ userConfig }) => {
    return { member: userConfig.userProfileInfo }
}
export default connect(connectStateToProps)(Footer)