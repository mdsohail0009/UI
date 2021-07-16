import React, { Component } from 'react';
import { List,  Select } from 'antd';
import config from '../../config/config';
import { Link } from 'react-router-dom';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import {getMemberCoins,updateCoinDetails} from '../buysell.component/crypto.reducer'
const { Option } = Select;
class WalletList extends Component {
    state = {
        isArrow: true,
    }
    render() {
        return (<>
            {/* {this.props.sellData.MemberFiat&& 
             <form className="form">
             <Select defaultValue="Select Wallet" className="cust-input" style={{ width: '100%' }} bordered={false} showArrow={false} suffixIcon={<span className="icon md uparrow" />}>
               {this.props.sellData.MemberFiat.map((item,idx) =>
                   <Option value={item.bankName}>{item.bankName}</Option>
               )}
            </Select>
            </form>
            } */}
             {this.props.sellData.MemberFiat&&<List
                itemLayout="horizontal"
                className="wallet-list mb-36"
                dataSource={this.props.sellData.MemberFiat}
                style={{ borderBottom: '1px solid var(--borderLight)' }}
                renderItem={item => (
                    <List.Item className="px-4" >
                        <Link>
                            <List.Item.Meta
                                avatar={<span className={`coin ${item.bankName}`} />}
                                title={<><div className="fs-16 fw-400 text-white">{item.bankName}</div>
                                    <div className="fs-16 fw-400 text-upper text-white">{item.network}</div></>}
                            />
                            <span className="icon sm r-arrow-o-white" />
                        </Link>
                    </List.Item>

                )}
            />}
            </>
        );
    }
}
const connectStateToProps = ({ buySell, sellData }) => {
    return { buySell, sellData }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        }
        ,
        fetchMemberCoins:()=>{
            dispatch(getMemberCoins())
        },
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(WalletList);
