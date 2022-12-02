import React, { Component } from "react";
import {
  Typography,
  List,
  Button,
  Image,
  Dropdown,
  Space,
  Menu,
  Avatar,
  Empty
} from "antd";
import ConnectStateProps from "../../utils/state.connect";
import Currency from "../shared/number.formate";
import Translate from "react-translate-component";
import Loader from "../../Shared/loader";
import { withRouter, Link } from "react-router-dom";

import apicalls from "../../api/apiCalls";
const { Title } = Typography;

class BankWallets extends Component {
  state = {
    customerData: [],
    getbankInfo: false,
    isLoading: false
  };
  componentDidMount() {
    this.getCustomerAccountBalance();
  }
  getCustomerAccountBalance = async () => {
    this.setState({ ...this.state, isLoading: true });
    let response = await apicalls.getAccountDetails(
      this.props.userProfile.id
    );
    if (response.ok) {
      this.setState({
        ...this.state,
        customerData: response.data,
        isLoading: false
      });
    } else {
      this.setState({ ...this.state, isLoading: false });
    }
  };

  createAccount = (e) => {
      this.redirectBank(`http://localhost:3001/createAccount/${e}`);
  };
  redirectBank = (url,type) =>{
    if (!this.props?.userProfile?.isKYC) {
      this.props.history.push("/notkyc");
      return;
  }
  if (!this.props?.twoFA.isEnabled) {
      this.props.history.push("/enabletwofactor");
      return;
  }
  if (this.props?.userProfile?.isDocsRequested) {
      this.props.history.push("/docnotices");
      return;
  }
  window.open(url,type||'_self');
  }
  menuBar = (item) => (
    <Menu>
      <ul className="pl-0 drpdwn-list">
        <li
          onClick={() =>
            this.redirectBank(
              process.env.REACT_APP_BANK_UI_URL + `internaltransfer`,
              "_self"
            )
          }
        >
          <Link value={5} className="c-pointer">
            Internal Transfer
          </Link>
        </li>
        <li
          onClick={() =>
            this.redirectBank(process.env.REACT_APP_BANK_UI_URL +`dashboard`, "_self")}
        >
          <Link value={5} className="c-pointer">
          Go To Personal Bank Account
          </Link>
        </li>
        <li
          onClick={() =>
            this.redirectBank(
              process.env.REACT_APP_BANK_UI_URL +
                `dashboard/digitalwallet/${item.currency}/${item.id}`,
              "_self"
            )
          }
        >
          <Link value={5} className="c-pointer">
          Transfer To Suissebase Digital Wallet
          </Link>
        </li>
      </ul>
    </Menu>
  );

  render() {
    const { Title, Text } = Typography;
    const { wallets } = this.props.dashboard;
    return (
      <>
        <Title className="db-titles">
          Personal Bank Accounts
        </Title>
        {this.state.isLoading ? (
          <Loader />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={this.state.customerData}
            //bordered={false}
            className="mobile-list custom-fund-buttons mb-36"
            renderItem={(item) => (
              <List.Item className="py-10 px-0">
                <List.Item.Meta
                  avatar={<Image preview={false} src={item.imagePath} />}
                  title={
                    <div className="fs-16 fw-600 text-upper text-white-30 l-height-normal">
                      {item.currency}
                    </div>
                  }
                  description={
                    <Currency
                      className="fs-16 text-white-30 m-0"
                      defaultValue={item.availableBalance}
                      prefix={
                        (item?.currency == "USD" ? "$" : null) ||
                        (item?.currency == "EUR" ? "€" : null)
                      }
                      decimalPlaces={8}
                      type={"text"}
                      style={{ lineHeight: "12px" }}
                    />
                  }
                />
                {item.isAccountExist ? (
                  <>
                    {item?.accountStatus?.toLowerCase() == "approved" && (
                      <div className="crypto-btns">
                        <Translate
                          content="transfer_funds"
                          component={Button}
                          type="primary"
                          className="custom-btn prime text-white" 
                          disabled={!(item.availableBalance && item.availableBalance>0)}
                          onClick={() =>
                            this.redirectBank(
                              process.env.REACT_APP_BANK_UI_URL +
                                `dashboard/transfer/${item.currency}/${item.id}`,
                              "_self"
                            )
                          }
                        />

                        <Translate
                          content="receive_funds"
                          component={Button}
                          type="primary"
                          className="custom-btn sec ml-16"
                          onClick={() =>
                            this.redirectBank(
                              process.env.REACT_APP_BANK_UI_URL +
                                `dashboard/receive/${item.currency}/${item.id}`,
                              "_self"
                            )
                          }
                        />

                        <Dropdown
                          overlay={this.menuBar(item)}
                          trigger={["click"]}
                          placement="bottomCenter"
                          arrow
                          overlayClassName="secureDropdown depwith-drpdown"
                        >
                          <a onClick={(e) => e.preventDefault()}>
                            <Space>
                              <span class="icon md menu-bar ml-4 p-relative"></span>
                            </Space>
                          </a>
                        </Dropdown>
                      </div>
                    )}

                    {item?.accountStatus?.toLowerCase() != "approved" && (
                      <div className="crypto-btns">
                        <Button
                          content="Pending"
                          type="primary"
                          className="custom-btn prime  text-white"
                          style={{width:'118px'}}
                          disabled={true}
                        >
                         {item?.accountStatus}
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="crypto-btns">
                    <Translate
                      content="createnow"
                      type="primary"
                      component={Button}
                      className="custom-btn prime"
                      onClick={() =>
                        this.redirectBank(
                          process.env.REACT_APP_BANK_UI_URL +
                            `createAccount/${item.currency}`,
                          "_self"
                        )
                      }
                    />
                  </div>
                )}
              </List.Item>
            )}
          ></List>
        )}
      </>
    );
  }
}

export default ConnectStateProps(withRouter(BankWallets));
