import { Spin, Tooltip } from 'antd';
import React, { Component } from 'react';

class ActionsToolbar extends Component {
    render() {
        return (
            <>
                <div>
                    <ul className="admin-actions mb-0">
                        <li><span class="icon md add-icon"></span></li>
                        <li><span class="icon md edit-icon"></span></li>
                        <li><span class="icon md buy"></span></li>
                    </ul>
                </div>
            </>
        );
    }
}

export default ActionsToolbar;