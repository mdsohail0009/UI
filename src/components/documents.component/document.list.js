import React, { Component } from "react";
import { Row, Col } from "antd";
import { uuidv4 } from "./api";

class DocumentsList extends Component {
    state = {
        docList: [
            { documentName: "Additional source of funds documentation", id: uuidv4() },
            { documentName: "Identity Document", id: uuidv4() },
            { documentName: "Original proof of address document", id: uuidv4() },
        ],
        selectedDocs: []
    }
    handleDocSelection = ({ currentTarget: { checked } }, doc) => {
        let _docs = [ ...this.state.selectedDocs ];
        if (checked) {
            _docs.push(doc)
        } else {
            _docs = _docs.filter(item => item.id != doc.id);
        }
        this.setState({ ...this.state, selectedDocs: _docs }, () => {
            this.props.onDocSelect(_docs);
        });
    }
    render() {
        return (
            <>
                <Row style={{ rowGap: 10 }}>
                    {this.state.docList?.map((doc, idx) => <Col span={12} key={idx}>
                        <div className="d-flex align-center mb-2">
                            <p className="mr-4 mb-0">
                                <label className="text-center custom-checkbox">
                                    <input name="check" onClick={(e) => this.handleDocSelection(e, doc)} checked={this.state.selectedDocs.filter(item => item.id==doc.id).length > 0} type="checkbox" />
                                    <span></span>
                                </label>

                            </p>
                            <span>{doc.documentName}</span>
                        </div>
                    </Col>
                    )}
                </Row>
            </>
        );
    }
}
export default (DocumentsList);
