import React, { Component } from 'react';
import { Typography, List, Button, Image,Dropdown,Space,Menu,Avatar,Empty } from 'antd';
import ConnectStateProps from '../../utils/state.connect';
import Currency from '../shared/number.formate';
import apiCalls from '../../api/apiCalls';
import Translate from 'react-translate-component';

import { withRouter,Link } from 'react-router-dom';

import apicalls from "../../api/apiCalls"
const { Title, Paragraph } = Typography;

class BankWallets extends Component {
    state = {
        customerData : [],
        getbankInfo : false,
    }
    componentDidMount() {
        this.getCustomerAccountBalance(); 
    }
    getCustomerAccountBalance = async ()=>{
        debugger
        let response  = await apicalls.getCustomerBankDetails(this.props.userProfile.id)
        if(response.ok){
         this.setState({...this.state,customerData:response.data})
         console.log(response.data)
        }
    }
    
     data = [
        {
          title: 'USD',
          isAccountExit:true,
          balance:'0',
         
        },
        {
          title: 'EUR',
          isAccountExit:true,
          balance:'1',
        }
      ];

      menuBar = (item) => (
        <Menu>
              <ul className="pl-0 drpdwn-list">
                  {/* <li  onClick={() =>  this.showSendReceiveDrawer(1, item)}>
                      <Link value={1} className="c-pointer">Receive</Link>
                  </li> */}
                  <li  onClick={() => window.open("http://localhost:3001/dashboard")}>
                  <Link  value={5} className="c-pointer">
                      <Translate content="Wallet" />
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
           
            {/* <List
              itemLayout="horizontal"
              dataSource={this.state.customerData}
              renderItem={item => (
                <List.Item actions={[
                   
                  <Button className={`pop-btn  px-8  c-pointer fw-500 text-captz ${item.isAccountExist ?"showButton" :  "d-none"}` } style={{height : '30px'}}
                  onClick={() =>
                    window.open(process.env.REACT_APP_BANK_UI_URL, "_blank")
                  }
                  onClick={() =>
                    window.open(`http://localhost:3001/transfer/${item.currency}`)
                  }
                  >
                  Send Funds
                  </Button>,
                   <Button className={`pop-btn  px-8  c-pointer fw-500 text-captz ${item.isAccountExist ?"showButton" :  "d-none"}` }  style={{height : '30px'}}
                   onClick={() =>
                     window.open(process.env.REACT_APP_BANK_UI_URL, "_blank")
                   }
                   
                   >
                   Receive Funds
                   </Button>,
                   <Button className={`pop-btn  px-8  c-pointer fw-500 text-captz ${item.isAccountExist ?"showButton" :  "d-none"}` } style={{height : '30px'}}
                   onClick={() =>
                     window.open(process.env.REACT_APP_BANK_UI_URL, "_blank")
                   }
                onClick={() =>
                    window.open("http://localhost:3001/dashboard")
                  }
                   >
                   wallet
                   </Button>,
                   <Button className={`pop-btn px-16  c-pointer text-captz ${item.isAccountExist == false ?"createbuttonShow" : "d-none" }` } style={{height : '50px'}}
                   onClick={() =>
                     window.open(process.env.REACT_APP_BANK_UI_URL, "_blank")
                   }
                   onClick={() =>
                    window.open("http://localhost:3001/createAccount")
                  }
                   >
                  Create Now
                   </Button>,
                ]} >
                  
                  <List.Item.Meta
                                 avatar={<Avatar src="https://suissebase.blob.core.windows.net/assets/usd.svg" />}
                                title={<div className="fs-16 fw-600 text-upper text-white-30 l-height-normal">{item.currency}</div>}
                                description={<Currency className="fs-16 text-white-30 m-0" defaultValue={item.availableBalance} 
                                prefix={(item?.currency == "USD" ? "$" : null) ||  (item?.currency == "EUR" ? "€" : null)} 
                                decimalPlaces={8} type={"text"} style={{ lineHeight: '12px' }} />}
                            />
    
                </List.Item>
              )}
            /> */}
                                    
                  <List
                    itemLayout="horizontal"
                    dataSource={this.state.customerData}
                    bordered={false}
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
                                //    onClick={() =>
                                //     window.open(process.env.REACT_APP_BANK_UI_URL, "_blank")
                                //   }
                                  onClick={() =>
                                    window.open(`http://localhost:3001/transfer/${item.currency}`)
                                  }
                                  />
                                  <Translate content="receive_funds"  component={Button} type="primary" className="custom-btn sec ml-16"  
                                //    onClick={() =>
                                //     window.open(process.env.REACT_APP_BANK_UI_URL, "_blank")
                                //   }
                                  /> 
                                  {/* <Translate content="suisse_wallets"  component={Button} type="primary" className="custom-btn sec ml-16" 
                                    onClick={() =>
                                        window.open(process.env.REACT_APP_BANK_UI_URL, "_blank")
                                      }
                                   onClick={() =>
                                       window.open("http://localhost:3001/dashboard")
                                     } /> */}

                            <Dropdown 
                            overlay={this.menuBar(item)}
                             trigger={['click']} placement="bottomCenter" arrow overlayClassName="secureDropdown depwith-drpdown" >
                                <a onClick={e => e.preventDefault()}>
                              <Space>
                                <span class="icon md menu-bar ml-4 p-relative"></span>
                          {/* <DownOutlined /> */}
                              </Space>
                            </a>
                          </Dropdown>
                              </div>
                              
                              
                            ) :(
                              <div className="crypto-btns mt-8">
                              <Translate content="createnow" type="primary" component={Button} className="custom-btn prime" 
                            //    onClick={() =>
                            //     window.open(process.env.REACT_APP_BANK_UI_URL, "_blank")
                            //   }
                              onClick={() =>
                               window.open("http://localhost:3001/createAccount")
                             }/>  
                              </div> )}
                  </List.Item>} 

                   

                >
               
                  </List>

            </>
        );
    }
}

export default ConnectStateProps(withRouter(BankWallets));