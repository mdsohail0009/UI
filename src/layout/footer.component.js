import React, { useState } from 'react';
import { Layout, Typography, Menu, Button, Dropdown } from 'antd';
import { Link } from 'react-router-dom';
import labels from '../utils/lables.json';
import counterpart from 'counterpart';
import en from '../lang/en';
import ch from '../lang/ch';
import my from '../lang/my';
import Translate from 'react-translate-component';
import { useThemeSwitcher } from 'react-css-theme-switcher';

counterpart.registerTranslations('en', en);
counterpart.registerTranslations('ch', ch);
counterpart.registerTranslations('my', my);
counterpart.setLocale('en');

const { Footer: AntFooter } = Layout
const languageMenu = (
    <Menu className="drpdwn-list">
        <Menu.Item key="0">
            <a className="text-white">English</a>
        </Menu.Item>
        <Menu.Item key="1">
            <a className="text-white">中国人</a>
        </Menu.Item>
        <Menu.Item key="2">
            <a className="text-white">Bahasa Melayu</a>
        </Menu.Item>
    </Menu>
);
const homeLink = (props) => {
    return (
        <Translate
            content={props.content}
            component={Link}
            to="/neo/AllCrypto"
        />)
}
function Footer() {
    const { switcher, themes, currentTheme, status } = useThemeSwitcher();
    const [isDarkMode, setIsDarkMode] = React.useState(true);
    const [lang, setLang] = useState('en')
    const [theme, setTheme] = useState('LRT')
    if (status === 'loading') {
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
    const onLangChange = (e) => {
        setLang({ lang: e.target.value });
        counterpart.setLocale(e.target.value);
    }

    const home = <homeLink content="ftr_home" />

    // return <AntFooter style={{ textAlign: 'center' }}>{labels.company} @copy; {new Date().getFullYear()} Created by {labels.company}</AntFooter>
    return (<AntFooter style={{ backgroundColor: 'transparent', padding: 0 }}>
        <div className="main-container footer-links">
            <div className="d-flex justify-content align-center">
                {/* <Translate content="links" with={home} />
                <Translate content="ftr_careers" component={Link}>Careers</Translate>
                <Translate content="ftr_tc_p" component={Link}>Legan & Policy</Translate> */}
                <a href="https://suissebase.ch/" target="_blank">Home</a>
                <a href="https://suissebase.ch/" target="_blank">Careers</a>
                <a href="https://www.iubenda.com/privacy-policy/42856099" target="_blank">Legal & Policy</a>
                <Typography className="mobile-none text-white-30">Suissebase<sup className="fs-10">TM</sup> {new Date().getFullYear()}</Typography>
            </div>
            <div className="copyright-block">
                <Typography className="copyright text-white-30">Suissebase<sup className="fs-10">TM</sup> {new Date().getFullYear()}</Typography>
                <span>
                    <Button type="primary" shape="circle" size="large" className='darkTheme' onClick={handleTheme}> {theme}</Button>
                    {/* <Dropdown placement="topRight" className="secureDrpdwn" overlayClassName="secureDropdown" overlay={languageMenu} trigger={['click']} arrow>
                            <Button shape="circle" className="selct-lang ml-8 text-center fs-14 fw-200" size="large" onClick={() => this.handleTheme}>EN</Button>
                        </Dropdown> */}
                    <select value={lang} onChange={onLangChange} className="selct-lang ml-8 f-12" removeIcon={true}>
                        <option value="en">EN</option>
                        <option value="ch">英语</option>
                        <option value="my">MY</option>
                    </select>
                </span>
            </div>
        </div>
    </AntFooter>)


}

export default Footer