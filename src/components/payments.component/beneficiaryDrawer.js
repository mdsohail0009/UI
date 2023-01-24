import React, { Component } from 'react';
import { Drawer, Typography } from 'antd';
import Translate from 'react-translate-component';
import { setStep, setTab, setHeaderTab } from '../../reducers/paymentsReducer';
import { processSteps as config } from './config';
import BeneficiaryDetails from './beneficiaryDetails';
import { connect } from 'react-redux';
import KycDocuments from './kycDocuments';
import SuccessMsg from './success';

const { Paragraph } = Typography;
class BeneficiaryDrawer extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    closeBuyDrawer = () => {
        this.props.dispatch(setTab(1));
        this.props.dispatch(setHeaderTab(""))
        if (this.props.onClose) {
            this.props.onClose();
        }
    }
    renderContent = () => {
        const stepcodes = {
            newBeneficiary: <BeneficiaryDetails />,
            kycDocuments: <KycDocuments />,
            successMsg: <SuccessMsg />
        }
        return stepcodes[config[this.props.paymentsStore.stepcode]]
    };
    renderTitle = () => {
        const titles = {
            newBeneficiary: <span />,
            kycDocuments: <span onClick={() => this.props.dispatch(setStep("step1"))} className="icon md lftarw-white c-pointer" />,
            successMsg: <span />,
        }
        return titles[config[this.props.paymentsStore.stepcode]]
    }
    renderIcon = () => {
        const stepcodes = {
            newBeneficiary: <span onClick={this.closeBuyDrawer} className="icon md close-white c-pointer" />,
            kycDocuments: <span onClick={this.closeBuyDrawer} className="icon md close-white c-pointer" />,
            successMsg: <span onClick={this.closeBuyDrawer} className="icon md close-white c-pointer" />,
        }
        return stepcodes[config[this.props.paymentsStore.stepcode]]
    }
    render() {
        return (<Drawer
            title={[<div className="side-drawer-header">
                {this.renderTitle()}
                <div className="text-center">
                    <Translate className=" drawer-maintitle" content={this.props.paymentsStore.stepTitles[config[this.props.paymentsStore.stepcode]]} component={Paragraph} />
                </div>
                {this.renderIcon()}</div>]}
            placement="right"
            closable={true}
            visible={this.props.showDrawer}
            closeIcon={null}
            className="side-drawer"
            destroyOnClose={true}
        >
            {this.renderContent()}
        </Drawer>);
    }
}

const connectStateToProps = ({ paymentsStore, userConfig}) => {
    return { paymentsStore, userConfig: userConfig.userProfileInfo }
}
const connectDispatchToProps = dispatch => {
    return {
        dispatch
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(BeneficiaryDrawer);