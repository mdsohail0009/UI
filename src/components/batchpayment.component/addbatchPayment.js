import React, { Component } from 'react';
import { Drawer, Typography, Col, List,Empty, Image,Button} from 'antd';
import Translate from 'react-translate-component';
import ConnectStateProps from '../../utils/state.connect';
import { connect } from 'react-redux';
import Search from "antd/lib/input/Search";
import { fetchMemberWallets } from "../dashboard.component/api";
import NumberFormat from "react-number-format";
import { Link } from "react-router-dom";
import PaymentAddress from './paymentAddress';
const { Title,Paragraph,Text } = Typography
class AddBatchPayment extends Component {
    state = {
        step: "selectcurrency",
        fiatWalletsLoading: false,
        fiatWallets: [],
        filtercoinsList: [],
        searchFiatVal: "",
        isCoinsListHide: false,

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
        if (this.props.onClose) {
            this.props.onClose();
        }
    }
    changeStep = (step) => {
        this.setState({ ...this.state, step });
    }

    // renderStep = (step) => {
    //     const steps = {
    //         selectcurrency: (
    //           <React.Fragment>
    //             <Drawer destroyOnClose={true}
    //         title={[<div className="side-drawer-header">
    //             <div className="text-center">
    //             <div>Batch Payments</div>
    //             </div>
    //             <span onClick={this.closeDrawer} className="icon md close-white c-pointer" />
               
    //         </div>]}
            
    //         placement="right"
    //         closable={true}
    //         visible={this.props.showDrawer}
    //         closeIcon={null}
    //         className="side-drawer w-50p"
    //         style={{width:"50%"}}
    //     >
    //         <div className="mt-8">
    //             <Title
    //                 className='sub-heading code-lbl'>Make payments</Title>
    //         </div>
    //         <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
    //             <Search placeholder="Search Currency" value={this.state.searchFiatVal} addonAfter={<span className="icon md search-white" />} onChange={this.handleFiatSearch} size="middle" bordered={false} className="text-center mb-16" />
    //         </Col>
    //         <List
    //             itemLayout="horizontal"
    //             dataSource={this.state.fiatWallets}
    //             className="crypto-list auto-scroll wallet-list"
    //             loading={this.state.fiatWalletsLoading}
    //             locale={{
    //                 emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={
    //                     <Translate content="No_data" />
    //                 } />
    //             }}
    //             renderItem={item => (
    //                 <List.Item onClick={() => this.setState({ ...this.state, selectedCurrency: item.walletCode }, () => { this.changeStep("multiaddress")})}>
    //                 <Link>
    //                   <List.Item.Meta
    //                     avatar={<Image preview={false} src={item.imagePath} />}

    //                     title={<div className="wallet-title">{item.walletCode}</div>}
    //                   />
    //                    <><div className="text-right coin-typo">
    //                                     <NumberFormat value={item.amount} className="text-white-30 fw-600" displayType={'text'} thousandSeparator={true} prefix={item.walletCode == 'USD' ? '$' : '€'} renderText={(value, props) => <div {...props} >{value}</div>} />

    //                                 </div></>
    //                 </Link>
    //               </List.Item>
    //             )}
    //           />
    //           <PaymentAddress ></PaymentAddress>
    //     </Drawer>
    //             </React.Fragment>
    //         ),
    //         multiaddress: (
    //         <React.Fragment>
    //              <div className="text-center">
    //             <div>Upload</div>
    //             </div>
    //         </React.Fragment>
    //         )
    //     }
    //     return steps[this.state.step];
    // }
   
    render() {
    //     return <React.Fragment>
    //     {this.renderStep()}
    // </React.Fragment>
        return (
           
        <Drawer destroyOnClose={true}
            title={[<div className="side-drawer-header">
                 <span></span>
                <div className="text-center">
                   
                <div><Text className='mb-8 text-white-30 fw-600 text-captz fs-24'>Batch Payments</Text></div>
                </div>
                <span onClick={this.closeDrawer} className="icon md close-white c-pointer" />
               
            </div>]}
            
            placement="right"
            closable={true}
            visible={this.props.showDrawer}
            closeIcon={null}
            className="side-drawer w-50p"
            style={{width:"50%"}}
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
            <Title className='text-white-30 fs-20'>Send USD to Multiple Address</Title>
            <Button className='pop-btn'>Upload Excel</Button>
            <Paragraph className='text-white-30 '>To download the excel, <a className='fw-700'> click here</a></Paragraph>
            <Button className='pop-btn'>Select from Whitelisted Addresses</Button>
            </div>
              </div>
              </>}
        </Drawer>
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
export default connect(connectStateToProps, connectDispatchToProps)(AddBatchPayment);