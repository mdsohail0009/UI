import React, { Component } from 'react';
import { Drawer, Typography, Col} from 'antd';
import Translate from 'react-translate-component';
import ConnectStateProps from '../../utils/state.connect';
import { connect } from 'react-redux';
import Search from "antd/lib/input/Search";
const { Title } = Typography
class SendUsd extends Component {
    state = {

    }

    
    closeDrawer = () => {
        if (this.props.onClose) {
            this.props.onClose();
        }
    }

   
    render() {
        return (<Drawer destroyOnClose={true}
            title={[<div className="side-drawer-header">
                <div className="text-center">
                <div>Batch Payments</div>
                </div>
                <span onClick={this.closeDrawer} className="icon md close-white c-pointer" />
               
            </div>]}
            
            placement="right"
            closable={true}
            visible={this.props.showDrawer}
            closeIcon={null}
            className="side-drawer w-50p"
            style={{width:"50%"}}
        >
            <div className="mt-8">
                <Title
                    className='sub-heading code-lbl'>Send USD to Multiple Address</Title>
            </div>
            <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                <Search placeholder="Search Currency" value={this.state.searchFiatVal} addonAfter={<span className="icon md search-white" />} onChange={this.handleFiatSearch} size="middle" bordered={false} className="text-center mb-16" />
            </Col>
        </Drawer>);
    }
}
const connectStateToProps = ({ sendReceive, userConfig }) => {
    return {sendReceive, userProfile: userConfig.userProfileInfo }
}
const connectDispatchToProps = dispatch => {
    return {
        dispatch
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(SendUsd);