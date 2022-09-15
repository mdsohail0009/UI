import React, { Component } from 'react';
import { Typography, List, Button, Image,Dropdown,Space,Menu,Avatar,Empty } from 'antd';
import ConnectStateProps from '../../utils/state.connect';
import Currency from '../shared/number.formate';

import Translate from 'react-translate-component';
import Loader from '../../Shared/loader';
import { withRouter,Link } from 'react-router-dom';

import apicalls from "../../api/apiCalls"
const { Title, Paragraph } = Typography;

class BankWallets extends Component {
    state = {
        customerData : [],
        getbankInfo : false,
        isLoading:false,
    }
    componentDidMount() {
        this.getCustomerAccountBalance(); 
    }
    getCustomerAccountBalance = async ()=>{
      debugger
      this.setState({...this.state,isLoading:true})
        let response  = await apicalls.getCustomerBankDetails(this.props.userProfile.id)
        if(response.ok){
         this.setState({...this.state,customerData:response.data ,isLoading:false})
         console.log(response.data)
        }else{
          this.setState({...this.state,isLoading:false})
        }
    }
    
    // createAccount= (e)=>{
    //     if(this.props.userProfile.isBusiness){
    //         window.open(`http://localhost:3001/businessCreateAccount/${e}`)
    //     }else{
    //         window.open(`http://localhost:3001/createAccount/${e}`)
    //     }
    // }
      menuBar = (item) => (
        <Menu>
              <ul className="pl-0 drpdwn-list">
                  {/* <li  onClick={() =>  this.showSendReceiveDrawer(1, item)}>
                      <Link value={1} className="c-pointer">Receive</Link>
                  </li> */}
                  <li  onClick={() => 
                    //window.open("http://localhost:3001/dashboard")}
                    window.open(process.env.REACT_APP_BANK_UI_URL +`/dashboard/${item.currency}`, "_blank")}
                    >
                  <Link  value={5} className="c-pointer">
                      <Translate content="suisse_wallets" />
                      </Link>
                  </li>
                  {/* <li onClick={() => this.showBuyDrawer(item, "sell")}>
                        <Link  value={4} className="c-pointer">
                        <Translate content="Receive" />
                        </Link>
                    </li> */}
                    {/* <li onClick={() => this.showInternalTransfer(item)}>
                      <Link  value={5} className="c-pointer">
                      <Translate content="menu_internal_transfer" />
                      </Link>
                  </li> */}
                  
              </ul>
          </Menu>

    )
     

    render() {
      const { Title, Text } = Typography;
      const { wallets } = this.props.dashboard;
        return (
            <>
           <Title className="fs-24 fw-600 mb-16 text-white px-4">
              Personal Bank Accounts
            </Title>
             {this.state.isLoading ? (<Loader/>) : (
                                    
                  <List
                    itemLayout="horizontal"
                    dataSource={this.state.customerData}
                    //bordered={false}
                    className="mobile-list custom-fund-buttons mb-36"
                    renderItem={item =>
                        <List.Item className="py-10 px-0">
                            <List.Item.Meta
                               avatar={<Image preview={false} src={item.imagePath} />}
                               title={<div className="fs-16 fw-600 text-upper text-white-30 l-height-normal">{item.currency}</div>}
                               description={<Currency className="fs-16 text-white-30 m-0" defaultValue={item.availableBalance} 
                               prefix={(item?.currency == "USD" ? "$" : null) ||  (item?.currency == "EUR" ? "€" : null)} 
                               decimalPlaces={8} type={"text"} style={{ lineHeight: '12px' }} />}
                            
                               />
                               {item.isAccountExist ?(
                              <div className="crypto-btns mt-8">
                                  <Translate content="transfer_funds"  component={Button} type="primary" className="custom-btn prime" 
                                   onClick={() =>
                                    window.open(process.env.REACT_APP_BANK_UI_URL +`/transfer/${item.currency}`, "_blank")
                                  }
                                  // onClick={() =>
                                  //   window.open(`http://localhost:3001/transfer/${item.currency}`)
                                  // }
                                  />
                                  <Translate content="receive_funds"  component={Button} type="primary" className="custom-btn sec ml-16"  
                                   onClick={() =>
                                    window.open(process.env.REACT_APP_BANK_UI_URL + `addView/${item.id}/${item.currency}`, "_blank")
                                  }
                                // onClick={() =>
                                //     window.open(`http://localhost:3001/addView/${item.id}/${item.currency}`)
                                //   }
                                  /> 
                                  
                            <Dropdown 
                            overlay={this.menuBar(item)}
                             trigger={['click']} placement="bottomCenter" arrow overlayClassName="secureDropdown depwith-drpdown" >
                                <a onClick={e => e.preventDefault()}>
                              <Space>
                                <span class="icon md menu-bar ml-4 p-relative"></span>
                     
                              </Space>
                            </a>
                          </Dropdown>
                              </div>
                              
                              
                            ) :(
                              <div className="crypto-btns mt-8">
                              <Translate content="createnow" type="primary" component={Button} className="custom-btn prime" 
                               onClick={() =>
                                window.open(process.env.REACT_APP_BANK_UI_URL+`feepage/${item.currency}`, "_blank")
                              }
          
                             />  
                            
                              </div> )}
                  </List.Item>} 

                   

                >
               
                  </List>
              )}
               <hr></hr>
            </>
           
        );
    }
}

export default ConnectStateProps(withRouter(BankWallets));