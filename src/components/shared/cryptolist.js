import React, { Component, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { List, Empty, Input } from 'antd';
import NumberFormat from 'react-number-format';
import { UserOutlined } from '@ant-design/icons';

const CryptoList = ({ coinList, isLoading, onCoinSelected, coinType, loadMore, showSearch, selectedCoin, iconField, titleField, showValues = true }) => {
    const [loading, setLoading] = useState(true);
    const [coinListData, setCoinListData] = useState([]);
    const [selList, setselList] = useState({});
    const { Search } = Input;
    useEffect(() => {
        setCoinListData(coinList)
    }, [coinList])
    useEffect(() => {
        if (selectedCoin) {
            setselList(selectedCoin)
            selectList(selectedCoin)
        }
    }, [selectedCoin])
    const handleSearch = (value) => {
        let filtercoinsList;
        if (!value) {
            filtercoinsList = coinList;
        } else {
            filtercoinsList = coinList.filter(item => (item[titleField || 'walletCode']).toLowerCase().includes(value.toLowerCase()));
        }
        setCoinListData(filtercoinsList)
    }
    const selectList = (item) => {
        setselList(item);
        if (onCoinSelected) { onCoinSelected(item) };
    }
    return (<>
        {showSearch && <Search placeholder="Search Currency" addonAfter={<span className="icon md search-white" />} onChange={({ currentTarget }) => { handleSearch(currentTarget.value) }} size="middle" bordered={false} className="my-16" />}
        <List
            itemLayout="horizontal"
            dataSource={coinListData}
            loadMore={loadMore ? loadMore : ''}
            className="crypto-list auto-scroll wallet-list c-pointer"
            loading={isLoading ? isLoading : false}
            locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} description={<span>No records found</span>} /> }}
            renderItem={item => (

                <List.Item className={(item[titleField || 'walletCode'] == selList[titleField || 'walletCode'] ? " select" : "")}>
                    <Link onClick={() => selectList(item)}>
                        <List.Item.Meta
                            avatar={<span className={`coin ${item[iconField || 'walletCode']} mr-4`} />}
                            title={<div className="wallet-title">{item[titleField || 'walletCode']}</div>}
                        />
                        <><div className="text-right coin-typo">
                            <NumberFormat value={coinType == "swap" ? item.coinValueinNativeCurrency : item.amountInUSD} className="text-white-30 fw-600" displayType={'text'} thousandSeparator={true} prefix={'$'} renderText={(value, props) => <div {...props} className="text-white-30 fw-600">{value}</div>} />
                            {coinType == "swap" && <NumberFormat value={item.coinBalance} className="text-white-30 fw-600" displayType={'text'} thousandSeparator={true} prefix={''} renderText={(value, props) => <div {...props} className={`fs-16 ${item.coinBalance > 0 ? "text-green" : "text-red"}`}>{value}</div>} />}
                            {coinType !== "swap" && <div className={item.percent_change_1h < 0 ? 'text-red' : 'text-green'}>{item.percent_change_1h} % </div>}
                        </div>
                            {coinType !== "swap" && <> {item.percent_change_1h > 0 ? <span className="icon sm uparrow ml-12" /> : <span className="icon sm downarrow ml-12" />}</>}</>
                    </Link>
                </List.Item>
            )}
        />
    </>
    );
}
export default CryptoList;