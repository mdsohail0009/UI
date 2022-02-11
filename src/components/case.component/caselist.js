import React, { Component } from "react";
import { Row, Col, Alert } from "antd";
// import { getDocList } from "./api";
import Loader from "../loader.component";

class CaseList extends Component {
    state = {
        docList: [],
        selectedDocs: [],
        isLoading: false,
        errorMsg:null
    }
    handleDocSelection = ({ currentTarget: { checked } }, doc) => {
        let _docs = [...this.state.selectedDocs];
        if (checked) {
            _docs.push(doc)
        } else {
            _docs = _docs.filter(item => item.id != doc.id);
        }
        this.setState({ ...this.state, selectedDocs: _docs }, () => {
            this.props.onDocSelect(_docs);
        });
    }
    componentDidMount() {
        this.loadDocList();
    }
    loadDocList = async () => {
        this.setState({ isLoading: true })
        let response = await getDocList();
        if (response.ok) {
            this.setState({ isLoading: false })
            this.setState({ ...this.state, docList: response.data, errorMsg:null });
        } else {
            this.setState({
                ...this.state, errorMsg: response.status === 401 ? (response.data.message) : response.data, isLoading:false
            });
        }
    }
    render() {
        return (
            <>
            {this.state.errorMsg != undefined && this.state.errorMsg != null && <Alert type="error" className="mb-16" showIcon message={this.state.errorMsg} />}
                <Row style={{ rowGap: 10 }}>
                    {this.state.isLoading ? <Loader /> : <>
                        {this.state.docList?.map((doc, idx) => <Col span={12} key={idx}>
                            <div className="d-flex align-center mb-2">
                                <p className="mr-4 mb-0">
                                    <label className="text-center custom-checkbox">
                                        <input name="check" onClick={(e) => this.handleDocSelection(e, doc)} checked={this.state.selectedDocs.filter(item => item.id == doc.id).length > 0} type="checkbox" />
                                        <span></span>
                                    </label>

                                </p>
                                <span>{doc.name}</span>
                            </div>
                        </Col>
                        )}</>}
                </Row>
            </>
        );
    }
}
export default CaseList;
