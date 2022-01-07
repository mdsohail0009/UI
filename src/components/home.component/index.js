import React, { Component } from 'react';
import { Layout, Menu, Modal, Typography, Dropdown, Row, Col, Divider, Avatar, Carousel, Switch, Drawer, Button, Card  } from 'antd';
import {
  ArrowRightOutlined
} from '@ant-design/icons';
class HomeComponent extends Component {
    render() {
        const { Title, Text, Paragraph } = Typography;
        return (
          <>
            <div className="text-center text-position">
              <Text className="d-block ">
                <span className="wlecome-text">Welcome</span>{" "}
                <span className="name-text"> John Doe</span>
              </Text>
              <Text className="goodmorning-text">Good Morning</Text>
            </div>
            <div className="text-center bg-img"></div>
            <div className="main-container text-white">
              <Row gutter={24}>
                <Col span={14}>
                  <Row gutter={24}>
                    <Col span={12}>
                      <Text className="d-block text-white">Fiat wallet</Text>
                    </Col>
                    <Col span={12} className="text-right">
                      <Text className="d-block  dashboard-color">Dashboard <ArrowRightOutlined /> </Text>
                    </Col>
                  </Row>
                  <Paragraph className=" d-block text-white">
                    We Understand Our Clients Time Is Money, Which Is Why They
                    Trust Suissebase™ With Their Important Investment Decisions.
                    Our Managers Will Work For You To Help You Achieve Your
                    Financial And Trading Goals.
                  </Paragraph>

                  <ul class="ant-list-items">
                    <li class="ant-list-item py-10 px-0">
                      <div class="ant-list-item-meta">
                        <div class="ant-list-item-meta-avatar">
                          <span class="coin usd-round mr-4"></span>
                        </div>
                        <div class="ant-list-item-meta-content">
                          <h4 class="ant-list-item-meta-title">
                            <div class="fs-16 fw-600 text-upper text-white-30 l-height-normal">
                              USD
                            </div>
                          </h4>
                          <div class="ant-list-item-meta-description">
                            <div class="fs-16 text-white-30 m-0">
                              {" "}
                              $4,822.05{" "}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="crypto-btns">
                        <button
                          type="button"
                          class="ant-btn ant-btn-primary custom-btn prime"
                        >
                          <span>Deposit</span>
                        </button>
                        <button
                          type="button"
                          class="ant-btn custom-btn sec ml-16"
                        >
                          <span>Withdraw</span>
                        </button>
                      </div>
                    </li>
                    <li class="ant-list-item py-10 px-0">
                      <div class="ant-list-item-meta">
                        <div class="ant-list-item-meta-avatar">
                          <span class="coin eur-round mr-4"></span>
                        </div>
                        <div class="ant-list-item-meta-content">
                          <h4 class="ant-list-item-meta-title">
                            <div class="fs-16 fw-600 text-upper text-white-30 l-height-normal">
                              EUR
                            </div>
                          </h4>
                          <div class="ant-list-item-meta-description">
                            <div class="fs-16 text-white-30 m-0"> €0.00 </div>
                          </div>
                        </div>
                      </div>
                      <div class="crypto-btns">
                        <button
                          type="button"
                          class="ant-btn ant-btn-primary custom-btn prime"
                        >
                          <span>Deposit</span>
                        </button>
                        <button
                          disabled=""
                          type="button"
                          class="ant-btn custom-btn sec ml-16"
                        >
                          <span>Withdraw</span>
                        </button>
                      </div>
                    </li>
                    <li class="ant-list-item py-10 px-0">
                      <div class="ant-list-item-meta">
                        <div class="ant-list-item-meta-avatar">
                          <span class=", mr-4"></span>
                        </div>
                        <div class="ant-list-item-meta-content">
                          <h4 class="ant-list-item-meta-title">
                            <div class="fs-16 fw-600 text-upper text-white-30 l-height-normal">
                              GBP
                            </div>
                          </h4>
                          <div class="ant-list-item-meta-description">
                            <div class="fs-16 text-white-30 m-0"> £0.00 </div>
                          </div>
                        </div>
                      </div>
                      <div class="crypto-btns">
                        <button
                          type="button"
                          class="ant-btn ant-btn-primary custom-btn prime"
                        >
                          <span>Deposit</span>
                        </button>
                        <button
                          disabled=""
                          type="button"
                          class="ant-btn custom-btn sec ml-16"
                        >
                          <span>Withdraw</span>
                        </button>
                      </div>
                    </li>
                  </ul>
                </Col>

                <Col span={10}>
                <Card title="Default size card" extra={<a href="#">More</a>} style={{ width: 300 }}>
                    <p>Card content</p>
                    <p>Card content</p>
                    <p>Card content</p>
                </Card>
                </Col>
              </Row>
            </div>
          </>
        );
    }
}

export default HomeComponent;