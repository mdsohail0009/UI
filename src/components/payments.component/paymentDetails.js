import React, { Component, createRef } from 'react';
import { Typography, Button, Form, Select, message, Input, Alert, Popover, Spin, Collapse, Badge,Upload } from 'antd';
import Translate from 'react-translate-component';
import { getCurrencyLu, getPaymentsData, savePayments, getBankData,creatPayment,updatePayments } from './api'
import NumberFormat from 'react-number-format';
import { connect } from "react-redux";
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;
const FormItem = Form.Item
const { Title, Text } = Typography;
const { Panel } = Collapse;
const { Dragger } = Upload;
const EllipsisMiddle = ({ suffixCount, children }) => {
    const start = children?.slice(0, children.length - suffixCount).trim();
    const suffix = children?.slice(-suffixCount).trim();
    return (
        <Text className="mb-0 fs-14 docname c-pointer d-block" style={{ maxWidth: '100%' }} ellipsis={{ suffix }}>
            {start}
        </Text>
    );
};
class PaymentDetails extends Component {
    formRef = createRef();
    constructor(props) {
        super(props);
        this.state = {
            currency: [],
            Currency: "USD",
            paymentsData: [],
            paymentSavedata: [],
            btnDisabled: false,
            disabled: false,
            errorMessage: null,
            visible: false,
            moreBankInfo: {},
            loading: false,
            tooltipLoad: false,
            uploadLoader: false,
            isValidFile: true,
            paymentsDocDetails:[],
            fileDetails: [],
            paymentDoc:{},
            payData:[],
            amount:0,
        }
        this.gridRef = React.createRef();
        this.useDivRef = React.createRef();
    }
    backToPayments = () => {
        this.props.history.push('/payments')
    }
    componentDidMount() {
        this.getCurrencyLookup()
        this.getPayments()
        this.useDivRef.current.scrollIntoView()
    }
    handleAlert = () => {
        this.setState({ ...this.state, errorMessage: null })
    }
    handleCurrencyChange = async (val, props) => {
        this.setState({ ...this.state, Currency: val, paymentsData: [] })
        if (this.state.Currency = val) {
            let response = await getPaymentsData("00000000-0000-0000-0000-000000000000", this.props.userConfig?.id, this.state.Currency)
            if (response.ok) {
                this.setState({ ...this.state, paymentsData: response.data.paymentsDetails,
                     loading: false })
            } else {
                message.destroy();
                this.setState({ ...this.state, errorMessage: response.data })
                this.useDivRef.current.scrollIntoView()
            }
        }

    }
    getCurrencyLookup = async () => {
        let response = await getCurrencyLu(this.props.userConfig?.id)
        if (response.ok) {
            this.setState({ ...this.state, currency: response.data });
        } else {
            message.destroy();
            this.setState({ ...this.state, errorMessage: response.data })
            this.useDivRef.current.scrollIntoView()
        }
    }
    getPayments = async (item) => {
        if(this.props.match.params.id==='00000000-0000-0000-0000-000000000000'){
            this.setState({ ...this.state, loading: true })
            let response = await getPaymentsData("00000000-0000-0000-0000-000000000000", this.props.userConfig?.id, this.state.Currency)
            if (response.ok) {
                this.setState({ ...this.state, paymentsData: response.data.paymentsDetails, loading: false,});
            } else {
                message.destroy();
                this.setState({ ...this.state, errorMessage: response.data })
                this.useDivRef.current.scrollIntoView()
            }
        }else{
            let response=await creatPayment(this.props.match.params.id)  
            if(response.ok){
                this.setState({...this.state,paymentsData:response.data});
            } else {
                message.destroy();
                this.setState({ ...this.state, errorMessage: response.data })
                this.useDivRef.current.scrollIntoView()
            }
        }

    }
    saveRolesDetails = async () => {
        let objData = this.state.paymentsData.filter((item) => {
            return item.checked
        })
        let objAmount = this.state.paymentsData.some((item) => {
            return item.amount != null
            //return item.amount>0
        })
        let obj = Object.assign({});
        obj.id = this.props.userConfig.id;
        obj.currency = this.state.Currency;
        obj.memberId = this.props.userConfig.id;
        obj.createdBy = this.props.userConfig.userName;
        obj.modifiedBy = "";
        obj.paymentsDetails = objData;
        if (obj.currency != null) {
            if (!objAmount) {
                this.setState({ ...this.state, errorMessage: "Please enter amount" })
                this.useDivRef.current.scrollIntoView()

            }
            else if (!objAmount > 0) {
                this.setState({ ...this.state, errorMessage: "Amount must be greater than zero." })
                this.useDivRef.current.scrollIntoView()
            }
            else {
                this.setState({ btnDisabled: true });
                let response = await savePayments(obj);
                if (response.ok) {
                    this.setState({ btnDisabled: false });
                    message.destroy();
                    message.success({
                        content: 'Payment details saved successfully',
                        className: "custom-msg",
                        duration: 0.5
                    })
                    this.props.history.push('/payments')
                } else {
                    this.setState({ btnDisabled: false });
                    message.destroy();
                    this.setState({ ...this.state, errorMessage: response.data })
                    this.useDivRef.current.scrollIntoView()
                }
            }
        } else {
            this.setState({ ...this.state, errorMessage: "Please select currency" })
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
    beforeUpload = (file) => {

        let fileType = { "image/png": true, 'image/jpg': true, 'image/jpeg': true, 'image/PNG': true, 'image/JPG': true, 'image/JPEG': true, 'application/pdf': true, 'application/PDF': true }

        if (fileType[file.type]) {
            this.setState({ ...this.state, isValidFile: true, })
            return true
        } else {
            this.state.errorMessage("File is not allowed. You can upload jpg, png, jpeg and PDF  files")
            this.setState({ ...this.state, isValidFile: false, })
            return Upload.LIST_IGNORE;
        }
    }
    handleUpload = ({file},item) => {
        this.setState({ ...this.state,fileDetails:[], isSubmitting: true, errorMessage: null })
            let paymentDetialsData= this.state.paymentsData;
            for(let pay in paymentDetialsData){
                if(paymentDetialsData[pay].id===item.id){
                    let obj = {
                        "id": "00000000-0000-0000-0000-000000000000",
                        "documentId": "00000000-0000-0000-0000-000000000000",
                        "isChecked": file.name == "" ? false : true,
                        "documentName":`${file.name}`,
                        "remarks": `${file.size}`,
                        "state": null,
                        "status": false,
                        "path": `${file.name}`,
                    }
                    paymentDetialsData[pay].documents.details=[obj];
                }
            }
            this.setState({...this.state,paymentsData:paymentDetialsData})
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
    render() {
        let total=0;
         for (let i=0; i<this.state.paymentsData.length; i++) {
            total += Number(this.state.paymentsData[i].amount);
        }

        const { currency, paymentsData, loading} = this.state;
        const { form } = this.props
        return (
            <>
                <div ref={this.useDivRef}></div>
                <div className="main-container">
                    <div className='mb-16'>
                        <Title className="basicinfo mb-0"><Translate content="menu_payments" component={Text} className="basicinfo" /></Title>
                    </div>
                    <div className="box basic-info text-white">
                        {this.state.errorMessage != null && (
                            <Alert
                                description={this.state.errorMessage}
                                type="error"
                                closable
                                onClose={() => this.handleAlert()}
                            />
                        )}
                        <Form
                            autoComplete="off">
                            <Form.Item
                                className='mb-16'
                            >
                                <Select
                                    className="cust-input"
                                    placeholder="Select Currency"
                                    onChange={(e) => this.handleCurrencyChange(e)}
                                    style={{ width: 280 }}
                                    dropdownClassName='select-drpdwn'
                                    bordered={false}
                                    showArrow={true}
                                    defaultValue="USD"
                                    // disabled={this.props.match.params.id !== "00000000-0000-0000-0000-000000000000" ? true:false}

                                >
                                    {currency?.map((item, idx) => (
                                        <Option
                                            key={idx}
                                            className="fw-400"
                                            value={item.currencyCode}
                                        > 
                                        {item.currencyCode}
                                            {<NumberFormat
                                                value={item.avilable}
                                                displayType={'text'}
                                                thousandSeparator={true}
                                                renderText={(value) => <span > Balance: {value}</span>} />}
                                        </Option>))}
                                </Select>
                            </Form.Item>
                            <div>
                                <table className='pay-grid'>
                                    <thead>
                                        <tr>
                                            <th style={{ width: 50 }}></th>
                                            <th>Name</th>
                                            <th>Bank Name</th>
                                            <th>BIC/SWIFT/Routing Number</th>
                                            <th>Amount</th>
                                        </tr>
                                    </thead>
                                    {paymentsData?.length > 0 ? <tbody className="mb-0">
                                        {loading && <tr>
                                            <td colSpan='4' className='text-center p-16'><Spin size='default' /></td></tr>}
                                       {/* {!this.props.match.params ?<> */}
                                       {paymentsData?.map((item, i) => {
                                            return (
                                                <>
                                                    <tr key={i} >
                                                        <td style={{ width: 50 }} className='text-center'>
                                                            <label className="text-center custom-checkbox p-relative">
                                                                <Input
                                                                    style={{ cursor: "not-allowed" }}
                                                                    name="check"
                                                                    type="checkbox"
                                                                    disabled
                                                                    checked={item.checked}
                                                                    className="grid_check_box"
                                                                />
                                                                <span></span>
                                                            </label>
                                                        </td>
                                                        <td>{item?.beneficiaryAccountName ?<>{item?.beneficiaryAccountName}</> :<span>{" - - "}</span>}</td>
                                                        <td>
                                                            <div className='d-flex align-center justify-content'>
                                                                <span>{item.bankname}
                                                                {item.isPrimary!==null? <Badge size="small" className='ml-8'
                                                                count={'3rd Party'} 
                                                                 style={{border: 'none'}} />:""}
                                                                 </span>
                                                                <Popover
                                                                    className='more-popover'
                                                                    content={this.popOverContent}
                                                                    trigger="click"
                                                                    visible={item.visible}
                                                                    placement='top'
                                                                    onVisibleChange={() => this.handleVisibleChange(i)}
                                                                >
                                                                    <span className='icon md info c-pointer' onClick={() => this.moreInfoPopover(item.addressId, i)} />
                                                                </Popover>
                                                            </div>
                                                        </td>
                                                        <td>{item.accountnumber}</td>
                                                        <td>
                                                        <div className='d-flex'>
                                                            <NumberFormat className="cust-input text-right"
                                                                customInput={Input} thousandSeparator={true} prefix={""}
                                                                placeholder="0.00"
                                                                decimalScale={2}
                                                                allowNegative={false}
                                                                maxlength={13}
                                                                style={{ height: 44 }}
                                                                onValueChange={({ e, value }) => {
                                                                    let paymentData = this.state.paymentsData;
                                                                    paymentData[i].amount = value;
                                                                    paymentData[i].checked = value > 0 ? true : false;
                                                                    this.setState({ ...this.state, paymentsData: paymentData })
                                                                }}
                                                                value={item.amount}
                                                            />
                                                             <Upload type='dashed' size='large' className='ml-8'
                                                                shape='circle' style={{backgroundColor: 'transparent'}} 
                                                                action={process.env.REACT_APP_UPLOAD_API + "UploadFile"}
                                                                showUploadList={false} 
                                                                beforeUpload={(props) => { this.beforeUpload(props) }}
                                                                onChange={(props) => { this.handleUpload(props,item) }}>
                                                                        <span className='icon md attach c-pointer' />                                                      
                                                                </Upload>
                                                            </div>
                                                            <Text className='file-label fs-12'>{item.documents?.details.length>0 && item.documents?.details[0]?.documentName}</Text>  
                                                      </td>
                                                    </tr>
                                                </>)
                                        })}
                                    </tbody> : <tbody><tr><td colSpan='8' className="p-16 text-center" style={{ color: "white", width: 300 }} >No bank details available</td></tr> </tbody>}
                                    <tfoot><tr>
                                <div className='d-flex'>
                                <span className='text-white fs-24'> Total:</span>
                                <span className='text-white fs-24'> {total}</span>
                                </div>
                                    </tr>  
                            </tfoot>
                                </table>
                            </div>
                            
                        </Form>
                        <div className="text-right mt-36">

                            {paymentsData.length > 0 ?
                                <div>
                                    <Button
                                        className="pop-cancel mr-36"
                                        style={{ margin: "0 8px" }}

                                        onClick={this.backToPayments}
                                    >
                                        Cancel
                                    </Button>
                                    <Button className="pop-btn px-36" disabled={this.state.btnDisabled} onClick={() => { this.saveRolesDetails() }} >
                                        Pay Now
                                    </Button>
                                </div> : ""}
                        </div>

                    </div>
                </div>
            </>
        )
    }
}
const connectStateToProps = ({ userConfig }) => {
    return { userConfig: userConfig.userProfileInfo };
};
export default connect(connectStateToProps, null)(PaymentDetails);