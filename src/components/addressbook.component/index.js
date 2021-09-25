import React, { Component } from 'react';
import { Typography, Drawer, Button, Tabs, Radio, Tooltip, Modal, Alert } from 'antd'
import { setAddressStep,rejectCoin } from '../../reducers/addressBookReducer';
import connectStateProps from '../../utils/state.connect';
import Translate from 'react-translate-component';
import { processSteps as config } from './config';
import NewAddressBook from './newAddressBook';
import List from '../grid.component';
import FaitWithdrawal from '../withDraw.component/faitWithdrawal'
import CryptoList from '../shared/cryptolist';
import NewFiatAddress from './addFiatAddressbook';
import { getCoinList, activeInactive } from './api';
import SelectCrypto from './selectCrypto';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { OKShareButton } from 'react-share';


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
            obj: {
                "id": [],
                "tableName": "Member.FavouriteAddress",
                "modifiedBy": "",
                "status": [],
                type:''
            },
            gridUrlCrypto: process.env.REACT_APP_GRID_API + "/AddressBook/FavouriteAddressCryptoK",
            gridUrlFiat: process.env.REACT_APP_GRID_API + "/AddressBook/FavouriteAddressFiatK",
        }
        this.gridRef = React.createRef();
    }
    columnsFiat = [
        { field: "", title: "", width: 50, customCell: (props) => (<td > <label className="text-center custom-checkbox"><input id={props.dataItem.id} name="isCheck" type="checkbox" checked={this.state.selection.indexOf(props.dataItem.id) > -1} onChange={(e) => this.handleInputChange(props, e)} /><span></span> </label></td>) },
        { field: "favouriteName", title: "Address Label", filter: true, width: 180 },
        { field: "toWalletAddress", title: "Address", filter: true, width: 380 },
        { field: "currency", title: "Currency", width: 150, filter: true, with: 150 },
        { field: "accountNumber", title: "Account Number", filter: true, width: 200 },
        { field: "routingNumber", title: "Routing Number", filter: true, width: 180 },
        { field: "bankName", title: "Bank Name", filter: true, width: 200 },
        { field: "bankAddress", title: "Bank Address", filter: true, width: 250 },
        { field: "beneficiaryAccountName", title: "Account Name", filter: true, width: 200 },
        { field: "beneficiaryAccountAddress", title: "Account Address", filter: true, width: 250 },
       // { field: "swiftCode", title: "Swift Code", filter: true, },
      
        { field: "status", title: "Status", filter: true, width: 100 }
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
        { field: "addressLable", title: "Address Label", filter: true, width: 250 },
        { field: "coin", title: "Coins", filter: true, width: 120 },
        { field: "address", title: "Address", filter: true, width: 380 },
        { field: "status", title: "Status", filter: true, width: 100 }
    ];
    componentDidMount() {
        this.coinList()
    }
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
        this.setState({ ...this.state, [name]: value, selectedObj: rowObj, selection});
    }
    statusUpdate = () => {
        if (!this.state.isCheck) {
            this.setState({ alert: true })
            setTimeout(() => this.setState({ alert: false }), 2000)
        }
        else {
            this.setState({ modal: true, })
        }
    }
    handleCancel = e => {
        this.setState({ ...this.state, modal: false, selection: [], isCheck: false });
    }
    handleSatatuSave = async () => {
        debugger
        this.setState({ ...this.state, isLoading: true })
        let statusObj = this.state.obj;
        statusObj.id.push(this.state.selectedObj.id);
        statusObj.modifiedBy =  this.props.oidc.user.profile.unique_name;
        statusObj.status.push(this.state.selectedObj.status);
        statusObj.type = this.state.cryptoFiat? "fiat":'crypto';
        let response = await activeInactive(statusObj)
        if (response.ok) {
            // this.success();
            this.setState({ ...this.state, modal: false, selection: [], isCheck: false, isLoading: false,
                obj: {
                    "id": [],
                    "tableName": "Member.FavouriteAddress",
                    "modifiedBy": "",
                    "status": []
                }, })
            this.gridRef.current.refreshGrid();
        }
        else {
            this.setState({ ...this.state, modal: false, selection: [], isCheck: false,
                obj: {
                    "id": [],
                    "tableName": "Member.FavouriteAddress",
                    "modifiedBy": "",
                    "status": []
                }, });
        }
    }
    coinList = async () => {
        let fromlist = await getCoinList(this.props.userProfile?.id)
        if (fromlist.ok) {
            this.setState({ ...this.state, fromCoinsList: fromlist.data, isLoading: false })
        } else {
            this.setState({ ...this.state, fromCoinsList: [], isLoading: false })
        }
    }


    handleFiatAddress = () => {
        this.setState({ ...this.state,fiatDrawer: true })
    }
    handleCryptoAddress = () => {
        this.setState({ ...this.state,visible: true })
    }

    closeBuyDrawer = () => {
        this.setState({ ...this.state,visible: false, fiatDrawer: false })
        this.props.rejectCoinWallet();
    }
    handleWithdrawToggle = e => {
        this.setState({
            ...this.state,cryptoFiat: e.target.value === 2
        })
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
            selectcrypto: <span onClick={() => this.props.dispatch(setAddressStep("step1"))} className="icon md lftarw-white c-pointer" />,
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
        const { cryptoFiat, gridUrlCrypto, gridUrlFiat } = this.state;
        const { Title, Paragraph } = Typography;
        return (
            <>

                <div className="box basic-info">
                    <Title className="basicinfo">Address Book</Title>
                    <Paragraph className="basic-decs mb-16">User customized address book</Paragraph>
                    <Radio.Group
                        defaultValue={1}
                        onChange={this.handleWithdrawToggle}
                        className="buysell-toggle mx-0" style={{ display: "inline-block" }}>
                        <Translate content="withdrawCrypto" component={Radio.Button} value={1} />
                        <Translate content="withdrawFiat" component={Radio.Button} value={2} />
                    </Radio.Group>

                    {cryptoFiat ? <>
                        <div className="d-flex justify-content align-center mb-16">
                            <div><Title className="fs-26 text-white-30 fw-500">Withdraw Fiat</Title>
                                {/* <Paragraph className="basic-decs fw-200">Basic Info, like your name and photo, that you use on Suissebase</Paragraph> */}
                            </div>
                            <div className="d-flex align-center">
                                <Button className="c-pointer pop-btn ant-btn px-24 mr-16" onClick={this.handleFiatAddress}> Add Address</Button>
                                <ul style={{ listStyle: 'none', paddingLeft: 0, marginBottom: 0 }}>
                                    <li onClick={this.statusUpdate}>
                                        <Tooltip placement="topRight" title="Active/Inactive">
                                            <Link className="icon md status mr-0"
                                            ></Link>
                                        </Tooltip>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        {this.state.alert &&
                            <div className="custom-alert" ><Alert
                          //  message="Warning"
                            description="Please select the one record"
                            type="warning"
                            showIcon
                            closable
                          />
                            </div>}
                        <List columns={this.columnsFiat} ref={this.gridRef} key={gridUrlFiat} url={gridUrlFiat} />
                    </> :
                        <>
                            <div className="d-flex justify-content align-center mb-16">
                                <div> <Title className="fs-26 text-white-30 fw-500">Withdraw Crypto</Title>
                                </div>

                                <div className="d-flex align-center">
                                    <Button className="c-pointer pop-btn ant-btn px-24 mr-16" onClick={this.handleCryptoAddress}> Add Address</Button>
                                    <ul style={{ listStyle: 'none', paddingLeft: 0, marginBottom: 0 }}>
                                        <li onClick={this.statusUpdate}>
                                            <Tooltip placement="topRight" title="Active/Inactive">
                                                <Link className="icon md status mr-0"
                                                ></Link>
                                            </Tooltip>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            {this.state.alert &&
                            <div className="custom-alert" ><Alert
                          //  message="Warning"
                            description="Please select the one record"
                            type="warning"
                            showIcon
                            closable
                          />
                            </div>}
                            <List columns={this.columnsCrypto} key={gridUrlCrypto} ref={this.gridRef} url={gridUrlCrypto} />
                        </>}
                </div>
                <Drawer destroyOnClose={true}
                    title={[<div className="side-drawer-header">
                        {this.renderTitle()}
                        <div className="text-center fs-16">
                            <Paragraph className="mb-0 text-white-30 fw-600 text-upper">Add Crypto Address</Paragraph>
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
                            <Paragraph className="mb-0 text-white-30 fw-600 text-upper">Add Fiat Address</Paragraph>
                        </div>
                        <span onClick={this.closeBuyDrawer} className="icon md close-white c-pointer" />
                    </div>]}
                    placement="right"
                    closable={true}
                    visible={this.state.fiatDrawer}
                    closeIcon={null}
                    className="side-drawer"
                >
                    <NewFiatAddress onCancel={() => this.closeBuyDrawer()} />
                </Drawer>
                <Modal
                    title={this.state.selectedObj.status == 'Active' ? 'Confirm Inactive?' : 'Confirm Active?'}
                    visible={this.state.modal}
                    closeIcon={<Tooltip title="Close"><span className="icon md close-white" onClick={this.handleCancel} /></Tooltip>}
                    footer={<>
                        <Button
                            style={{ width: '100px', border: '1px solid #f2f2f2' }}
                            className=" pop-cancel"
                            onClick={this.handleCancel}
                        >
                            No
                        </Button>
                        <Button className="primary-btn pop-btn" onClick={this.handleSatatuSave} style={{ width: '100px' }}>
                            yes
                        </Button>
                    </>}
                >
                    <p className="fs-16 mb-0">Do you really want to {this.state.selectedObj.status == 'Active' ? 'Inactive?' : 'Active?'}</p>
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
        }
    }
}
export default connect(connectStateToProps,connectDispatchToProps)(AddressBook);