import React, { Component } from 'react';
import { getPaymentsData,getBankData,getFileURL } from './api';
import { Typography, Button, Spin,message,Alert,Popover,Upload,Tooltip,Modal } from 'antd';
import Translate from 'react-translate-component';
import NumberFormat from 'react-number-format';
import { connect } from "react-redux";
import FilePreviewer from 'react-file-previewer';
const { Title, Text } = Typography;
const { Dragger } = Upload;
const EllipsisMiddle = ({ suffixCount, children }) => {
    const start = children?.slice(0, children.length - suffixCount).trim();
    const suffix = children?.slice(-suffixCount).trim();
    return (
        <Text className="mb-0 fs-14 docname c-pointer d-block file-label fs-12 text-yellow fw-400"
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
            this.setState({ ...this.state, errorMessage: response.data})
            this.useDivRef.current.scrollIntoView()
        }
    }
    moreInfoPopover = async (id, index) => {
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
    handleVisibleChange = (index) => {
        this.setState({ ...this.state, visible: false });
    }
    popOverContent = () => {
        const { moreBankInfo, tooltipLoad } = this.state;
        if (tooltipLoad) {
            return <Spin />
        } else {
            return (<div className='more-popover'>
                <Text className='lbl'>Address Label</Text>
                <Text className='val'>{moreBankInfo?.favouriteName}</Text>
                <Text className='lbl'>Recipient Full Name</Text>
                <Text className='val'>{moreBankInfo?.beneficiaryAccountName}</Text>
                <Text className='lbl'>Recipient Address</Text>
                <Text className='val'>{moreBankInfo?.beneficiaryAccountAddress}</Text>
                <Text className='lbl'>BIC/SWIFT/Routing Number</Text>
                <Text className='val'>{moreBankInfo?.routingNumber}</Text>
                <Text className='lbl'>Bank Address</Text>
                <Text className='val'>{moreBankInfo?.bankAddress}</Text>
            </div>)
        }
    }
    filePreview = async (file) => {
        let res = await getFileURL({ url: file.path });
        if (res.ok) {
          this.state.PreviewFilePath = file.path;
          this.setState({ ...this.state, previewModal: true, previewPath: res.data });
        }else {
                message.error(res.data);
            }
      }
      filePreviewPath() {
        console.log(this.state.previewPath)
        if (this.state.previewPath?.includes(".pdf")) {
          return this.state.previewPath;
        } else {
          return this.state.previewPath;
        }
      }
    backToPayments = () => {
        this.props.history.push('/payments')
    }
    render() {
        const total=(this.state.paymentsData.reduce((total,currentItem) =>  total = total + currentItem.amount , 0 ));
        const { paymentsData, loading } = this.state;
        return (
            <>
             <div ref={this.useDivRef}></div>
                <div className="main-container">
                {this.state.errorMessage != null && (
                            <Alert
                                description={this.state.errorMessage}
                                type="error"
                                closable
                                onClose={() => this.handleAlert()}
                            />
                        )}
                    <Title className="basicinfo mb-16"><Translate content="menu_payments" component={Text} className="basicinfo" /></Title>
                    <div className="box basic-info">
                        <table className='pay-grid view'>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Bank Name</th>
                                    <th>Bank account number</th>
                                    <th>State</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paymentsData?.map((item, idx) => {
                                    return (
                                        <>
                                          {paymentsData.length > 0? <> <tr key={idx}>
                                          <td>{item?.beneficiaryAccountName}</td>
                                                <td>
                                                    <div className='d-flex align-center justify-content'>
                                                   <span>
                                                    {item.bankname}
                                                    <Text
                                            size="small"
                                            className="file-label ml-8"
                                          >
                                                    {this.addressTypeNames(item.addressType)}
                                                    </Text>
                                              </span>
                                                            <Popover
                                                                    className='more-popover'
                                                                    content={this.popOverContent}
                                                                    trigger="click"
                                                                    visible={item.visible}
                                                                    placement='top'
                                                                    onVisibleChange={() => this.handleVisibleChange(idx)}
                                                                >
                                                                    <span className='icon md info c-pointer' onClick={() => this.moreInfoPopover(item.addressId, idx)} />
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
                                                     <div className='docdetails' onClick={() => this.filePreview(file)}>
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
                                    <td colSpan='4' className='text-center p-16'><Spin size='default' /></td></tr>}
                            </tbody>

                            <tfoot>
                            {paymentsData?.length > 0 &&
                                    <tr>
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
                        </div>
                    </div>
                </div>
                <Modal
            className="documentmodal-width"
            destroyOnClose={true}
            title="Preview"
            width={1000}
            visible={this.state.previewModal}
            closeIcon={<Tooltip title="Close"><span className="icon md close-white c-pointer" onClick={this.backToPayments} /></Tooltip>}
            footer={<>
              <Button  onClick={this.backToPayments} className="pop-btn px-36"
                         style={{ margin: "0 8px" }}>Close</Button>
              <Button  className="pop-btn px-36"
                         style={{ margin: "0 8px" }}onClick={() => window.open(this.state.previewPath, "_blank")}>Download</Button>
            </>}
          >
            {/* <FilePreviewer hideControls={true} file={{ url: this.state.previewPath ? this.filePreviewPath() : null, mimeType: this.state?.previewPath?.includes(".pdf") ? 'application/pdf' : "", }} /> */}
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