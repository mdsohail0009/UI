import React from 'react';
import { toDataSourceRequestString, translateDataSourceResultGroups } from '@progress/kendo-data-query';
import { store } from '../../store'
import moment from 'moment';
import { ExcelExport } from '@progress/kendo-react-excel-export'
// import { excellExportSubject } from './subscribir';
const filterOperators = {
    'text': [
        { text: 'grid.filterContainsOperator', operator: 'contains' },
        { text: 'grid.filterNotContainsOperator', operator: 'doesnotcontain' },
        { text: 'grid.filterEqOperator', operator: 'eq' },
        { text: 'grid.filterNotEqOperator', operator: 'neq' },
        { text: 'grid.filterStartsWithOperator', operator: 'startswith' },
        { text: 'grid.filterEndsWithOperator', operator: 'endswith' },
        { text: 'grid.filterIsEmptyOperator', operator: 'isempty' },
        { text: 'grid.filterIsNotEmptyOperator', operator: 'isnotempty' }
    ],
    'numeric': [
        { text: 'grid.filterEqOperator', operator: 'eq' },
        { text: 'grid.filterNotEqOperator', operator: 'neq' }
    ],
    'date': [
        { text: 'grid.filterAfterOrEqualOperator', operator: 'gte' },
        { text: 'grid.filterAfterOperator', operator: 'gt' },
        { text: 'grid.filterBeforeOperator', operator: 'lt' },
        { text: 'grid.filterBeforeOrEqualOperator', operator: 'lte' }
    ],
    'datetime': [
        { text: 'grid.filterEqOperator', operator: 'eq' },
        { text: 'grid.filterNotEqOperator', operator: 'neq' },
        { text: 'grid.filterAfterOrEqualOperator', operator: 'gte' },
        { text: 'grid.filterAfterOperator', operator: 'gt' },
        { text: 'grid.filterBeforeOperator', operator: 'lt' },
        { text: 'grid.filterBeforeOrEqualOperator', operator: 'lte' }
    ],
    'boolean': [
        { text: 'grid.filterEqOperator', operator: 'eq' }
    ]
}
export function withState(WrappedGrid) {
    return class StatefullGrid extends React.Component {
        constructor(props) {
            debugger
            super(props);
            this.state = { dataState: { skip: 0, take: 10 }, additionalParams: null, data: [], isLoading: false };
            this.excelRef = React.createRef();
            // this.exportSubscriber = excellExportSubject.subscribe(() => {
            // });
        }
        numberWithCommas(x) {
            return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        }
        refreshGrid() {
            this.fetchData(this.state.dataState);
        }
        componentWillUnmount() {
            this.exportSubscriber.unsubscribe();
      }
        loadingPanel = (
            <div className="k-loading-mask">
                <span className="k-loading-text">Loading</span>
                <div className="k-loading-image"></div>
                <div className="k-loading-color"></div>
            </div>
        );
        render() {
            return (
                <div style={{ position: 'relative' }}>
                    {this.state.isLoading && this.loadingPanel}
                    {this.props.showExcelExport && <div className='text-right'> <button
                        title="Export Excel"
                        className="k-button k-button-md k-rounded-md k-button-solid  mt-16 mb-16 mr-16 search-btn primary-btn excel-btn"
                        onClick={() => {
                            debugger
                            if (this.excelRef) {
                                if (this.excelRef?.current.save) {
                                    let workbook = this.excelRef.current.workbookOptions(); // get the workbook.
                                    workbook.sheets[0].rows.map((item, index) => {
                                        if (item.type === "data") {
                                            for (const i in this.props.columns) {
                                                    const idx = this.props.columns.length === item.cells.length ? i : (i - 1);
                                                    if (this.props.columns[i].filterType === "date") {
                                                    if (item.cells[idx].value)
                                                    item.cells[idx].value =moment( item.cells[idx].value).format("DD/MM/YYYY hh:mm a")
                                                }
                                                if (this.props.columns[i].filterType === "numeric") {
                                                    if (item.cells[idx].value)
                                                        item.cells[idx].value = this.numberWithCommas(item.cells[idx].value);
                                                        item.cells[idx].textAlign="right";
                                                    }
                                            }
                                        }
                                    });
                                    this.excelRef.current.save(workbook);
                               }
                    // this.excelRef.save(workbook);
                            }
                            
                        }}
                    >
                        Export Excel
                    </button>
                    </div>}
                    { this.props.showExcelExport ? <ExcelExport data={this.state.data} ref={this.excelRef} fileName = {this.props?.excelFileName}>

                        <WrappedGrid
                            sortable={true}
                            resizable={true}
                            filterOperators={filterOperators}
                            pageable={{ pageSizes: [5, 10, 20, 30, 40, 50, "All"] }}
                            {...this.props}
                            total={this.state.total}
                            data={this.state.data}
                            skip={this.state.dataState.skip}
                            pageSize={this.state.dataState.take}
                            filter={this.state.dataState.filter}
                            sort={this.state.dataState.sort}
                            onDataStateChange={this.handleDataStateChange}
                        />
                    </ExcelExport> : <WrappedGrid
                        sortable={true}
                        resizable={true}
                        filterOperators={filterOperators}
                        pageable={{ pageSizes: [5, 10, 20, 30, 40, 50, "All"] }}
                        {...this.props}
                        total={this.state.total}
                        data={this.state.data}
                        skip={this.state.dataState.skip}
                        pageSize={this.state.dataState.take}
                        filter={this.state.dataState.filter}
                        sort={this.state.dataState.sort}
                        onDataStateChange={this.handleDataStateChange}
                    />}
                </div>
            );
        }

        componentDidMount() {
            this.fetchData(this.state.dataState);
        }

        handleDataStateChange = (changeEvent) => {
            let _dataState = changeEvent.dataState;
            if (isNaN(_dataState.take)) {
                _dataState.take = this.state.total
            }
            this.setState({ dataState: _dataState });
            this.fetchData(_dataState);
        }

        fetchData=(dataState) => {
            if (dataState.filter) {
                dataState.filter.filters?.map((item) => {
                  return item.filters?.map((value) => {
                        if (value.operator === "gte" || value.operator === "gt" || value.operator === "lte" || value.operator === "lt") {
                            value.value = value.value ? ((value.operator === 'lte' || value.operator === "gt") ? new Date(moment(value.value).format('YYYY-MM-DDT23:59:59')) : new Date(moment(value.value).format('YYYY-MM-DDT00:00:00'))) : null;
                        }
                    })
                })
            }
            this.setState({ ...this.state, isLoading: true })
            const { oidc: { user } } = store.getState();
            let queryStr = `${toDataSourceRequestString(dataState)}`; // Serialize the state.
            const hasGroups = dataState.group && dataState.group.length;
            if (this.props.additionalParams) {
                let _additionalParams = '';
                for (let key in this.props.additionalParams) {
                    _additionalParams = _additionalParams + `/${this.props.additionalParams[key]}`
                }
                queryStr = _additionalParams + '?' + queryStr;
            } else {
                queryStr = '?' + queryStr
            }
            const base_url = this.props.url;
            const init = { method: 'GET', accept: 'application/json', headers: { "Authorization": `Bearer ${user.access_token}` } };

            fetch(`${base_url}${queryStr}`, init)
                .then(response => response.json())
                .then(({ data, total }) => {
                    this.setState({
                        data: hasGroups ? translateDataSourceResultGroups(data) : data,
                        total,
                        dataState,
                        isLoading: false
                    });
                });
        }
    }
}