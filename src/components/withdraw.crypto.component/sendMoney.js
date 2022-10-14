import React, { Component } from 'react';
import { Input,Drawer,Typography,Alert,Col,Row,Divider } from 'antd';
import { favouriteFiatAddress } from '../addressbook.component/api';
import { setAddress, setStep, setWithdrawcrypto } from '../../reducers/sendreceiveReducer';
import oops from '../../assets/images/oops.png'
import Loader from '../../Shared/loader';

import { connect } from 'react-redux';
import apiCalls from "../../api/apiCalls";
import { setAddressStep} from "../../reducers/addressBookReducer";
import CryptoTransfer from '../onthego.transfer/crypto.transfer';
import {fetchPayees, fetchPastPayees,confirmTransaction, validateAmount } from '../onthego.transfer/api';
import AddressCrypto from '../addressbook.component/addressCrypto';
import SelectCrypto from '../addressbook.component/selectCrypto';
import { processSteps as config } from "../addressbook.component/config";
import Translate from 'react-translate-component';
const { Paragraph, Text, Title } = Typography;
class SendMoney extends Component {
    
    state = {
        addressLu: [],
        filterObj: [],
        loading: false,
        showFuntransfer:false,
        pastPayees: [],
        payeesLoading: true,
        selectedPayee: {},
    }
    async componentDidMount() {
        this.getPayees();
       // this.getAddressLu();
        await this.trackevent()
    }

    getPayees= async () => {
        this.setState({ ...this.state, loading: true })
        let response = await apiCalls.getPayeeCryptoLu(this.props.userProfile.id, this.props?.sendReceive?.cryptoWithdraw?.selectedWallet?.coin);
            if (response.ok) {
                this.setState({ ...this.state, loading: false, payeesLoading: false, filterObj: response.data, payees: response.data });
            }
            else {
                this.setState({ ...this.state, loading: false, payeesLoading: false, filterObj: [] });
            }
       
        let res = await apiCalls.getPayeeCrypto(this.props.userProfile.id, this.props?.sendReceive?.cryptoWithdraw?.selectedWallet?.coin);
            if (res.ok) {
                this.setState({ ...this.state, loading: false, pastPayees: res.data });
            }
            else {
                this.setState({ ...this.state, loading: false,  pastPayees: [] });
            }
    }

    // validateAmt = async (step, values, loader) => {
    //     const obj = {
    //         CustomerId: this.props.userProfile?.id,
    //         amount: this.props?.sendReceive?.withdrawCryptoObj.totalValue,
    //         WalletCode: this.props?.sendReceive?.cryptoWithdraw?.selectedWallet?.coin
    //     }
    //     this.setState({ ...this.state, [loader]: true, errorMessage: null });
    //     const res = await validateAmount(obj);
    //     if (res.ok) {
    //         this.setState({ ...this.state, [loader]: false, errorMessage: null }, () => this.chnageStep(step, values));
    //     } else {
    //         this.setState({ ...this.state, [loader]: false, errorMessage: this.isErrorDispaly(res) })
    //     }

    // }
   
    trackevent = () => {
        apiCalls.trackEvent({
            "Type": 'User', "Action": 'Withdraw Crypto Address page view  ', "Username": this.props.userProfile.userName, "customerId": this.props.userProfile.id, "Feature": 'Withdraw Crypto', "Remarks": "Withdraw Crypto Address page view", "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Withdraw Crypto'
        });
    }
    // getAddressLu = async () => {
    //     this.setState({ ...this.state, loading: true })
    //     let customerId = this.props.userProfile.id;
    //     let coin_code = this.props.sendReceive?.cryptoWithdraw?.selectedWallet?.coin;
    //     let recAddress = await favouriteFiatAddress(customerId, 'crypto', coin_code)
    //     if (recAddress.ok) {
    //         this.setState({ ...this.state, addressLu: recAddress.data, loading: false, filterObj: recAddress.data });
    //     }
    //     else { this.setState({ ...this.state, loading: true }) }
    // }
    handleSearch = ({ target: { value: val } }) => {
        if (val) {
            const filterObj = this.state.payees.filter(item => item.name.toLowerCase().includes(val.toLowerCase()));
            this.setState({ ...this.state, filterObj, searchVal: val });
        }
        else
            this.setState({ ...this.state, filterObj: this.state.payees,searchVal: val });
    }
    handleSelectAdd = (item) => {
        this.props.SelectedAddress(item)
        let obj = this.props.sendReceive.withdrawCryptoObj;
        this.props.dispatch(setWithdrawcrypto({ ...obj, toWalletAddress: item.address }))
        this.props.changeStep('withdraw_crypto_selected');
    }
    handlePreview = (item) => {
        let obj = this.props.sendReceive.withdrawCryptoObj;
        this.props.dispatch(setWithdrawcrypto({ ...obj, toWalletAddress: item.walletAddress, addressBookId: item.id, network: item.network, isShowDeclaration: false }))
        this.props.changeStep('withdraw_crpto_summary');
    }

    chnageStep=() =>{
        this.setState({...this.state, visible: true, showFuntransfer: true, errorWorning: null });
    }
  
    selectCrypto = (type) => {
        const { id, coin } = this.props.sendReceive?.cryptoWithdraw?.selectedWallet
        //this.props.dispatch(setSubTitle(apiCalls.convertLocalLang('send_crypto_address')));
        let obj = {
            "customerId": this.props.userProfile.id,
            "customerWalletId": id,
            "walletCode": coin,
            "toWalletAddress": this.state.walletAddress,
            "reference": "",
            "description": "",
            "totalValue": this.state.CryptoAmnt,
            "tag": "",
            'amounttype': this.state.amountPercentageType
        }
        this.props.dispatch(setWithdrawcrypto(obj))
        this.setState({ ...this.state, loading: true })
        if (type == "ADDRESS") {
            this.props.changeStep('step8');
        } else {
            this.setState({
                ...this.state, showFuntransfer: true, errorWorning: null
                // , selection: [],
                // isCheck: false,
            });
        }
    }
    
    closeBuyDrawer = (obj) => {
        let showCrypto = false, showFiat = false;
        if (obj) {
            if (obj.isCrypto)
                showCrypto = !obj?.close;
            else
                showFiat = !obj?.close;
        };
        this.setState({ ...this.state, visible: showCrypto, fiatDrawer: showFiat });

    };

    renderContent = () => {
        const stepcodes = {
            cryptoaddressbook: (<>
                <AddressCrypto onCancel={(obj) => this.closeBuyDrawer(obj)} cryptoTab={1} />
            </>
            ),
            selectcrypto: <SelectCrypto />,
        };
        return stepcodes[config[this.props.addressBookReducer.stepcode]];
    };
    renderIcon = () => {
        const stepcodes = {
            cryptoaddressbook: (
                <span
                    onClick={() => this.closeBuyDrawer()}
                    className="icon md close-white c-pointer"
                />
            ),
            selectcrypto: <span />,
        };
        return stepcodes[config[this.props.addressBookReducer.stepcode]];
    };


    renderTitle = () => {
        const titles = {
            cryptoaddressbook: <span />,
            selectcrypto: (
                <span
                    onClick={this.backStep}
                    className="icon md lftarw-white c-pointer"
                />
            ),
        };
        return titles[config[this.props.addressBookReducer.stepcode]];
    };
    render() {
        const { filterObj, loading, pastPayees } = this.state;
        const { Search } = Input;
        return (
            <>
             {this.state.errorMessage && <Alert type="error" description={this.state.errorMessage} showIcon />}
             {/* <div className="mb-16">
                    <text Paragraph
                        className='fs-26 fw-600 text-white mb-16 mt-4 text-captz text-right'>Send Crypto</text>
                </div> */}
              <div className="mb-16" style={{textAlign:'center'}}>
                    <text Paragraph
                        className='fs-24 fw-600 text-white mb-16 mt-4 text-captz' >Who are you sending crypto to?</text>
                </div>
                <Col xs={24} md={24} lg={24} xl={24} xxl={24}>

                    {/* <Form.Item
                        name="lastName"
                        label={"Search for Payee"}
                        colon={false}
                    >
                        <Search
                            placeholder="Search for Payee" bordered={false} showSearch
                            className=" "
                            onChange={this.handleSearch}
                            value={this.state.searchVal}
                        />
                    </Form.Item> */}
                    {/* <Text className="fs-14 mb-8 text-white d-block fw-200">
									Search For Beneficiary *
								</Text> */}
                                
                    <Search placeholder="Search For Beneficiary" value={this.state.searchVal} addonAfter={<span className="icon md search-white" />} onChange={this.handleSearch} size="middle" bordered={false} className="text-center mt-12" />
                </Col>
                {this.state?.loading && <Loader />}
                {/* {(!this.state.loading) && <>
                    <Title className="fw-600 text-white px-4 mb-16 mt-16 text-captz" style={{ fontSize: '18px' }}>Address Book</Title>
                  

                    <ul style={{ listStyle: 'none', paddingLeft: 0, }} className="addCryptoList">
                            <><Row className="fund-border c-pointer ">
                                <Col xs={2} md={2} lg={2} xl={3} xxl={3} className=""><div class="fund-circle text-white">R</div></Col>
                                <Col xs={24} md={24} lg={24} xl={19} xxl={19} className="small-text-align">
                                    <label className="fs-16 fw-600 text-upper text-white-30 l-height-normal">
                                        <strong>beneficiary 100
                                        </strong>
                                    </label>
                                    <div><Text className="fs-16 text-white-30 m-0">USD acc ending in 4544</Text></div>
                                </Col>
                                <Col xs={24} md={24} lg={24} xl={2} xxl={2} className="mb-0 mt-8">
                                    <span class="icon md rarrow-white" onClick={() => this.handlePreview()}></span>
                                </Col>
                            </Row></>
                    </ul>

                    <Title className="fw-600 text-white px-4 mb-16 mt-16 text-captz" style={{ fontSize: '18px' }}>Past Recipients</Title>
                  
                    <ul style={{ listStyle: 'none', paddingLeft: 0, }} className="addCryptoList">
                            <><Row className="fund-border c-pointer ">
                            <Col xs={2} md={2} lg={2} xl={3} xxl={3} className=""><div class="fund-circle text-white">R</div></Col>
                            <Col xs={24} md={24} lg={24} xl={19} xxl={19} className="small-text-align">
                                <label className="fs-16 fw-600 text-upper text-white-30 l-height-normal">
                                    <strong>John's Metamask(0x...)
                                    </strong>
                                </label>
                                <div><Text className="fs-16 text-white-30 m-0">USDT(ERC-20)</Text></div>
                            </Col>
                            <Col xs={24} md={24} lg={24} xl={2} xxl={2} className="mb-0 mt-8">
                                <span class="icon md rarrow-white" onClick={() => this.handlePreview()}></span>
                            </Col>
                           
                        </Row>
                        <Row className="fund-border c-pointer ">
                        <Col xs={2} md={2} lg={2} xl={3} xxl={3} className=""><div class="fund-circle text-white">R</div></Col>
                            <Col xs={24} md={24} lg={24} xl={19} xxl={19} className="small-text-align">
                                <label className="fs-16 fw-600 text-upper text-white-30 l-height-normal">
                                    <strong>Smith Metamask(3b...)
                                    </strong>
                                </label>
                                <div><Text className="fs-16 text-white-30 m-0">USDT(ERC-20)</Text></div>
                            </Col>
                            <Col xs={24} md={24} lg={24} xl={2} xxl={2} className="mb-0 mt-8">
                                <span class="icon md rarrow-white" onClick={() => this.handlePreview()}></span>
                            </Col>
                            </Row></>
                      
                    </ul>
                </>} */}

                {(!this.state.loading) && <>
                    <Title className="fw-600 text-white px-4 mb-16 mt-16 text-captz" style={{ fontSize: '18px' }}>Address Book</Title>
                    <Divider className="cust-divide" />

                    <ul style={{ listStyle: 'none', paddingLeft: 0, }} className="addCryptoList">
                        {(filterObj.length > 0) && filterObj?.map((item, idx) =>
                            <>{<Row className="fund-border c-pointer " onClick={async () => {
                                if (!["myself", "1stparty", 'ownbusiness'].includes(item.addressType?.toLowerCase())) {
                                    this.setState({ ...this.state, addressOptions: { ...this.state.addressOptions, addressType: item.addressType }, selectedPayee: item, codeDetails: { ...this.state.codeDetails, ...item } }, () => {this.handlePreview(item)});
                                } else {
                                    this.setState({ ...this.state, loading: true, errorMessage: null, selectedPayee: item, codeDetails: { ...this.state.codeDetails, ...item } });
                                    const res = await apiCalls.confirmCryptoTransaction({ payeeId: item.id, reasonOfTransfer: "", amount: this.state.amount });
                                    if (!res.ok) {
                                        this.setState({ ...this.state, reviewDetails: res.data, loading: false }, () => {this.handlePreview(item)});
                                    } else {
                                        this.setState({ ...this.state, loading: false, errorMessage: res.data?.message || res.data || res.originalError.message });
                                    }
                                }
                            }}>
                                <Col xs={2} md={2} lg={2} xl={3} xxl={3} className=""><div class="fund-circle text-white">{item?.name?.charAt(0).toUpperCase()}</div></Col>
                                <Col xs={24} md={24} lg={24} xl={19} xxl={19} className="small-text-align">
                                    <label className="fs-16 fw-600 text-white l-height-normal text-captz">{item?.name} ({item.walletAddress?.length > 0 ? item.walletAddress.substring(0,4)+ `......`+ item.walletAddress.slice(-4):""})</label>
                                    {/* {item.accountNumber && <div><Text className="fs-14 text-white-30 m-0">{this.props?.sendReceive?.cryptoWithdraw?.selectedWallet?.coin} account ending with {item.accountNumber?.substr(item.accountNumber.length - 4)}</Text></div>} */}
                                    {item.walletAddress && <div><Text className="fs-14 text-white-30 m-0">{item.walletCode} ({item.network})</Text></div>}
                                </Col>
                                <Col xs={24} md={24} lg={24} xl={2} xxl={2} className="mb-0 mt-8">
                                    <span class="icon md rarrow-white"></span>
                                </Col>
                            </Row>}</>
                        )}
                        {(!filterObj.length > 0) && <div className="success-pop text-center" style={{ marginTop: '20px' }}>
                            <img src={oops} className="confirm-icon" style={{ marginBottom: '10px' }} alt="Confirm" />
                            <h1 className="fs-36 text-white-30 fw-200 mb-0" > {apiCalls.convertLocalLang('oops')}</h1>
                            <p className="fs-16 text-white-30 fw-200 mb-0"> {apiCalls.convertLocalLang('address_available')} </p>
                            <a onClick={() => this.chnageStep("newtransfer")}>Click here to make new transfer</a>
                        </div>}
                    </ul>

                    <Title className="fw-600 text-white px-4 mb-16 mt-16 text-captz" style={{ fontSize: '18px' }}>Past Recipients</Title>
                    <Divider className="cust-divide" />
                    <ul style={{ listStyle: 'none', paddingLeft: 0, }} className="addCryptoList">
                        {(pastPayees.length > 0) && pastPayees?.map((item, idx) =>
                            <Row className="fund-border c-pointer" onClick={async () => {
                                if (!["myself", "1stparty", "ownbusiness"].includes(item.addressType?.toLowerCase())) {
                                    this.setState({ ...this.state, addressOptions: { ...this.state.addressOptions, addressType: item.addressType }, selectedPayee: item }, () => {this.handlePreview(item)})
                                } else {
                                    this.setState({ ...this.state, loading: true, errorMessage: null, selectedPayee: item });
                                    const res = await apiCalls.confirmCryptoTransaction({ payeeId: item.id, reasonOfTransfer: "", amount: this.state.amount });
                                    if (res.ok) {
                                        this.setState({ ...this.state, reviewDetails: res.data, loading: false }, () => {this.handlePreview(item)});
                                    } else {
                                        this.setState({ ...this.state, loading: false, errorMessage: res.data?.message || res.data || res.originalError.message });
                                    }
                                }
                            }}>
                                <Col xs={2} md={2} lg={2} xl={3} xxl={3} className=""><div class="fund-circle text-white">{item?.name?.charAt(0).toUpperCase()}</div></Col>
                                <Col xs={24} md={24} lg={24} xl={19} xxl={19} className=" small-text-align">
                                    <label className="fs-16 fw-600 text-white l-height-normal text-captz">{item?.name}({item.walletAddress?.length > 0 ? item.walletAddress.substring(0,4)+ `......`+ item.walletAddress.slice(-4):""})</label>
                                    <div><Text className="fs-14 text-white-30 m-0">{item?.walletCode} ({item.network})</Text></div>
                                </Col>
                                <Col xs={24} md={24} lg={24} xl={2} xxl={2} className="mb-0 mt-8">
                                    <span class="icon md rarrow-white"></span>
                                </Col>
                            </Row>

                        )}
                        {(!pastPayees.length > 0) && <div className="success-pop text-center" style={{ marginTop: '20px' }}>
                            <img src={oops} className="confirm-icon" style={{ marginBottom: '10px' }} alt="Confirm" />
                            <h1 className="fs-36 text-white-30 fw-200 mb-0" > {apiCalls.convertLocalLang('oops')}</h1>
                            <p className="fs-16 text-white-30 fw-200 mb-0"> {'You have no past recipients'} </p>
                        </div>}
                    </ul>
                </>}
                
                <Drawer
                        destroyOnClose={true}
                        title={[
                            <div className="side-drawer-header">
                                {this.renderTitle()}
                                <div className="text-center fs-16">
                                    <Translate
                                        className="text-white-30 fw-600 text-upper mb-4"
                                        content={
                                            this.props.addressBookReducer.stepTitles[
                                            config[this.props.addressBookReducer.stepcode]
                                            ]
                                        }
                                        component={Paragraph}
                                    />
                                    <Translate
                                        className="text-white-50 mb-0 fw-300 fs-14 swap-subtitlte"
                                        content={
                                            this.props.addressBookReducer.stepSubTitles[
                                            config[this.props.addressBookReducer.stepcode]
                                            ]
                                        }
                                        component={Paragraph}
                                    />
                                </div>
                                {this.renderIcon()}
                            </div>,
                        ]}
                        placement="right"
                        closable={true}
                        visible={this.state.visible}
                        closeIcon={null}
                        className="side-drawer w-50p">
                        {this.renderContent()}
                    </Drawer>
             </>    
        );
    }
}
const connectStateToProps = ({ sendReceive, userConfig,addressBookReducer }) => {
    return { addressBookReducer,sendReceive, userProfile: userConfig.userProfileInfo }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setAddressStep(stepcode))
        },
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        },
        SelectedAddress: (addressObj) => {
            dispatch(setAddress(addressObj));
        },
       
        dispatch
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(SendMoney);
