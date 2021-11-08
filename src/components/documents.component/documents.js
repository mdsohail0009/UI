import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ApiControllers } from '../../api/config';
import List from '../grid.component'
import { withRouter } from 'react-router';
import Translate from 'react-translate-component';
import apiCalls from '../../api/apiCalls';


class Documents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // gridUrl: process.env.REACT_APP_GRID_API + ApiControllers.transaction + "/GetUserDocumentsK",
            gridUrl: process.env.REACT_APP_GRID_API +"Documents/Accounts",
            alert: false,
            errorMessage: "",
            allDocs: false,
            selection: []
        }
        this.gridRef = React.createRef();
    }
     gridColumns = [
        { field: "title", title: apiCalls.convertLocalLang('title') , filter: true, customCell: (props) => <td><div className="gridLink" onClick={() => this.details(props)}>{props.dataItem?.title}</div></td> },
        { field: "date", title: apiCalls.convertLocalLang('RequestedDate'), filter: true, filterType: "date" },
        { field: "status", title: apiCalls.convertLocalLang('Status'), filter: true },
    ]
    details = ({ dataItem }) => {
        this.props.history.push("/documents?id=" + dataItem.id)
    }
   
    handleAllDocuments = e => {
        this.setState({
            allDocs: e.target.value === 1
        }, () => this.gridRef.current.refreshGrid());

    }
    render() {
        const { gridUrl } = this.state;
       
        return (<>
            <div className="box basic-info">
            <Translate content="documents" className="basicinfo"/>
                <List url={gridUrl} ref={this.gridRef} columns={this.gridColumns} additionalParams={{ "memberId": this.props.userProfileInfo?.id }} />
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
export default connect(connectStateToProps, connectDispatchToProps)(withRouter(Documents));
