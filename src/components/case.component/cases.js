import React, { Component } from 'react';
import { connect } from 'react-redux';
import List from '../grid.component'
import {
    Form, Typography, Input, Button, Alert, Spin, message, Select, Checkbox, Tooltip, Modal,
    Radio, Row, Col, AutoComplete,  Image, Tabs, Drawer
  } from "antd";
import {Link,  withRouter } from "react-router-dom";
import Translate from 'react-translate-component';
import apiCalls from "../../api/apiCalls";
import Moment from 'react-moment';
import { getScreenName } from '../../reducers/feturesReducer';

const { Text, Paragraph, Title } = Typography;
class Cases extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gridUrl:process.env.REACT_APP_GRID_API + `Case/GetMemebrCasesK`,
            alert: false,
            errorMessage: "",
            allDocs: false,
            selection: []
        }
        this.gridRef = React.createRef();
    }
    columnGrid = [
        {
            field: "createdDate",
            // title: "Date",
            title: apiCalls.convertLocalLang("Date"),
            width: 200,
            filter: true,
            filterType: "date",
            customCell: (props) => (
              <td>
                <div className="gridLink" onClick={() => this.viewCase(props)}>
                <Moment format="DD/MM/YYYY">
                    {props.dataItem.createdDate}
                </Moment>
                </div>
              </td>
            )
          },
        {field: "caseNumber",title: apiCalls.convertLocalLang("Case_Number"),filter: true, width: 240,},
		{field: "customerCaseTitle",title: apiCalls.convertLocalLang("title"),filter: true,width: 450},
		{field: "state",title:apiCalls.convertLocalLang("state"),filter: true,width: 275,},
	];
    componentDidMount() {
        this.props.dispath(getScreenName({getScreen:null}))
    }
     viewCase = ({dataItem}) => {
		this.props.history.push(`/caseView/${dataItem.id}`);
	};

    handleAllDocuments = e => {
        this.setState({
            allDocs: e.target.value === 1
        }, () => this.gridRef.current.refreshGrid());

    }
    render() {
        const { gridUrl } = this.state;

        return (<>
        <div className="cust-list main-container">
        <div className="backbtn-arrowmb"><Link className="icon md leftarrow c-pointer backarrow-mr" to="/cockpit" /><span className="back-btnarrow">Back</span></div>
            
                <Translate content="case" component={Paragraph} className="grid-title" />
                <div className="mb-16 cases-grid-view">
                    <List className="address-clear" url={gridUrl} ref={this.gridRef} columns={this.columnGrid} />
                </div>
            </div>
        </>
        );
    }
}
const connectDispatchToProps = dispath => {
    return { dispath }
}
const connectStateToProps = ({ userConfig }) => {
    return { userProfileInfo: userConfig.userProfileInfo }
}
export default connect(connectStateToProps, connectDispatchToProps)(withRouter(Cases));
