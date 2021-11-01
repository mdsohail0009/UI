import React, { Component } from 'react';
import List from "../../grid.component";
import { Link } from 'react-router-dom';
import Translate from 'react-translate-component';
class Documents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            gridUrl: process.env.REACT_APP_GRID_API + "Transaction/TransactionHistoryk"
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
        const { gridUrl } = this.state;
        return <>
            <div className="box basic-info">
            <Translate content="Documents" className="f-16 text-white-30 mt-16 "  />
                <Link to="/requesteddocs/">Documents View</Link>
                <List url={gridUrl} ref={this.gridRef} columns={this.gridColumns} />
            </div>
        </>;
    }
}

export default Documents;