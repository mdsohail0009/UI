import React from 'react';
import { toDataSourceRequestString, translateDataSourceResultGroups } from '@progress/kendo-data-query';
import { store } from '../../store'
import moment from 'moment';
import CryptoJS from "crypto-js";
import { ExcelExport } from '@progress/kendo-react-excel-export'
import { savePDF, PDFExport } from '@progress/kendo-react-pdf';
import logColor from '../../assets/images/logo-color.png';
import {Button, Dropdown,Menu,} from 'antd';
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
const items = [
    {
      key: '1',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
          1st menu item
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
          2nd menu item
        </a>
      ),
    },
    {
      key: '3',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
          3rd menu item
        </a>
      ),
    },
  ];
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
                    <div>
                   <div style={{height:"0",overflow:"hidden", width:"100%"}}>
                        <PDFExport margin={5} scale={0.55} paperSize="A4" repeatHeaders={true} fileName='Transaction History' ref={this.tempRef}>
                            <table width="100%">
                                <tr>

                                    <td colspan="2" style={{width:"100%"}}><h1 style={{ fontSize: "26px", fontWeight: 700, textAlign: "center", marginLeft:"100px"}}>Transaction History</h1></td>
                                    <td></td>
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
                                <table className="transaction-pdf-template" style={{ width:"100%"}}>
                                    <thead style={{ background: "#cccccc" }}>
                                        <th >Transaction ID</th>
                                        <th style={{ width:"150px"}}>Date</th>
                                        <th style={{ width:"100px"}}>Type</th>
                                        <th style={{ width:"90px"}}>Wallet</th>
                                        <th style={{ width:"90px"}}>Value</th>
                                        <th style={{ width:"140px"}}>Sender/Recipient Full Name</th>
                                        <th style={{ width:"150px"}}>Bank Account Number /IBAN</th>
                                        <th style={{ width:"100px"}}>Hash</th>
                                        <th style={{ width:"70px"}}>Status</th>
                                    </thead>
                                    <tbody className='pdt-data'style={{ width:"100%"}}>
                                        {this.state?.data?.map(item => <tr>
                                            <td >{item.transactionId}</td>
                                            <td style={{ width:"150px"}}>{moment(item.date).format("DD/MM/YYYY hh:mm a")}</td>
                                            <td style={{ width:"100px"}}>{item.docType}</td>
                                            <td style={{ width:"90px"}}>{item.wallet}</td>
                                            <td style={{ width:"90px"}}>{this.getCombineFieldValue(item, ["debit","credit"])}</td>
                                            <td style={{ width:"140px"}}>{this.getCombineFieldValue(item, ["senderName", "beneficiryName"])}</td>
                                            <td style={{ width:"150px"}}>{this.getCombineFieldValue(item, ["accountnumber", "iban"])}</td>
                                            <td style={{ width:"100px"}}>{item.hash}</td>
                                            <td style={{ width:"70px"}}>{item.state}</td>
                                        </tr>)}
                                    </tbody>
                                </table>
                            </div>
                        </PDFExport>
                    </div>
                    </div>
                    <div className="cust-list main-container">
                    {this.state.isLoading && this.loadingPanel}
                    {this.props.showExcelExport && <div className='text-right secureDropdown export-pdf'>
                     <Dropdown
                      overlayClassName="secureDropdown depwith-drpdown transacton-drpdwn"
                       overlay={<Menu >
                        <ul className="drpdwn-list pl-0">
                        <li onClick={this.handleExcelExport}><a>Export to Excel</a></li>
                            <li onClick={this.exportToPDF}><a>Export to Pdf</a></li>

                        </ul>
                    </Menu>}
                        placement="bottomLeft"
                        >
                        <Button>Download Transaction<span className='icon md excel-export'></span></Button>
                        </Dropdown>
                       {/* <Dropdown.Button
                        className=""
                          overlay={<div className='ant-dropdown-menu history-excel'>
                            <ul className='pl-0 drpdwn-list'>
                            <li onClick={this.handleExcelExport}><a>Export to Excel</a></li>
                            <li onClick={this.exportToPDF}><a>Export to Pdf</a></li></ul>
                        </div>}

                          placement="bottomCenter"
                          arrow
                          overlayClassName=""
                        >
                             Download Transaction History<span className='icon md excel-export'></span>
                        </Dropdown.Button>                        */}
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