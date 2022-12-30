import React from "react";
import { Form, Input, Row, Col, Select, Typography,AutoComplete } from 'antd';
import apiCalls from "../../api/apiCalls";
import { validateContentRule } from "../../utils/custom.validator";
import Translate from "react-translate-component";

const { Option } = Select;
const { Text } = Typography;
const CryptoAdress = ({PayeeLu=[]}) => {
    return <React.Fragment>
        <Form>
            <Row gutter={[16, 16]}>
                <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                        className="custom-forminput custom-label mb-0"
                        name="favouriteName"
                        label={
                            <Translate
                                content="favorite_name"
                                component={Form.label}
                            />
                        }
                        required
                        rules={[
                            {
                                required: true,
                                message: apiCalls.convertLocalLang("is_required"),
                            },
                            {
                                whitespace: true,
                                message: apiCalls.convertLocalLang("is_required"),
                            },
                            {
                                validator: validateContentRule,
                            },
                        ]}
                    >
                        <AutoComplete
                            onChange={(e) => {
                                // handleChange(e)
                            }}
                            maxLength={20}
                            className="cust-input"
                            placeholder={apiCalls.convertLocalLang("favorite_name")}
                        >
                            {PayeeLu?.map((item, indx) => (
                                <Option key={indx} value={item.name}>
                                    {item.name}
                                </Option>
                            ))}
                        </AutoComplete>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
        <div className="mt-36">
            <div className="d-flex align-center justify-content">
                <div>
                    <Text className="mb-16 fs-14 text-aqua fw-500 text-upper" Paragraph>BENEFICIARY ADDRESS DETAILS</Text>
                </div>
                <div className="mb-right">
                    <span class="icon md c-pointer add-icon mr-12"></span>
                    <span class="icon md c-pointer delete-icon mr-12"></span>
                </div>
            </div>
            <table className="custom-table pay-grid view mb-view mt-16 address-book-table">
                <thead>
                    <tr>
                        <th style={{ width: 50 }}></th>
                        <th style={{ width: 150 }}>Coin</th>
                        <th>Address</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="text-center">
                            <label className="text-center custom-checkbox c-pointer cust-check-outline">
                                <input
                                    id={""}
                                    className="c-pointer"
                                    name="isCheck"
                                    type="checkbox"
                                    checked={false}
                                    onChange={(e) => { }}
                                />
                                <span></span>{" "}
                            </label>
                        </td>
                        <td>
                            <Select style={{ width: "100%" }}
                                placeholder="Coin"
                                className="cust-input c-pointer"
                                onChange={(e) => { }}
                                bordered={false}
                            >
                                <Select.Option>USDT-TRC20</Select.Option>
                                <Select.Option>USDT-ERC20</Select.Option>
                                <Select.Option>EUR</Select.Option>
                            </Select>
                        </td>
                        <td>
                            <Input className="cust-input" placeholder="Address" />
                        </td>
                    </tr>
                    <tr>
                        <td className="text-center">
                            <label className="text-center custom-checkbox c-pointer cust-check-outline">
                                <input
                                    id={""}
                                    className="c-pointer"
                                    name="isCheck"
                                    type="checkbox"
                                    checked={false}
                                    onChange={(e) => { }}
                                />
                                <span></span>{" "}
                            </label>
                        </td>
                        <td>
                            <Select style={{ width: "100%" }}
                                placeholder="Coin"
                                className="cust-input c-pointer"
                                onChange={(e) => { }}
                                bordered={false}
                            >
                                <Select.Option>USDT-TRC20</Select.Option>
                                <Select.Option>USDT-ERC20</Select.Option>
                                <Select.Option>EUR</Select.Option>
                            </Select>
                        </td>
                        <td>
                            <Input className="cust-input" placeholder="Address" />
                        </td>
                    </tr>
                </tbody>
            </table>

        </div>
    </React.Fragment>
}
export default CryptoAdress