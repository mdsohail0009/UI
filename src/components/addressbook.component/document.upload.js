import { Component } from "react";
import { Row, Col, Typography, Upload, Form, Modal, Button,Alert } from 'antd';
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
        documents: {}, showDeleteModal: false, isDocLoading: false,selectedObj:{},errorMessage:null
    }
    componentDidMount() {
        this.setState({ ...this.state, documents: this.props?.documents || document(), isEdit: this.props?.editDocument, filesList: this.props?.documents ? [...this.props?.documents?.details] : [],refreshData:this.props?.refreshData })
    }
    docDetail = (doc) => {
        return {
            "id": doc.id || "00000000-0000-0000-0000-000000000000",
            "documentId": this.state.documents.id,
            "documentName": doc.name,
            "status": true,
            "recorder": 0,
            "remarks":  doc.size,
            "isChecked": true,
            "state": "",
            "path": doc?.response[0]
        }
    }
  
    render() {
        if(this.props.refreshData != this.state.refreshData){
            this.setState({ ...this.state, documents: this.props?.documents || document(), filesList: this.props?.documents ? [...this.props?.documents?.details] : [], refreshData:this.props.refreshData })
        }
        return <Row >
            <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="text-left">
                <div className='mb-24'>
                    <Paragraph
                      className="mb-8 fs-14 text-white fw-500 ml-12" 
                    >{this.props.title}</Paragraph>
                     {this.state.errorMessage && <Alert type="error" description={this.state.errorMessage} showIcon />}
                    <Form.Item name={"files"} required rules={[{
                        validator: (_, value) => {
                            let fileType = { "image/png": true, 'image/jpg': true, 'image/jpeg': true, 'image/PNG': true, 'image/JPG': true, 'image/JPEG': true, 'application/pdf': true, 'application/PDF': true }
                            // if (this.state.filesList.length == 0) {
                            //    // this.setState({...this.state,isDocLoading:false,errorMessage:null })
                            //     return Promise.reject("At least one document is required")
                            // }
                            if (value&&!fileType[value.file.type]) {
                                this.setState({...this.state,isDocLoading:false,errorMessage:null })
                                return Promise.reject("File is not allowed. You can upload jpg, png, jpeg and PDF  files");
                            }
                            else {
                                const isValidFiles = this.state.filesList.filter(item => (item.name || item.documentName).indexOf(".") != (item.name || item.documentName).lastIndexOf(".")).length == 0;
                                if (isValidFiles) { return Promise.resolve(); } else {
                                    this.setState({...this.state,isDocLoading:false,errorMessage:null })
                                    return Promise.reject("File don't allow double extension");
                                }

                            }
                        },

                    }
                    ]}>
                        <Dragger accept=".pdf,.jpg,.jpeg,.png, .PDF, .JPG, .JPEG, .PNG"
                            className="upload mt-4"
                            multiple={false} action={process.env.REACT_APP_UPLOAD_API + "UploadFile"}
                            showUploadList={false}
                            beforeUpload={(props) => {
                              //  return props.name.split(".").length < 2;
                            }}
                            onChange={({ file }) => {
                                this.setState({ ...this.state, isDocLoading: true });
                                if (file.status === "done") {
                                    let fileType = { "image/png": true, 'image/jpg': true, 'image/jpeg': true, 'image/PNG': true, 'image/JPG': true, 'image/JPEG': true, 'application/pdf': true, 'application/PDF': true }
                                    if (fileType[file.type]) {
                                        let { filesList: files } = this.state;
                                        files.push(file);
                                        this.setState({ ...this.state, filesList: files, isDocLoading: false, errorMessage: null });
                                        let { documents: docs } = this.state;
                                        docs?.details?.push(this.docDetail(file));
                                        this.props?.onDocumentsChange(docs);
                                    }else{
                                        this.setState({ ...this.state,  isDocLoading: false});  
                                    }
                                }else if(file.status ==='error'){
                                    console.log(file)
                                    this.setState({ ...this.state, isDocLoading: false,errorMessage:file?.response });
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
                            <span className={`icon xl ${(file.name?file.name.slice(-3) === "zip" ? "file" : "":(file.documentName?.slice(-3) === "zip" ? "file" : "")) || file.name?(file.name.slice(-3) === "pdf" ? "file" : "image"):(file.documentName?.slice(-3) === "pdf" ? "file" : "image")} mr-16`} />
                            <div className="docdetails">
                                <EllipsisMiddle suffixCount={6}>{file.name || file.documentName}</EllipsisMiddle>
                                <span className="fs-12 text-secondary">{file.size ? bytesToSize(file.size) : ""}</span>
                            </div>
                            <span className="icon md close c-pointer" onClick={() => {
                                this.setState({ ...this.state, showDeleteModal: true, selectedFileIdx: indx,selectedObj:file })

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
                                let { documents: docs } = this.state;
                                let files = docs.details;
                                for (let k in files) {
                                    if (files[k].id == '00000000-0000-0000-0000-000000000000') {
                                        files.splice(k, 1);
                                    } else {
                                        if (files[k].id == this.state.selectedObj.id) {
                                            files[k].state = 'Deleted'
                                        }
                                    }
                                }
                                let obj=Object.assign([],files)
                                let {filesList}=this.state
                                filesList.splice(this.state.selectedFileIdx, 1);
                                if(!this.state?.isEdit){
                                    obj.splice(this.state.selectedFileIdx, 1);
                                }
                                this.setState({ ...this.state, filesList, showDeleteModal: false });
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