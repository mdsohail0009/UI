import React, { Component } from 'react';
import { Typography } from 'antd';

class Documents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            gridUrl: process.env.REACT_APP_GRID_API + "Member/membershipk",
        }
    }
    gridColumns = [
        { field: "", title: "", width: 50, customCell: (props) => (<td > <label className="text-center custom-checkbox"><input id={props.dataItem.id} name="ischecked" type="checkbox" checked={this.state.selection.indexOf(props.dataItem.id) > -1} onChange={(e) => this.handleInputChange(props, e)} /><span></span> </label></td>) },
        { field: "firstName", title: "Title", filter: true, width: 350, customCell: (props) => <td><div className="gridLink" onClick={() => this.update(props)}> {props.dataItem.firstName}</div></td> },
        { field: "dob", title: "Date", filter: true, filterType: "date", width: 150 },
        { field: "firstName", title: "User Name", filter: true, width: 250 },
        { field: "firstName", title: "Full Name", filter: true, width: 250 },
        { field: "email", title: "Email", filter: true, width: 300 },
        { field: "status", title: "Status", filter: true, width: 200 }
    ]
    render() {
        const { Title, gridUrl } = Typography;
        return <>
            <div className="box basic-info">
                <Title className="basicinfo">Documents</Title>
                <List url={gridUrl} ref={this.gridRef} columns={this.gridColumns} />
            </div>
        </>;
    }
}

export default Documents;