import React, { useEffect } from 'react';
import { Layout, Typography } from 'antd';
import counterpart from 'counterpart';
import en from '../lang/en';
import ch from '../lang/ch';
import my from '../lang/my';
import { useThemeSwitcher } from 'react-css-theme-switcher';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';


counterpart.registerTranslations('en', en);
counterpart.registerTranslations('ch', ch);
counterpart.registerTranslations('my', my);

const { Footer: AntFooter } = Layout
const { Text } = Typography;

function Footer({ member }) {
    const { status } = useThemeSwitcher();
    useEffect(() => {
        counterpart.setLocale(member?.language ? member?.language : 'en');
    }, [])
    if (status == 'loading') {
        return <div>Loading styles...</div>;
    }





    return (<AntFooter style={{ backgroundColor: 'transparent', padding: 0 }}>
        <div className="main-container">
            <div className=" footer-links">
                {/* <a href="https://suissebase.io/" target="_blank">Home</a> */}
                <a href="https://suissebase.io/" target="_blank"><Translate content="home" /></a>
                {/* <a href="https://suissebase.io/" target="_blank">Careers</a> */}
                <a href="https://suissebase.io/" target="_blank"><Translate content="careers" /></a>
                <a href="https://www.suissebase.io/asset-directory/" target="_blank"><Translate content="asset_directory" /></a>
                {/* <a href="https://www.iubenda.com/privacy-policy/42856099" target="_blank">Legal & Policy</a> */}
                {/* <a href="https://www.iubenda.com/privacy-policy/42856099" target="_blank"><Translate content="legal_policy" /></a> */}
                <Text className="text-white-30">Suissebase<sup className="fs-10">TM</sup> {new Date().getFullYear()}</Text>

            </div>
        </div>
    </AntFooter>)


}
const connectStateToProps = ({ userConfig }) => {
    return { member: userConfig.userProfileInfo }
}
export default connect(connectStateToProps)(Footer)