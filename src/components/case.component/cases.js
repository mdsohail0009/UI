import React, { Component } from 'react';
import { connect } from 'react-redux';
import List from '../grid.component'
import {
     Typography
  } from "antd";
import { withRouter } from "react-router-dom";
import Translate from 'react-translate-component';
import apiCalls from "../../api/apiCalls";
import Moment from 'react-moment';
import AppConfig from '../../utils/app_config';
import { getScreenName } from '../../reducers/feturesReducer';

const { Paragraph} = Typography;
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
    backToDashboard=()=>{
        if (!this.props?.userProfileInfo?.isKYC) {
            this.props.history.push("/notkyc");
            return;
        }
          else{
            this.props.history.push("/");
          }
    }
    handleAllDocuments = e => {
        this.setState({
            allDocs: e.target.value === 1
        }, () => this.gridRef.current.refreshGrid());

    }
    render() {
        const { gridUrl } = this.state;

        return (<>
        <div className="cust-list main-container case-demo" >
        <div className="backbtn-arrowmb"><span className="icon md leftarrow c-pointer backarrow-mr"onClick={()=>this.backToDashboard()}></span><span className="back-btnarrow c-pointer"onClick={()=>this.backToDashboard()}>Back</span></div>
          
                <Translate content="case" component={Paragraph} className="grid-title" /> </div>
                    <List className="address-clear cases-grid-style" url={gridUrl} ref={this.gridRef} columns={this.columnGrid} />
               
            
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
