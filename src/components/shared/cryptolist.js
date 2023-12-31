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
            
            filtercoinsList = coinType === "Sell" ? coinList.filter(item => (item[titleField || 'coin']).toLowerCase().includes(value.toLowerCase())) : coinList.filter(item => (item[titleField || 'walletCode']).toLowerCase().includes(value.toLowerCase()));
        }
        setCoinListData(filtercoinsList)
    }
    const selectList = (item) => {
        setselList(item);
        if (onCoinSelected) { onCoinSelected(item) }
    }
    return (<>
        {showSearch && 
        <Search value={searchVal} 
        placeholder={apiCalls.convertLocalLang('searchCurrency')} 
        prefix={<span className="icon lg search-angle drawer-search" />} 
         onChange={({ currentTarget }) => { 
            setSearchVal(currentTarget.value);
          handleSearch(currentTarget.value) }} size="middle" bordered={false} className="cust-search" />}
        <List
            itemLayout="horizontal"
            dataSource={coinListData}
            loadMore={loadMore ? loadMore : ''}
            className="crypto-list auto-scroll wallet-list"
            loading={isLoading ? isLoading : false}
           locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={
            <Translate content="No_data"  />
            } /> }}
            renderItem={item => (
                <div>
              {coinType === "Sell" ?
               <>
               <List.Item className={(item[titleField ||  'coin'] === selList[titleField || 'coin'] ? " select" : "")}>
               <Link onClick={() => selectList(item)}>
                   <List.Item.Meta className='drawer-coin'
                     avatar={ <Image preview={false} src={item.impagePath}/>}

                       title={<div className="wallet-title">{item[titleField ||  'coin']}</div>}
                   />
                   <><div className="text-right coin-typo">
                       {coinType === "Sell" && item.coinBalance != null && <NumberFormat value={item.coinBalance} displayType={'text'} thousandSeparator={true} prefix={''} renderText={(value, props) => <div {...props} className="drawer-balnstyle">{value}</div>} />}
                       {item.coinValueinNativeCurrency !== 0 && <NumberFormat value={coinType === "Sell" ? item.coinValueinNativeCurrency : item.amountInUSD || item.coinBalance} className="" displayType={'text'} thousandSeparator={true} prefix={'$'} renderText={(value, props) => <div {...props} className={`drawer-list-font ${coinType !== "Sell" ? "fs-16" : "fs-14 "} ${coinType === "Sell" ? (item.coinBalance > 0 ? "text-green" : "text-red") : 'text-white'}`}>{value}</div>} />}
                        {coinType !== "Sell" && <div className={item.percent_change_1h < 0 ? 'text-red ' : 'text-green'}>{item.percent_change_1h} %</div>}
                   </div>
                       {coinType !== "Sell" && <> {item.percent_change_1h >= 0 ? <span className="icon sm  valupp-icon pg-arrow" /> : <span className="icon sm downarrow ml-12" />}</>}</>
               </Link>
           </List.Item>
              </> : 
              <>
              <List.Item className={(item[titleField || 'walletCode' ] === selList[titleField || 'walletCode'] ? " select" : "")}>
               <Link onClick={() => selectList(item)}>
                   <List.Item.Meta className='drawer-coin'
                     avatar={ <Image preview={false} src={item.impagePath}/>}

                       title={<div className="wallet-title">{item[titleField || 'walletCode']}</div>}
                   />
                   <><div className="text-right coin-typo">
                       {coinType === "swap" && item.coinBalance != null && <NumberFormat value={item.coinBalance} displayType={'text'} thousandSeparator={true} prefix={''} renderText={(value, props) => <div {...props} className="drawer-balnstyle">{value}</div>} />}
                       {item.coinValueinNativeCurrency !== 0 && <NumberFormat value={coinType === "swap" ? item.coinValueinNativeCurrency : item.amountInUSD || item.coinBalance} className="text-white-30 fw-600" displayType={'text'} thousandSeparator={true} prefix={'$'} renderText={(value, props) => <div {...props} className={`drawer-list-font ${coinType !== "swap" ? "fs-16 " : "fs-14 "} ${coinType === "swap" ? (item.coinBalance > 0 ? "text-green" : "text-red") : ''}`}>{value}</div>} />}
                       {coinType !== "swap" && <div className={item.percent_change_1h < 0 ? 'text-red' : 'text-green'}>{item.percent_change_1h} % {coinType !== "swap" && <> {item.percent_change_1h >= 0 ? <span className="icon sm  valupp-icon pg-arrow" /> : <span className="icon sm downarrow ml-12" />}</>}</div>}
                       
                   </div>
                       </>
               </Link>
           </List.Item>
              </>

            }
            </div>
            
              
            )}
        />
    </>
    );
});
export default CryptoList;