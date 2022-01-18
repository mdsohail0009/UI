import React, { Component } from 'react';
import { Typography, Row, Col, List, Image, Avatar, Button } from 'antd';
import Wallets from '../dashboard.component/wallets.component';
import Master from '../../assets/images/master.png';
import Visa from '../../assets/images/visa.png';
import Country from '../../assets/images/country.png';
import Country1 from '../../assets/images/country1.png';
import Country2 from '../../assets/images/country2.png';
import Country3 from '../../assets/images/country3.png';
import Country4 from '../../assets/images/country4.png';
import Cryptocurrencies from '../../assets/images/cryptocurrencies.png';
import {
  ArrowRightOutlined
} from '@ant-design/icons';

const data = [
  {
    id: '1',
    bankLogo: Visa,
    bankName: 'Swiss Bank',
    accountNumer: '8451 XXXX XXXX 2482',
    currency: '$',
    amount: '50,000.25'
  },
  {
    id: '2',
    bankLogo: Master,
    bankName: 'Indus Bank',
    accountNumer: '7482 XXXX XXXX 5874',
    currency: '$',
    amount: '45,872.05'
  },
  {
    id: '3',
    bankLogo: Master,
    bankName: 'Indus Bank',
    accountNumer: '7482 XXXX XXXX 5874',
    currency: '$',
    amount: '45,872.05'
  },
  {
    id: '4',
    bankLogo: Visa,
    bankName: 'Swiss Bank',
    accountNumer: '8451 XXXX XXXX 2482',
    currency: '$',
    amount: '50,000.25'
  },
];
const Trade = [
  {
    id: '1',
    countryLogo: Country,
    countryName: 'Hong Kong',
    buy: '1.2631',
    sell: '1.0301'
  },
  {
    id: '2',
    countryLogo: Country1,
    countryName: 'USA',
    buy: '1.6768',
    sell: '1.3721'
  },
  {
    id: '3',
    countryLogo: Country2,
    countryName: 'Japan',
    buy: '12.7125',
    sell: '9.9553'
  },
  {
    id: '4',
    countryLogo: Country3,
    countryName: 'South Africa',
    buy: '13.2715',
    sell: '10.7923'
  },
  {
    id: '5',
    countryLogo: Country4,
    countryName: 'Austraila',
    buy: '162.2830',
    sell: '130.2621'
  },
  {
    id: '6',
    countryLogo: Country2,
    countryName: 'Japan',
    buy: '12.7125',
    sell: '9.9553'
  },
  {
    id: '7',
    countryLogo: Country3,
    countryName: 'South Africa',
    buy: '13.2715',
    sell: '10.7923'
  },
  {
    id: '8',
    countryLogo: Country2,
    countryName: 'Switzerland',
    buy: '162.2830',
    sell: '130.2621'
  },
  {
    id: '9',
    countryLogo: Country1,
    countryName: 'Philippine',
    buy: '1.8333',
    sell: '1.5900'
  },
  {
    id: '10',
    countryLogo: Country4,
    countryName: 'New Zealand',
    buy: '1.7822',
    sell: '1.5200'
  },

];

class HomeComponent extends Component {
  render() {
    const { Title, Text, Paragraph } = Typography;
    return (
      <>
        <div className="text-center text-position p-relative">
          <Text className="d-block l-height-normal">
            <span className="wlecome-text ">Welcome</span>{" "}
            <span className="name-text"> John Doe</span>
          </Text>
          <Text className="goodmorning-text l-height-normal">Good Morning</Text>
        </div>
        <div className="suissebgText"></div>
        <div className="main-container mt-36 landing_page">
          <Row gutter={36}>
            <Col xs={24} sm={24} md={24} xl={14} xxl={14}>
              <div className='header-block mb-8 mt-24'>
                <Text className="fs-30 fw-600 text-white">Fiat wallet</Text>
                <Text className="text-orange fs-16 c-pointer">Dashboard <ArrowRightOutlined /></Text>
              </div>
              <Paragraph className="fs-16 text-white fw-200 mb-24">
                We Understand Our Clients Time Is Money, Which Is Why They
                Trust Suissebase™ With Their Important Investment Decisions.
                Our Managers Will Work For You To Help You Achieve Your
                Financial And Trading Goals.
              </Paragraph>
              <div className='ftwallets mb-16'>
                <Wallets walletstitle={false} />
              </div>
            </Col>
            <Col xs={24} sm={24} md={24} xl={10} xxl={10}>
              <div className='cards-block'>
                <div className='header-block mb-8'>
                  <Text className="fs-30 fw-600 text-dark">Cards</Text>
                  <Text className="text-dark fw-600 fs-16 c-pointer">View more <ArrowRightOutlined /></Text>
                </div>
                <Paragraph className="fs-16 text-dark fw-400 mb-16">Introducing The SuisseBase Rewards Card® Signature Debit Card. The World’s First Rewards Debit Card.</Paragraph>
                <List
                  itemLayout="horizontal"
                  dataSource={data}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                        title={<div className="text-dark fw-400 fs-16 l-height-normal">
                          <Image preview={false} src={item.bankLogo} />
                          <div className='mt-4'>{item.bankName}</div>
                          <div className='mt-4'>{item.accountNumer}</div>
                        </div>}
                      />
                      <Text className="text-dark fw-600 fs-16">{item.currency}{item.amount}</Text>
                    </List.Item>
                  )}
                />
              </div>
            </Col>
          </Row>
          <Row gutter={24} className='mt-36'>
            <Col xs={24} sm={24} md={24} xl={12} xxl={12}>
              <div className='mx-24'>
                <div className='header-block mb-8'>
                  <Text className="fs-30 fw-600 text-white">Fx</Text>
                  <Text className="text-orange fs-16 c-pointer">Trade <ArrowRightOutlined /></Text>
                </div>
                <Paragraph className="fs-16 text-white fw-200 mb-24">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry Create Your Financial Portfolio Today
                </Paragraph>
              </div>
              <div className='box fx-block'>
                <List
                  header={<div className='fs-18 text-orange fx-list-header'>
                    <span className='text-left'>Exchange Rate</span>
                    <span>Buy</span>
                    <span>Sell</span>
                  </div>}
                  itemLayout="horizontal"
                  dataSource={Trade}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar size={36} src={item.countryLogo} />}
                        title={<div className="text-white fw-400 fs-16 mt-4">
                          {item.countryName}
                        </div>}
                      />
                      <Text className="text-white fw-600 fs-16">{item.buy}</Text>
                      <Text className="text-white fw-600 fs-16">{item.sell}</Text>
                    </List.Item>
                  )}
                />
              </div>
            </Col>
            <Col xs={24} sm={24} md={24} xl={12} xxl={12}>
              <div className='mx-24'>
                <div className='header-block mb-8'>
                  <Text className="fs-30 fw-600 text-white">Crypto</Text>
                </div>
                <Paragraph className="fs-16 text-white fw-200 mb-24">Wiss Protections | Anywhere | Manage Portfolio | Industry Best Practice Create Your Financial Portfolio Today</Paragraph>
              </div>
              <div className='box crypto-block text-center'>
                <Image width={200} preview={false} src={Cryptocurrencies} className='mb-36' />
                <Paragraph className='fs-26 text-white fw-300 mb-0'>Create Your Financial Portfolio Today</Paragraph>
                <h2 className='mt-0 mb-8 fw-700'>Buy, Sell And Trade</h2>
                <Paragraph className='crypto-benfits text-white fw-200'>wiss Protections | Trade Anywhere Manage <br /> Portfolio | Industry Best Practice</Paragraph>
                <Button type="primary" size='large' className='fs-20 fw-500 gradient-btn'>Trade Now <ArrowRightOutlined /></Button>
              </div>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default HomeComponent;