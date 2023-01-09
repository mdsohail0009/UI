import React from 'react';
import { toDataSourceRequestString, translateDataSourceResultGroups } from '@progress/kendo-data-query';
import { store } from '../../store'
import moment from 'moment';
import CryptoJS from "crypto-js";
import { ExcelExport } from '@progress/kendo-react-excel-export'
import { savePDF, PDFExport } from '@progress/kendo-react-pdf';
import logColor from '../../assets/images/logo-color.png';
import { Dropdown} from 'antd';
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
            this.state = { dataState: { skip: 0, take: 10 }, additionalParams: null, data: [], isLoading: false, profile: store.getState().userConfig?.userProfileInfo };
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
            if (this.tempRef.current)
                this.tempRef.current.save();
        }
        getPDFROWS = () => {

        }
        getCombineFieldValue = (dataItem, fields) => {
            for (const i in this.props.columns) {
                if (this.props.columns[i].filterType === "numeric") {
                    dataItem[fields[0]] = this.numberWithCommas(dataItem[fields[0]])
                    dataItem[fields[1]] = this.numberWithCommas(dataItem[fields[1]])
                }
            }
            return dataItem[fields[0]] && dataItem[fields[1]] ? `${dataItem[fields[0]]} / ${dataItem[fields[1]]}` : (dataItem[fields[0]] || dataItem[fields[1]]);
        }
        handleExcelExport = () => {

            if (this.excelRef) {
                if (this.excelRef?.current.save) {
                    let workbook = this.excelRef.current.workbookOptions();
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
                                    item.cells[idx].value = this.getCombineFieldValue(this.excelRef?.current.props.data[index - 1], this.props.columns[i].combineFields)
                                }
                            }
                        }
                    });
                    this.excelRef.current.save(workbook);
                }
            }

        }
        render() {
            return (
                <div >
                   <div style={{height:"0",overflow:"hidden"}}>
                        <PDFExport margin={5} scale={0.55} paperSize="A4" repeatHeaders={true} fileName='Transaction History' ref={this.tempRef}>
                            <table width="100%">
                                <tr>

                                    <td colspan="2" style={{ fontSize: "26px", fontWeight: 700, textAlign: "center"}}><h1>Suissebase Account Statement</h1></td>

                                </tr>
                            </table>
                            <div className='statement-header logo-content'>
                                <div> <img src={logColor} className="logo" /></div>
                                {
                                    <ul style={{ fontWeight: 500, margin: "0", padding: "0" }}>
                                        <li> Name : {`${this.state.profile.firstName} ${this.state.profile.lastName}`}</li>
                                        <li> Email : {this.state.profile.email}</li>
                                        <li> Phone : {this.state.profile.phoneNo || this.state.profile.phoneNumber}</li>
                                    </ul>
                                }
                            </div>
                            <div>
                                <table className="transaction-pdf-template">
                                    <thead style={{ background: "#cccccc" }}>
                                        <th >Transaction ID</th>
                                        <th >Date</th>
                                        <th >Type</th>
                                        <th >Wallet</th>
                                        <th >Value</th>
                                        <th >Sender/Recipient Full Name</th>
                                        <th >Bank Account Number /IBAN</th>
                                        <th>Hash</th>
                                        <th >Status</th>
                                    </thead>
                                    <tbody className='pdt-data'>
                                        {this.state?.data?.map(item => <tr>
                                            <td>{item.transactionId}</td>
                                            <td >{moment(item.date).format("DD/MM/YYYY hh:mm a")}</td>
                                            <td >{item.docType}</td>
                                            <td >{item.wallet}</td>
                                            <td >{this.getCombineFieldValue(item, ["debit","credit"])}</td>
                                            <td >{this.getCombineFieldValue(item, ["senderName", "beneficiryName"])}</td>
                                            <td >{this.getCombineFieldValue(item, ["accountnumber", "iban"])}</td>
                                            <td >{item.hash}</td>
                                            <td >{item.state}</td>
                                        </tr>)}
                                    </tbody>
                                </table>
                            </div>
                        </PDFExport>
                    </div>
                    {this.state.isLoading && this.loadingPanel}
                    {this.props.showExcelExport && <div className='text-right secureDropdown export-pdf'>
                       <Dropdown.Button
                        className="mt-16 mb-16"
                          overlay={<div className='ant-dropdown-menu history-excel'>
                            <ul className='pl-0 drpdwn-list'>
                            <li onClick={this.handleExcelExport}><a>Export to Excel</a></li>
                            <li onClick={this.exportToPDF}><a>Export to Pdf</a></li></ul>
                        </div>}

                          placement="bottomCenter"
                          arrow
                          overlayClassName=""
                        >
                             Download Transaction History
                        </Dropdown.Button>                       
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