import React from 'react';
import { toDataSourceRequestString, translateDataSourceResultGroups } from '@progress/kendo-data-query';
import { store } from '../../store'
import moment from 'moment';
import CryptoJS from "crypto-js";
import { ExcelExport } from '@progress/kendo-react-excel-export'
import { savePDF } from '@progress/kendo-react-pdf';
import logColor from '../../assets/images/logo-color.png' 
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
            super(props);
            this.state = { dataState: { skip: 0, take: 10 }, additionalParams: null, data: [], isLoading: false };
            this.excelRef = React.createRef();
            this.gridref = React.createRef(null);
            this.tempRef = React.createRef(null)
        }
        numberWithCommas(x) {
            if (!x) {
                return ''
            } else if ((typeof x) === 'string') {
                return x
            }
            x = (typeof x) == 'string' ? x : x.toString();
            var arParts = x.split('.');
            var intPart = parseInt(arParts[0]).toLocaleString();
            var decPart = (arParts.length > 1 ? arParts[1] : '');
            return '' + intPart + (decPart ? ('.' + decPart) : '');
        }
        refreshGrid() {
            this.fetchData(this.state.dataState);
        }
        loadingPanel = (
            <div className="k-loading-mask">
                <span className="k-loading-text">Loading</span>
                <div className="k-loading-image"></div>
                <div className="k-loading-color"></div>
            </div>
        );
        exportToPDF = () => {
            savePDF(this.tempRef.current, {
                paperSize: "A4",
                margin: 30,
                scale: 0.7,
                fileName: `Report for ${new Date().getFullYear()}`,
            })
        }
        render() {
            return (
                <div>
                    <div ref={this.tempRef}>
                        <div className='statement-header logo-content'>
                            <div> <img src={logColor} className="logo"/></div>
                            <div><h2 className='header'>Suissebase Account Statement</h2></div>
                        </div>
                        <div className='statement-header'>
                            <ul>
                                <li>Place de la Fusterie 12, 1204 Genève</li>
                                <li> +41 22 575 40 62</li>
                                <li> compliance@suissebase.ch</li>
                            </ul>
                           
                                <ul>
                                <li>CustomerID: DYUOREWHDB</li>
                                <li> Name : Ramkishore</li>
                                <li> Email : ramkishore@yopmail.com</li>
                                <li> Phone : +919542634551</li>
                                <li> Address :7-1-397/91 2nd floor,</li>
                                <li>Anuna building,
                                    24 B,Lane Number 13,</li>
                                <li>MIGH Colony, Sanjeeva Reddy Nagar,
                                    Hyderabad 500038. </li>
                                </ul>
                          
                        </div>
                        <div>
                            <table className="transaction-pdf-template">
                                <thead>
                                    <th >Transaction Id</th>
                                    <th >Date</th>
                                    <th >Type</th>
                                    <th >Wallet</th>
                                    <th >Value</th>
                                    <th >Sender/Recipient Full Name</th>
                                    <th >Bank Account Number /IBAN</th>
                                    <th >Status</th>
                                </thead>
                                <tbody>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(item => <tr>
                                        <td>W8DAE35938E1AE8A</td>
                                        <td >21/12/2022 07:12:37 PM</td>
                                        <td >Withdraw</td>
                                        <td >USD</td>
                                        <td >100</td>
                                        <td >Raj</td>
                                        <td >56464464566464</td>
                                        <td >Submitted</td>
                                    </tr>)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {this.state.isLoading && this.loadingPanel}
                    {this.props.showExcelExport && <div className='text-right'> <button
                        title={this.props?.exExportTitle || "Export Excel"}
                        className="k-button k-button-md k-rounded-md k-button-solid  mt-16 mb-16 mr-16 search-btn primary-btn excel-btn"
                        onClick={() => {
                            const getCombineFieldValue = (dataItem, fields) => {
                                for (const i in this.props.columns) {
                                    if (this.props.columns[i].filterType === "numeric") {
                                        dataItem[fields[0]] = this.numberWithCommas(dataItem[fields[0]])
                                        dataItem[fields[1]] = this.numberWithCommas(dataItem[fields[1]])
                                    }
                                }
                                return dataItem[fields[0]] && dataItem[fields[1]] ? `${dataItem[fields[0]]} / ${dataItem[fields[1]]}` : (dataItem[fields[0]] || dataItem[fields[1]]);
                            }
                            if (this.excelRef) {
                                if (this.excelRef?.current.save) {
                                    let workbook = this.excelRef.current.workbookOptions(); // get the workbook.
                                    workbook.sheets[0].rows.map((item, index) => {
                                        if (item.type === "data") {
                                            for (const i in this.props.columns) {
                                                const idx = this.props.columns.length === item.cells.length ? i : (i - 1);
                                                if (this.props.columns[i].filterType === "date") {
                                                    if (item.cells[idx].value)
                                                        item.cells[idx].value = moment(item.cells[idx].value).format("DD/MM/YYYY hh:mm a")
                                                }
                                                if (this.props.columns[i].filterType === "numeric") {
                                                    if (item.cells[idx].value)
                                                        item.cells[idx].value = this.numberWithCommas(item.cells[idx].value);
                                                    item.cells[idx].textAlign = "right";
                                                }
                                                if (this.props.columns[i]?.combine) {
                                                    item.cells[idx].value = getCombineFieldValue(this.excelRef?.current.props.data[index - 1], this.props.columns[i].combineFields)
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
                        {this.props?.exExportTitle || "Export Excel"}
                    </button>
                        <button onClick={() => this.exportToPDF()} 
                        // style={{display:"none"}}
                        >Save as Pdf</button>
                    </div>}
                    {this.props.showExcelExport ? <ExcelExport data={this.state.data} ref={this.excelRef} fileName={this.props?.excelFileName}>

                        <WrappedGrid ref={this.gridref}
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
                    </ExcelExport> : <WrappedGrid ref={this.gridref}
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
        _encrypt = (msg, key) => {
            msg = typeof (msg) == 'object' ? JSON.stringify(msg) : msg;
            var salt = CryptoJS.lib.WordArray.random(128 / 8);

            key = CryptoJS.PBKDF2(key, salt, {
                keySize: 256 / 32,
                iterations: 10
            });

            var iv = CryptoJS.lib.WordArray.random(128 / 8);

            var encrypted = CryptoJS.AES.encrypt(msg, key, {
                iv: iv,
                padding: CryptoJS.pad.Pkcs7,
                mode: CryptoJS.mode.CBC

            });
            return ((salt.toString()) + (iv.toString()) + (encrypted.toString()));
        }
        fetchData = (dataState) => {
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
            const { oidc: { user }, userConfig: { userProfileInfo }, currentAction: { action },
                menuItems } = store.getState();
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
            const init = {
                method: 'GET', accept: 'application/json', headers: {
                    "Authorization": `Bearer ${user.access_token}`,
                    "AuthInformation": userProfileInfo?.id ? this._encrypt(`{CustomerId:"${userProfileInfo?.id}", Action:"${action || "view"
                        }", FeatureId:"${menuItems?.featurePermissions?.selectedScreenFeatureId}"}`, userProfileInfo.sk) : ''
                }
            };

            fetch(`${base_url}${queryStr}`, init)
                .then(response => {
                    if (response.status === 401) {
                        return { data: null, total: null, unauthorized: 401, message: 'Unauthorized' }
                    } else {
                        return response.json()
                    }
                })
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