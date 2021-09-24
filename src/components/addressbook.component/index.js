import React, { Component } from 'react';
import { Typography, Drawer, Button, Tabs, Radio ,Tooltip } from 'antd'
import { setAddressStep } from '../../reducers/addressBookReducer';
import connectStateProps from '../../utils/state.connect';
import Translate from 'react-translate-component';
import { processSteps as config } from './config';
import NewAddressBook from './newAddressBook';
import List from '../grid.component';
import FaitWithdrawal from '../withDraw.component/faitWithdrawal'
import CryptoList from '../shared/cryptolist';
import NewFiatAddress from './addFiatAddressbook';
import { getCoinList } from './api';
import SelectCrypto from './selectCrypto';
import { Link } from 'react-router-dom';



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
            gridUrlCrypto: process.env.REACT_APP_GRID_API + "/AddressBook/FavouriteAddressCryptoK",
            gridUrlFiat: process.env.REACT_APP_GRID_API + "/AddressBook/FavouriteAddressFiatK",
        }
        this.gridRef = React.createRef();
    }
    columnsFiat = [
        { field: "", title: "", width: 50, customCell: (props) => (<td > <label className="text-center custom-checkbox"><input id={props.dataItem.id} name="isCheck" type="checkbox" checked={this.state.selection.indexOf(props.dataItem.id) > -1} onChange={(e) => this.handleInputChange(props, e)} /><span></span> </label></td>) },
        { field: "favouriteName", title: "Address Label", filter: true, width: 180 },
        { field: "type", title: "Currency", width: 150, filter: true, with: 150 },
        { field: "toWalletAddress", title: "Address", filter: true, width: 380 },
        { field: "accountNumber", title: "Account Number", filter: true, width: 200 },
        { field: "beneficiaryAccountName", title: "Account Name", filter: true, width: 200 },
        { field: "beneficiaryAccountAddress", title: "Account Address", filter: true, width: 250 },
        { field: "routingNumber", title: "Routing Number", filter: true, width: 180 },
        { field: "swiftCode", title: "Swift Code", filter: true, },
        { field: "bankName", title: "Bank Name", filter: true, width: 200 },
        { field: "bankAddress", title: "Bank Address", filter: true, width: 250 },
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
        { field: "coin", title: "Coins", filter: true, },
        { field: "address", title: "Address", filter: true, width: 380 }
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
        this.setState({ ...this.state, [name]: value, selectedObj: rowObj, selection });
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
        this.setState({ fiatDrawer: true })
    }
    handleCryptoAddress = () => {
        this.setState({ visible: true })
    }

    closeBuyDrawer = () => {
        this.setState({ visible: false, fiatDrawer: false })
    }
    handleWithdrawToggle = e => {
        this.setState({
            cryptoFiat: e.target.value === 2
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
                            <div className="text-right ">
                                <Button className="c-pointer pop-btn ant-btn px-24" onClick={this.handleFiatAddress}> Add Address</Button>
                                {/* <ul >
                                    <li>
                                        <Tooltip placement="top" title="Edit">
                                            <Link className="icon md edit mr-0" onClick={() => this.editNotice()}></Link>
                                        </Tooltip>
                                    </li>
                                    <li onClick={this.statusUpdate}>
                                        <Tooltip placement="topRight" title="Active/Inactive">
                                            <Link className="icon md status mr-0"
                                            ></Link>
                                        </Tooltip>
                                    </li>
                                </ul> */}
                            </div>
                        </div>
                        <List columns={this.columnsFiat} ref={this.gridRef} key={gridUrlFiat} url={gridUrlFiat} />
                    </> :
                        <>
                            <div className="d-flex justify-content align-center mb-16">
                                <div> <Title className="fs-26 text-white-30 fw-500">Withdraw Crypto</Title>
                                    {/* <Paragraph className="basic-decs fw-200">Basic Info, like your name and photo, that you use on Suissebase</Paragraph> */}
                                </div>
                                <div className="text-right ">
                                    <Button className="c-pointer pop-btn ant-btn px-24" onClick={this.handleCryptoAddress}> Add Address</Button>
                                </div>
                            </div>
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
            </>
        )
    }
}

export default connectStateProps(AddressBook);