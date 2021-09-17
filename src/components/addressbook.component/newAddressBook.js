import React, { Component } from 'react';
import { Form, Input, Typography, Button } from 'antd'

const { Text } = Typography;
class NewAddressBook extends Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {}
    }
    saveAddressBook = (values) => {
        console.log(values)
    }
    render() {
        return (
            <>
                <div className="mt-16">
                    <Form
                        ref={this.formRef}
                        onFinish={this.saveAddressBook()} >
                        <Form.Item
                            className="custom-forminput mb-0 pr-0"
                            name="label" >
                            <div>
                                <div className="d-flex">
                                    <Text className="input-label">Address Label</Text>
                                    <span style={{ color: "#fafcfe", paddingLeft: "2px" }}>*</span>
                                </div>
                                <Input className="cust-input" placeholder="Enter Address label" />
                            </div>
                        </Form.Item>
                        <Form.Item
                            className="custom-forminput mb-0 pr-0"
                            name="coins" >
                            <div>
                                <div className="d-flex">
                                    <Text className="input-label">Coins</Text>
                                    <span style={{ color: "#fafcfe", paddingLeft: "2px" }}>*</span>
                                </div>
                                <Input className="cust-input" placeholder="Select from Coins" />
                            </div>
                        </Form.Item>
                        <Form.Item
                            className="custom-forminput mb-0 pr-0"
                            name="currentpassword" >
                            <div>
                                <div className="d-flex">
                                    <Text className="input-label">Address</Text>
                                    <span style={{ color: "#fafcfe", paddingLeft: "2px" }}>*</span>
                                </div>
                                <Input className="cust-input" placeholder="Enter Address" />
                            </div>
                        </Form.Item>
                        <div style={{ marginTop: '50px' }} className="">
                            <Button
                                htmlType="submit"
                                size="large"
                                block
                                className="pop-btn"
                            >
                                Save
                            </Button>
                            <Button
                                htmlType="cancel"
                                size="large"
                                block
                                className="pop-cancel"
                            >
                                Cancel
                            </Button>
                        </div>

                    </Form>
                </div>
            </>
        )
    }
}

export default NewAddressBook;