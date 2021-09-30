import Currency from "../shared/number.formate";

const infoColumns = [
    { dataIndex: "image", render: val => <img style={{ height: 20, width: 20 }} src={val} alt={'coin'}/>, width: 40 },
    { title: "Coin", dataIndex: "symbol", render: text => <span className="fs-18 fw-500 text-upper text-white mb-0 mt-12">{text.toUpperCase()}</span>, sorter: (a, b) => ('' + a.symbol).localeCompare(b.symbol), },
    {
        title: "Price", dataIndex: "current_price", render: (val) => <Currency defaultValue={val} type={"text"} className="fs-16 fw-400 text-upper text-white" />, sorter: (a, b) => a.current_price - b.current_price
    },
    { title: "Last 24hrs", dataIndex: "price_change_percentage_24h", sorter: (a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h, render: val => <><div className="coin-typo text-right"> <div className={val < 0 ? 'text-red' : 'text-green'}>{parseFloat(val).toFixed(1)}%<span>{val < 0 ? <span className="icon md lose ml-8" /> : <span className="icon md gain ml-8" />}</span></div></div></> },

];

const detailInfoColumns = [
    { title: "", dataIndex: "image", render: val => <img style={{ height: 20, width: 20 }} src={val} alt={'coin'}/>, width: 80 },
    { title: "", dataIndex: "name", width: 250, render: text => <span className="fs-18 fw-500 text-upper text-white mb-0 mt-12">{text}</span> },
    { title: "Coin", dataIndex: "symbol", render: text => <span className="fs-18 fw-500 text-upper text-white mb-0 mt-12">{text.toUpperCase()}</span>, sorter: (a, b) => ('' + a.symbol).localeCompare(b.symbol), },
    {
        title: "Price", dataIndex: "current_price", render: (val) => <Currency className="fs-14 fw-400 text-upper text-white mb-0 mt-12" defaultValue={val} type={"text"} />, sorter: (a, b) => a.current_price - b.current_price,
    },
    { title: "Last 24hrs", dataIndex: "price_change_percentage_24h", sorter: (a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h, render: val => <><div className="coin-typo"> <div className={val < 0 ? 'text-red' : 'text-green'}>{parseFloat(val).toFixed(1)}%<span>{val < 0 ? <span className="icon md lose ml-16" /> : <span className="icon md gain ml-12" />}</span></div></div></> },
    { title: "Mkt Cap", dataIndex: "market_cap", render: val => <Currency className="fs-14 fw-400 text-upper text-white mb-0 mt-12" defaultValue={val} type={"text"} />, sorter: (a, b) => a.market_cap - b.market_cap, },
    { title: "Total Volume", dataIndex: "total_volume", render: val => <Currency className="fs-14 fw-400 text-upper text-white mb-0 mt-12" defaultValue={val} type={"text"} />, sorter: (a, b) => a.total_volume - b.total_volume, },
    { title: "Total Supply", dataIndex: "total_supply", render: val => <Currency className="fs-14 fw-400 text-upper text-white mb-0 mt-12" defaultValue={val} type={"text"} />, sorter: (a, b) => a.total_supply - b.total_supply, },



]
export { infoColumns, detailInfoColumns }