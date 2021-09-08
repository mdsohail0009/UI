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
        return <td><Moment format="DD/MM/YYYY">{props.dataItem[props.field]}</Moment></td>
    }
    renderNumber = (props) => {
        return <td>  <NumberFormat value={props?.dataItem[props.field]} decimalSeparator="."  displayType={'text'} thousandSeparator={true} /></td>
    }
    render() {
        const { columns, url, additionalParams } = this.props
        return (
            <div>
                <StatefullGrid url={url} additionalParams={additionalParams} ref={this.eleRef}>
                    {columns?.map((column, indx) => <GridColumn key={indx}
                        columnMenu={column.filter ? ColumnMenu : null}
                        field={column.field}
                        title={column.title} width={column.width}
                        cell={column.customCell || (column.filterType == "date" ? this.renderDate : (column.dataType == 'number' ? this.renderNumber : null))}
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