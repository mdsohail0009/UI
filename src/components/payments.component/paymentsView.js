import React, { Component } from 'react';
import { getPaymentsData,getBankData,getFileURL } from './api';
import { Typography, Button, Spin,message,Popover,Tooltip,Modal } from 'antd';
import Translate from 'react-translate-component';
import NumberFormat from 'react-number-format';
import { connect } from "react-redux";
import FilePreviewer from 'react-file-previewer';
const { Title, Text } = Typography;
const EllipsisMiddle = ({ suffixCount, children }) => {
    const start = children?.slice(0, children.length - suffixCount).trim();
    const suffix = children?.slice(-suffixCount).trim();
    return (
        <Text className="docnames c-pointer d-block file-label "
            style={{ maxWidth: '100% !important' }} ellipsis={{ suffix }}>
            {start}
        </Text>
    );
  };
class PaymentsView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            paymentsData: [],
            currency:'USD',
            loading: false,
            amount:0,
            isloading:false,
        }
        this.useDivRef = React.createRef();
    }
    componentDidMount() {
        this.getPaymentsViewData();
    }
    addressTypeNames = (type) => {
      const stepcodes = {
        "ownbusiness": "My Company",
        "individuals": "Individuals",
        "otherbusiness": "Other Business",
        "myself": "My Self"
      };
      return stepcodes[type];
    };
    getPaymentsViewData = async () => {
        this.setState({ ...this.state, loading: true });
        let response = await getPaymentsData(this.props.match.params.id,this.props.match.params.currency);
        if (response.ok) {
            this.setState({ ...this.state, paymentsData: response.data.paymentsDetails, loading: false });
        }else {
            message.destroy();
            this.useDivRef.current.scrollIntoView()
        }
    }
    moreInfoPopover = async (id) => {
        this.setState({...this.state,isloading:true});
        let response = await getBankData(id);
        if (response.ok) {
          this.setState({
            ...this.state,
            moreBankInfo: response.data,
            visible: true,
            isloading:true
          });
        } else {
          this.setState({ ...this.state, visible: false, isloading: false });
        }
      };
     handleVisibleChange = () => {
    this.setState({ ...this.state, visible: false });
    if(this.state.visible=== false){
      this.setState({ ...this.state, isloading: false });
    }
  };
  popOverContent = () => {
    const { moreBankInfo,isloading } = this.state;
    if (!isloading) {
      return <Spin />;
    } else {
      return (
        <div className="more-popover payments-card kpi-List">
        <div className='popover-mb-12'>
        <label className="kpi-label">BIC/SWIFT/ABA Routing Code</label>
        <span className="kpi-val d-block">{moreBankInfo?.routingNumber}</span></div>
         {(moreBankInfo?.transferType!=="internationalIBAN" && moreBankInfo?.transferType!=="sepa")&& <>
         <div className='popover-mb-12'> <label className="basicinfo">Bank Address</label>
        <label className="kpi-label d-block">Address Line 1</label>
        <span className="kpi-val d-block">{moreBankInfo?.bankAddress1}</span></div>
        {moreBankInfo?.bankAddress2!==null &&<>
          <div className='popover-mb-12'>  <label className="kpi-label">Address Line 2</label>
        <span className="kpi-val d-block">{moreBankInfo?.bankAddress2}</span></div>
        </>}
        </>}
        {(moreBankInfo?.transferType==="sepa" || moreBankInfo?.transferType==="internationalIBAN" ) && 
        <>
        <div className='popover-mb-12'><label className="kpi-label">Bank Address</label>
         <span className="kpi-val d-block">{moreBankInfo?.bankBranch}{moreBankInfo?.bankBranch && ","}
          {moreBankInfo?.country} { moreBankInfo?.country && ","}{moreBankInfo?.state}{moreBankInfo?.state && ","}{moreBankInfo?.city}{moreBankInfo?.city && ","}{moreBankInfo?.postalCode}</span> </div></>}
         </div>
      );
    }
  };
    filePreview = async (file) => {
        let res = await getFileURL({ url: file.path });
        if (res.ok) {
          this.setState({ ...this.state, previewModal: true, previewPath: res.data });
        }else {
                message.error(res.data);
            }
      }
      filePreviewPath() {
        return this.state.previewPath;
    }
    backToPayments = () => {
      this.props.history.push(`/payments/${"All"}`);

    }
    docPreviewClose = () => {
        this.setState({ ...this.state, previewModal: false, previewPath: null })
      }
    render() {
        const total=(this.state.paymentsData.reduce((totalVal,currentItem) =>  totalVal + currentItem.amount , 0 ));
        const { paymentsData, loading } = this.state;
        return (
            <>
             <div ref={this.useDivRef}></div>
                <div className="main-container">
                    <Title className="basicinfo"><span onClick={() => this.props.history?.push(`/payments/All`)} className='icon md c-pointer back backarrow-mr'/><Translate content="menu_payments" component={Text} className="basicinfo" /></Title>
                    <div className='transaction-custom-table'>
                    <div className="responsive_table db-ts-grid">
                        <table className='pay-grid view mb-view'>
                            <thead>
                                <tr>
                                <th className="doc-def">Whitelist Name</th>
                                    <th className="doc-def" style={{width: "410px"}}>Bank Name</th>
                                    <th className="doc-def" style={{width: "300px"}}>Bank Account Number/IBAN</th>
                                    <th>State</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paymentsData?.map((item, idx) => {
                                    return (
                                        <>
                                          {paymentsData.length > 0? <> <tr key={idx}>
                                          <td className="doc-def">{item?.beneficiaryAccountName}</td>
                                                <td className="doc-def" >
                                      <div className="d-flex align-center">
                                        <span className='pay-docs bill-bank'>
                                      <Tooltip title={item.bankname}>
                                            <span className='pay-docs'>{item.bankname}</span>
                                          </Tooltip></span>
                                        <span>
                                          
                                          <Text
                                            size="small"
                                            className="file-label add-lbl doc-def"
                                          >
                                            {this.addressTypeNames(item.addressType)}{" "}
                                          </Text>

                                        </span>
                                        <Popover
                                          className="more-popover"
                                          content={this.popOverContent}
                                          trigger="click"
                                          visible={item.visible}
                                          placement="top"
                                          onVisibleChange={() =>
                                            this.handleVisibleChange()
                                          }
                                        >
                                          <span
                                            className="icon md info c-pointer ml-4"
                                            onClick={() =>
                                              this.moreInfoPopover(
                                                item.addressId,
                                              )
                                            }
                                          />
                                        </Popover>
                                      </div>
                                    </td>
                                                <td>{item.accountnumber}</td>
                                                <td>{item.state}</td>
                                                <td>
                                                    <NumberFormat
                                                        value={item.amount}
                                                        thousandSeparator={true}
                                                        displayType={'text'}
                                                        renderText={value => value}
                                                    />
                                                    <br/>
                                                    {item.documents?.details.map((file) =>
                                                   <>
                                                   {file.documentName !== null && (
                                                     <div className='docdetails pay-docdetails'  onClick={() => this.filePreview(file)}>
                                                                                                        <Tooltip title={file.documentName}>
                                                      {file.documentName?.split(".")[0].length>4&&<EllipsisMiddle>
                                                        {file.documentName.slice(0,4) + "..." +file.documentName.split(".")[1]}
                                                      </EllipsisMiddle>}
                                                      {file.documentName?.split(".")[0].length<=4&&<EllipsisMiddle>
                                                        {file.documentName}
                                                      </EllipsisMiddle>}
                                                    </Tooltip>
                                                     </div>
                                                   )}
                                                 </>
                                                                 )} 
                                                </td>
                                            </tr>
                                            </>
                                        :"No bank details available."}</>
                                    )
                                })}
                                {paymentsData?.length == 0 && !loading&&
                                <tr>
                                <td
                                  colSpan="8"
                                  className="p-16 text-center"
                                  style={{ width: 300 }}
                                >
                                 No bank details available
                                </td>
                              </tr>
                                  }
                                {loading && <tr>
                                    <td colSpan='6' className='text-center p-16'><Spin size='default' /></td></tr>}
                            </tbody>

                            <tfoot>
                            {paymentsData?.length > 0 &&
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td className='total-align'>
                                            <span className=''> Total:</span>
                                        </td>
                                        <td className='total-align font-size-align'><span className=''> <NumberFormat className=" text-right"
                                            customInput={Text} thousandSeparator={true} prefix={""}
                                            decimalScale={2}
                                            allowNegative={false}
                                            maxlength={13}
                                            style={{ height: 44 }}
                                        >
                                            <span className='text-white '>
                                            {parseFloat(total).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{" "}
                                                </span>
                                        </NumberFormat></span></td>
                                    </tr>
                                }
                            </tfoot>
                        </table>
                        </div>
                        </div>
                        {!loading &&
                        <div className="text-right cust-pop-up-btn crypto-pop">
                        {paymentsData?.length > 0 &&
                            <Button
                            block
                                className="detail-popbtn cust-cancel-btn"
                                
                                onClick={this.backToPayments}
                            >
                                Cancel
                            </Button>
                                }
                        </div>}
                   
                </div>
                <Modal
            className="documentmodal-width"
            destroyOnClose={true}
            title="Preview"
            width={1000}
            visible={this.state.previewModal}
            closeIcon={<Tooltip title="Close"><span className="icon md close-white c-pointer" onClick={this.docPreviewClose} /></Tooltip>}
            footer={<>
             <div className="cust-pop-up-btn crypto-pop">
             
             <Button  onClick={this.docPreviewClose} className="cust-cancel-btn cust-cancel-btn pay-cust-btn detail-popbtn paynow-btn-ml"
                        >Close</Button>
                         <Button  className="primary-btn pop-btn detail-popbtn paynow-btn-ml" 
                       onClick={() => window.open(this.state.previewPath, "_blank")}>Download</Button>
                       
                        </div>
            </>}
          >
            <FilePreviewer
				hideControls={true}
				file={{
					url: this.state.previewPath ? this.filePreviewPath() : null,
					mimeType: this.state.previewPath?.includes(".pdf") ? "application/pdf" : ""
				}}
			/>
          </Modal>
            </>
        )
    }
}

const connectStateToProps = ({ userConfig }) => {
    return { userConfig: userConfig.userProfileInfo };
};
export default connect(connectStateToProps, null)(PaymentsView);