import React, { Component } from 'react';
import { Drawer, Typography, Button, Card, Input } from 'antd';


class CurrencyDestination extends Component {
    
    render() {
        const { Title, Paragraph, Text } = Typography;
        return (
            <>
            <Card className="crypto-card mb-36" bordered={false}>
              <span className="d-flex">
                  <span className="coin md eth-white" />
                  <Text className="fs-24 text-white crypto-name ml-24">Bitcoin</Text>
              </span>
              <div className="crypto-details">
                  <Text className="crypto-percent text-white fw-700">65<sup className="fs-24 text-white fw-700" style={{ verticalAlign: 'Middle', marginLeft: 14 }}>%</sup></Text>
                  <div className="fs-16 text-white-30 fw-200 text-right">
                      <div>1.0147668 BTC</div>
                      <div>$ 411.07</div>
                  </div>
              </div>
            </Card>
            <div className="enter-val-container mr-0">
                <div className="text-center">
                    <Input className="fs-36 fw-100 text-white-30 text-center enter-val p-0"
                        placeholder="$106.00" bordered={false} prefix="USD" style={{ maxWidth: 230 }} />
                                    <Text className="fs-14 text-white-30 fw-200 text-center d-block mb-36">0.00701 BTC</Text>
                                </div>
                                <span className="mt-24" style={{ marginLeft: 80 }}>
                                    <span className="icon sm uparw-o-white d-block c-pointer mb-4" /><span className="icon sm dwnarw-o-white d-block c-pointer" />
                                </span>
                            </div>
                            <Paragraph className="text-upper fw-600 mb-0 text-aqua pt-16">Find with your favoite wallet</Paragraph>
                            <WalletList isArrow={true} />
                            {/* <List
                itemLayout="horizontal"
                className="wallet-list mb-36"
                renderItem={item => (
                    <List.Item>
                        <Link>
                            <List.Item.Meta
                                avatar={<span className="coin usd-d" />}
                                title={<><div className="fs-16 fw-400 text-white">{item.title}</div>
                                    <div className="fs-16 fw-400 text-upper text-white">{item.coin}</div></>}
                            />
                            <span className="icon sm r-arrow-o-white" />
                        </Link>
                    </List.Item>

                )}
            /> */}
                            
                            <Button size="large" block className="pop-btn">PREVIEW</Button>
            </>

        )
    }
}
export default CurrencyDestination;