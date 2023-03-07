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

function Footer({ customer }) {
    const { status } = useThemeSwitcher();
    useEffect(() => {
        counterpart.setLocale(customer?.language ? customer?.language : 'en');
    }, []);
    if (status == 'loading') {
        return <div>Loading styles...</div>;
    }





    return (<AntFooter style={{ backgroundColor: 'transparent', padding: 0 }}>
        <div className="main-container">
            <div className=" footer-links">
                <a href={process.env.REACT_APP_SUISSEBASE_HOME}  target="_blank"><Translate content="home" /></a>
                <a href={process.env.REACT_APP_SUISSEBASE_ASSET_DIRECTORY} target="_blank"><Translate content="asset_directory" /></a>
                <Text className="text-white-30">SuisseBase<sup className="fs-10">TM</sup>{"  "} {new Date().getFullYear()}</Text>

            </div>
        </div>
    </AntFooter>)


}
const connectStateToProps = ({ userConfig }) => {
    return { customer: userConfig.userProfileInfo }
}
export default connect(connectStateToProps)(Footer)