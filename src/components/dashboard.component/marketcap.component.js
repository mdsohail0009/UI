import { Table, Tooltip, Input, Empty, Drawer, Typography } from 'antd';
import { FullscreenOutlined, ReloadOutlined } from '@ant-design/icons'
import React, { useEffect, useState, useCallback} from 'react';
import Translate from 'react-translate-component';
import Loader from '../../Shared/loader';
import { fetchMarketCaps } from './api';
import { useFullScreenHandle } from 'react-full-screen'
import { detailInfoColumns, infoColumns } from './marketcap.columns';
import apicalls from '../../api/apiCalls';
const { Title, Paragraph } = Typography;
const MarketCap = () => {
    const marketsFullScreen = useFullScreenHandle();
    const { Search } = Input;
    const [isLoading, setIsLoading] = useState(false);
    const [marketCaps, setMarketCaps] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [searchVal, setSearchVal] = useState([])
    const [originalMarketCaps, setOriginalMarketCaps] = useState([])
    useEffect(() => { fetchMarketCapsInfo() }, [])
    const fetchMarketCapsInfo = async () => {
        setIsLoading(true)
        const response = await fetchMarketCaps({ pageNo: 1 });
        if (response.ok) {
            setMarketCaps(response.data);
            setOriginalMarketCaps(response.data);
            setIsLoading(false);
        }
    }
    const onFullScreenChange = useCallback((state) => {
    });
    const onSearch = ({ currentTarget: { value } }) => {
        let matches = originalMarketCaps.filter(item => item.symbol.toLowerCase().includes(value.toLowerCase()));
        setSearchVal(value)
        setMarketCaps(matches)
    }

    const showDrawer = () => {
        setIsOpen(true);   
    }
    const onClose = () => {
        setIsOpen(false)
    }

    if (isLoading) { return <Loader /> }
    return <>
        <div handle={marketsFullScreen} onChange={onFullScreenChange}>
            <div className="full-screenable-node" style={{ overflow: "hidden", height: "100%", background: "daryGrey" }}>
                <div className="d-flex justify-content" style={{ padding: '30px 24px 10px' }}>
                    <div>
                        <Translate content="markets_title" component={Title} className="fs-24 fw-600 mb-0 text-white-30" />
                        <Translate content="markets_subtitle" component={Paragraph} className="text-white-30 fs-16 fw-200 mb-0" />
                    </div>
                    <div>
                        <Tooltip title="Full screen"><FullscreenOutlined onClick={() => showDrawer()} className="fs-18 text-white ml-8 fw-500" /></Tooltip>
                        <Tooltip title="Reload"><ReloadOutlined onClick={fetchMarketCapsInfo} className="fs-18 text-white ml-16 fw-500" /></Tooltip>
                    </div>
                </div>
                {/* <Search placeholder="Search Currency" value={searchVal} addonAfter={<span className="icon md search-white" />} onChange={(value) => onSearch(value)} size="middle" bordered={false} className="px-16 mt-8 mb-8" /> */}
                <Search placeholder={apicalls.convertLocalLang('searchCurrency')} value={searchVal} addonAfter={<span className="icon md search-white" />} onChange={(value) => onSearch(value)} size="middle" bordered={false} className="px-16 mt-8 mb-8" />
                <Table locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No data found" /> }} sortDirections={["ascend", "descend"]} style={{ background: "daryGrey" }} scroll={{ y: '' }} pagination={false} columns={infoColumns} dataSource={marketCaps} loading={isLoading} className="custom-table" />
            </div>
        <Drawer
            title={[<div className="side-drawer-header">
                <span className="text-white">Markets</span>
                <span onClick={() => onClose()} className="icon md close-white c-pointer" />
            </div>]}
            placement="right"
            width="100%"
            closable={true}
            visible={isOpen}
            closeIcon={null}
            onClose={() => setIsOpen(false)}
            className="side-drawer-full"
        >
            <div className="markets-panel mr-0 markets-popup">
                <div className="full-screenable-node" style={{ overflow: "hidden", height: "100%", background: "daryGrey" }}>
                    <div style={{ marginBottom: '8px', textAlign: 'right', padding: 16 }}>
                        <Search value={searchVal} placeholder="Search Currency" addonAfter={<span className="icon md search-white" />} onChange={(value) => onSearch(value)} size="middle" bordered={false} className="px-16 mt-8 mb-8" />
                        <Table locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No data found" /> }} sortDirections={["ascend", "descend"]} style={{ background: "grey" }} pagination={false} columns={detailInfoColumns} scroll={{ y: '100vh' }} dataSource={marketCaps} loading={isLoading} className="custom-table" />
                    </div>
                </div>
            </div>
        </Drawer>
        </div>
    </>

}
export default MarketCap;