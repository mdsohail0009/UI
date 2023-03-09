import React, { Component } from 'react';
import { Drawer, Typography, Col, List,Empty, Image,Button,Modal,Tooltip,Upload,Alert} from 'antd';
import Translate from 'react-translate-component';
import { connect } from 'react-redux';
import Search from "antd/lib/input/Search";
import { fetchMemberWallets } from "../dashboard.component/api";
import {refreshTransaction,saveTransaction,confirmGetDetails,batchPaymentsLu} from './api'
import NumberFormat from "react-number-format";
import { Link,withRouter } from "react-router-dom";
import PaymentPreview from './paymentPreview';
import pending1 from '../../assets/images/pending1.png'
import Loader from '../../Shared/loader';
import { getVerificationFields } from "../onthego.transfer/verification.component/api"
import apicalls from '../../api/apiCalls';
const { Title, Paragraph, Text } = Typography
class AddBatchPayment extends Component {
    useDivRef = React.createRef()

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
        uploadErrorModal: false,
        errorMessage:null,
        showInprogressModal:false,
        file:{},
        transactionError:null,
        refreshBtnLoader:false,
        previewData:null,
        reefreshData:null,
        uploadUrl:process.env.REACT_APP_API_END_POINT + "/MassPayment/importfileUpload",
        worningMessage:null,
        loader:true,
        isVerificationEnable: false,
        isVarificationLoader: true,
        btnloader:false,
        batchPayementsWallet:[],
        fiatWallet: [],
    }

    componentDidMount() {
      this.batchPaymentLu()
          this.setState({ ...this.state, fiatWalletsLoading: true , errorMessage:null,isCoinsListHide:false });
          fetchMemberWallets(this.props?.userProfile?.id).then(res => {
            if (res.ok) {
                this.setState({ ...this.state, fiatWallets: res.data, paymentCoinsList: res.data, fiatWalletsLoading: false });
            } else {
                this.setState({ ...this.state, fiatWallets: [], paymentCoinsList: [], fiatWalletsLoading: false });
            }
          });
          this.verificationCheck();
      }

      batchPaymentLu = async () => { 
        let response=await batchPaymentsLu()
         if(response.ok){
          this.setState({...this.state,fiatWallet:response.data,batchPayementsWallet:response.data})
          console.log(response.data)
        }else{
           this.setState({ ...this.state,fiatWallet:[],batchPayementsWallet:[], errorMessage:(apicalls.isErrorDispaly(response)) });
          } }
      verificationCheck = async () => {
        this.setState({ ...this.state, isVarificationLoader: true,fiatWalletsLoading: true  })
        const verfResponse = await getVerificationFields();
        let minVerifications = 0;
        if (verfResponse.ok) {
          for (let verifMethod in verfResponse.data) {
          if (["isEmailVerification", "isPhoneVerified", "twoFactorEnabled", "isLiveVerification"].includes(verifMethod) && verfResponse.data[verifMethod] === true) {
            minVerifications = minVerifications + 1;
          }
          }
          if (minVerifications >= 2) {
          this.setState({ ...this.state, isVarificationLoader: false, isVerificationEnable: false })
            } else {
              this.setState({ ...this.state, isVarificationLoader: false, isVerificationEnable: true })
          }
        } else {
          this.setState({ ...this.state, isVarificationLoader: false, errorMessage: apicalls.isErrorDispaly(verfResponse) })
        }
        }
    handleSearch = ({ target: { value: val } }) => {
        if (val) {
            const fiatWallet = this.state.batchPayementsWallet?.filter(item => item?.currencyCode?.toLowerCase().includes(val.toLowerCase()));
            this.setState({ ...this.state, fiatWallet, searchVal: val });
        }
        else
            this.setState({ ...this.state, fiatWallet: this.state.batchPayementsWallet, searchVal: val });
    }
    
    closeDrawer = (isPreviewBack) => {

        this.setState({ ...this.state, paymentPreview: false,showModal:false,isCoinsListHide: false,uploadErrorModal: false,errorMessage:null,showInprogressModal:false});
        if (this.props.onClose) {
            this.props.onClose(isPreviewBack);
        }
    }
    uploadCancel = () => {
        this.setState({ ...this.state, isCoinsListHide: false})
        this.closeDrawer();
    }
    beforeUpload = (file) => {
        this.setState({...this.state,worningMessage:null})
        if (file.name.split('.').length > 2) {
           this.setState({...this.state,worningMessage:"File don't allow double extension"})
          return true;
        }
        
        let fileType = {
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":true,
            "application/vnd.ms-excel":true
        };
         let isFileName = file.name.split(".").length > 2 ? false : true;
        if (fileType[file.type] && isFileName) {
            this.setState({ ...this.state, isValidFile: true,errorMessage:null,worningMessage:null });
            return true;
        } else {
            this.setState({ ...this.state, isValidFile: false ,
                worningMessage: isFileName
                ? `Please upload .XLS or .XLSX file`
                : "File don't allow double extension"
            });
            return Upload.LIST_IGNORE;
        }
    };
  
handleUpload = ({ file }) => {
  this.setState({...this.state,})
    if (file.name.split('.').length > 2) {
      this.setState({ ...this.state, errorMessage: null, uploadLoader: false,});
    }
    else{
        this.setState({ ...this.state, errorMessage: null, uploadLoader: true,showInprogressModal:true });
      let obj = {
        "id":"00000000-0000-0000-0000-000000000000",
        "documentName": `${file.name}`,
        "isChecked": file.name === "" ? false : true,
        "remarks": `${file.size}`,
        "state": null,
        "status": false,
        "path": `${file.response}`,
        "size": `${file.size}`,
      }
      if(file?.response){
        this.setState({...this.state,previewData:file, uploadLoader: true})
        this.confirmPreview(obj)
      }
        
    }
   
  };
    selectWhitelist=()=>{
        this.props.history.push(`/payments/${this.state.selectedCurrency}`) 
    }
    handleCancel=()=>{
        this.setState({ ...this.state, showModal:false});
    }
    handleInprogressCancel=()=>{
        this.setState({ ...this.state, showInprogressModal:false,refreshBtnLoader:false});
    }
    confirmPreview = async (file) => {
      this.setState({...this.state,errorMessage:null})
     let saveObj={
          "id": file?.id,
          "walletCode": this.state?.selectedCurrency,
          "customerId": this.props?.userProfile?.id,
          "filepath": file?.path,
          "fileName": file?.documentName,
          "userCreated":this.props.userProfile?.userName
        }
      let response = await saveTransaction(saveObj)
      if(response.ok){
        this.setState({ ...this.state, paymentSummary: true,file:response.data, insufficientModal: false,showInprogressModal:true,uploadLoader:false,uploadErrorModal:false})
        if(response.data?.invalidTransactionCount >0){
            this.setState({...this.state,uploadErrorModal:true,file:response.data,showInprogressModal:false})
          }
    }
      else{
        this.setState({...this.state,insufficientModal:true,showInprogressModal:true,errorMessage:(apicalls.isErrorDispaly(response)),worningMessage:null, paymentSummary:false,uploadErrorModal:false})
      }
    
    }
    
goToGrid=()=>{
    this.closeDrawer();
    this.setState({...this.state,showInprogressModal:false,errorMessage:null,worningMessage:null,isCoinsListHide:false})

}
downLoadPreview=()=>{
    if(this.state?.selectedCurrency==="USD"){
    window.open('https://prdsbiostorageaccount.blob.core.windows.net/suissebaseio/USDBatchPayment.xlsx','_blank')
    }
    else{
    window.open('https://prdsbiostorageaccount.blob.core.windows.net/suissebaseio/EURBatchPayment.xlsx','_blank')
    }
}
    refreshTransaction=async()=>{
        if(this.state.file?.id){
        this.setState({...this.state,refreshBtnLoader:true,showModal:false,errorMessage:null})
        const res=await refreshTransaction(this.state.file?.id)
       if(res.ok){
        if(res.data.isFileUploded===false){
            this.setState({...this.state,refreshBtnLoader:false,reefreshData:res.data,showInprogressModal:true,showModal:false,errorMessage:null})
        }else if(res.data?.invalidTransactionCount >0){
            this.setState({...this.state,uploadErrorModal:true,file:res.data,showInprogressModal:false})
          }
        else{
            this.setState({...this.state,refreshBtnLoader:false,reefreshData:res.data,showInprogressModal:false,showModal:true,errorMessage:null})
        }
        }else{
            this.setState({...this.state,errorMessage:apicalls.isErrorDispaly(res),refreshBtnLoader:false,})
        }
}
    }
    handleNext=async()=>{
      this.setState({...this.state,btnloader:true})
        const res=await confirmGetDetails(this.state.reefreshData?.id)
        if(res.ok){
            this.setState({ ...this.state, showModal: false,errorMessage:null, uploadErrorModal: false, paymentPreview: true,worningMessage:null,btnloader:false })
        }
        else{
            this.setState({...this.state,errorMessage:apicalls.isErrorDispaly(res),btnloader:false})
        }
    }
    confirmTransaction=async(id)=>{
        const res=await confirmGetDetails(id) 
        if(res.ok){      
            this.setState({...this.state,refreshBtnLoader:false,showInprogressModal:true,showModal:true,errorMessage:null,worningMessage:null})
        }
    }
    render() {
        const { uploadLoader, refreshBtnLoader ,errorMessage,worningMessage,isVerificationEnable,btnloader} = this.state;
        return (
            <>
               <div ref={this.useDivRef}></div>
           <div className='send-address'>
           
        <Drawer destroyOnClose={true}
            title={[<div className="side-drawer-header">
                <span></span>
                <div className="text-center">
                {!this.state.isCoinsListHide && <> <Paragraph className='drawer-maintitle'>Batch Payment</Paragraph> </>}
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

            {!this.state.isCoinsListHide && <>
           
            {this.state.fiatWalletsLoading &&<Loader />}
          {!this.state.fiatWalletsLoading && !isVerificationEnable && (<>
            <div className="mt-8">
                <div
                    className='label-style'>Make Payments</div>
            </div>
            <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                <Search placeholder="Search Currency" value={this.state.searchVal} prefix={<span className="icon lg search-angle drawer-search" />} onChange={this.handleSearch} size="middle" bordered={false} className="cust-search"  />
            </Col>
            <List
                itemLayout="horizontal"
                dataSource={this.state.fiatWallet}
                className="crypto-list auto-scroll wallet-list"
                loading={this.state.fiatWalletsLoading}
                locale={{
                    emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={
                        <Translate content="No_data" />
                    } />
                }}
                renderItem={item => (
                    <List.Item className="drawer-list-fiat" onClick={
                        () => this.setState({ ...this.state, selectedCurrency: item.currencyCode, isCoinsListHide: true})}>
                    <Link>
                      <List.Item.Meta className='drawer-coin'
                        avatar={<Image preview={false} src={item.imagePath} />}

                        title={<div className="wallet-title">{item.currencyCode}</div>}
                      />
                       <><div className="text-right coin-typo">
                                        <NumberFormat value={item.avilable} className="drawer-list-font" displayType={'text'} thousandSeparator={true} prefix={item.currencyCode == 'USD' && '$' || item.currencyCode=='EUR' && '€'} renderText={(value, props) => <div {...props} >{value}</div>} />

                                    </div></>
                    </Link>
                  </List.Item>
                )}
              />
              </>)}
              </>}
              {isVerificationEnable && !this.state.fiatWalletsLoading && !this.state.isCoinsListHide&& (
                  <Alert 
                  message="Verification alert !"
                  description={<Text>Without verifications you can't send. Please select send verifications from <Link onClick={() => {
                      this.props.history.push("/userprofile/2");
                      if (this.props?.onClosePopup) {
                          this.props?.onClosePopup();
                      }
                  }}>security section</Link></Text>}
                  type="warning"
                  showIcon
                  closable={false}
              />
              )}
              {this.state.isCoinsListHide&& <>
                {worningMessage !== null && (
          <Alert type="error" description={worningMessage} showIcon />
               )}
              
              <div className='drawer-content'>
               
                <div className='text-center makepayment-section'>
            <Title className='drawer-maintitle'>Send {this.state.selectedCurrency} to Multiple Addresses</Title>
                                             <Upload
                                              type="dashed"
                                              size="large"
                                              className="ml-8 mt-12"
                                              shape="circle"
                                              style={{
                                                backgroundColor: "transparent",
                                              }}
                                              accept=".xlsx, .xls"
                                              multiple={false}
                                              action={this.state.uploadUrl}
                                              showUploadList={false}
                                              beforeUpload={(props) => this.beforeUpload(props)}
                                              onChange={(props) => this.handleUpload(props)}
                                              headers={{Authorization : `Bearer ${this.props.user.access_token}`}}
                                         
                                              >
                                              <Button className='pop-btn mt-24'>Upload Excel</Button>
                                </Upload>{" "}
            <Paragraph className='text-white download-excel'>To download the excel, <a className='fw-700' onClick={this.downLoadPreview} href> click here</a></Paragraph>
            <Button className='pop-btn px-36' onClick={this.selectWhitelist}>Select from Whitelisted Addresses</Button>
                                
            </div>
              </div>
              </>}
        </Drawer>
        <Modal  
                
                visible={this.state.showInprogressModal}
                title="upload excel"

                 destroyOnClose={true}
                 footer={[
                    <>
                        <div className="cust-pop-up-btn crypto-pop bill-pop">
                       
                          <Button
                            className="cust-cancel-btn cust-cancel-btn pay-cust-btn detail-popbtn paynow-btn-ml"
                            onClick={this.goToGrid}   
                          >
                            Exit
                          </Button>
                          <Button block
                            className="primary-btn pop-btn detail-popbtn"
                            onClick={this.refreshTransaction}  disabled={uploadLoader}
                            loading={refreshBtnLoader}
                          >
                            Refresh
                          </Button>
                        </div>
                    </>
                  ]}
         
               >
                   <>
                   {errorMessage !== null && (
          <Alert type="error" description={errorMessage} showIcon />
               )}
                   <div className='text-center pt-16'>
                   <img src={pending1} alt={"Processed"} />
                   <Paragraph className='text-white fs-18'>File is being processed please wait a while</Paragraph>
                   </div>
                   </>
           </Modal>
                <Modal  
                
                     visible={this.state.showModal}
                     title="upload success"
                      destroyOnClose={true}
                      closeIcon={
                        <Tooltip title="Close">
                            <span
                                className="icon md close-white c-pointer"
                                onClick={() => this.setState({ ...this.state, showModal: false, uploadErrorModal: false,btnloader:false })}
                            />
                        </Tooltip>
                    }
                    footer={ <Button className="primary-btn pop-btn"
                    style={{ width: 100, height: 50 }}
                   loading={btnloader}
                    onClick={this.handleNext}>Next</Button>}>
                        <>
                        {errorMessage !== null && (
                      <Alert type="error" description={errorMessage} showIcon />
                       )}
                     {errorMessage === null&&
                        <div className=' pt-16'>
                            <Paragraph className='text-white fs-18'>Document has been successfully uploaded</Paragraph>
                           
                        </div>
                     }
                        </>
                </Modal>
                <Modal
                    visible={this.state.uploadErrorModal}
                    title="Proceed with Transactions"
                    closeIcon={
                        <Tooltip title="Close">
                            <span
                                className="icon md close-white c-pointer"
                                onClick={() => this.setState({ ...this.state, showModal: false, uploadErrorModal: false })}
                            />
                        </Tooltip>
                    }
                    destroyOnClose={true}
                  
                    footer={null}
                    >
                    <>
                    
                        <div className='text-center pt-16'>
                            <Paragraph className='text-white fs-18'>
                            Excel has been uploaded.
                            We have detected {this.state.file?.invalidTransactionCount} errors out of
                            the <br/>{this.state.file?.transactionCount} transactions requested.</Paragraph>
                            {this.state?.file.validTransactionCount > 0 &&(
                           <div> <Button className="primary-btn pop-btn"  onClick={() => this.setState({ ...this.state, showModal: false, uploadErrorModal: false, paymentPreview: true })}>
                            Proceed with {" "} {this.state.file?.validTransactionCount} transactions
                            </Button></div>)}
                            <br></br>
                            <div><Button className="primary-btn pop-btn"  onClick={this.closeDrawer}>View and make changes</Button></div>
                        </div>
                    </>
                </Modal>
             
                {this.state.paymentPreview &&
                       <PaymentPreview
                       previewData={this.state?.previewData}
                        showDrawer={this.state.paymentPreview}
                            id={this.state.file?.id}
                        onClose={this.props.onClose}
                        fileData={this.state.file}
                        currency={this.state.selectedCurrency}
                    />
                       }
        </div>
        </>
        );
       
    }
}
const connectStateToProps = ({ sendReceive, userConfig,oidc }) => {
    return {sendReceive, userProfile: userConfig.userProfileInfo ,user: oidc.user}
}
const connectDispatchToProps = dispatch => {
    return {
        dispatch
    }
}

export default connect(connectStateToProps, connectDispatchToProps)(withRouter(AddBatchPayment));