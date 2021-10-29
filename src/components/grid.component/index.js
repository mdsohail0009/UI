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
        if(props.dataItem[props.field]){
            return <td><Moment format="DD/MM/YYYY">{this.convertUTCToLocalTime(props.dataItem[props.field])}</Moment></td>
        }else{
            return <td>{props.dataItem[props.field]}</td>
        }
    }
    renderDateTime = (props) => {
        if(props.dataItem[props.field]){
            return <td><Moment format="DD/MM/YYYY hh:mm:ss A" globalLocal={true}>{this.convertUTCToLocalTime(props.dataItem[props.field])}</Moment></td>
        }else{
            return <td>{props.dataItem[props.field]}</td>
        }
    }
    renderNumber = (props) => {
        return <td>  <NumberFormat value={props?.dataItem[props.field]} decimalSeparator="." displayType={'text'} thousandSeparator={true} /></td>
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
        const localTime = new Date(milliseconds);
        let datetime = localTime.toISOString()
        return datetime
      };
    render() {
        const { columns, url, additionalParams } = this.props
        return (
            <div>
                <StatefullGrid url={url} additionalParams={additionalParams} ref={this.eleRef}>
                    {columns?.map((column, indx) => <GridColumn key={indx}
                        columnMenu={column.filter ? ColumnMenu : null}
                        field={column.field}
                        title={column.title} width={column.width}
                        cell={column.customCell || (column.filterType === "date" ? this.renderDate : (column.dataType === 'number' ? this.renderNumber : (column.filterType === "datetime" ? this.renderDateTime : null )))}
                        filter={column.filterType || 'text'}
                        format="{0:,0.##}"
                    />
                    )}
                </StatefullGrid>
            </div>
        );
    }
}

export default List;