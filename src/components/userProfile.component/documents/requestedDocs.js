import React, { Component } from 'react';
import { Collapse, Upload, Row, Col, Button, Typography, Modal, Tooltip, message, Input } from 'antd';
import profile from '../../../assets/images/user.jpg';
import uploadImage from '../../../assets/images/uploadimg.png';
import { Link } from 'react-router-dom';

const { Panel } = Collapse;
const { Dragger } = Upload;
const { Text } = Typography;

const EllipsisMiddle = ({ suffixCount, children }) => {
    const start = children.slice(0, children.length - suffixCount).trim();
    const suffix = children.slice(-suffixCount).trim();
    return (
        <Text className="mb-0 fs-14 docname c-pointer d-block" style={{ maxWidth: '100%' }} ellipsis={{ suffix }}>
            {start}
        </Text>
    );
};

class RequestedDocs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            previewModal: false,
        }
        this.docPreview = this.docPreview.bind(this);
        this.docPreviewClose = this.docPreviewClose.bind(this);
    }
    docPreview = () => {
        this.setState({ previewModal: true })
    }
    docPreviewClose = () => {
        this.setState({ previewModal: false })
    }
    docApprove = () => {
        message.destroy()
        message.success({
            content: 'Request document has been approved',
            className: 'custom-msg',
        });
    }
    docReject = () => {
        message.destroy()
        message.warning({
            content: 'Request document has been rejected',
            className: 'custom-msg',
        });
    }
    render() {
        return <div className="main-container">
            <div className="mb-24 text-white-50"><Link className="icon md leftarrow mr-16 c-pointer" to="/userprofile" />/&nbsp;&nbsp;&nbsp;Payment Bill, Identity Document</div>
            <div className="bank-view">
                <div className="box basic-info pb-0">
                    <Row gutter={[8, 8]} className="kpi-List" >
                        <Col xs={24} rarrow-white={24} md={12} lg={8} xxl={6}>
                            <span className="icon md file" />
                            <div>
                                <label className="kpi-label">Title</label>
                                <div className="kpi-val">Payment Bill, Idenity Document</div>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xxl={6}>
                            <span className="icon md calendar" />
                            <div>
                                <label className="kpi-label">Date</label>
                                <div className="kpi-val">21-09-2021</div>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xxl={6}>
                            <span className="icon md user" />
                            <div>
                                <label className="kpi-label">User Name</label>
                                <div className="kpi-val">John_003</div>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xxl={6}>
                            <span className="icon md user" />
                            <div>
                                <label className="kpi-label">Full Name</label>
                                <div className="kpi-val">John Doe</div>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xxl={6}>
                            <span className="icon md email" />
                            <div>
                                <label className="kpi-label">Email</label>
                                <div className="kpi-val">
                                    john@suissebase.com
                                </div>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xxl={6}>
                            <span className="icon md status" />
                            <div>
                                <label className="kpi-label">Status</label>
                                <div className="kpi-val">
                                    Approved
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
                <Collapse accordion className="accordian mb-24" defaultActiveKey={['1']} expandIcon={() => <span className="icon md downangle" />}>
                    <Panel header="Payment Receipt" key="1" extra={<span className="icon md greyCheck" />}>
                        <div className="mb-24">
                            <Text className="fs-12 text-white-50 d-block mb-4 fw-200">Reply</Text>
                            <Input
                                className="mb-24 cust-input"
                                placeholder="Enter your reply text"
                            />
                            <Dragger className="upload">
                                <p className="ant-upload-drag-icon">
                                    <span className="icon xxxl doc-upload" />
                                </p>
                                <p className="ant-upload-text fs-18 mb-0">Drag and drop or browse to choose file</p>
                                <p className="ant-upload-hint text-secondary fs-12">
                                    PNG, JPG and GIF files are allwoed
                                </p>
                            </Dragger>
                        </div>
                        
                        <div className="docfile-container">
                            <div className="docfile">
                                <span className="icon xl image mr-16" />
                                <div className="docdetails c-pointer" onClick={this.docPreview}>
                                    <EllipsisMiddle suffixCount={12}>credit card bill.jpg</EllipsisMiddle>
                                    <span className="fs-12 text-secondary">25 KB</span>
                                </div>
                                <span className="icon md close c-pointer" />
                            </div>
                            <div className="docfile">
                                <span className="icon xl file mr-16" />
                                <div className="docdetails c-pointer" onClick={this.docPreview}>
                                    <EllipsisMiddle suffixCount={12}>credit card bill.pdf</EllipsisMiddle>
                                    <span className="fs-12 text-secondary">25 KB</span>
                                </div>
                                <span className="icon md close c-pointer" />
                            </div>
                            <div className="docfile">
                                <span className="icon xl image mr-16" />
                                <div className="docdetails c-pointer" onClick={this.docPreview}>
                                    <EllipsisMiddle suffixCount={12}>credit card bill.jpg</EllipsisMiddle>
                                    <span className="fs-12 text-secondary">25 KB</span>
                                </div>
                                <span className="icon md close c-pointer" />
                            </div>
                            <div className="docfile">
                                <span className="icon xl file mr-16" />
                                <div className="docdetails c-pointer" onClick={this.docPreview}>
                                    <EllipsisMiddle suffixCount={12}>credit card bill.pdf</EllipsisMiddle>
                                    <span className="fs-12 text-secondary">25 KB</span>
                                </div>
                                <span className="icon md close c-pointer" />
                            </div>
                        </div>
                        <div className="text-center my-36">
                            <Button type="primary" onClick={this.docReject} className="cust-cancel-btn">
                                Cancel
                            </Button>
                            <Button className="cust-cancel-btn" onClick={this.docApprove}>Submit</Button>
                        </div>
                        <div className="reply-container">
                            <img src={profile} className="mr-16" />
                            <div className="reply-body">
                                <Text className="reply-username">John Doe</Text><Text className="reply-date">Tue, 21 Sep</Text>
                                <p className="reply-txt">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour</p>
                                <div className="docfile-container">
                                    <div className="docfile">
                                        <span className="icon xl image mr-16" />
                                        <div className="docdetails c-pointer" onClick={this.docPreview}>
                                            <EllipsisMiddle suffixCount={12}>credit card bill.jpg</EllipsisMiddle>
                                            <span className="fs-12 text-secondary">25 KB</span>
                                        </div>
                                        <span className="icon md close c-pointer" />
                                    </div>
                                    <div className="docfile">
                                        <span className="icon xl file mr-16" />
                                        <div className="docdetails c-pointer" onClick={this.docPreview}>
                                            <EllipsisMiddle suffixCount={12}>credit card bill.pdf</EllipsisMiddle>
                                            <span className="fs-12 text-secondary">25 KB</span>
                                        </div>
                                        <span className="icon md close c-pointer" />
                                    </div>
                                    <div className="docfile">
                                        <span className="icon xl image mr-16" />
                                        <div className="docdetails c-pointer" onClick={this.docPreview}>
                                            <EllipsisMiddle suffixCount={12}>credit card bill.jpg</EllipsisMiddle>
                                            <span className="fs-12 text-secondary">25 KB</span>
                                        </div>
                                        <span className="icon md close c-pointer" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="reply-container">
                            <img src={profile} className="mr-16" />
                            <div className="reply-body">
                                <Text className="reply-username">John Doe</Text><Text className="reply-date">Tue, 21 Sep</Text>
                                <p className="reply-txt">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour</p>
                                <div className="docfile-container">
                                    <div className="docfile">
                                        <span className="icon xl image mr-16" />
                                        <div className="docdetails c-pointer" onClick={this.docPreview}>
                                            <EllipsisMiddle suffixCount={12}>credit card bill.jpg</EllipsisMiddle>
                                            <span className="fs-12 text-secondary">25 KB</span>
                                        </div>
                                        <span className="icon md close c-pointer" />
                                    </div>
                                    <div className="docfile">
                                        <span className="icon xl file mr-16" />
                                        <div className="docdetails c-pointer" onClick={this.docPreview}>
                                            <EllipsisMiddle suffixCount={12}>credit card bill.pdf</EllipsisMiddle>
                                            <span className="fs-12 text-secondary">25 KB</span>
                                        </div>
                                        <span className="icon md close c-pointer" />
                                    </div>
                                    <div className="docfile">
                                        <span className="icon xl image mr-16" />
                                        <div className="docdetails c-pointer" onClick={this.docPreview}>
                                            <EllipsisMiddle suffixCount={12}>credit card bill.jpg</EllipsisMiddle>
                                            <span className="fs-12 text-secondary">25 KB</span>
                                        </div>
                                        <span className="icon md close c-pointer" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="reply-container mb-0">
                            <img src={profile} className="mr-16" />
                            <div className="reply-body">
                                <div className="chat-send">
                                    <Input autoFocus type="text" placeholder="Write your message..." size="large" bordered={false} multiple={true} />
                                    <div className="d-flex align-center">
                                        <Tooltip title="Attachments"><span className="icon md attach mr-16 c-pointer" /></Tooltip>
                                        <div className="send-circle c-pointer">
                                            <Tooltip title="Send"><span className="icon md send-icon" /></Tooltip>
                                        </div>
                                    </div>
                                </div>
                                <div className="docfile-container">
                                    <div className="docfile">
                                        <span className="icon xl image mr-16" />
                                        <div className="docdetails c-pointer" onClick={this.docPreview}>
                                            <EllipsisMiddle suffixCount={12}>credit card bill.jpg</EllipsisMiddle>
                                            <span className="fs-12 text-secondary">25 KB</span>
                                        </div>
                                        <span className="icon md close c-pointer" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="text-center">
                           
                            <Button className="pop-btn" onClick={this.docApprove}>Approve</Button>
                            <Button type="primary" onClick={this.docReject} className="cust-cancel-btn">
                                Reject
                            </Button>
                        </div>
                    </Panel>
                </Collapse>
                <Collapse accordion className="accordian mb-24" expandIcon={() => <span className="icon md downangle" />}>
                    <Panel header="Proof of Address" key="1" extra={<span className="icon md greenCheck" />}>
                    </Panel>
                </Collapse>
            </div>
            <Modal
                className="documentmodal-width"
                title="Preview"
                width={1000}
                visible={this.state.previewModal}
                closeIcon={<Tooltip title="Close"><span className="icon md close" onClick={this.docPreviewClose} /></Tooltip>}
                footer={<>
                <div className="cust-pop-up-btn crypto-pop">
                    
                    <Button onClick={this.docPreviewClose} className="cust-cancel-btn cust-cancel-btn pay-cust-btn detail-popbtn paynow-btn-ml">Close</Button>
                    <Button  className="primary-btn pop-btn detail-popbtn">Download</Button>
                    </div>
                </>}
            >
                <img style={{ width: "100%" }} src={uploadImage} alt="User" />
            </Modal>
        </div>;
    }
}

export default RequestedDocs;