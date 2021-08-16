import React, { Component, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { List, Empty,Input } from 'antd';
import NumberFormat from 'react-number-format';
import Search from 'antd/lib/transfer/search';

const CryptoList = ({ coinList,isLoading, onCoinSelected,coinType,loadMore,showSearch}) => {
    const [loading, setLoading] = useState(true);
    const [coinListData, setCoinListData] = useState([]);
    const [selList, setselList] = useState({});
    const {Search} = Input;
    useEffect(() => {
        setCoinListData(coinList)
    }, [coinList])
    const handleSearch = (value) => {
        let filtercoinsList;
        if (!value) {
            filtercoinsList = coinList;
        } else {
            filtercoinsList = coinList.filter(item => (coinType=='swap'?item.coin:item.walletCode).toLowerCase().includes(value.toLowerCase()));
        }
        setCoinListData(filtercoinsList)
    }
    const selectList = (item) =>{
        setselList(item);
        if(onCoinSelected){onCoinSelected(item)};
    }
    return (<>
        {showSearch &&<Search placeholder="Search Currency" onChange={({ currentTarget }) => { handleSearch(currentTarget.value) }} size="middle" bordered={false} enterButton className="my-16" />}
        <List
            itemLayout="horizontal"
            dataSource={coinListData}
            loadMore={loadMore?loadMore:''}
            className="crypto-list auto-scroll wallet-list c-pointer"
            loading={isLoading?isLoading:false}
            locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} description={<span>No records found</span>} /> }}
            renderItem={item => (
                <List.Item className={  (item.id == selList.id ? " select" : "")}>
                    <Link onClick={() => selectList(item)}>
                        <List.Item.Meta
                            avatar={<span className={`coin ${coinType=='swap'?item.coin:item.walletCode} mr-4`} />}
                            title={<div className="wallet-title">{coinType=='swap'?item.coin:item.walletCode}</div>}
                        />
                        {coinType!='swap'&&<><div className="text-right coin-typo">
                            <NumberFormat value={item.amountInUSD} className="text-white-30 fw-600" displayType={'text'} thousandSeparator={true} prefix={'$'} renderText={(value, props) => <div {...props} className="text-white-30 fw-600">{value}</div>} />
                            <div className={item.percent_change_1h < 0 ? 'text-red' : 'text-green'}>{item.percent_change_1h} % </div>
                        </div>
                        {item.percent_change_1h > 0 ? <span className="icon sm uparrow ml-12" /> : <span className="icon sm downarrow ml-12" />}</>}
                    </Link>
                </List.Item>
            )}
        />
    </>
    );
}
export default CryptoList;