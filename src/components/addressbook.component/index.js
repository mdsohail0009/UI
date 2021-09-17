import React, { Component } from 'react';
import { Typography, Drawer, Button, Tabs, Form, Input, Row, Col } from 'antd'
import { setStep } from '../../reducers/addressBookReducer';
import connectStateProps from '../../utils/state.connect';
import Translate from 'react-translate-component';
import { processSteps as config } from './config';
import NewAddressBook from './newAddressBook';


const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;
class AddressBook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        }
    }
    showDrawer = () => {
        this.setState({ visible: true })
    }

    closeBuyDrawer = () => {
        this.setState({ visible: false })
    }
    onFinish = () => {

    }
    tabChange = () => {

    }
    renderContent = () => {
        const stepcodes = {
            newaddressbook: <NewAddressBook />,
        }
        return stepcodes[config[this.props.addressBookReducer.stepcode]]
    }
    renderTitle = () => {
        const titles = {
            newaddressbook: <span onClick={this.closeBuyDrawer} className="icon md lftarw-white c-pointer" />,
        }
        return titles[config[this.props.addressBookReducer.stepcode]]
    }
    renderIcon = () => {
        const stepcodes = {
            newaddressbook: <span onClick={this.closeBuyDrawer} className="icon md close-white c-pointer" />
        }
        return stepcodes[config[this.props.addressBookReducer.stepcode]]
    }
    render() {
        return (
            <>
                <div className="box basic-info">
                    <Title className="basicinfo">Withdraw Crypto</Title>
                    <Paragraph className="basic-decs mb-16">User customized addressbook</Paragraph>
                    <Form
                        className="mt-24"
                        onFinish={this.onFinish()} >
                        <Row>

                            <Col sm={24} md={24} className="px-8 mb-16">
                                <div className="d-flex">
                                    <label className="input-label profile-label">Select Coins</label>
                                    <Form.Item
                                        name="coins"
                                        style={{ flexGrow: 5 }}
                                        className="input-label selectcustom-input mb-0"
                                        label="Coins">
                                        <Input className="cust-input cust-adon mb-0" addonAfter={<i className="icon md downarrow-icon c-pointer" onClick={() => { this.setState({ ...this.state, visible: true, }) }} />} />
                                    </Form.Item>
                                </div>
                            </Col>
                            <Col sm={24} md={24} className="px-8 ">
                                <div className="d-flex">
                                    <label className="input-label profile-label">Withdraw To</label>
                                    <Tabs defaultActiveKey="1" onChange={this.tabChange()} className="crypto-list-tabs addressbook_tabs" style={{ flexGrow: 5 }}>
                                        <TabPane tab="New Address" key="1">
                                            <Form.Item
                                                name="coins"
                                                className="input-label selectcustom-input mb-0"
                                                label="Address">
                                                <Input className="cust-input cust-adon mb-0" />
                                            </Form.Item>
                                            {/* <Form.Item
                                                name="coins"
                                                className="input-label selectcustom-input mb-0"
                                                label="Network">
                                                <Input className="cust-input cust-adon mb-0" addonAfter={<i className="icon md downarrow-icon c-pointer" onClick={() => { this.setState({ ...this.state, visible: true, }) }} />} />
                                            </Form.Item> */}
                                            {/* <div className="wdr-summary d-flex mt-24">
                                                <div>
                                                <label className="mb-0 text-white-30 fw-200">BTC spot balance</label>
                                                <Paragraph className="basic-decs mb-0">0 BTC</Paragraph>
                                                </div>
                                                <div>
                                                <label className="mb-0 text-white-30 fw-200">BTC spot balance</label>
                                                <Paragraph className="basic-decs mb-0">0 BTC</Paragraph>
                                                </div>
                                            </div> */}
                                            <Row className='mt-24 ml-16'>
                                                <Col sm={12} className="pb-16">
                                                <label className="mb-0 text-white-30 fw-200">BTC spot balance</label>
                                                <Paragraph className="basic-decs mb-0">0 BTC</Paragraph>
                                                </Col>
                                                <Col sm={12}  className="pb-16">
                                                <label className="mb-0 text-white-30 fw-200">Minimum withdrawal</label>
                                                <Paragraph className="basic-decs mb-0">0.0000088 BTC</Paragraph>
                                                </Col>
                                                <Col sm={12}  className="pb-16">
                                                <label className="mb-0 text-white-30 fw-200">Network fee</label>
                                                <Paragraph className="basic-decs mb-0">0.0000044 ~ 0.0006 BTC</Paragraph>
                                                </Col>
                                                <Col sm={12}  className="pb-16">
                                                <label className="mb-0 text-white-30 fw-200">24h remaining limit</label>
                                                <Paragraph className="basic-decs mb-0">0.06 BTC/0.06 BTC</Paragraph>
                                                </Col>
                                            </Row>
                                        </TabPane>
                                        <TabPane tab="Add Address" key="2">

                                            <Form.Item
                                                name="coins"
                                                className="input-label selectcustom-input mb-0"
                                                label="Address Book">
                                                <Input className="cust-input cust-adon mb-0" addonAfter={<i className="icon md downarrow-icon c-pointer" onClick={() => { this.setState({ ...this.state, visible: true, }) }} />} />
                                            </Form.Item>
                                            <Row className='mt-24 ml-16'>
                                                <Col sm={12} className="pb-16">
                                                <label className="mb-0 text-white-30 fw-200">BTC spot balance</label>
                                                <Paragraph className="basic-decs mb-0">0 BTC</Paragraph>
                                                </Col>
                                                <Col sm={12}  className="pb-16">
                                                <label className="mb-0 text-white-30 fw-200">Minimum withdrawal</label>
                                                <Paragraph className="basic-decs mb-0">0.0000088 BTC</Paragraph>
                                                </Col>
                                                <Col sm={12}  className="pb-16">
                                                <label className="mb-0 text-white-30 fw-200">Network fee</label>
                                                <Paragraph className="basic-decs mb-0">0.0000044 ~ 0.0006 BTC</Paragraph>
                                                </Col>
                                                <Col sm={12}  className="pb-16">
                                                <label className="mb-0 text-yellow fw-200 ">24h remaining limit</label>
                                                <Paragraph className="basic-decs  mb-0">0.06 BTC/0.06 BTC</Paragraph>
                                                </Col>
                                            </Row>
                                        </TabPane>
                                    </Tabs>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </div>

                <Drawer destroyOnClose={true}
                    title={[<div className="side-drawer-header">
                        {this.renderTitle()}
                        <div className="text-center fs-16">
                            <Paragraph className="mb-0 text-white-30 fw-600 text-upper">Add New Address</Paragraph>
                            {/* <Translate className="mb-0 text-white-30 fw-600 text-upper" content={this.props.addressBookReducer.stepTitles[config[this.props.addressBookReducer.stepcode]]} component={Paragraph} />
                            <Translate className="text-white-50 mb-0 fs-14 fw-300" content={this.props.addressBookReducer.stepSubTitles[config[this.props.addressBookReducer.stepcode]]} component={Paragraph} /> */}
                        </div>
                        {this.renderIcon()}
                    </div>]}

                    placement="right"
                    closable={true}
                    visible={this.state.visible}
                    closeIcon={null}
                    className="side-drawer"

                >
                    {this.renderContent()}
                </Drawer>
            </>
        )
    }
}

export default connectStateProps(AddressBook);