import React, { Component } from 'react';
import { Typography, Drawer, Button, Radio, Tooltip, Modal, Alert } from 'antd'
import { setAddressStep, rejectCoin, fetchUsersIdUpdate, clearValues, clearCryptoValues,withdrawfiatUpdate } from '../../reducers/addressBookReducer';
import Translate from 'react-translate-component';
import { processSteps as config } from './config';
import NewAddressBook from './newAddressBook';
import List from '../grid.component';
import NewFiatAddress from './addFiatAddressbook';
import { activeInactive } from './api';
import SelectCrypto from './selectCrypto';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import apiCalls from '../../api/apiCalls';
import { warning } from '../../utils/message';



const { Title, Paragraph, Text } = Typography;

class AddressBook extends Component {
   
     constructor(props) {
    
      super(props);
        this.state = {
            visible: false,
            cryptoFiat:this.props?.activeFiat ? true : false,
            fiatDrawer: false,
            isCheck: false,
            selection: [],
            selectedObj: {},
            modal: false,
            alert: false,
            successMsg: false,
            btnDisabled: false,

            obj: {
                "id": [],
                "tableName": "Member.FavouriteAddress",
                "modifiedBy": "",
                "status": [],
                type: ''
            },
            memberId: this.props.userConfig.id,

            gridUrlCrypto: process.env.REACT_APP_GRID_API + "Address/Crypto",
            gridUrlFiat: process.env.REACT_APP_GRID_API + "Address/Fiat",
        }
        this.gridFiatRef = React.createRef();
        this.gridCryptoRef = React.createRef();
    }
    componentDidMount() {
        if (!this.state.cryptoFiat) {
            apiCalls.trackEvent({ "Type": 'User', "Action": 'Withdraw Crypto Address book grid view', "Username": this.props.userProfileInfo?.userName, "MemeberId": this.props.userProfileInfo?.id, "Feature": 'Address Book', "Remarks": 'Withdraw Crypto Address book grid view', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Address Book' });
        }
        else{
            apiCalls.trackEvent({ "Type": 'User', "Action": 'Withdraw Fiat Address book add view', "Username": this.props.userProfileInfo?.userName, "MemeberId": this.props.userProfileInfo?.id, "Feature": 'Address Book', "Remarks": 'Withdraw Fiat Address book add view', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Address Book' });
        }
    }

    columnsFiat = [
        { field: "", title: "", width: 50, customCell: (props) => (<td > <label className="text-center custom-checkbox"><input id={props.dataItem.id} name="isCheck" type="checkbox" checked={this.state.selection.indexOf(props.dataItem.id) > -1} onChange={(e) => this.handleInputChange(props, e)} /><span></span> </label></td>) },
        {
            field: "", 
            title: apiCalls.convertLocalLang('AddressLabel'),
            filter: true, width: 300,
            customCell: (props) => (<td >{props.dataItem.favouriteName}<Text className='file-label ml-8 fs-12'>{this.addressTypeNames(props?.dataItem?.addressType)}</Text></td>),
         },
        { field: "toWalletAddress", title: apiCalls.convertLocalLang('address'), filter: true, width: 380 },
        { field: "currency", title: apiCalls.convertLocalLang('currency'), width: 150, filter: true, with: 150 },
        { field: "accountNumber", title: apiCalls.convertLocalLang('Bank_account'), filter: true, width: 250 },
        { field: "routingNumber", title: apiCalls.convertLocalLang('BIC_SWIFT_routing_number'), filter: true, width: 250 },
        { field: "bankName", title: apiCalls.convertLocalLang('Bank_name'), filter: true, width: 200 },
        { field: "bankAddress", title: apiCalls.convertLocalLang('Bank_address1'), filter: true, width: 250 },
        { field: "beneficiaryAccountName", title: apiCalls.convertLocalLang('business_recipient'), filter: true, width: 300 },
        { field: "beneficiaryAccountAddress", title: apiCalls.convertLocalLang('Recipient_address1'), filter: true, width: 250 },
        { field: "addressState", title: apiCalls.convertLocalLang('addressState'), filter: true, width: 180 },
        { field: "status", title: apiCalls.convertLocalLang('Status'), filter: true, width: 100 }
    ];
    columnsCrypto = [
        {
            field: "", title: "", width: 50,
            customCell: (props) => (<td > <label className="text-center custom-checkbox">
                <input id={props.dataItem.id} name="isCheck" type="checkbox"
                    checked={this.state.selection.indexOf(props.dataItem.id) > -1}
                    onChange={(e) => this.handleInputChange(props, e)} />
                <span></span> </label></td>)
        },
        {
            field: "", title: apiCalls.convertLocalLang('AddressLabel'), filter: true, width: 300,
            customCell: (props) => (<td >{props.dataItem.addressLable}<Text className='file-label ml-8 fs-12'>{props?.dataItem?.addressType}</Text></td>)
        },
        { field: "coin", title: apiCalls.convertLocalLang('Coin'), filter: true, width: 120 },
        { field: "address", title: apiCalls.convertLocalLang('address'), filter: true, width: 380 },
        { field: "addressState", title: apiCalls.convertLocalLang('addressState'), filter: true, width: 180 },
        { field: "status", title: apiCalls.convertLocalLang('Status'), filter: true, width: 100 }
    ];
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
        this.setState({ ...this.state, isLoading: true, btnDisabled: true })
        let statusObj = this.state.obj;
        statusObj.id.push(this.state.selectedObj.id);
        statusObj.modifiedBy = this.props.oidc.user.profile.unique_name;
        statusObj.status.push(this.state.selectedObj.status);
        statusObj.type = this.state.cryptoFiat ? "fiat" : 'crypto';
        statusObj.info = JSON.stringify(this.props.trackLogs);
        let response = await activeInactive(statusObj)
        if (response.ok) {
            this.setState({
                ...this.state, modal: false, selection: [], isCheck: false, isLoading: false, btnDisabled: false,
                obj: {
                    "id": [],
                    "tableName": "Member.FavouriteAddress",
                    "modifiedBy": "",
                    "status": []
                }, successMsg: true
            })
            setTimeout(() => this.setState({ successMsg: false }), 1000)
            if (this.state.cryptoFiat) {
                this.gridFiatRef.current.refreshGrid();
            }
            else {
                this.gridCryptoRef.current.refreshGrid();
            }
        }
        else {
            this.setState({
                ...this.state, modal: false, selection: [], isCheck: false, btnDisabled: false,
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
        if (this.state.cryptoFiat) {
            this.setState({ ...this.state, fiatDrawer: true })
            if (!this.state.fiatDrawer) {
                apiCalls.trackEvent({ "Type": 'User', "Action": 'Withdraw Fiat Address book add view', "Username": this.props.userProfileInfo?.userName, "MemeberId": this.props.userProfileInfo?.id, "Feature": 'Address Book', "Remarks": 'Withdraw Fiat Address book add view', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Address Book' });
            }
            this.props.clearFormValues();
        }
        else {
            this.setState({ ...this.state, visible: true })
            apiCalls.trackEvent({ "Type": 'User', "Action": 'Withdraw Crypto Address book add view', "Username": this.props.userProfileInfo?.userName, "MemeberId": this.props.userProfileInfo?.id, "Feature": 'Address Book', "Remarks": 'Withdraw Crypto Address book add view', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Address Book' });
            this.props.clearFormValues();
        }

    }
    editAddressBook = () => {
     
        let obj = this.state.selectedObj;
        if (!this.state.isCheck) {
            this.setState({ alert: true })
            setTimeout(() => this.setState({ alert: false }), 2000)
        } else if(obj.addressState === 'Approved' || obj.addressState === "Rejected") {
            warning(`Record is already ${obj.addressState} you can't modify`);
        }
        else {
            obj.walletCode = obj.coin;
            this.props.rowSelectedData(obj)
            if (obj.isPrimary == false) {
                this.props.history.push(`/payments/newbeneficiary/${obj.id}`)
            }
            else {
                if (this.state.cryptoFiat) {
                    this.setState({ ...this.state, fiatDrawer: true, selection: [], isCheck: false, });
                    apiCalls.trackEvent({ "Type": 'User', "Action": 'Withdraw Fait  Address edit view', "Username": this.props.userProfileInfo?.userName, "MemeberId": this.props.userProfileInfo?.id, "Feature": 'Address Book', "Remarks": 'Withdraw Fiat Address edit view', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Address Book' });
                }
                else {
                    apiCalls.trackEvent({ "Type": 'User', "Action": 'Withdraw Crypto  Address edit view', "Username": this.props.userProfileInfo?.userName, "MemeberId": this.props.userProfileInfo?.id, "Feature": 'Address Book', "Remarks": 'Withdraw Crypto Address edit view', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Address Book' });
                    this.setState({ ...this.state, visible: true, selection: [], isCheck: false, })
                }
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
            ...this.state, cryptoFiat: e.target.value === 2, selection: [], selectedObj: {}, isCheck: false
        })
        if (this.state.cryptoFiat) {
            apiCalls.trackEvent({ "Type": 'User', "Action": 'Withdraw Crypto Address book grid view', "Username": this.props.userProfileInfo?.userName, "MemeberId": this.props.userProfileInfo?.id, "Feature": 'Address Book', "Remarks": 'Withdraw Crypto Address book grid view', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Address Book' });
        } else {
            apiCalls.trackEvent({ "Type": 'User', "Action": 'Withdraw Fiat Address book grid view', "Username": this.props.userProfileInfo?.userName, "MemeberId": this.props.userProfileInfo?.id, "Feature": 'Address Book', "Remarks": 'Withdraw Fiat Address book grid view', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Address Book' });
        }
    }
 addressTypeNames = (type) =>{
   const stepcodes = {
             "1stparty" : "1st Party",
             "3rdparty" : "3rd Party",
    }
    return stepcodes[type]
}
    renderContent = () => {
        const stepcodes = {
            cryptoaddressbook: <NewAddressBook onCancel={() => this.closeBuyDrawer()} />,
            selectcrypto: <SelectCrypto />
        }
        return stepcodes[config[this.props.addressBookReducer.stepcode]]
    }
    renderTitle = () => {
        const titles = {
            cryptoaddressbook: <span />,
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
        const { cryptoFiat, gridUrlCrypto, gridUrlFiat, memberId, btnDisabled } = this.state;

        return (
            <>
                <div className="box basic-info">
                    <Translate content="address_book" component={Text} className="basicinfo" />
                    <Text className='fs-14 text-yellow fw-400 mb-36 d-block'>(NOTE: Whitelisting of Crypto Address and Bank Account is required, please add below.)</Text>
                    <div className="display-flex mb-16">
                        <Radio.Group
                            defaultValue={this.props?.activeFiat ? 2 : 1}
                            onChange={this.handleWithdrawToggle}
                            className="buysell-toggle mx-0" style={{ display: "inline-block" }}>
                            <Translate content="withdrawCrypto" component={Radio.Button} value={1} className="buysell-toggle mx-0" />
                            <Translate content="withdrawFiat" component={Radio.Button} value={2} className="buysell-toggle mx-0" />
                        </Radio.Group>
                        <ul className="address-icons" style={{ listStyle: 'none', paddingLeft: 0, marginBottom: 0, display: 'flex' }}>
                            <li onClick={this.addAddressBook} className="mr-16">
                                <Tooltip placement="topRight" title={<Translate content="add" />}>
                                    <Link className="icon md add-icon mr-0"></Link>
                                </Tooltip>
                            </li>
                            <li onClick={this.editAddressBook} className="mr-16">
                                <Tooltip placement="topRight" title={<Translate content="edit" />}>
                                    <Link className="icon md edit-icon mr-0"></Link>
                                </Tooltip>
                            </li>
                            <li onClick={this.statusUpdate}>
                                <Tooltip placement="topRight" title={<Translate content="active_inactive" />}>
                                    <Link className="icon md status mr-0" ></Link>
                                </Tooltip>
                            </li>
                        </ul>
                    </div>
                    {this.state.alert &&
                        <div className="custom-alert" ><Alert
                            description={apiCalls.convertLocalLang('one_record')}
                            type="warning"
                            showIcon /></div>}
                    {this.state.successMsg && <Alert type="success"
                        description={'Record ' + (this.state.selectedObj.status == 'Active' ? 'deactivated' : 'activated') + ' successfully'} showIcon />}
                    {cryptoFiat ?

                        <List className="address-clear" columns={this.columnsFiat} ref={this.gridFiatRef} key={gridUrlFiat} url={gridUrlFiat} additionalParams={{ memberId: memberId }} />
                        :
                        <List className="address-clear" columns={this.columnsCrypto} key={gridUrlCrypto} ref={this.gridCryptoRef} url={gridUrlCrypto} additionalParams={{ memberId: memberId }} />
                    }
                </div>

                <Drawer destroyOnClose={true}
                    title={[<div className="side-drawer-header">
                        {this.renderTitle()}
                        <div className="text-center fs-16">
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
                            <Paragraph className="mb-0 text-white-30 fw-600 text-upper"><Translate content="AddFiatAddress" component={Paragraph} className="mb-0 text-white-30 fw-600 text-upper" /></Paragraph>
                        </div>
                        <span onClick={this.closeBuyDrawer} className="icon md close-white c-pointer" />
                    </div>]}
                    placement="right"
                    closable={true}
                    visible={this.state.fiatDrawer}
                    closeIcon={null}
                    className="side-drawer w-50p"
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
                            No
                        </Button>
                        <Button className="primary-btn pop-btn"
                            onClick={this.handleSatatuSave} style={{ width: 120, height: 50 }}
                            disabled={btnDisabled}
                        >
                            Yes
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
    return { addressBookReducer, userConfig: userConfig.userProfileInfo, oidc, trackLogs: userConfig.trackAuditLogData }
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
export default connect(connectStateToProps, connectDispatchToProps)(withRouter(AddressBook));