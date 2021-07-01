import React, { Component } from 'react';
import { Layout, Typography, Menu, Button, Dropdown } from 'antd';
import labels from '../utils/lables.json';
import counterpart from 'counterpart';
import en from '../lang/en';
import ch from '../lang/ch';
import my from '../lang/my';
import Translate from 'react-translate-component';

counterpart.registerTranslations('en', en);
counterpart.registerTranslations('ch', ch);
counterpart.registerTranslations('my', my);
counterpart.setLocale('en');

const { Footer: AntFooter } = Layout

class Footer extends Component {
    state = {
        lang: 'en',
        darkTheme: true,
    };
    onLangChange = (e) => {
        this.setState({ lang: e.target.value });
        counterpart.setLocale(e.target.value);
    }
    handleTheme() {
        this.setState({ darkTheme: false })
    }
    themeBtnClr() {
        let themeBtnClasses = "fw-400 fs-12 theme-";
        themeBtnClasses += this.state.darkTheme ? 'dark' : 'light';
        return themeBtnClasses;
    }
    render() {

        // return <AntFooter style={{ textAlign: 'center' }}>{labels.company} @copy; {new Date().getFullYear()} Created by {labels.company}</AntFooter>
        return <AntFooter style={{ backgroundColor: 'transparent', padding: 0 }}>
            <div className="main-container footer-links">
                <div className="d-flex justify-content align-center">
                    <Translate content="ftr_home" component={Typography.Link}>Home</Translate>
                    <Translate content="ftr_careers" component={Typography.Link}>Careers</Translate>
                    <Translate content="ftr_tc_p" component={Typography.Link}>Legan & Policy</Translate>
                    <Typography.Link className="mobile-none">Suissebase<sup className="fs-10">TM</sup> {new Date().getFullYear()}</Typography.Link>
                </div>
                
                <div>
                    <Button type="primary" shape="circle" className={this.themeBtnClr()} size="large" onClick={() => this.handleTheme}>{this.state.darkTheme ? 'DRK' : 'LHT'}</Button>
                    <select value={this.state.lang} onChange={this.onLangChange} className="selct-lang ml-8 f-12" removeIcon={true}>
                        <option value="en">EN</option>
                        <option value="ch">英语</option>
                        <option value="my">MY</option>
                    </select>
                </div>
            </div>
        </AntFooter>
    }

}

export default Footer