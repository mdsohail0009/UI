import React, { Component } from 'react';
import { Typography, Drawer, Button, Tabs, Radio } from 'antd'
import { setStep } from '../../reducers/addressBookReducer';
import connectStateProps from '../../utils/state.connect';
import Translate from 'react-translate-component';
import { processSteps as config } from './config';
import NewAddressBook from './newAddressBook';
import List from '../grid.component';
import FaitWithdrawal from '../withDraw.component/faitWithdrawal'
import CryptoList from '../shared/cryptolist';
import NewFiatAddress from './addFiatAddressbook';
import { getCoinList} from './api'


const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;
const columnsCrypto = [
    { field: "", title: "", width: 50, customCell: (props) => (<td > <label className="text-center custom-checkbox"><input id={props.dataItem.id} name="check" type="checkbox" checked={this.state.selection.indexOf(props.dataItem.id) > -1} onChange={(e) => this.handleInputChange(props, e)} /><span></span> </label></td>) },
    { field: "walletCode", title: "Address Label", filter: true, },
    { field: "docType", title: "Coin", width: 150, filter: true, },
    { field: "debit", title: "Address", filter: true, width: 180 },
    { field: "status", title: "Status", filter: true, width: 220 }
];
const columnsFiat = [
    { field: "", title: "", width: 50, customCell: (props) => (<td > <label className="text-center custom-checkbox"><input id={props.dataItem.id} name="check" type="checkbox" checked={this.state.selection.indexOf(props.dataItem.id) > -1} onChange={(e) => this.handleInputChange(props, e)} /><span></span> </label></td>) },
    { field: "favouriteName", title: "Address Label", filter: true, },
    { field: "type", title: "Currency", width: 150, filter: true, },
    { field: "toWalletAddress", title: "Address", filter: true, width: 180 },
    { field: "accountNumber", title: "Account Number", filter: true, width: 180 },
    { field: "beneficiaryAccountName", title: "Account Name", filter: true, width: 180 },
    { field: "beneficiaryAccountAddress", title: "Account Address", filter: true, width: 220 },
    { field: "routingNumber", title: "Routing Number", filter: true, width: 180 },
    { field: "swiftCode", title: "Swift Code", filter: true, },
    { field: "bankName", title: "Bank Name", filter: true, width: 180 },
    { field: "bankAddress", title: "Bank Address", filter: true, width: 220 },
    { field: "status", title: "Status", filter: true, width: 220 }
];
class AddressBook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            cryptoFiat: false,
            fiatDrawer:false,
            gridUrl: process.env.REACT_APP_GRID_API + "Transaction/TransactionHistoryk",
            gridUrlFiat: process.env.REACT_APP_GRID_API + "Addressbook/FavouriteAddressK",
        }
    }

    componentDidMount() {
        this.coinList()
    }

    coinList = async() =>{
        let  fromlist =  await getCoinList(this.props.userProfile?.id)
         if(fromlist.ok){
             this.setState({...this.state,fromCoinsList:fromlist.data,isLoading:false})
         }else{
             this.setState({...this.state,fromCoinsList:[],isLoading:false})
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
            cryptoaddressbook: <NewAddressBook />,
            selectcrypto:  <CryptoList coinType="swap" showSearch={true} showValues={true} titleField={'coin'} iconField={'coin'} selectedCoin={this.props.swapfrom?this.props.swapStore.coinDetailData:this.props.swapStore.coinReceiveDetailData} coinList={this.state.fromCoinsList} />
        }
        return stepcodes[config[this.props.addressBookReducer.stepcode]]
    }
    renderTitle = () => {
        const titles = {
            cryptoaddressbook: <span onClick={this.closeBuyDrawer} className="icon md lftarw-white c-pointer" />,
            selectcrypto: <span onClick={() => this.props.dispatch(setStep("step1"))} className="icon md lftarw-white c-pointer" />,
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
        const { cryptoFiat, gridUrl,gridUrlFiat } = this.state;
        return (
            <>
                <div className="box basic-info">
                    <Title className="basicinfo">Address Book</Title>
                    <Paragraph className="basic-decs mb-16">User customized addressbook</Paragraph>
                    <Radio.Group
                        defaultValue={1}
                        onChange={this.handleWithdrawToggle}
                        className="buysell-toggle">
                        <Translate content="withdrawCrypto" component={Radio.Button} value={1} />
                        <Translate content="withdrawFiat" component={Radio.Button} value={2} />
                    </Radio.Group>

                    {cryptoFiat ? <div className="mt-24">
                        <div className="d-flex justify-content">
                            <div><Title className="fs-26 text-white-30 fw-500">Withdraw Fiat</Title>
                                <Paragraph className="basic-decs fw-200">Basic Info, like your name and photo, that you use on Suissebase</Paragraph>
                            </div>
                            <div className="text-right ">
                                <Button className="c-pointer pop-btn ant-btn px-24" onClick={this.handleFiatAddress}> Add Address</Button>
                            </div>
                        </div>
                        <List url={gridUrlFiat}  columns={columnsFiat} />
                    </div> :
                        <div className="mt-24">
                            <div className="d-flex justify-content">
                                <div> <Title className="fs-26 text-white-30 fw-500">Withdraw Crypto</Title>
                                    <Paragraph className="basic-decs fw-200">Basic Info, like your name and photo, that you use on Suissebase</Paragraph>
                                </div>
                                <div className="text-right ">
                                    <Button className="c-pointer pop-btn ant-btn px-24" onClick={this. handleCryptoAddress}> Add Address</Button>
                                </div>
                            </div>
                            <List url={gridUrl}  columns={columnsCrypto} />
                        </div>}
                </div>
                <Drawer destroyOnClose={true}
                    title={[<div className="side-drawer-header">
                        {this.renderTitle()}
                        <div className="text-center fs-16">
                            <Paragraph className="mb-0 text-white-30 fw-600 text-upper">Add New Address</Paragraph>
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
                            <Paragraph className="mb-0 text-white-30 fw-600 text-upper">Add New Address</Paragraph>
                        </div>
                        <span onClick={this.closeBuyDrawer} className="icon md close-white c-pointer" />
                    </div>]}
                    placement="right"
                    closable={true}
                    visible={this.state.fiatDrawer}
                    closeIcon={null}
                    className="side-drawer"
                >
                <NewFiatAddress/>
                </Drawer>
            </>
        )
    }
}

export default connectStateProps(AddressBook);