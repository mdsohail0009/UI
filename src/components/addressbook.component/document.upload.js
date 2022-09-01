import { Component } from "react";
import { Row, Col, Typography,Upload  } from 'antd';

const { Dragger } = Upload;
const {Paragraph,Text,Title}=Typography;
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

    render() {
        return <Row >
            <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="text-left">
                <div className='mb-24'>
                    <Paragraph
                        className="mb-16 fs-14 text-white fw-500"
                    >{this.props.title}</Paragraph>
                    <Dragger accept=".pdf,.jpg,.jpeg,.png, .PDF, .JPG, .JPEG, .PNG"
                        className="upload mt-16"
                        multiple={false} action={process.env.REACT_APP_UPLOAD_API + "UploadFile"}
                        showUploadList={false}
                        beforeUpload={(props) => { this.beforeUpload(props) }}
                    >
                        <p className="ant-upload-drag-icon">
                            <span className="icon xxxl doc-upload" />
                        </p>
                        <p className="ant-upload-text fs-18 mb-0">Drag and drop or browse to choose file</p>
                        <p className="ant-upload-hint text-secondary fs-12">
                            PNG, JPG,JPEG and PDF files are allowed
                        </p>
                    </Dragger>
                    {/* <div className="docfile">
                        <span className={`icon xl file mr-16`} />
                        <div className="docdetails c-pointer">
                            <EllipsisMiddle suffixCount={6}>Identity card</EllipsisMiddle>
                            <span className="fs-12 text-secondary">25 KB</span>
                        </div>
                        <span className="icon md close c-pointer" />
                    </div> */}
                </div>
            </Col>
        </Row>
    }
}
export default AddressDocumnet;