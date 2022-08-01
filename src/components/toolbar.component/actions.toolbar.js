import { Spin, Tooltip } from 'antd';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchFeaturePermissions } from '../../reducers/feturesReducer';

class ActionsToolbar extends Component {
    state = {

    }
    permissionsInterval;
    componentDidMount() {
        const feature = this.props.menuItems?.features?.data?.find(item => item.path == ("/" + this.props.featureKey));
        this.props.dispatch(fetchFeaturePermissions(feature.id, this.props.userConfig?.id));
    }
    loadPermission = () => {

    }
    render() {
        const { featureKey, onActionClick, menuItems,screenName } = this.props;

        return (
            <>
                {menuItems?.featurePermissions?.loading && <Spin />}
                <div>
                    <ul className="admin-actions mb-0 address-icons">
                        {menuItems?.featurePermissions[featureKey]?.actions?.map(action => <li onClick={() => onActionClick(action.permissionName)}><span className={`icon ${action.icon}-icon`}></span></li>)}
                    </ul>
                </div>
            </>
        );
    }
}
const connectStateToProps = ({ menuItems, userConfig }) => {
    return {
        menuItems,
        userConfig: userConfig.userProfileInfo
    }
}
const connectDispatchToProps = dispatch => { return { dispatch } }
export default connect(connectStateToProps, connectDispatchToProps)(ActionsToolbar);