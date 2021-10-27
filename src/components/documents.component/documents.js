import React, { Component } from 'react';
import { Typography } from 'antd';
import { connect } from 'react-redux';
import { ApiControllers } from '../../api/config';
import List from '../grid.component'
import { withRouter } from 'react-router';
import Translate from 'react-translate-component';
const { Title } = Typography;


class Documents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gridUrl: process.env.REACT_APP_GRID_API + ApiControllers.transaction + "/GetUserDocumentsK",
            alert: false,
            errorMessage: "",
            allDocs: false,
            selection: []
        }
        this.gridRef = React.createRef();
    };
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
        const {Text} = Typography;
        const gridColumns = [
            { field: "title", title:  <Translate content="title" component={Text} className="custom-font fw-300 fs-14 text-white" />, filter: true, customCell: (props) => <td><div className="gridLink" onClick={() => this.details(props)}>{props.dataItem?.title}</div></td> },
            { field: "date", title: <Translate content="RequestedDate" component={Text} className="custom-font fw-300 fs-14 text-white" />, filter: true, filterType: "date" },
            { field: "status", title:  <Translate content="Status" component={Text} className="custom-font fw-300 fs-14 text-white" />, filter: true },
        ]
        return (<>
            <div className="box basic-info">
            <Translate content="documents" className="basicinfo"/>
                <List url={gridUrl} ref={this.gridRef} columns={gridColumns} additionalParams={{ "memberId": this.props.userProfileInfo?.id }} />
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
