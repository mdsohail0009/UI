import { Component } from "react";
import { Row, Col, Typography, Upload, Form } from 'antd';
import Loader from "../../Shared/loader";
import { document } from "../onthego.transfer/api";
import apiCalls from "../../api/apiCalls";

const { Dragger } = Upload;
const { Paragraph, Text, Title } = Typography;
const EllipsisMiddle = ({ suffixCount, children }) => {
    const start = children.slice(0, children.length - suffixCount).trim();
    const suffix = children.slice(-suffixCount).trim();
    return (
        <Text className="mb-0 fs-14 docname c-pointer d-block" style={{ maxWidth: '100%' }} ellipsis={{ suffix }}>
            {start}
        </Text>
    );
};
class AddressDocumnet extends Component {
    state = {
        filesList: this.props?.documents?.details || [],
        documents: {}
    }
    componentDidMount() {
        this.setState({ ...this.state, documents: this.props?.documents || document() })
    }
    setDocs = () => {

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
                                return Promise.reject(apiCalls.convertLocalLang("is_required"))
                            } else {
                                return Promise.resolve();
                            }
                        },

                    }
                    ]}>
                        <Dragger accept=".pdf,.jpg,.jpeg,.png, .PDF, .JPG, .JPEG, .PNG"
                            className="upload mt-16"
                            multiple={true} action={process.env.REACT_APP_UPLOAD_API + "UploadFile"}
                            showUploadList={false}
                            beforeUpload={(props) => { }}
                            onChange={({ fileList, file }) => {
                                this.setState({ ...this.state, filesList: fileList });
                                if (file.status === "done") {
                                    let { documents } = this.state;
                                    documents?.details?.push(this.docDetail(file));
                                    this.props?.onDocumentsChange(documents);
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
                        {file.status === "uploading" && <Loader />}
                        {file.status === "done" ||file.status==true && <>
                            <span className={`icon xl file mr-16`} />
                            <div className="docdetails c-pointer">
                                <EllipsisMiddle suffixCount={6}>{file.name||file.documentName}</EllipsisMiddle>
                                <span className="fs-12 text-secondary">{file.size}</span>
                            </div>
                            <span className="icon md close c-pointer" onClick={() => {
                                let filesList = [...this.state.filesList];
                                filesList.splice(indx, 1);
                                this.setState({ ...this.state, filesList });
                            }} />
                        </>}
                    </div>)}
                </div>
            </Col>
        </Row>
    }
}
export default AddressDocumnet;