import React, { Component } from 'react';
import { Drawer, Typography, Col, List,Empty, Image,Button,Modal} from 'antd';
import Translate from 'react-translate-component';
import { connect } from 'react-redux';
import Search from "antd/lib/input/Search";
import { fetchMemberWallets } from "../dashboard.component/api";
import NumberFormat from "react-number-format";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import PaymentPreview from './paymentPreview';
import pending from '../../assets/images/pending.png'
const { Title,Paragraph } = Typography
class AddBatchPayment extends Component {
    state = {
        fiatWalletsLoading: false,
        fiatWallets: [],
        filtercoinsList: [],
        searchFiatVal: "",
        isCoinsListHide: false,
        showModal: false,
        paymentPreview: false

    }

    componentDidMount() {
          this.setState({ ...this.state, fiatWalletsLoading: true });
          fetchMemberWallets(this.props?.userProfile?.id).then(res => {
            if (res.ok) {
                this.setState({ ...this.state, fiatWallets: res.data, filtercoinsList: res.data, fiatWalletsLoading: false });
            } else {
                this.setState({ ...this.state, fiatWallets: [], filtercoinsList: [], fiatWalletsLoading: false });
            }
          });
      }

    
    closeDrawer = () => {
        this.setState({ ...this.state, paymentPreview: false,showModal:false,isCoinsListHide: false});
        if (this.props.onClose) {
            this.props.onClose();
        }
    }
    uploadExcel=()=>{
        this.setState({ ...this.state, showModal:true});
    }
    selectWhitelist=()=>{
        this.props.history.push('/payments/00000000-0000-0000-0000-000000000000/add') 
    }

    render() {
        return (
           <div>
        <Drawer destroyOnClose={true}
            title={[<div className="side-drawer-header">
                <span></span>
                <div className="text-center">
                {!this.state.isCoinsListHide && <> <div className='text-white fs-24 fw-500'>Batch Payments</div> </>}
                </div>
                <span onClick={this.closeDrawer} className="icon md close-white c-pointer" />
               
            </div>]}
            
            placement="right"
            closable={true}
            visible={this.props.showDrawer}
            closeIcon={null}
            className="side-drawer w-50p"
        >
            { !this.state.isCoinsListHide && <>
            <div className="mt-8">
                <Title
                    className='sub-heading code-lbl'>Make payments</Title>
            </div>
            <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                <Search placeholder="Search Currency" value={this.state.searchFiatVal} addonAfter={<span className="icon md search-white" />} onChange={this.handleFiatSearch} size="middle" bordered={false} className="text-center mb-16" />
            </Col>
            <List
                itemLayout="horizontal"
                dataSource={this.state.fiatWallets}
                className="crypto-list auto-scroll wallet-list"
                loading={this.state.fiatWalletsLoading}
                locale={{
                    emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={
                        <Translate content="No_data" />
                    } />
                }}
                renderItem={item => (
                    <List.Item onClick={() => this.setState({ ...this.state, selectedCurrency: item.walletCode, isCoinsListHide: true }, () => { })}>
                    <Link>
                      <List.Item.Meta
                        avatar={<Image preview={false} src={item.imagePath} />}

                        title={<div className="wallet-title">{item.walletCode}</div>}
                      />
                       <><div className="text-right coin-typo">
                                        <NumberFormat value={item.amount} className="text-white-30 fw-600" displayType={'text'} thousandSeparator={true} prefix={item.walletCode == 'USD' ? '$' : '€'} renderText={(value, props) => <div {...props} >{value}</div>} />

                                    </div></>
                    </Link>
                  </List.Item>
                )}
              />
              </>}
              {this.state.isCoinsListHide && <>
              <div>
               
                <div className='text-center makepayment-section'>
            <Title className='text-white fs-24 fw-500'>Send USD to Multiple Address</Title>
            <Button className='pop-btn mt-24'onClick={this.uploadExcel}>Upload Excel</Button>
            <Paragraph className='text-white-30 '>To download the excel, <a className='fw-700'> click here</a></Paragraph>
            <Button className='pop-btn'onClick={this.selectWhitelist}>Select from Whitelisted Addresses</Button>
            </div>
              </div>
              </>}
        </Drawer>
                <Modal
                     visible={this.state.showModal}
                    closable={false}
                    closeIcon={false}
                    footer={null}>
                        <>
                        <div className='text-center p-16'>
                            <Paragraph className='text-white fs-18'>Document has been successfully uploaded.</Paragraph>
                            <Button className="primary-btn pop-btn"
                                style={{ width: 100, height: 50 }}
                                onClick={() => this.setState({ ...this.state, showModal: false, paymentPreview: true }, () => { })}>Next</Button>
                        </div>
                        </>
                </Modal>
                {this.state.paymentPreview &&
                       <PaymentPreview
                        showDrawer={this.state.paymentPreview}
                        onClose={() => {
                            this.closeDrawer();
                        }}
                    />
                       }
        </div>

        );
       
    }
}
const connectStateToProps = ({ sendReceive, userConfig }) => {
    return {sendReceive, userProfile: userConfig.userProfileInfo }
}
const connectDispatchToProps = dispatch => {
    return {
        dispatch
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(withRouter(AddBatchPayment));