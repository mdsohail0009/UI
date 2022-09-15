import { Component } from "react";
import { Row, Col, Typography, Upload, Form, Modal, Button } from 'antd';
import Loader from "../../Shared/loader";
import { document } from "../onthego.transfer/api";
import apiCalls from "../../api/apiCalls";
import { bytesToSize } from "../../utils/service";

const { Dragger } = Upload;
const { Paragraph, Text, Title } = Typography;
const EllipsisMiddle = ({ suffixCount, children }) => {
    const start = children.slice(0, children.length - suffixCount).trim();
    const suffix = children.slice(-suffixCount).trim();
    return (
        <Text className="mb-0 fs-14 docname d-block" style={{ maxWidth: '100%' }} ellipsis={{ suffix }}>
            {start}
        </Text>
    );
};
class AddressDocumnet extends Component {
    state = {
        filesList: [],
        documents: {}, showDeleteModal: false, isDocLoading: false
    }
    componentDidMount() {
        this.setState({ ...this.state, documents: this.props?.documents || document(), filesList: this.props?.documents ? [...this.props?.documents?.details] : [] })
    }
    docDetail = (doc) => {
        return {
            "id": doc.id || "00000000-0000-0000-0000-000000000000",
            "documentId": this.state.documents.id,
            "documentName": doc.name,
            "status": true,
            "recorder": 0,
            "remarks": "",
            "isChecked": true,
            "state": "",
            "path": doc?.response[0]
        }
    }
    render() {
        return <Row >
            <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="text-left">
                <div className='mb-24'>
                    <Paragraph
                        className="mb-16 fs-14 text-white fw-500"
                    >{this.props.title}</Paragraph>
                    <Form.Item name={"files"} required rules={[{
                        validator: (_, value) => {
                            if (this.state.filesList.length == 0) {
                                return Promise.reject("At least one document is required")
                            } else {
                                const isValidFiles = this.state.filesList.filter(item => (item.name || item.documentName).indexOf(".") != (item.name || item.documentName).lastIndexOf(".")).length == 0;
                                if (isValidFiles) { return Promise.resolve(); } else {
                                    return Promise.reject("Double extension file not allowed");
                                }

                            }
                        },

                    }
                    ]}>
                        <Dragger accept=".pdf,.jpg,.jpeg,.png, .PDF, .JPG, .JPEG, .PNG"
                            className="upload mt-0"
                            multiple={false} action={process.env.REACT_APP_UPLOAD_API + "UploadFile"}
                            showUploadList={false}
                            beforeUpload={(props) => {
                              //  return props.name.split(".").length < 2;
                            }}
                            onChange={({ file }) => {
                                this.setState({ ...this.state, isDocLoading: true });
                                if (file.status === "done") {
                                    let { filesList: files } = this.state;
                                    files.push(file);
                                    this.setState({ ...this.state, filesList: files, isDocLoading: false });
                                    let { documents: docs } = this.state;
                                    docs?.details?.push(this.docDetail(file));
                                    this.props?.onDocumentsChange(docs);
                                }
                            }}
                        >
                            <p className="ant-upload-drag-icon">
                                <span className="icon xxxl doc-upload" />
                            </p>
                            <p className="ant-upload-text fs-18 mb-0">Drag and drop or browse to choose file</p>
                            <p className="ant-upload-hint text-secondary fs-12">
                                PNG, JPG,JPEG and PDF files are allowed
                            </p>
                        </Dragger>
                    </Form.Item>
                    {this.state?.filesList?.map((file, indx) => <div className="docfile">
                        {(file.status === "done" || file.status == true) && <>
                            <span className={`icon xl file mr-16`} />
                            <div className="docdetails">
                                <EllipsisMiddle suffixCount={6}>{file.name || file.documentName}</EllipsisMiddle>
                                <span className="fs-12 text-secondary">{file.size ? bytesToSize(file.size) : ""}</span>
                            </div>
                            <span className="icon md close c-pointer" onClick={() => {
                                this.setState({ ...this.state, showDeleteModal: true, selectedFileIdx: indx })

                            }} />
                        </>}
                    </div>)}
                    {this.state.isDocLoading && <Loader />}
                </div>
            </Col>
            <Modal visible={this.state.showDeleteModal}
                closable={false}
                title={"Confirm delete"}
                footer={
                    <>
                        <Button
                            style={{ width: "30px", border: "1px solid #f2f2f2" }}
                            className=" pop-cancel"
                            onClick={() => { this.setState({ ...this.state, showDeleteModal: false }) }}>
                            No
                        </Button>
                        <Button
                            className="primary-btn pop-btn"
                            onClick={() => {
                                let filesList = [...this.state.filesList];
                                filesList[this.state.selectedFileIdx].state='Deleted'
                                let obj=Object.assign([],filesList)
                                filesList.splice(this.state.selectedFileIdx, 1);
                                this.setState({ ...this.state, filesList, showDeleteModal: false });
                                let { documents: docs } = this.state;
                                docs.details=Object.assign([],obj)
                                this.props?.onDocumentsChange(docs);
                            }}
                            style={{ width: 120, height: 50 }}>
                            {apiCalls.convertLocalLang("Yes")}
                        </Button>
                    </>
                }>

                <Paragraph className="text-white">Are you sure, do you really want to delete ?</Paragraph>
            </Modal>
        </Row>
    }
}
export default AddressDocumnet;