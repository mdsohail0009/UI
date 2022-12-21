import { Spin, Tooltip } from 'antd';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setCurrentAction } from '../../reducers/actionsReducer';
class ActionsToolbar extends Component {
    render() {
        const { featureKey, onActionClick, menuItems, screenName } = this.props;
        return (
            <>
                {menuItems?.featurePermissions?.loading && <Spin />}
                {!menuItems?.featurePermissions?.loading && <div>
                    <ul className="admin-actions address-icons">
                        {menuItems?.featurePermissions[featureKey]?.actions?.map(action => <>{(!["View", "view"].includes(action.permissionName) && (action.values)) && <Tooltip title={action.toolTip}><li onClick={() => onActionClick(action.permissionName)}><span className={`icon md c-pointer ${action.icon}-icon`}></span></li></Tooltip>}</>)}
                    </ul>
                </div>}
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
const connectDispatchToProps = dispatch => {
     return {
        setAction: (val) => {
            dispatch(setCurrentAction(val))
          },
        dispatch 
    } 
}
export default connect(connectStateToProps, connectDispatchToProps)(ActionsToolbar);