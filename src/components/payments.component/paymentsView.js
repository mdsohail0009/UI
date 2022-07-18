import React, { Component } from 'react';
import { getPaymentsData,getBankData,getFileURL } from './api';
import { Typography, Button, Spin,message,Alert,Popover,Tooltip,Modal } from 'antd';
import Translate from 'react-translate-component';
import NumberFormat from 'react-number-format';
import { connect } from "react-redux";
import FilePreviewer from 'react-file-previewer';
const { Title, Text } = Typography;
const EllipsisMiddle = ({ suffixCount, children }) => {
    const start = children?.slice(0, children.length - suffixCount).trim();
    const suffix = children?.slice(-suffixCount).trim();
    return (
        <Text className="mb-0 fs-14 docnames c-pointer d-block file-label fs-12 text-yellow fw-400"
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
            amount:0
        }
        this.useDivRef = React.createRef();
    }
    componentDidMount() {
        this.getPaymentsViewData();
    }
    addressTypeNames = (type) =>{
       const stepcodes = {
                  "1stparty" : "1st Party",
                  "3rdparty" : "3rd Party",
         }
         return stepcodes[type]
     }
    getPaymentsViewData = async () => {
        this.setState({ ...this.state, loading: true });
        let response = await getPaymentsData(this.props.match.params.id, this.props.userConfig?.userId,this.state.currency);
        if (response.ok) {
            this.setState({ ...this.state, paymentsData: response.data.paymentsDetails, loading: false });
        }else {
            message.destroy();
            this.useDivRef.current.scrollIntoView()
        }
    }
    moreInfoPopover = async (id) => {
        this.setState({ ...this.state, tooltipLoad: true });
        let response = await getBankData(id);
        if (response.ok) {
            this.setState({
                ...this.state, moreBankInfo: response.data, visible: true, tooltipLoad: false
            });
        } else {
            this.setState({ ...this.state, visible: false, tooltipLoad: false });
        }
    }
    handleVisibleChange = () => {
        this.setState({ ...this.state, visible: false });
    }
    popOverContent = () => {
        const { moreBankInfo, tooltipLoad } = this.state;
        if (tooltipLoad) {
            return <Spin />
        } else {
            return (<div className='more-popover'>
                <Text className='lbl'>Bank Label</Text>
                <Text className='val'>{moreBankInfo?.bankLabel}</Text>
                {/* <Text className='lbl'>Bank Address</Text>
                <Text className='val'>{moreBankInfo?.bankAddress}</Text> */}
                <Text className='lbl'>BIC/SWIFT/Routing Number</Text>
                <Text className='val'>{moreBankInfo?.routingNumber}</Text>
                {/* <Text className='lbl'>Recipient Address</Text>
                <Text className='val'>{moreBankInfo?.beneficiaryAccountAddress}</Text> */}
            </div>)
        }
    }
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
        this.props.history.push('/payments')
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
                    <Title className="basicinfo mb-16"><Translate content="menu_payments" component={Text} className="basicinfo" /></Title>
                    <div className="box basic-info responsive_table bg-none">
                        <table className='pay-grid view mb-view'>
                            <thead>
                                <tr>
                                <th className="doc-def">Favorite Name</th>
                                    <th className="doc-def" style={{width: "300px"}}>Bank Name</th>
                                    <th>Bank Account Number/IBAN</th>
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
                                                <td className="doc-def">
                                                    <div className='mb-flex-none visible-flex'>
                                                   <div className='bill-payment'>
                                                    <Tooltip title= {item.bankname}>
                                                        <div className='pay-docs'>{item.bankname}</div>
                                                    </Tooltip>
                                                            
                                                            </div>
                                                            <div className="d-flex align-center">
                                                            <Text
                                                                size="small"
                                                                className="file-label  ml-8"
                                                            >
                                                                {this.addressTypeNames(item.addressType)}
                                                            </Text>
                                                            <Popover
                                                                    className='more-popover'
                                                                    content={this.popOverContent}
                                                                    trigger="click"
                                                                    visible={item.visible}
                                                                    placement='top'
                                                                    onVisibleChange={() => this.handleVisibleChange()}
                                                                >
                                                                    <span className='icon md info c-pointer ml-4' onClick={() => this.moreInfoPopover(item.addressId)} />
                                                                </Popover>
                                                                </div>
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
                                                     <div className='docdetails'  style={{width:"80px"}} onClick={() => this.filePreview(file)}>
                                                     <Tooltip title={file.documentName}>
                                                     <EllipsisMiddle  suffixCount={4}>
                                                       {file.documentName}
                                                       </EllipsisMiddle>
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

                                {loading && <tr>
                                    <td colSpan='6' className='text-center p-16'><Spin size='default' /></td></tr>}
                            </tbody>

                            <tfoot>
                            {paymentsData?.length > 0 &&
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td >
                                            <span className='text-white fs-24 ml-8'> Total:</span>
                                        </td>
                                        <td><span className='text-white fs-24'> <NumberFormat className=" text-right"
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
                        {!loading &&
                        <div className="text-right mt-36">
                        {paymentsData?.length > 0 &&
                            <Button
                                className="pop-btn px-36"
                                style={{ margin: "0 8px" }}
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
              <Button  onClick={this.docPreviewClose} className="pop-btn px-36"
                         style={{ margin: "0 8px" }}>Close</Button>
              <Button  className="pop-btn px-36"
                         style={{ margin: "0 8px" }}onClick={() => window.open(this.state.previewPath, "_blank")}>Download</Button>
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