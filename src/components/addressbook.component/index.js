import React, { Component } from 'react';
import { Typography, Drawer, Button, Radio, Tooltip, Modal, Alert } from 'antd'
import { setAddressStep, rejectCoin, fetchUsersIdUpdate, clearValues ,clearCryptoValues} from '../../reducers/addressBookReducer';
import Translate from 'react-translate-component';
import { processSteps as config } from './config';
import NewAddressBook from './newAddressBook';
import List from '../grid.component';
import NewFiatAddress from './addFiatAddressbook';
import { activeInactive } from './api';
import SelectCrypto from './selectCrypto';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';


class AddressBook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            cryptoFiat: false,
            fiatDrawer: false,
            isCheck: false,
            selection: [],
            selectedObj: {},
            modal: false,
            alert: false,
            successMsg: false,
            obj: {
                "id": [],
                "tableName": "Member.FavouriteAddress",
                "modifiedBy": "",
                "status": [],
                type: ''
            },
            memberId: this.props.userConfig.id,

            gridUrlCrypto: process.env.REACT_APP_GRID_API + "/AddressBook/FavouriteAddressCryptoK",
            gridUrlFiat: process.env.REACT_APP_GRID_API + "/AddressBook/FavouriteAddressFiatK",
        }
        this.gridFiatRef = React.createRef();
        this.gridCryptoRef = React.createRef();
    }
    // columnsFiat = [
    //     { field: "", title: "", width: 50, customCell: (props) => (<td > <label className="text-center custom-checkbox"><input id={props.dataItem.id} name="isCheck" type="checkbox" checked={this.state.selection.indexOf(props.dataItem.id) > -1} onChange={(e) => this.handleInputChange(props, e)} /><span></span> </label></td>) },
    //     { field: "favouriteName", title: <Translate content="AddressLabel" component={Text}/>, filter: true, width: 180 },
    //     { field: "toWalletAddress", title: "Address", filter: true, width: 380 },
    //     { field: "currency", title: "Currency", width: 150, filter: true, with: 150 },
    //     { field: "accountNumber", title: "Bank account number/IBAN", filter: true, width: 220 },
    //     { field: "routingNumber", title: "BIC/SWIFT/Routing Number", filter: true, width: 180 },
    //     { field: "bankName", title: "Bank Name", filter: true, width: 200 },
    //     { field: "bankAddress", title: "Bank address line 1", filter: true, width: 250 },
    //     { field: "beneficiaryAccountName", title: "Recipient full name", filter: true, width: 200 },
    //     { field: "beneficiaryAccountAddress", title: "Recipient address line 1", filter: true, width: 250 },
    //     // { field: "swiftCode", title: "Swift Code", filter: true, },
    //     { field: "status", title: "Status", filter: true, width: 100 }
    // ];
    // columnsCrypto = [
    //     {
    //         field: "", title: "", width: 50,
    //         customCell: (props) => (<td > <label className="text-center custom-checkbox">
    //             <input id={props.dataItem.id} name="isCheck" type="checkbox"
    //                 checked={this.state.selection.indexOf(props.dataItem.id) > -1}
    //                 onChange={(e) => this.handleInputChange(props, e)} />
    //             <span></span> </label></td>)
    //     },
    //     { field: "addressLable", title: "Address Label", filter: true, width: 250 },
    //     { field: "coin", title: "Coin", filter: true, width: 120 },
    //     { field: "address", title: "Address", filter: true, width: 380 },
    //     { field: "status", title: "Status", filter: true, width: 100 }
    // ];
    handleInputChange = (prop, e) => {
        const rowObj = prop.dataItem;
        const value = e.currentTarget.type === 'checkbox' ? e.currentTarget.checked : e.currentTarget.value;
        const name = e.currentTarget.name;
        let { selection } = this.state;
        let idx = selection.indexOf(rowObj.id);
        if (selection) {
            selection = [];
        }
        if (idx > -1) {
            selection.splice(idx, 1)
        }
        else {
            selection.push(rowObj.id)
        }
        this.setState({ ...this.state, [name]: value, selectedObj: rowObj, selection });
    }
    statusUpdate = () => {
        if (!this.state.isCheck) {
            this.setState({ alert: true })
            setTimeout(() => this.setState({ alert: false }), 2500)
        }
        else {
            this.setState({ modal: true, })
        }
    }
    handleCancel = e => {
        this.setState({ ...this.state, modal: false, selection: [], isCheck: false });
        if (this.state.cryptoFiat) {
            this.gridFiatRef.current.refreshGrid();
        }
        else {
            this.gridCryptoRef.current.refreshGrid();

        }
    }
    handleSatatuSave = async () => {
        this.setState({ ...this.state, isLoading: true })
        let statusObj = this.state.obj;
        statusObj.id.push(this.state.selectedObj.id);
        statusObj.modifiedBy = this.props.oidc.user.profile.unique_name;
        statusObj.status.push(this.state.selectedObj.status);
        statusObj.type = this.state.cryptoFiat ? "fiat" : 'crypto';
        let response = await activeInactive(statusObj)
        if (response.ok) {
            // this.success();
            this.setState({
                ...this.state, modal: false, selection: [], isCheck: false, isLoading: false,
                obj: {
                    "id": [],
                    "tableName": "Member.FavouriteAddress",
                    "modifiedBy": "",
                    "status": []
                }, successMsg: true
            })
            setTimeout(() => this.setState({ successMsg: false }), 2500)
            if (this.state.cryptoFiat) {
                this.gridFiatRef.current.refreshGrid();
            }
            else {
                this.gridCryptoRef.current.refreshGrid();
            }
        }
        else {
            this.setState({
                ...this.state, modal: false, selection: [], isCheck: false,
                obj: {
                    "id": [],
                    "tableName": "Member.FavouriteAddress",
                    "modifiedBy": "",
                    "status": []
                },
            });
        }
    }
    setSuccessMsg = () => {
        this.setState({ ...this.state, successMsg: false })
    }
    addAddressBook = () => {
        debugger
        if (this.state.cryptoFiat) {
            this.setState({ ...this.state, fiatDrawer: true })
            this.props.clearFormValues();
        }
        else {
            this.setState({ ...this.state, visible: true })
            this.props.clearFormValues();
        }
    }
    editAddressBook = () => {
        if (!this.state.isCheck) {
            this.setState({ alert: true })
            setTimeout(() => this.setState({ alert: false }), 2000)
        } else {
            let obj = this.state.selectedObj;
            obj.walletCode = obj.coin;
            this.props.rowSelectedData(obj)
            if (this.state.cryptoFiat) {
                this.setState({ ...this.state, fiatDrawer: true, selection: [],isCheck: false, })
            }
            else {
                this.setState({ ...this.state, visible: true, selection: [],isCheck: false, })
            }
        }
    }
    closeBuyDrawer = () => {
        this.setState({ ...this.state, visible: false, fiatDrawer: false })
        this.props.rejectCoinWallet();
        this.props.clearFormValues();
        this.props.clearCrypto()
        if (this.state.cryptoFiat) {
            this.gridFiatRef.current.refreshGrid();
        }
        else {
            this.gridCryptoRef.current.refreshGrid();
        }
    }
    backStep = () => {
        this.props.changeStep('step1')
    }
    handleWithdrawToggle = e => {
        this.setState({
            ...this.state, cryptoFiat: e.target.value === 2
        })
    }
    renderContent = () => {
        const stepcodes = {
            cryptoaddressbook: <NewAddressBook onCancel={() => this.closeBuyDrawer()} />,
            selectcrypto:<SelectCrypto />
        }
        return stepcodes[config[this.props.addressBookReducer.stepcode]]
    }
    renderTitle = () => {
        const titles = {
            cryptoaddressbook: <span/>,
            selectcrypto: <span onClick={this.backStep} className="icon md lftarw-white c-pointer" />,
        }
        return titles[config[this.props.addressBookReducer.stepcode]]
    }
    renderIcon = () => {
        const stepcodes = {
            cryptoaddressbook: <span onClick={this.closeBuyDrawer} className="icon md close-white c-pointer" />,
            selectcrypto: <span />
        }
        return stepcodes[config[this.props.addressBookReducer.stepcode]]
    }
    render() {
        const { cryptoFiat, gridUrlCrypto, gridUrlFiat, memberId } = this.state;
        const { Title, Paragraph,Text } = Typography;
       const columnsFiat = [
            { field: "", title: "", width: 50, customCell: (props) => (<td > <label className="text-center custom-checkbox"><input id={props.dataItem.id} name="isCheck" type="checkbox" checked={this.state.selection.indexOf(props.dataItem.id) > -1} onChange={(e) => this.handleInputChange(props, e)} /><span></span> </label></td>) },
            { field: "favouriteName", title: <Translate content="AddressLabel" component={Text} className="custom-font fw-400 fs-14 text-white"/>, filter: true, width: 180 },
            { field: "toWalletAddress", title: <Translate content="address" component={Text} className="custom-font fw-400 fs-14 text-white"/>, filter: true, width: 380 },
            { field: "currency", title: <Translate content="currency" component={Text} className="custom-font fw-400 fs-14 text-white"/>, width: 150, filter: true, with: 150 },
            { field: "accountNumber", title: <Translate content="Bank_account" component={Text} className="custom-font fw-400 fs-14 text-white"/>, filter: true, width: 220 },
            { field: "routingNumber", title:  <Translate content="BIC_SWIFT_routing_number" component={Text} className="custom-font fw-400 fs-14 text-white"/>, filter: true, width: 180 },
            { field: "bankName", title: <Translate content="Bank_name" component={Text} className="custom-font fw-400 fs-14 text-white"/>, filter: true, width: 200 },
            { field: "bankAddress", title: <Translate content="Bank_address1" component={Text} className="custom-font fw-400 fs-14 text-white"/>, filter: true, width: 250 },
            { field: "beneficiaryAccountName", title: <Translate content="Recipient_full_name" component={Text} className="custom-font fw-400 fs-14 text-white"/>, filter: true, width: 200 },
            { field: "beneficiaryAccountAddress", title: <Translate content="Recipient_address1" component={Text} className="custom-font fw-400 fs-14 text-white"/>, filter: true, width: 250 },
            // { field: "swiftCode", title: "Swift Code", filter: true, },
            { field: "status", title: <Translate content="Status" component={Text} className="custom-font fw-400 fs-14 text-white"/>, filter: true, width: 100 }
        ];
       const columnsCrypto = [
            {
                field: "", title: "", width: 50,
                customCell: (props) => (<td > <label className="text-center custom-checkbox">
                    <input id={props.dataItem.id} name="isCheck" type="checkbox"
                        checked={this.state.selection.indexOf(props.dataItem.id) > -1}
                        onChange={(e) => this.handleInputChange(props, e)} />
                    <span></span> </label></td>)
            },
            { field: "addressLable", title:<Translate content="AddressLabel" component={Text} className="custom-font fw-400 fs-14 text-white"/>, filter: true, width: 250 },
            { field: "coin", title: <Translate content="Coin" component={Text} className="custom-font fw-400 fs-14 text-white"/>, filter: true, width: 120 },
            { field: "address", title: <Translate content="address" component={Text} className="custom-font fw-400 fs-14 text-white"/>, filter: true, width: 380 },
            { field: "status", title: <Translate content="Status" component={Text} className="custom-font fw-400 fs-14 text-white"/>, filter: true, width: 100 }
        ];
        return (
            <>

                <div className="box basic-info">
                    <Title className="basicinfo"><Translate content="address_book" component={Text} className="basicinfo"/></Title>
                    <Paragraph className="basic-decs mb-16"><Translate content="address_book_tag" component={Paragraph} className="basic-decs mb-16"/></Paragraph>
                    <Radio.Group
                        defaultValue={1}
                        onChange={this.handleWithdrawToggle}
                        className="buysell-toggle mx-0" style={{ display: "inline-block" }}>
                        <Translate content="withdrawCrypto" component={Radio.Button} value={1} className="buysell-toggle mx-0"/>
                        <Translate content="withdrawFiat" component={Radio.Button} value={2} className="buysell-toggle mx-0"/>
                    </Radio.Group>
                    <div className="d-flex justify-content align-center mb-16">
                        <div><Title className="fs-26 text-white-30 fw-500">{cryptoFiat ? <Translate content="withdrawFiat" className="fs-26 text-white-30 fw-500" component={Title}/> : <Translate content="withdrawCrypto" component={Title} className="fs-26 text-white-30 fw-500"/>}</Title>
                        </div>
                        <ul style={{ listStyle: 'none', paddingLeft: 0, marginBottom: 0, display: 'flex' }}>
                            <li onClick={this.addAddressBook} className="mr-16">
                                <Tooltip placement="topRight" title="Add">
                                    <Link className="icon md add-icon mr-0"></Link>
                                </Tooltip>
                            </li>
                            <li onClick={this.editAddressBook} className="mr-16">
                                <Tooltip placement="topRight" title="Edit">
                                    <Link className="icon md edit-icon mr-0"></Link>
                                </Tooltip>
                            </li>
                            <li onClick={this.statusUpdate}>
                                <Tooltip placement="topRight" title="Active/Inactive">
                                    <Link className="icon md status mr-0" ></Link>
                                </Tooltip>
                            </li>
                        </ul>
                    </div>
                    {this.state.alert &&
                        <div className="custom-alert" ><Alert
                            description="Please select one record"
                            type="warning"
                            showIcon /></div>}
                    {this.state.successMsg && <Alert type="success"
                        description={'Record ' + (this.state.selectedObj.status == 'Active' ? 'deactivated' : 'activated') + ' successfully'} showIcon />}
                    {cryptoFiat ?
                        <List columns={columnsFiat} ref={this.gridFiatRef} key={gridUrlFiat} url={gridUrlFiat} additionalParams={{ memberId: memberId }} />
                        :
                        <List columns={columnsCrypto} key={gridUrlCrypto} ref={this.gridCryptoRef} url={gridUrlCrypto} additionalParams={{ memberId: memberId }} />
                    }
                </div>

                <Drawer destroyOnClose={true}
                    title={[<div className="side-drawer-header">
                        {this.renderTitle()}
                        <div className="text-center fs-16">
                            {/* <Paragraph className="mb-0 text-white-30 fw-600 text-upper">Add Crypto Address</Paragraph> */}
                            <Translate className="text-white-30 fw-600 text-upper mb-4" content={this.props.addressBookReducer.stepTitles[config[this.props.addressBookReducer.stepcode]]} component={Paragraph} />
                            <Translate className="text-white-50 mb-0 fw-300 fs-14 swap-subtitlte" content={this.props.addressBookReducer.stepSubTitles[config[this.props.addressBookReducer.stepcode]]} component={Paragraph} />
                        </div>
                        {this.renderIcon()}
                    </div>]}
                    placement="right"
                    closable={true}
                    visible={this.state.visible}
                    closeIcon={null}
                    className="side-drawer"
                >
                    {this.renderContent()}
                </Drawer>
                <Drawer destroyOnClose={true}
                    title={[<div className="side-drawer-header">
                        <span />
                        <div className="text-center fs-16">
                            <Paragraph className="mb-0 text-white-30 fw-600 text-upper"><Translate content="AddFiatAddress" component={Text} className="mb-0 text-white-30 fw-600 text-upper"/></Paragraph>
                        </div>
                        <span onClick={this.closeBuyDrawer} className="icon md close-white c-pointer" />
                    </div>]}
                    placement="right"
                    closable={true}
                    visible={this.state.fiatDrawer}
                    closeIcon={null}
                    className="side-drawer"
                >
                    {this.state.fiatDrawer && <NewFiatAddress onCancel={() => this.closeBuyDrawer()} />}
                </Drawer>
                <Modal
                    title={this.state.selectedObj.status === 'Active' ? 'Deactivate Account?' : 'Activate Account'}
                    visible={this.state.modal}
                    closeIcon={<Tooltip title="Close"><span className="icon md close-white c-pointer" onClick={this.handleCancel} /></Tooltip>}
                    footer={<>
                        <Button
                            style={{ width: '100px', border: '1px solid #f2f2f2' }}
                            className=" pop-cancel"
                            onClick={this.handleCancel}
                        >
                            Cancel
                        </Button>
                        <Button className="primary-btn pop-btn" onClick={this.handleSatatuSave} style={{ width: '100px' }}>
                            Save
                        </Button>
                    </>}
                >
                    <p className="fs-16 mb-0">Do you really want to {this.state.selectedObj.status === 'Active' ? 'deactivate?' : 'activate?'}</p>
                </Modal>
            </>
        )
    }
}
const connectStateToProps = ({ addressBookReducer, userConfig, oidc }) => {
    return { addressBookReducer, userConfig: userConfig.userProfileInfo, oidc }
}
const connectDispatchToProps = dispatch => {
    return {
        rejectCoinWallet: () => {
            dispatch(rejectCoin())
        },
        rowSelectedData: (selectedRowData) => {
            dispatch(fetchUsersIdUpdate(selectedRowData));
        },
        clearFormValues: () => {
            dispatch(clearValues())
        },
        clearCrypto: () => {
            dispatch(clearCryptoValues())
        },
        changeStep: (stepcode) => {
            dispatch(setAddressStep(stepcode))
        },
     
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(AddressBook);