import React, { Component, createRef } from 'react';
import { Typography, Button, Form, Select, message, Input, Alert, Popover, Spin, Collapse, Badge,Upload,Modal } from 'antd';
import Translate from 'react-translate-component';
import { getCurrencyLu, getPaymentsData, savePayments, getBankData,creatPayment,updatePayments,deletePayDetials } from './api'
import NumberFormat from 'react-number-format';
import { connect } from "react-redux";
import Loader from '../../Shared/loader';
import { DeleteOutlined } from '@ant-design/icons';
const { confirm } = Modal;

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
            type:this.props.match.params.type,
            billPaymentData:null
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
        this.setState({ ...this.state, errorMessage: null,loading: true })
    }
    // handleCurrencyChange = async (val, props) => {
    //     this.setState({ ...this.state, loading: true, Currency: val, paymentsData: [] })
    //     if (this.state.Currency = val) {
    //         let response = await getPaymentsData("00000000-0000-0000-0000-000000000000", this.props.userConfig?.id, this.state.Currency)
    //         if (response.ok) {
    //             this.setState({ ...this.state, paymentsData: response.data.paymentsDetails,
    //                  loading: false })
    //         } else {
    //             message.destroy();
    //             this.setState({ ...this.state, errorMessage: response.data,loading: false })
    //             this.useDivRef.current.scrollIntoView()
    //         }
    //     }

    // }

    handleCurrencyChange = async(val,props) => {
        this.setState({ ...this.state, Currency: val,paymentsData:[] })
        if(this.state.Currency=val){
            let response = await getPaymentsData("00000000-0000-0000-0000-000000000000", this.props.userConfig?.id,this.state.Currency)
            if (response.ok) {
                console.log(response.data.paymentsDetails)
                this.setState({ ...this.state, paymentsData: response.data.paymentsDetails, loading: false }) 
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
    getPayments = async () => {
        this.setState({ ...this.state, loading: true })
        if(this.props.match.params.id==='00000000-0000-0000-0000-000000000000'){
            let response = await getPaymentsData("00000000-0000-0000-0000-000000000000", this.props.userConfig?.id, this.state.Currency)
            if (response.ok) {
                this.setState({ ...this.state,billPaymentData:response.data, paymentsData: response.data.paymentsDetails, loading: false});
            } else {
                message.destroy();
                this.setState({ ...this.state, errorMessage: response.data,loading: false })
                this.useDivRef.current.scrollIntoView()
            }
        }else{
            let response=await creatPayment(this.props.match.params.id)  
            if(response.ok){
                let paymentDetails=response.data;
                for(let i in paymentDetails.paymentsDetails ){
                    paymentDetails.paymentsDetails[i].checked=true;
                }
                this.setState({...this.state,billPaymentData:response.data,paymentsData:paymentDetails.paymentsDetails, loading: false});

                
            } else {
                message.destroy();
                this.setState({ ...this.state, errorMessage: response.data,loading: false })
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
                if(this.props.match.params.id==='00000000-0000-0000-0000-000000000000'){
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
                }else{
                    let PaymentDetails = this.state.paymentsData;
                    for(var i in PaymentDetails){
                        if(PaymentDetails[i].checked===false){
                            PaymentDetails[i].RecordStatus = 'Deleted'
                        }
                    }
                    let response = await updatePayments(this.state.paymentsData);
                if (response.ok) {
                    this.setState({ btnDisabled: false, });
                    message.destroy();
                    message.success({
                        content: 'Payment details update successfully',
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
            }
        } else {
            this.setState({ ...this.state, errorMessage: "Please select currency" })
            this.useDivRef.current.scrollIntoView()
        }
    }
    deleteDetials = async ( idx ) => {
        const response = await deletePayDetials(idx.id);
        message.destroy()
        if (response.ok) {
            message.warning('Payment has been deleted');
            this.getPayments();
            this.props.history.push('/payments');
        } else {
            message.warning(response.data);
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
        this.setState({ ...this.state,fileDetails:[], isSubmitting: true, errorMessage: null,loading: true })
            let paymentDetialsData= this.state.paymentsData;
            for(let pay in paymentDetialsData){
                if(paymentDetialsData[pay].id===item.id){
                    let obj = {
                        "id":"00000000-0000-0000-0000-000000000000",
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
            this.setState({...this.state,paymentsData:paymentDetialsData,loading: false})
    }
    popOverContent = () => {
        const { moreBankInfo, tooltipLoad } = this.state;
        if (tooltipLoad) {
            return <Spin />
        } else {
            return (<div className='more-popover'>
                <Text className='lbl'>Address Label</Text>
                <Text className='val'>{moreBankInfo?.favouriteName}</Text>
                <Text className='lbl'>Recipient Name</Text>
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
    addressTypeNames = (type) =>{
        const stepcodes = {
                  "1stparty" : "1st Party",
                  "3rdparty" : "3rd Party",
         }
         return stepcodes[type]
     }
    render() {
        let total=0;
         for (let i=0; i<this.state.paymentsData.length; i++) {
            total += Number(this.state.paymentsData[i].amount);
        }
        const { currency, paymentsData, loading,type} = this.state;
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
                            {/* <Form.Item
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
                                    value={this.state.billPaymentData?.currency}
                                    defaultValue="USD"
                                    disabled={(type === 'disabled' ? true : false) || (this.props.match.params.id !== "00000000-0000-0000-0000-000000000000" ? true : false)}
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
                            </Form.Item> */}
                             <Form.Item
                               
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
                                      
                                   >
                                       {currency?.map((item, idx) => (
                                           <Option
                                               key={idx}
                                               className="fw-400"
                                              
                                               value={item.currencyCode}
                                           > {item.currencyCode}
                                           { <NumberFormat
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
                                            {/* <th>BIC/SWIFT/Routing Number</th> */}
                                            <th>Bank account number</th>
                                            {this.props.match.params.id !=='00000000-0000-0000-0000-000000000000' && <th>State</th>}
                                            <th>Amount</th>
                                        </tr>
                                    </thead>
                                   
                                    {loading ?<tbody><tr><td colSpan='8' className="p-16 text-center"  ><Loader /></td></tr> </tbody>   :<>
                                    {paymentsData?.length > 0 ? <tbody className="mb-0">
                                            {paymentsData?.map((item, i) => {
                                            return (
                                                <>
                                                    <tr key={i} disabled={(this.props.match.params.id==='00000000-0000-0000-0000-000000000000' || item.state==="Submitted")?false:true} >
                                                        <td style={{ width: 50 }} className='text-center'>
                                                            <label className="text-center custom-checkbox p-relative">
                                                                <Input
                                                                     //style={(this.props.match.params.id==='00000000-0000-0000-0000-000000000000' || item.state==="Submitted")?'':{ cursor: "not-allowed" }}
                                                                    name="check"
                                                                    type="checkbox"
                                                                    disabled={item.state==="Approved" ||item.state==="Cancelled" || item.state==="Pending"}
                                                                    checked={item.checked}
                                                                    className="grid_check_box"
                                                                    onClick={(value)=>{
                                                                        console.log(value.target.checked)
                                                                        let paymentData = this.state.paymentsData;
                                                                    if(value.target.checked===false){paymentData[i].amount = 0;}
                                                                    paymentData[i].checked = value.target.checked;
                                                                    this.setState({ ...this.state, paymentsData: paymentData })
                                                                    }}
                                                                />
                                                                <span></span>
                                                            </label>
                                                        </td>
                                                        <td>{item?.beneficiaryAccountName ?<>{item?.beneficiaryAccountName}</> :<span>{" - - "}</span>}</td>
                                                        <td>
                                                            <div className='d-flex align-center justify-content'>
                                                                <span>{item.bankname}
                                                                {item.isPrimary!==null? <Text  size="small" className='file-label ml-8'
                                                                  >{this.addressTypeNames(item.addressType)} </Text>:""}
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
                                                        {this.props.match.params.id !=='00000000-0000-0000-0000-000000000000' && <td>{item.state?item.state:"- -"}</td>}
                                                        <td>
                                                        <div className='d-flex'>
                                                        <Form.Item
                                                            //name={item.id}
                                                            className='mb-16'
                                                            rules={item.checked &&[
                                                                    {
                                                                        required: true,
                                                                        message: 'is_required'
                                                                    }
                                                                 ]}
                                                        >
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
                                                                    paymentData[i].checked = value > 0 ? true : paymentData[i].checked;
                                                                    this.setState({ ...this.state, paymentsData: paymentData })
                                                                }}
                                                                disabled={item.state==="Approved" ||item.state==="Cancelled" || item.state==="Pending"}
                                                                value={item.amount}
                                                            />
                                                            </Form.Item>
                                                             <Upload type='dashed' size='large' className='ml-8 mt-12'
                                                                shape='circle' style={{backgroundColor: 'transparent'}} 
                                                                action={process.env.REACT_APP_UPLOAD_API + "UploadFile"}
                                                                showUploadList={false} 
                                                                beforeUpload={(props) => { this.beforeUpload(props) }}
                                                                onChange={(props) => { this.handleUpload(props,item) }}
                                                                disabled={item.state==="Approved" ||item.state==="Cancelled" || item.state==="Pending"}
                                                                >
                                                                 <span className={`icon md attach ${item.state==="Approved"?"":"c-pointer"} `}/>                                                      
                                                                </Upload>
                                                                <Button
                                                                disabled={item.state==="Approved" ||item.state==="Cancelled" || item.state==="Pending"}
                                                                className="delete-btn mt-30"
                                                                style={{ padding: "0 14px" }}
                                                                onClick={() =>
                                                                    confirm({
                                                                    content: (
                                                                        <div className="fs-14 text-white-50">
                                                                        Are you sure do you want to delete Payment ?
                                                                        </div>
                                                                    ),
                                                                    title: (
                                                                        <div className="fs-18 text-white-30">
                                                                    Delete Payment ?
                                                                        </div>
                                                                    ),
                                                                    onOk: () => {this.deleteDetials(item)}
                                                                    })
                                                                }
                                                        >
                                                       <DeleteOutlined  className='ml-8 mt-12' />
                                                        </Button>
                                                            </div>
                                                            
                                                            {item.documents?.details.map((file) =><> 
                                                                {file.documentName !== null && 
                                                             <Text  className='file-label fs-12'>
                                                                 {file.documentName}
                                                                 </Text>  
                                                            }
                                                             </>)} 
                                                      </td>
                                                    </tr>
                                                </>)   })}
                                    </tbody> : <tbody><tr><td colSpan='8' className="p-16 text-center" style={{ color: "white", width: 300 }} >No bank details available</td></tr> </tbody>}</>}
                                    <tfoot>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            {this.props.match.params.id !=='00000000-0000-0000-0000-000000000000' && <td></td>}
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
                                                                 <span className='text-white '>{parseFloat(total).toFixed(2)} </span>
                                 {/* <span className='text-white '>{total}</span> */}
                                 </NumberFormat>
                                 </span></td>
                                
                              
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