import * as React from 'react';
import { GridColumn, Grid } from '@progress/kendo-react-grid';
import { withState } from './grid';
import { ColumnMenu } from './columnMenu'
import Moment from 'react-moment'
import NumberFormat from 'react-number-format';
const StatefullGrid = withState(Grid);
class List extends React.Component {
    constructor(props) {
        super(props);
        this.eleRef = React.createRef();
    }
    refreshGrid() {
        this.eleRef.current.refreshGrid();
    }
    renderDate = (props) => {
        if (props.dataItem[props.field]) {
            return <td><Moment format="DD/MM/YYYY">{this.convertUTCToLocalTime(props.dataItem[props.field])}</Moment></td>
        } else {
            return <td>{props.dataItem[props.field]}</td>
        }
    }
    renderDateTime = (props) => {
        if (props.dataItem[props.field]) {
            return <td><Moment format="DD/MM/YYYY hh:mm:ss A" globalLocal={true}>{this.convertUTCToLocalTime(props.dataItem[props.field])}</Moment></td>
        } else {
            return <td>{props.dataItem[props.field]}</td>
        }
    }
    renderNumber = (props) => {
        return <td>  <NumberFormat value={props?.dataItem[props.field]} decimalSeparator="." displayType={'text'} thousandSeparator={true} /></td>
    }

    gridFilterData = (column) => {
        if (column.filterType === "date") {
            if (column.isShowTime) {
                return this.renderDateTime;
            }
            else {
                return this.renderDate;
            }
        } else if (column.filterType === "number") {
            return this.renderNumber;
        } else if (column.filterType === "datetime") {
            return this.renderDateTime;
        } else {
            return null
        }
    }
    convertUTCToLocalTime = (dateString) => {
        let date = new Date(dateString);
        const milliseconds = Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
        );
        return new Date(milliseconds)
    };
    render() {
        const { columns, url, additionalParams } = this.props
        return (
            <div className=""> 
                <StatefullGrid url={url} additionalParams={additionalParams} ref={this.eleRef} {...this.props} >
                    {columns?.map((column, indx) => <GridColumn key={indx}
                        columnMenu={column.filter ? ColumnMenu : null}
                        field={column.field}
                        title={column.title} width={column.width}
                        cell={column.customCell || this.gridFilterData(column)}
                        filter={column.filterType || 'text'}
                        format="{0:#,0.##########}"
                         sortable={column.sortable===false?false:true}
                    />
                    )}
                </StatefullGrid>
            </div>
        );
    }
}

export default List;