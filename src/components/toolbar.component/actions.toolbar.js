import { Spin, Tooltip } from 'antd';
import React, { Component } from 'react';
import { connect } from 'react-redux';

class ActionsToolbar extends Component {
    render() {
        const { key, onActionClick, permissions } = this.props;

        return (
            <>
            {permissions?.loading&&<Spin/>}
                <div>
                    <ul className="admin-actions mb-0">
                        {/* <li><span class="icon md add-icon"></span></li>
                        <li><span class="icon md edit-icon"></span></li>
                        <li><span class="icon md buy"></span></li> */}
                        {permissions[key]?.map(action => <li onClick={() => onActionClick(action.permissionName)}><span class={action.iconName}></span></li>)}
                    </ul>
                </div>
            </>
        );
    }
}
const connectStateToProps = ({ menuItems }) => {
    return {
        permissions: menuItems.featurePermissions.actions
    }
}
export default connect(connectStateToProps)(ActionsToolbar);