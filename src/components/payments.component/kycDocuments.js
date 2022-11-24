import React, { useState } from 'react';
import { Button, Spin, Upload, Typography, Form, Input } from 'antd';
import { connect } from 'react-redux';
import { LoadingOutlined } from '@ant-design/icons';
import { setStep } from '../../reducers/paymentsReducer';
import { validateContentRule } from '../../utils/custom.validator'
import Translate from 'react-translate-component';

const { Dragger } = Upload;
const { Paragraph, Text } = Typography;
const { TextArea } = Input;

const EllipsisMiddle = ({ suffixCount, children }) => {
    const start = children.slice(0, children.length - suffixCount).trim();
    const suffix = children.slice(-suffixCount).trim();
    return (
        <Text className="mb-0 fs-14 docname c-pointer d-block" style={{ maxWidth: '100%' }} ellipsis={{ suffix }}>
            {start}
        </Text>
    );
};
const KycDocuments = (props) => {
    const [btnDisabled, setBtnDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const antIcon = <LoadingOutlined style={{ fontSize: 18, color: '#fff', marginRight: '16px' }} spin />;
    return (
        <>
            <div className='mb-24'>
                <Paragraph
                    //content="Beneficiary_Details"
                    //component={Paragraph}
                    className="mb-16 fs-14 text-white fw-500 text-upper"
                >Please provide your identity proof</Paragraph>
                <Dragger accept=".pdf,.jpg,.jpeg,.png, .PDF, .JPG, .JPEG, .PNG"
                    className="upload mt-4"
                    multiple={false} action={process.env.REACT_APP_UPLOAD_API + "UploadFile"}
                    showUploadList={false}
                    beforeUpload={(props) => { this.beforeUpload(props) }}
                //onChange={(props) => { this.handleUpload(props, doc) }}
                headers={{Authorization : `Bearer ${this.props.user.access_token}`}}
                >
                    <p className="ant-upload-drag-icon">
                        <span className="icon xxxl doc-upload" />
                    </p>
                    <p className="ant-upload-text fs-18 mb-0">Drag and drop or browse to choose file</p>
                    <p className="ant-upload-hint text-secondary fs-12">
                        PNG, JPG,JPEG and PDF files are allowed
                    </p>
                </Dragger>
                <div className="docfile">
                    <span className={`icon xl file mr-16`} />
                    <div className="docdetails c-pointer">
                        <EllipsisMiddle suffixCount={6}>Identity card</EllipsisMiddle>
                        <span className="fs-12 text-secondary">25 KB</span>
                    </div>
                    <span className="icon md close c-pointer" />
                </div>
            </div>
            <div>
                <Paragraph
                    //content="Beneficiary_Details"
                    //component={Paragraph}
                    className="mb-16 fs-14 text-white fw-500 text-upper"
                >Please provide your address proof</Paragraph>
                <Dragger accept=".pdf,.jpg,.jpeg,.png, .PDF, .JPG, .JPEG, .PNG"
                    className="upload mt-4"
                    multiple={false} action={process.env.REACT_APP_UPLOAD_API + "UploadFile"}
                    showUploadList={false}
                    beforeUpload={(props) => { this.beforeUpload(props) }}
                //onChange={(props) => { this.handleUpload(props, doc) }}
                headers={{Authorization : `Bearer ${this.props.user.access_token}`}}
                >
                    <p className="ant-upload-drag-icon">
                        <span className="icon xxxl doc-upload" />
                    </p>
                    <p className="ant-upload-text fs-18 mb-0">Drag and drop or browse to choose file</p>
                    <p className="ant-upload-hint text-secondary fs-12">
                        PNG, JPG,JPEG and PDF files are allowed
                    </p>
                </Dragger>
                <div className="docfile">
                    <span className={`icon xl file mr-16`} />
                    <div className="docdetails c-pointer">
                        <EllipsisMiddle suffixCount={6}>Address Details</EllipsisMiddle>
                        <span className="fs-12 text-secondary">25 KB</span>
                    </div>
                    <span className="icon md close c-pointer" />
                </div>
            </div>
            <Form className='mt-16'>
                <Form.Item
                    label="Remarks"
                    className="input-label"
                    rules={[
                        {
                            validator: validateContentRule
                        }
                    ]}
                >
                    <TextArea className='cust-input' rows={4} placeholder="Remarks">
                    </TextArea>
                </Form.Item>
            </Form>
            <Button 
                htmlType="submit"
                size="large"
                block
                className="pop-btn mt-36"
                disabled={btnDisabled}
                onClick={() => props.dispatch(setStep('step3'))}
            >
                {isLoading && <Spin indicator={antIcon} />}  <Translate content="submit" />
            </Button>
        </>
    )
}

const connectStateToProps = ({ useConfig, oidc }) => {
    return {
        useConfig,  user: oidc.user
    }
}

const connectDispatchToProps = (dispatch) => {
    return {
        dispatch
    }
}

export default connect(connectStateToProps, connectDispatchToProps)(KycDocuments);