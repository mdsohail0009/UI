import Currency from "../shared/number.formate";

const infoColumns = [{ title: "Coin", dataIndex: "name",sorter:(a,b)=>b.name.length-a.name.length, },
{ title: "", dataIndex: "symbol", render: text => <>{text.toUpperCase()}</> ,width:100},
{
    title: "Price", dataIndex: "current_price", render: (val) => <Currency defaultValue={val} type={"text"} />,sorter:(a,b)=>b.current_price-a.current_price
},
{ title: "24h(%)", dataIndex: "price_change_percentage_24h",sorter:(a,b)=>b.price_change_percentage_24h-a.price_change_percentage_24h, render: val => <><div className="coin-typo"> <div className={val < 0 ? 'text-red' : 'text-green'}>{val}</div></div></> },

];

const detailInfoColumns = [
    { title: "", dataIndex: "image", render: val => <img style={{ height: 20, width: 20 }} src={val} />,width:100 },
    { title: "Coin", dataIndex: "name",width:250 },
    { title: "", dataIndex: "symbol", render: text => <>{text.toUpperCase()}</>,sorter:(a,b)=>b.name-a.name,},
    {
        title: "Price", dataIndex: "current_price", render: (val) => <Currency defaultValue={val} type={"text"} />,sorter:(a,b)=>b.current_price-a.current_price,
    },
    { title: "24h(%)", dataIndex: "price_change_percentage_24h",sorter:(a,b)=>b.price_change_percentage_24h-a.price_change_percentage_24h, render: val => <><div className="coin-typo"> <div className={val < 0 ? 'text-red' : 'text-green'}>{val}</div></div></> },
    {title:"Mkt Cap",dataIndex:"market_cap",render:val=><Currency defaultValue={val} type={"text"} />,sorter:(a,b)=>b.market_cap-a.market_cap,},
    {title:"Total Volume",dataIndex:"total_volume",render:val=><Currency defaultValue={val} type={"text"} />,sorter:(a,b)=>b.total_volume-a.total_volume,},
    {title:"Total Supply",dataIndex:"total_supply",render:val=><Currency defaultValue={val} type={"text"} />,sorter:(a,b)=>b.total_supply-a.total_supply,},
    


]
export {infoColumns,detailInfoColumns}