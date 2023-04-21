import { Component } from "react";
import apiCalls from "../../../api/apiCalls";
import { Form, Row, Col, Input,Select,Alert } from "antd";
import { validateContentRule } from "../../../utils/custom.validator";
import { getReasonforTransferDetails } from "../api";
const { TextArea } = Input;
const {Option}=Select;
class InternationalTransfer extends Component {
    state={
        reasonForTransferDataa:[],
        selectedReasonforTransfer:null,
        errorMessage:null,
        domesticTypeName:this.props.refreshData,
    }
    componentDidMount(){
      this.getReasonForTransferData();  
    }
    getReasonForTransferData=async()=>{
        let res = await getReasonforTransferDetails();
        if(res.ok){
            this.setState({...this.state,reasonForTransferDataa:res.data,errorMessage:null})
        }else{
            this.setState({...this.state,errorMessage: apiCalls.isErrorDispaly(res),})
           
        }
    }

    handleReasonTrnsfer=(e)=>{
        this.setState({...this.state,selectedReasonforTransfer:e})
        this.props.form.current.setFieldsValue({transferOthers:null})
    }
    render() {
        const { refreshData } = this.props;
        if(refreshData != this.state.domesticTypeName){
            this.setState({...this.state, domesticTypeName:refreshData, selectedReasonforTransfer:null});
            this.props.form.current?.setFieldsValue({transferOthers:null})
        }
        return <Row className="validateiban-content">
             {this.state.errorMessage && <Alert type="error" description={this.state.errorMessage} showIcon />}
            <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                <Form.Item
                    className="custom-forminput custom-label"
                    name="accountNumber"
                    label={"Account Number"}
                    required
                    rules={[
                        {
                            required: true,
                            message: apiCalls.convertLocalLang("is_required"),
                        },
                       {
                            validator: (_, value) => {
                                if (
                                    value &&
                                    !/^[A-Za-z0-9]+$/.test(value)
                                ) {
                                    return Promise.reject(
                                        "Invalid Account Number"
                                    );
                                }else {
                                    return validateContentRule(_, value);
                                }
                            },
                        }
                    ]}
                >
                    <Input
                        className="cust-input"
                        placeholder={"Account Number"}
                        maxLength={50}/>

                </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                <Form.Item
                    className="custom-forminput custom-label"
                    name="swiftRouteBICNumber"
                    label={"Swift / BIC Code"}
                    required
                    rules={[
                        {
                            required: true,
                            message: apiCalls.convertLocalLang("is_required"),
                        },
                       {
                            validator: (_, value) => {
                                if (
                                    value &&
                                    !/^[A-Za-z0-9]+$/.test(value)
                                ) {
                                    return Promise.reject(
                                        "Invalid Swift / BIC Code"
                                    );
                                }else {
                                    return validateContentRule(_, value)
                                }
                            },
                        }
                    ]}
                >
                    <Input
                        className="cust-input"
                        placeholder={"Swift / BIC Code"}
                        maxLength={50}/>

                </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                <Form.Item
                    className="custom-forminput custom-label"
                    name="bankName"
                    label={"Bank Name"}
                    required
                    rules={[
                        {
                            required: true,
                            message: apiCalls.convertLocalLang("is_required"),
                        },
                        {
                            whitespace: true,
                            message: apiCalls.convertLocalLang("is_required"),
                        },{
                            validator: validateContentRule,
                        },
                    ]}
                >
                    <Input
                        className="cust-input"
                        placeholder={"Bank Name"}
                        maxLength={100} />

                </Form.Item>
            </Col>
           
            <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                <Form.Item
                    className="custom-forminput custom-label"
                    name="bankAddress1"
                    required
                    rules={[
                        {
                            required: true,
                            message: apiCalls.convertLocalLang("is_required"),
                        },
                        {
                            whitespace: true,
                            message: apiCalls.convertLocalLang("is_required"),
                        },{
                            validator: validateContentRule,
                        },
                    ]}
                    label={
                        "Bank Address 1"
                    }
                >
                    <TextArea
                        placeholder={"Bank Address 1"}
                        className="cust-input cust-text-area address-book-cust"
                        autoSize={{ minRows: 1, maxRows: 1 }}
                        maxLength={1000}
                    ></TextArea>
                </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                <Form.Item
                    className="custom-forminput custom-label"
                    name="bankAddress2"
                    rules={[
                        {
                            validator: validateContentRule,
                        },
                    ]}
                    label={
                        "Bank Address 2"
                    }
                >
                    <TextArea
                        placeholder={"Bank Address 2"}
                        className="cust-input cust-text-area address-book-cust"
                        autoSize={{ minRows: 1, maxRows: 1 }}
                        maxLength={1000}
                    ></TextArea>
                </Form.Item>
            </Col>
            {this.props.type !== "manual" && <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                <Form.Item
                    className="custom-forminput custom-label"
                    name="reasonOfTransfer"
                    required
                    rules={[
                        {
                            required: true,
                            message: apiCalls.convertLocalLang("is_required"),
                        },
                        {
                            whitespace: true,
                            message: apiCalls.convertLocalLang("is_required"),
                        },
                        {
                            validator: validateContentRule,
                        },
                    ]}
                    label={
                        "Reason For Transfer"
                    }
                >
                     <Select
                                    className="cust-input"
                                    maxLength={100}
                                    placeholder={"Reason For Transfer"}
                                    optionFilterProp="children"
                                    onChange={(e)=>this.handleReasonTrnsfer(e)}
                                >
                                    {this.state.reasonForTransferDataa?.map((item, idx) => (
                                    <Option key={idx} value={item.name}>
                                        {item.name}
                                    </Option>
                                    ))}
                                </Select>
                 
                </Form.Item>
            </Col>}
            {this.state.selectedReasonforTransfer=="Others" && <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item
                            className=" mb-8 px-4 text-white-50 custom-forminput custom-label pt-8 sc-error"
                            name="transferOthers"
                            required
                            rules={[
                                {whitespace: true,
                                message: "Is required",
                                },
                                {
                                required: true,
                                message: "Is required",
                                },
                                {
                                validator: validateContentRule,
                            },
                            ]}
                            >
                            <Input
                                className="cust-input"
                                maxLength={100}
                                placeholder="Please specify:"
                                
                            />
                            </Form.Item>
                      </Col>}
        </Row>
    }
}
export default InternationalTransfer;