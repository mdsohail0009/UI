import React, { Component } from "react";
import List from "../grid.component";
import {
    Tooltip,
    Modal,
    message,
    Button,
    Alert,
    Form,
    Upload,
    Row,
    Col,
    Input
} from "antd";
import apiCalls from "../../api/apiCalls";
import { connect } from "react-redux";
import { setCurrentAction } from "../../reducers/actionsReducer";
import Loader from "../../Shared/loader";
import { validateContentRule } from "../../utils/custom.validator";
import { store } from "../../store";
import CryptoJS from "crypto-js";
import { uuidv4, getFileURL, SaveTransaction } from "./api";

class UploadMassPayments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isCheck: false,
            selectedObj: {},
            selection: [],
            modal: false,
            isValidFile: true,
            stateLoading: true,
            gridUrl: process.env.REACT_APP_GRID_API + "MassPayments/Transaction",
            param: { customerId: this.props.userConfig?.id },
            Name: "",
            obj: {
                id: [],
                tableName: "Notice.Notices",
                modifiedBy: "",
                status: []
            },
            uploadObj: {
                Name: "",
                TransactionId: "",
                FilePath: "",
                UploadBy: "",
                Status: ""
            },
            alert: false,
            downloadErrorMsg: false,
            uploadLoader: false,
            errorMessage: ""
        };
        this.gridRef = React.createRef();
        this.formref = React.createRef();
    }

    gridColumns = [
        {
            field: "",
            title: "",
            width: 50,
            customCell: (props) => (
                <td>
                    {" "}
                    <label className="text-center custom-checkbox">
                        <input
                            id={props.dataItem.id}
                            name="isCheck"
                            type="checkbox"
                            checked={this.state.selection.indexOf(props.dataItem.id) > -1}
                            onChange={(e) => this.checkChange(props, e)}
                        />
                        <span></span>{" "}
                    </label>
                </td>
            )
        },
        {
            field: "name",
            title: "Name",
            filter: true,
            customCell: (props) => (
                <td>
                    <div
                        className="gridLink"
                        onClick={() => this.uploadMassPaymentsView(props)}
                    >
                        {" "}
                        {props.dataItem.name}
                    </div>
                </td>
            )
        },
        { field: "createdDate", title: "Date", filter: true, filterType: "date" },
        { field: "uploadStatus", title: "Upload Status", filter: true },
        { field: "remarks", title: "Remarks", filter: true }
    ];
    componentDidMount = () => {
        this.UploadMassPaymentsTrack();
    };

    UploadMassPaymentsTrack = () => {
        apiCalls.trackEvent({
            Type: "User",
            Action: "Upload Mass Payments grid page view",
            Username: this.props.userConfig?.userName,
            MemeberId: this.props.userConfig?.id,
            Feature: "Upload Mass Payments",
            Remarks: "Upload Mass Payments grid page view",
            Duration: 1,
            Url: window.location.href,
            FullFeatureName: "Uplaod Mass Payments"
        });
    };
    _encrypt(msg, key) {
        msg = typeof msg === "object" ? JSON.stringify(msg) : msg;
        var salt = CryptoJS.lib.WordArray.random(128 / 8);
        key = CryptoJS.PBKDF2(key, salt, {
            keySize: 256 / 32,
            iterations: 10
        });
        var iv = CryptoJS.lib.WordArray.random(128 / 8);
        var encrypted = CryptoJS.AES.encrypt(msg, key, {
            iv: iv,
            padding: CryptoJS.pad.Pkcs7,
            mode: CryptoJS.mode.CBC
        });
        return salt.toString() + iv.toString() + encrypted.toString();
    }

    uploadMassPaymentsView = (e) => {
        const rowId = e.dataItem.id;
        this.props.history.push("/uploadmasspayments/" + rowId);
        apiCalls.trackEvent({
            Action: "Upload Mass Payment details page View",
            Feature: "Upload Mass Payments",
            Remarks: "Upload Mass Payments details page View",
            FullFeatureName: "Upload Mass Payments",
            userName: this.props.userConfig.userName,
            id: this.props.userConfig.id
        });
    };

    checkChange = (prop, e) => {
        const rowObj = prop.dataItem;
        const value =
            e.currentTarget.type === "checkbox"
                ? e.currentTarget.checked
                : e.currentTarget.value;
        const name = e.currentTarget.name;
        let { selection } = this.state;
        let idx = selection.indexOf(rowObj.id);
        if (selection) {
            selection = [];
        }
        if (idx > -1) {
            selection.splice(idx, 1);
        } else {
            selection.push(rowObj.id);
        }
        this.setState({
            ...this.state,
            [name]: value,
            selectedObj: rowObj,
            selection: selection
        });
    };
    success = () => {
        message.success({
            content:
                "Record " +
                (this.state.selectedObj.status === "Active"
                    ? "deactivated"
                    : "activated") +
                " successfully",
            className: "custom-msg",
            duration: 1
        });
    };

    handleCancel = (e) => {
        this.props.dispatch(setCurrentAction(null));
        this.setState({
            ...this.state,
            modal: false,
            selection: [],
            isCheck: false,
            error: null
        });
        this.formref.current.resetFields();
        this.gridRef.current.refreshGrid();
    };


    uploadExcelMassPayments = () => {
        debugger
        const _currentScreen = window.location.pathname.split("/")[1];
        const {
            oidc: { user },
            userConfig: { userProfileInfo },
            //permissions: { currentScreen }
        } = store.getState();
        const Authorization = `Bearer ${user.access_token}`;
        const Authentication = this._encrypt(
            `{CustomerId:"${userProfileInfo?.id}",Action:"view", PermissionKey:"${this.props.pKey || _currentScreen 
            }"}`,
            userProfileInfo.sk
        );
        this.setState(
            {
                ...this.state,
                modal: true,
                headers: {
                    Authorization: Authorization,
                    AuthInformation: Authentication
                }
            },
            () => {
                this.setState({
                    ...this.state,
                    stateLoading: true,
                    headers: {
                        Authorization: Authorization,
                        AuthInformation: Authentication
                    }
                });
                setTimeout(
                    () =>
                        this.setState({
                            ...this.state,
                            stateLoading: false,
                            headers: {
                                Authorization: Authorization,
                                AuthInformation: Authentication
                            }
                        }),
                    1000
                );

                setTimeout(
                    () =>
                        this.formref.current.setFieldsValue({
                            ...this.state
                        }),
                    1000
                );
            }
        );
        apiCalls.trackEvent({
            Action: "Upload MassPayment page ",
            Feature: "Upload MassPayments",
            Remarks: "Upload MassPayment page ",
            FullFeatureName: "Upload MassPayments ",
            userName: this.props.userConfig.userName,
            id: this.props.userConfig.id
        });
    };

    showReqDocModal = () => {
        if (!this.state.isCheck) {
            this.setState({ alert: true });
            setTimeout(() => this.setState({ alert: false }), 1000);
        } else {
            this.setState({ ...this.state, modal: true });
        }
    };

    getFileURL = async (props) => {
        if (props.dataItem.failedRecords === 0) {
            this.setState({ downloadErrorMsg: true });
            setTimeout(() => this.setState({ downloadErrorMsg: false }), 1000);
        } else {
            let res = await getFileURL(props.dataItem.id);
            if (res.ok) {
                window.open(res.data.result, "_blank");
            }
        }
    };

    beforeUpload = (file) => {
        debugger
        let fileType = {
            "application/csv": true,
            "application/vnd.ms-excel": true,
            "text/csv": true
        };
        if (fileType[file.type]) {
            this.setState({ ...this.state, isValidFile: true });
            return true;
        } else {
            message.error({
                content: `File is not allowed. You can upload only csv files`,
                className: "custom-msg"
            });
            this.setState({ ...this.state, isValidFile: false });
            return Upload.LIST_IGNORE;
        }
    };

    uopdateReplyObj = (item, list) => {
        for (let obj of list) {
            if (obj.id === item.id) {
                obj = item;
            }
        }
        return list;
    };
    isDocExist(lstObj, id) {
        const lst = lstObj.filter((obj) => {
            return obj.docunetDetailId === id;
        });
        return lst[0];
    }
    messageObject = (id) => {
        return {
            id: uuidv4(),
            docunetDetailId: id,
            path: []
        };
    };

    handleUpload = async ({ file }, doc) => {
        debugger
        this.setState({
            ...this.state,
            uploadLoader: true,
            errorMessage: null,
            docReplyObjs: []
        });
        if (file.status !== "done" && this.state.isValidFile) {
            let replyObjs = [...this.state.docReplyObjs];
            let item = this.isDocExist(replyObjs, doc?.id);
            let obj;
            if (item) {
                obj = item;
                const ObjPath = (function () {
                    if (obj.path === "string") {
                        return JSON.parse(obj.path);
                    } else {
                        return obj.path ? obj.path : [];
                    }
                })();
                obj.path = obj.path && typeof ObjPath;
                obj.path.push({
                    filename: file.name,
                    path: file.response,
                    size: file.size
                });
                replyObjs = this.uopdateReplyObj(obj, replyObjs);
            } else {
                obj = this.messageObject(doc?.id);
                obj.path.push({
                    filename: file.name,
                    path: file.response,
                    size: file.size
                });
                replyObjs.push(obj);
            }
            this.setState({
                ...this.state,
                uploadLoader: false,
                docReplyObjs: replyObjs
            });
        } else if (file.status === "error") {
            message.error({ content: `${file.response}`, className: "custom-msg" });
            this.setState({ ...this.state, uploadLoader: false });
        } else if (!this.state.isValidFile) {
            this.setState({
                ...this.state,
                uploadLoader: false,
                isSubmitting: false
            });
        }
        this.setState({
            ...this.state,
            uploadLoader: false,
            path: file.status === "done" ? file.response : null
        });
    };

    handleChange = (e) => {
        this.setState({ ...this.state, Name: e.target.value });
    };

    onFieldUpdate = (e) => {
        if (this.state.Name) {
            this.setState({ ...this.state, Name: e });
        }
    };

    onClickRefresh = async () => {
        this.gridRef.current.refreshGrid();
    };

    saveUploadMassPayments = async (values) => {
        if (this.state.Name) {
            this.state.uploadObj.Name = this.state.Name;
            this.state.uploadObj.TransactionId = null;
            this.state.uploadObj.UploadBy =
                this.props.userConfig?.firstName +
                " " +
                this.props.userConfig?.lastName;
            this.state.uploadObj.Status = null;
            this.state.uploadObj.FilePath = this.state.path;
            this.state.uploadObj.info = JSON.stringify(this.props.trackAuditLogData);

            let res = await SaveTransaction(this.state.uploadObj);
            if (res.ok) {
                this.props.dispatch(setCurrentAction(null));
                this.success();
                this.setState({
                    ...this.state,
                    modal: false,
                    isLoading: true,
                    selection: [],
                    check: false,
                    error: null
                });
                this.gridRef.current.refreshGrid();
            } else {
                this.setState({
                    ...this.state,
                    uploadLoader: false,
                    error: res.data.messages?.[0]
                });
            }
        }
        apiCalls.trackEvent({
            Type: "User",
            Action: "Upload Mass Payment saved",
            Username: this.props.userConfig?.userName,
            MemeberId: this.props.userConfig?.id,
            Feature: "Upload Mass Payment",
            Remarks: "Upload Mass Payment saved",
            Duration: 1,
            Url: window.location.href,
            FullFeatureName: "Uplaod Mass Payment"
        });
    };
    render() {
        const { gridUrl, param, headers } = this.state;

        return (
            <>
                {this.state.alert && (
                    <div className="custom-alert">
                        <Alert
                            message="Please select the one record"
                            type="warning"
                            showIcon
                            closable={false}
                        />
                    </div>
                )}
                {this.state.downloadErrorMsg && (
                    <div className="custom-alert">
                        <Alert
                            message="Cannot download 0 Failed Records"
                            type="warning"
                            showIcon
                            closable={false}
                        />
                    </div>
                )}
             
                <div class="mb-16 text-right">
                    <Button
                        onClick={this.uploadExcelMassPayments}
                        style={{ height: "40px" }}
                        className="pop-btn mb-36 mt-24"
                    >
                        {/* <Translate
                            content=""
                            component={Text}

                        /> */}
                        <span className="icon md add-icon-black ml-8"></span>
                    </Button>

                </div>
                <List
                    pKey={"uploadmasspayments"}
                    url={gridUrl}
                    additionalParams={param}
                    ref={this.gridRef}
                    columns={this.gridColumns}
                />
                <Modal
                    title="Upload File"
                    visible={this.state.modal}
                    closeIcon={
                        <Tooltip title="Close">
                            <span className="icon md close-white c-pointer" onClick={this.handleCancel} />
                        </Tooltip>
                    }
                    footer={
                        <>
                            <Button 
                            style={{ width: "100px", border: "1px solid #f2f2f2" }}
                                className=" pop-cancel"
                                onClick={() => this.handleCancel()}>Cancel</Button>
                            <Button className="primary-btn pop-btn"
                                style={{ width: 100, height: 50 }}
                                key="submit"
                                htmlType="submit"
                                onClick={this.saveUploadMassPayments}
                            >Ok</Button>

                        </>
                    }
                >
                    <div className="">
                    {this.state.stateLoading && <Loader /> ||
                    <div>
                        <Form
                            ref={this.formref}
                            className="ant-advanced-search-form"
                            autoComplete="off"
                            onFinish={this.handleOk}
                        >
                            {this.state.error != undefined && this.state.error != null && (
                                <Alert type="error" showIcon message={this.state.error} />
                            )}
                            {/* <Row gutter={24} className="mb-24 pb-24 border-bottom">
                                <Col xs={24} sm={24} md={24}>
                                    <Form.Item
                                        name="Name"
                                        label="Name"
                                        className="input-label"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Is required",
                                                whitespace: true
                                            },
                                            {
                                                validator: validateContentRule
                                            }
                                        ]}
                                    >
                                        <Input
                                            placeholder="Name"
                                            className="cust-input"
                                            maxLength={50}
                                            value={this.state.Name}
                                            onChange={this.handleChange}
                                            onUpdate={this.onFieldUpdate.bind(this, this.state.Name)}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24}></Col>
                            </Row> */}
                            <label className="text-white-30">
                                Attachments
                                <Tooltip title="Only csv files Upload">
                                    <span className="icon md info ml-4" />
                                </Tooltip>
                            </label>
                            <div className="reply-container">
                                <div className="reply-body">
                                    <div className="chat-send custom-import mb-0 d-block text-right">
                                        <div className="align-center">
                                            <Tooltip title="Attachments">
                                                <Upload
                                                    accept=".xlsx, .xls, .csv"
                                                    multiple="false"
                                                    onChange={(props) => this.handleUpload(props)}
                                                    beforeUpload={(props) => {
                                                        this.beforeUpload(props);
                                                    }}
                                                    showUploadList={true}
                                                    action={
                                                        process.env.REACT_APP_API_END_POINT +
                                                        "/api/v1/ImportExcel/UploadAttachedFile"
                                                    }
                                                    headers={headers}
                                                >
                                                    {!this.state.path && (
                                                        <span className="icon md attach mr-16 c-pointer mt-8" />
                                                    )}
                                                </Upload>{" "}
                                            </Tooltip>
                                            {this.state.uploadLoader && <Loader />}
                                        </div>
                                    </div>
                                    {this.state.errorMessage != null && (
                                        <div className="text-red">{this.state.errorMessage}</div>
                                    )}
                                    <div className="docfile-container"></div>
                                </div>
                            </div>
                            {/* <Form.Item className="mb-0">
                                <div className="text-right">
                                  
                                            <Button style={{ width: 100 }}
                                                className=" pop-cancel"
                                                onClick={() => this.handleCancel()}>Cancel</Button>
                                            <Button className="primary-btn pop-btn"
                                                style={{ width: 100, height: 50 }}
                                                key="submit"
                                                htmlType="submit"
                                                onClick={this.saveUploadMassPayments}
                                            >Ok</Button>
                                   
                                </div>
                            </Form.Item> */}
                        </Form>
                      </div> }
                    </div>
                </Modal>
            </>
        );
    }
}
const connectStateToProps = ({ breadCrumb, oidc, userConfig, trackAuditLogData }) => {
    return { breadCrumb, oidc, userConfig: userConfig.userProfileInfo, trackAuditLogData: userConfig, trackAuditLogData };
};

export default connect(connectStateToProps, (dispatch) => {
    return { dispatch };
})(UploadMassPayments);
