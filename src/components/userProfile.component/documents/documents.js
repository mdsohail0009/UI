import React, { Component } from 'react';
import List from "../../grid.component";
import { Link } from 'react-router-dom';
import Translate from 'react-translate-component';
class Documents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
        }
        this.gridRef = React.createRef();
    }
    gridColumns = [
        { field: "walletCode", title: "Title", filter: true, width: 350, customCell: (props) => <td><div className="gridLink" onClick={() => this.update(props)}> {props.dataItem.firstName}</div></td> },
        { field: "txDate", title: "Date", filter: true, filterType: "date", width: 150 },
        { field: "credit", title: "User Name", filter: true, width: 250 },
        { field: "docType", title: "Full Name", filter: true, width: 250 },
        { field: "description", title: "Email", filter: true, width: 300 },
        { field: "status", title: "Status", filter: true, width: 200 }
    ]
    render() {
        return <>
            <div className="box basic-info">
            <Translate content="Documents" className="f-16 text-white-30 mt-16 "  />
                <Link to="/requesteddocs/">Documents View</Link>
                <List
                    showActionBar={true}
                    onActionClick={(key) => this.onActionClick(key)}
                    pKey={"alerts"}
                    ref={this.gridRef}
                    url={process.env.REACT_APP_GRID_API + "Alert/GetAlertK"}
                    columns={this.gridColumns}
                />
            </div>
        </>;
    }
}

export default Documents;