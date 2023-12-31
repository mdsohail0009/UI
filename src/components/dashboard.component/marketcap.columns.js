import Currency from "../shared/number.formate";
import apiCalls from '../../api/apiCalls';

const infoColumns = [
    { dataIndex: "image", render: (val, data) => <img style={{ height: 20, width: 20 }} src={val} alt={'coin'} />, width: 40 },
    { title: apiCalls.convertLocalLang('coin'), dataIndex: "symbol", render: (text, data) => <span className="market-coinname">{text.toUpperCase()}</span>, sorter: (a, b) => ('' + a.symbol).localeCompare(b.symbol), },
    {
        title: apiCalls.convertLocalLang('price'), dataIndex: "current_price", render: (val) => <Currency defaultValue={val} type={"text"} className="coin-price-style" />, sorter: (a, b) => a.current_price - b.current_price
    },
    { title: apiCalls.convertLocalLang('last_24hrs'), dataIndex: "price_change_percentage_24h", sorter: (a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h, render: val => <><div className="coin-typo"> <div className={val < 0 ? 'text-red' : 'text-green'}>{parseFloat(val).toFixed(1)}%<span>{val < 0 ? <span className="icon sm valupp-icon red-arrow" /> : <span className="icon sm valupp-icon pg-arrow" />}</span></div></div></> },

];

const detailInfoColumns = [
    { title: "", dataIndex: "image", render: val => <img style={{ height: 20, width: 20 }} src={val} alt={'coin'} />, width: 80 },
    { title: "", dataIndex: "name", width: 160, render: text => <span className="coin-price-style">{text}</span> },
    { title: apiCalls.convertLocalLang('coin'), dataIndex: "symbol", width: 120, render: text => <span className="coin-price-style">{text.toUpperCase()}</span>, sorter: (a, b) => ('' + a.symbol).localeCompare(b.symbol), },
    { title: apiCalls.convertLocalLang('price'), dataIndex: "current_price", width: 140, render: (val) => <Currency className="coin-price-style" defaultValue={val} type={"text"} />, sorter: (a, b) => a.current_price - b.current_price, },
    { title: apiCalls.convertLocalLang('last_24hrs'), dataIndex: "price_change_percentage_24h", width: 160, sorter: (a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h, render: val => <><div className="coin-typo"> <div className={val < 0 ? 'text-red' : 'text-green'}>{parseFloat(val).toFixed(1)}%<span>{<span className="icon sm valupp-icon red-arrow" />}</span></div></div></> },
    { title: apiCalls.convertLocalLang('mkt_Cap'), dataIndex: "market_cap", width: 160, render: val => <Currency className="coin-price-style" defaultValue={val} type={"text"} />, sorter: (a, b) => a.market_cap - b.market_cap, },
    { title: apiCalls.convertLocalLang('total_volume'), dataIndex: "total_volume", width: 200, render: val => <Currency className="coin-price-style" defaultValue={val} type={"text"} />, sorter: (a, b) => a.total_volume - b.total_volume, },
    { title: apiCalls.convertLocalLang('total_supply'), dataIndex: "total_supply", width: 200, render: val => <Currency className="coin-price-style" defaultValue={val} type={"text"} />, sorter: (a, b) => a.total_supply - b.total_supply, },
]
export { infoColumns, detailInfoColumns }