import { Table, Tooltip, Input, Empty, Drawer } from 'antd';
import { FullscreenOutlined, ReloadOutlined } from '@ant-design/icons'
import React, { useEffect, useState, useCallback } from 'react';
import Loader from '../../Shared/loader';
import { fetchMarketCaps } from './api';
import { useFullScreenHandle } from 'react-full-screen'
import { detailInfoColumns, infoColumns } from './marketcap.columns';
const MarketCap = () => {
    const marketsFullScreen = useFullScreenHandle();
    const { Search } = Input;
    const [isDetailView, setDetailView] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [marketCaps, setMarketCaps] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
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
        setDetailView(state);
    });
    const onSearch = ({ currentTarget: { value } }) => {
        let matches = originalMarketCaps.filter(item => item.symbol.toLowerCase().includes(value.toLowerCase()));
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
            <div style={{ marginBottom: '8px', textAlign: 'right', paddingRight: 16 }}>
                <Tooltip title="Full screen"><FullscreenOutlined onClick={()=>showDrawer()} className="fs-18 text-white ml-8 fw-500" /></Tooltip>
                    <Tooltip title="Reload"><ReloadOutlined onClick={fetchMarketCapsInfo} className="fs-18 text-white ml-16 fw-500" /></Tooltip>
            </div>
            <Search placeholder="Search Currency" addonAfter={<span className="icon md search-white" />} onChange={(value) => onSearch(value)} size="middle" bordered={false} className="px-16 mt-8 mb-8" />
            <Table locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> }} sortDirections={["ascend", "descend"]} style={{ background: "grey" }} scroll={{ y: isDetailView ? '100vh' : '' }} pagination={false} columns={infoColumns} dataSource={marketCaps} loading={isLoading} className="custom-table" />
        </div>
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
            <div style={{ marginBottom: '8px', textAlign: 'right', padding: 16  }}>
                <Search placeholder="Search Currency" addonAfter={<span className="icon md search-white" />} onChange={(value) => onSearch(value)} size="middle" bordered={false} className="px-16 mt-8 mb-8" />
                <Table locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> }} sortDirections={["ascend", "descend"]} style={{ background: "grey"}} pagination={false} columns={detailInfoColumns} dataSource={marketCaps} loading={isLoading} className="custom-table"/>
            </div>
            </div>
            </div>
        </Drawer>
    </>

}
export default MarketCap;