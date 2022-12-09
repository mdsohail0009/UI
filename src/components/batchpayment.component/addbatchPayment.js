import React, { Component } from 'react';
import { Drawer, Typography, Col, List,Empty, Image,Button,Modal,Tooltip,Upload, message} from 'antd';
import Translate from 'react-translate-component';
import { connect } from 'react-redux';
import Search from "antd/lib/input/Search";
import { fetchMemberWallets } from "../dashboard.component/api";
import NumberFormat from "react-number-format";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import PaymentPreview from './paymentPreview';
import pending from '../../assets/images/pending.png'
import { store } from "../../store";
import apiCalls from "../../api/apiCalls";
import CryptoJS from "crypto-js";
const { Title,Paragraph } = Typography
class AddBatchPayment extends Component {
    state = {
        selectedCurrency : "USD",
        fiatWalletsLoading: false,
        fiatWallets: [],
        paymentCoinsList: [],
        searchVal: "",
        isCoinsListHide: false,
        showModal: false,
        paymentPreview: false,
        isValidFile: true,
        uploadLoader: false,

    }

    componentDidMount() {
          this.setState({ ...this.state, fiatWalletsLoading: true });
          fetchMemberWallets(this.props?.userProfile?.id).then(res => {
            if (res.ok) {
                this.setState({ ...this.state, fiatWallets: res.data, paymentCoinsList: res.data, fiatWalletsLoading: false });
            } else {
                this.setState({ ...this.state, fiatWallets: [], paymentCoinsList: [], fiatWalletsLoading: false });
            }
          });
      }

    handleSearch = ({ target: { value: val } }) => {
        if (val) {
            const fiatWallets = this.state.paymentCoinsList?.filter(item => item.walletCode.toLowerCase().includes(val.toLowerCase()));
            this.setState({ ...this.state, fiatWallets, searchVal: val });
        }
        else
            this.setState({ ...this.state, fiatWallets: this.state.paymentCoinsList, searchVal: val });
    }
    
    closeDrawer = (isPreviewBack) => {
        this.setState({ ...this.state, paymentPreview: false,showModal:false,isCoinsListHide: false});
        if (this.props.onClose) {
            this.props.onClose(isPreviewBack);
        }
    }
    uploadCancel = () => {
        this.setState({ ...this.state, isCoinsListHide: false});
    }
    _encrypt(msg, key) {
        msg = typeof msg === "object" ? JSON.stringify(msg) : msg;
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
        return salt.toString() + iv.toString() + encrypted.toString();
    }
    beforeUpload = (file) => {
        let fileType = {
            "application/csv": true,
            "application/vnd.ms-excel": true,
            "text/csv": true
        };
        if (fileType[file.type]) {
            this.setState({ ...this.state, isValidFile: true });
            return true;
        } else {
            message.error({
                content: `File is not allowed. You can upload only csv files`,
                className: "custom-msg"
            });
            this.setState({ ...this.state, isValidFile: false });
            return Upload.LIST_IGNORE;
        }
    };
    // isDocExist(lstObj, id) {
    //     const lst = lstObj.filter((obj) => {
    //         return obj.docunetDetailId === id;
    //     });
    //     return lst[0];
    // }
    handleUpload = async ({ file }, doc) => {
        this.setState({
            ...this.state,
            uploadLoader: true,
            errorMessage: null,
            docReplyObjs: [],
            //showModal: true
        });
        // if (file.status !== "done" && this.state.isValidFile) {
        //     let replyObjs = [...this.state.docReplyObjs];
        //     let item = this.isDocExist(replyObjs, doc?.id);
        //     let obj;
        //     if (item) {
        //         obj = item;
        //         const ObjPath = (function () {
        //             if (obj.path === "string") {
        //                 return JSON.parse(obj.path);
        //             } else {
        //                 return obj.path ? obj.path : [];
        //             }
        //         })();
        //         obj.path = obj.path && typeof ObjPath;
        //         obj.path.push({
        //             filename: file.name,
        //             path: file.response,
        //             size: file.size
        //         });
        //         replyObjs = this.uopdateReplyObj(obj, replyObjs);
        //     } else {
        //         obj = this.messageObject(doc?.id);
        //         obj.path.push({
        //             filename: file.name,
        //             path: file.response,
        //             size: file.size
        //         });
        //         replyObjs.push(obj);
        //     }
        //     this.setState({
        //         ...this.state,
        //         uploadLoader: false,
        //         docReplyObjs: replyObjs
        //     });
        // } else if (file.status === "error") {
        //     message.error({ content: `${file.response}`, className: "custom-msg" });
        //     this.setState({ ...this.state, uploadLoader: false });
        // } 
       if (!this.state.isValidFile) {
            this.setState({
                ...this.state,
                uploadLoader: false,
                showModal: false
            });
        }
        else {
            this.setState({
                ...this.state,
                showModal: true
            });
        }
        this.setState({
            ...this.state,
            uploadLoader: false,
            path: file.status === "done" ? file.response : null
        });
    };
    // uploadExcel=()=>{
    //     this.setState({ ...this.state, showModal:true});
    //         const _currentScreen = window.location.pathname.split("/")[1];
    //         const {
    //             oidc: { user },
    //             userConfig: { userProfileInfo },
    //             //permissions: { currentScreen }
    //         } = store.getState();
    //         const Authorization = `Bearer ${user.access_token}`;
    //         const Authentication = this._encrypt(
    //             `{CustomerId:"${userProfileInfo?.id}",Action:"view", PermissionKey:"${this.props.pKey || _currentScreen 
    //             }"}`,
    //             userProfileInfo.sk
    //         );
    //         this.setState(
    //             {
    //                 ...this.state,
    //                 modal: true,
    //                 headers: {
    //                     Authorization: Authorization,
    //                     AuthInformation: Authentication
    //                 }
    //             },
    //             () => {
    //                 this.setState({
    //                     ...this.state,
    //                     stateLoading: true,
    //                     headers: {
    //                         Authorization: Authorization,
    //                         AuthInformation: Authentication
    //                     }
    //                 });
    //                 setTimeout(
    //                     () =>
    //                         this.setState({
    //                             ...this.state,
    //                             stateLoading: false,
    //                             headers: {
    //                                 Authorization: Authorization,
    //                                 AuthInformation: Authentication
    //                             }
    //                         }),
    //                     1000
    //                 );
    
    //                 // setTimeout(
    //                 //     () =>
    //                 //         this.formref.current.setFieldsValue({
    //                 //             ...this.state
    //                 //         }),
    //                 //     1000
    //                 // );
    //             }
    //         );
    //         apiCalls.trackEvent({
    //             Action: "Upload MassPayment page ",
    //             Feature: "Upload MassPayments",
    //             Remarks: "Upload MassPayment page ",
    //             FullFeatureName: "Upload MassPayments ",
    //             userName: this.props.userProfile.userName,
    //             id: this.props.userProfile.id
    //         });
        
    // }
    selectWhitelist=()=>{
        this.props.history.push(`/payments/${this.state.selectedCurrency}`) 
    }
    handleCancel=()=>{
        this.setState({ ...this.state, showModal:false});
    }

    render() {
        const { gridUrl, param, headers } = this.state;
        return (
           <div className='send-address'>
        <Drawer destroyOnClose={true}
            title={[<div className="side-drawer-header">
                <span></span>
                <div className="text-center">
                {!this.state.isCoinsListHide && <> <div className='text-white fs-24 fw-500'>Batch Payment</div> </>}
                </div>
                {!this.state.isCoinsListHide &&<span onClick={this.closeDrawer} className="icon md close-white c-pointer" />}
                {this.state.isCoinsListHide &&<span onClick={this.uploadCancel} className="icon md close-white c-pointer" />}
               
            </div>]}
            
            placement="right"
            closable={true}
            visible={this.props.showDrawer}
            closeIcon={null}
            className="side-drawer w-50p"
        >
            { !this.state.isCoinsListHide && <>
            <div className="mt-8">
                <Title
                    className='sub-heading code-lbl'>Make Payments</Title>
            </div>
            <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                <Search placeholder="Search Currency" value={this.state.searchVal} addonAfter={<span className="icon md search-white" />} onChange={this.handleSearch} size="middle" bordered={false} className="text-center mb-16" />
            </Col>
            <List
                itemLayout="horizontal"
                dataSource={this.state.fiatWallets}
                className="crypto-list auto-scroll wallet-list"
                loading={this.state.fiatWalletsLoading}
                locale={{
                    emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={
                        <Translate content="No_data" />
                    } />
                }}
                renderItem={item => (
                    <List.Item onClick={
                        () => this.setState({ ...this.state, selectedCurrency: item.walletCode, isCoinsListHide: true }, () => { })}>
                    <Link>
                      <List.Item.Meta
                        avatar={<Image preview={false} src={item.imagePath} />}

                        title={<div className="wallet-title">{item.walletCode}</div>}
                      />
                       <><div className="text-right coin-typo">
                                        <NumberFormat value={item.amount} className="text-white-30 fw-600" displayType={'text'} thousandSeparator={true} prefix={item.walletCode == 'USD' ? '$' : '€'} renderText={(value, props) => <div {...props} >{value}</div>} />

                                    </div></>
                    </Link>
                  </List.Item>
                )}
              />
              </>}
              {this.state.isCoinsListHide && <>
              <div className='drawer-content'>
               
                <div className='text-center makepayment-section'>
            <Title className='text-white fs-24 fw-500'>Send {this.state.selectedCurrency} to Multiple Address</Title>
            {/* <Button className='pop-btn mt-24'onClick={this.uploadExcel}>Upload Excel</Button> */}
            <Upload
                                    accept=".xlsx, .xls, .csv"
                                    multiple="false"
                                    onChange={(props) => this.handleUpload(props)}
                                    beforeUpload={(props) => {
                                        this.beforeUpload(props);
                                    }}
                                    showUploadList={false}
                                    action={
                                        process.env.REACT_APP_API_END_POINT +
                                        "/api/v1/ImportExcel/UploadAttachedFile"
                                    }
                                    headers={headers}
                                >
                                       <Button className='pop-btn mt-24'>Upload Excel</Button>
                                </Upload>{" "}
            <Paragraph className='text-white-30'>To download the excel, <a className='fw-700'> click here</a></Paragraph>
            <Button className='pop-btn px-36' onClick={this.selectWhitelist}>Select from Whitelisted Addresses</Button>
                                
            </div>
              </div>
              </>}
        </Drawer>
                <Modal
                     visible={this.state.showModal}
                     title="upload success"
                     closeIcon={
                        <Tooltip title="Close">
                          <span
                            className="icon md close-white c-pointer"
                            onClick={() => this.handleCancel()}
                          />
                        </Tooltip>
                      }
                      destroyOnClose={true}
                   
                    footer={ <Button className="primary-btn pop-btn"
                    style={{ width: 100, height: 50 }}
                    onClick={() => this.setState({ ...this.state, showModal: false, paymentPreview: true }, () => { })}>Next</Button>}>
                        <>
                        <div className='text-center pt-16'>
                            <Paragraph className='text-white fs-18'>Document has been successfully uploaded</Paragraph>
                           
                        </div>
                        </>
                </Modal>
                {this.state.paymentPreview &&
                       <PaymentPreview
                        showDrawer={this.state.paymentPreview}
                        onClose={() => {
                            this.closeDrawer("true");
                        }}
                    />
                       }
        </div>

        );
       
    }
}
const connectStateToProps = ({ sendReceive, userConfig }) => {
    return {sendReceive, userProfile: userConfig.userProfileInfo }
}
const connectDispatchToProps = dispatch => {
    return {
        dispatch
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(withRouter(AddBatchPayment));