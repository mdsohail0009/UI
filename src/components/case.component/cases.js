import React, { Component } from 'react';
import { connect } from 'react-redux';
import List from '../grid.component'
import { withRouter } from 'react-router';
import Translate from 'react-translate-component';
import apiCalls from "../../api/apiCalls";
import Moment from 'react-moment';
import AppConfig from '../../utils/app_config';
class Cases extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gridUrl:AppConfig.REACT_APP_GRID_API + `Case/GetMemebrCasesK`,
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
		{field: "state",title:apiCalls.convertLocalLang("state"),filter: true,width: 240,},
	];
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
        <div className="main-container">
            <div className="box basic-info">
                <Translate content="case" className="basicinfo mb-12 d-block" />
                <div className="display-flex mb-16">
                    <List className="address-clear" url={gridUrl} ref={this.gridRef} columns={this.columnGrid} additionalParams={{ "customerId": this.props.userProfileInfo?.id }} />
                </div>
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
