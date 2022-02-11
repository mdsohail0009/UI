import React, { Component } from 'react'
import { connect } from 'react-redux';
import List from '../grid.component'
import { withRouter } from 'react-router';
import Translate from 'react-translate-component';
import Moment from 'react-moment';
class Cases extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // gridUrl: process.env.REACT_APP_GRID_API + "Documents/Accounts",
            gridUrl:process.env.REACT_APP_GRID_API + `Case/GetMemebrCasesK`,
            alert: false,
            errorMessage: "",
            allDocs: false,
            selection: []
        }
        this.gridRef = React.createRef();
    }
    // details = ({ dataItem }) => {
    //     // this.props.dispath(setBreadcrumb({ key: "/cases/" + dataItem.id, val: dataItem.caseNumber }))
    //     this.props.history.push({
    //         pathname: "/cases/" + dataItem.id,
    //         state: {
    //             pKey: "cases",
    //             action: 'edit'
    //         }
    //     })
    // }
    details = ({ dataItem }) => {
        this.props.history.push("/cases?id=" + dataItem.id)
    }
    columnGrid = [
        {field: "createdDate", title: 'Date', filter: true, filterType: "date", customCell: (props) => (
                <td>
                    <Moment format="DD/MM/YYYY">{new Date(props.dataItem.createdDate).toLocaleDateString()}</Moment></td>)
        },
        {field: "caseNumber",title: "Case Number",filter: true,
        customCell: (props) => <td><div className="gridLink"
         onClick={() => this.details(props)}>{props.dataItem?.caseNumber }</div></td> },
		{field: "caseTitle",title: "Case Title",filter: true,},
        {field: "remindDate",title: "Remind Date",filter: true,},
        {field: "closedDate",title: "Closed Date",filter: true,},
		{field: "state",title: "State",filter: true,},
	];
    render() {
        const { gridUrl } = this.state;

        return (<>
            <div className="box basic-info">
                <Translate content="case" className="basicinfo" />
                <div className="mt-16">
                    <List url={gridUrl} ref={this.gridRef} columns={this.columnGrid} additionalParams={{ "memberId": this.props.userConfig?.id }} />
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
    return {  userConfig: userConfig.userProfileInfo }
}
export default connect(connectStateToProps, connectDispatchToProps) (Cases)