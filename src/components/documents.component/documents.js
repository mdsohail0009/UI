import React, { Component } from 'react';
import { connect } from 'react-redux';
import List from '../grid.component'
import { withRouter } from 'react-router';
import Translate from 'react-translate-component';
import apiCalls from '../../api/apiCalls';
import AppConfig from '../../utils/app_config';

class Documents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gridUrl: AppConfig.REACT_APP_GRID_API + "Documents/Accounts",
            alert: false,
            errorMessage: "",
            allDocs: false,
            selection: []
        }
        this.gridRef = React.createRef();
    }
    componentDidMount() {
        this.documentTrack();
    }
    documentTrack = () => {
        apiCalls.trackEvent({ "Type": 'User', "Action": 'Documents Grid view', "Username": this.props.userProfileInfo?.userName, "customerId": this.props.userProfileInfo?.id, "Feature": 'Documents', "Remarks": 'Documents Grid view', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Documents' });
    }
    gridColumns = [
        { field: "title", title: apiCalls.convertLocalLang('title'), filter: true, customCell: (props) => <td><div className="gridLink" onClick={() => this.details(props)}>{props.dataItem?.title}</div></td> },
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
                <Translate content="documents" className="basicinfo" />
                <div className="mt-16">
                    <List url={gridUrl} ref={this.gridRef} columns={this.gridColumns} additionalParams={{ "customerId": this.props.userProfileInfo?.id }} />
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
export default connect(connectStateToProps, connectDispatchToProps)(withRouter(Documents));
