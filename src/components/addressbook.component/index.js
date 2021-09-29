import React, { Component } from 'react';
import { Typography, Drawer, Button, Tabs, Radio, Tooltip, Modal, Alert,message } from 'antd'
import { setAddressStep,rejectCoin,setCoin,fetchUsersIdUpdate } from '../../reducers/addressBookReducer';
import Translate from 'react-translate-component';
import { processSteps as config } from './config';
import NewAddressBook from './newAddressBook';
import List from '../grid.component';
import NewFiatAddress from './addFiatAddressbook';
import { getCoinList, activeInactive } from './api';
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
            successMsg:false,
            obj: {
                "id": [],
                "tableName": "Member.FavouriteAddress",
                "modifiedBy": "",
                "status": [],
                type:''
            },
            memberId:this.props.userConfig.id,

            gridUrlCrypto: process.env.REACT_APP_GRID_API + "/AddressBook/FavouriteAddressCryptoK",
            gridUrlFiat: process.env.REACT_APP_GRID_API + "/AddressBook/FavouriteAddressFiatK",
        }
        this.gridFiatRef = React.createRef();
        this.gridCryptoRef = React.createRef();
    }
    columnsFiat = [
        { field: "", title: "", width: 50, customCell: (props) => (<td > <label className="text-center custom-checkbox"><input id={props.dataItem.id} name="isCheck" type="checkbox" checked={this.state.selection.indexOf(props.dataItem.id) > -1} onChange={(e) => this.handleInputChange(props, e)} /><span></span> </label></td>) },
        { field: "favouriteName", title: "Address Label", filter: true, width: 180 },
        { field: "toWalletAddress", title: "Address", filter: true, width: 380 },
        { field: "currency", title: "Currency", width: 150, filter: true, with: 150 },
        { field: "accountNumber", title: "Bank account number/IBAN" , filter: true, width: 220 },
        { field: "routingNumber", title: "BIC/SWIFT/Routing Number", filter: true, width: 180 },
        { field: "bankName", title: "Bank Name", filter: true, width: 200 },
        { field: "bankAddress", title: "Bank address line 1", filter: true, width: 250 },
        { field: "beneficiaryAccountName", title: "Recipient full name", filter: true, width: 200 },
        { field: "beneficiaryAccountAddress", title: "Recipient address line 1", filter: true, width: 250 },
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
        //this.setState({memberId:userConfig.id})
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
        if(this.state.cryptoFiat){
            this.gridFiatRef.current.refreshGrid();
        }
        else{
            this.gridCryptoRef.current.refreshGrid();
 
        }
    }
    handleSatatuSave = async () => {
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
                },successMsg:true })
                setTimeout(() => this.setState({ successMsg:false}), 1500)
                if(this.state.cryptoFiat){
                    this.gridFiatRef.current.refreshGrid();
                }
                else{
                    this.gridCryptoRef.current.refreshGrid();
         
                }
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
    setSuccessMsg=()=>{
        this.setState({ ...this.state,successMsg:false}) 
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
    editFiatAddress =() =>{
        debugger
        if (!this.state.isCheck) {
            this.setState({ alert: true })
            setTimeout(() => this.setState({ alert: false }), 2000)
        } else {
            const obj = this.state.selectedObj;
            let val = obj.id;
            this.props.rowSelectedData(val)
            console.log(val);
            this.setState({ ...this.state,fiatDrawer: true });
        }
    }
    handleCryptoAddress = () => {
        this.setState({ ...this.state,visible: true })
    }

    closeBuyDrawer = () => {
        this.setState({ ...this.state,visible: false, fiatDrawer: false })
        this.props.rejectCoinWallet();
        if(this.state.cryptoFiat){
            this.gridFiatRef.current.refreshGrid();
        }
        else{
            this.gridCryptoRef.current.refreshGrid();
 
        }
    }
    handleWithdrawToggle = e => {
        this.setState({
            ...this.state,cryptoFiat: e.target.value === 2
        })
    }
    renderContent = () => {
        const stepcodes = {
            cryptoaddressbook: <NewAddressBook onCancel={() => this.closeBuyDrawer() } />,
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
        const { cryptoFiat, gridUrlCrypto, gridUrlFiat,memberId } = this.state;
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
                                {/* <Button className="c-pointer pop-btn ant-btn px-24 mr-16" onClick={this.handleFiatAddress}> Add Address</Button>
                                <ul style={{ listStyle: 'none', paddingLeft: 0, marginBottom: 0 ,display:'flex'}}>
                                <li onClick={this.handleFiatAddress} className="mr-16">
                                        <Tooltip placement="topRight" title="Add">
                                            <Link className="icon md add-icon mr-0"
                                            ></Link>
                                        </Tooltip>
                                    </li>
                                {/* <li onClick={this.editFiatAddress} className="mr-16">
                                        <Tooltip placement="topRight" title="Edit">
                                            <Link className="icon md edit-icon mr-0"
                                            ></Link>
                                        </Tooltip>
                                    </li> */}
                                    {/* <li onClick={this.statusUpdate}>
                                        <Tooltip placement="topRight" title="Active/Inactive">
                                            <Link className="icon md status mr-0"
                                            ></Link>
                                        </Tooltip>
                                    </li>
                                </ul>  */}
                            
                        </div>
                        {this.state.alert &&
                            <div className="custom-alert" ><Alert
                          //  message="Warning"
                            description="Please select one record"
                            type="warning"
                            showIcon
                           // closable
                          />
                            </div>}
                            {this.state.successMsg  && <Alert type="success"
                             description={'Record ' + (this.state.selectedObj.status == 'Active' ? 'Inactivated' : 'Activated') + ' Successfully'}  showIcon />}
                        <List columns={this.columnsFiat} ref={this.gridFiatRef} key={gridUrlFiat} url={gridUrlFiat} additionalParams={{memberId:memberId}} />
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
                            description="Please select one record"
                            type="warning"
                            showIcon
                           // closable
                          />
                            </div>}
                            {this.state.successMsg  && <Alert type="success"
                             description={'Record ' + (this.state.selectedObj.status == 'Active' ? 'Inactivated' : 'Activated') + ' Successfully'}  showIcon />}
                            <List columns={this.columnsCrypto} key={gridUrlCrypto} ref={this.gridCryptoRef} url={gridUrlCrypto} additionalParams={{memberId:memberId}}/>
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
        },
        rowSelectedData: (selectedRowData) => {
            dispatch(fetchUsersIdUpdate(selectedRowData));
        },

    }
}
export default connect(connectStateToProps,connectDispatchToProps)(AddressBook);