import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Link } from 'react-router-dom';
import { List, Empty, Input,Image } from 'antd';
import NumberFormat from 'react-number-format';
import apiCalls from '../../api/apiCalls';
import Translate from 'react-translate-component';

const CryptoList = forwardRef(({ coinList, isLoading, onCoinSelected, coinType, loadMore, showSearch, selectedCoin, iconField, titleField, onReturnCoin }, ref) => {
    const [coinListData, setCoinListData] = useState([]);
    const [selList, setselList] = useState({});
    const [searchVal, setSearchVal] = useState("");
    const { Search } = Input;
    useEffect(() => {
        setCoinListData(coinList)
    }, [coinList])// eslint-disable-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (selectedCoin) {
            setselList(selectedCoin)
            if (!onReturnCoin) {
                selectList(selectedCoin)
            }
        }
    }, [selectedCoin]);// eslint-disable-line react-hooks/exhaustive-deps
    useImperativeHandle(ref, () => ({
        clearSearch() {
            setSearchVal("");
        }
    }))
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
        if (onCoinSelected) { onCoinSelected(item) }
    }
    return (<>
        {showSearch && <Search value={searchVal} placeholder={apiCalls.convertLocalLang('searchCurrency')} addonAfter={<span className="icon md search-white" />} onChange={({ currentTarget }) => { setSearchVal(currentTarget.value); handleSearch(currentTarget.value) }} size="middle" bordered={false} className="mb-16" />}
        <List
            itemLayout="horizontal"
            dataSource={coinListData}
            loadMore={loadMore ? loadMore : ''}
            className="crypto-list auto-scroll wallet-list c-pointer"
            loading={isLoading ? isLoading : false}
           locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={
            <Translate content="No_data"  />
            } /> }}
            renderItem={item => (

                <List.Item className={(item[titleField || 'walletCode'] === selList[titleField || 'walletCode'] ? " select" : "")}>
                    <Link onClick={() => selectList(item)}>
                        <List.Item.Meta
                          avatar={ <Image preview={false} src={item.impagePath}/>}

                            title={<div className="wallet-title">{item[titleField || 'walletCode']}</div>}
                        />
                        <><div className="text-right coin-typo">
                            {coinType === "swap" && item.coinBalance != null && <NumberFormat value={item.coinBalance} displayType={'text'} thousandSeparator={true} prefix={''} renderText={(value, props) => <div {...props} className="text-white-30">{value}</div>} />}
                            {item.coinValueinNativeCurrency !== 0 && <NumberFormat value={coinType === "swap" ? item.coinValueinNativeCurrency : item.amountInUSD} className="text-white-30 fw-600" displayType={'text'} thousandSeparator={true} prefix={'$'} renderText={(value, props) => <div {...props} className={` ${coinType !== "swap" ? "fs-16 " : "fs-14 "} ${coinType === "swap" ? (item.coinBalance > 0 ? "text-green" : "text-red") : 'text-white'}`}>{value}</div>} />}
                            {coinType !== "swap" && <div className={item.percent_change_1h < 0 ? 'text-red fs-14' : 'text-green fs-14'}>{item.percent_change_1h} %</div>}
                        </div>
                            {coinType !== "swap" && <> {item.percent_change_1h >= 0 ? <span className="icon sm uparrow ml-12" /> : <span className="icon sm downarrow ml-12" />}</>}</>
                    </Link>
                </List.Item>
            )}
        />
    </>
    );
});
export default CryptoList;