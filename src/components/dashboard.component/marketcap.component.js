import { Table } from 'antd';
import { FullscreenOutlined ,ReloadOutlined} from '@ant-design/icons'
import React, { useEffect, useState, useCallback } from 'react';
import Loader from '../../Shared/loader';
import { fetchMarketCaps } from './api';
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import { detailInfoColumns, infoColumns } from './marketcap.columns';
const MarketCap = () => {
    const marketsFullScreen = useFullScreenHandle();
    const [isDetailView,setDetailView] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [marketCaps, setMarketCaps] = useState([]);
    useEffect(() => { fetchMarketCapsInfo() }, [])
    const fetchMarketCapsInfo = async () => {
        setIsLoading(true)
        const response = await fetchMarketCaps({ pageNo: 1 });
        if (response.ok) {
            setMarketCaps(response.data);
            setIsLoading(false);
        }
    }
    const onFullScreenChange = useCallback((state, handle) => {
        setDetailView(state);
    });
    if (isLoading) { return <Loader /> }
    return <div>

        <FullScreen handle={marketsFullScreen} onChange={onFullScreenChange}>
            <div className="full-screenable-node" style={{overflow:"hidden",height:"100%",background:"daryGrey"}}>
                <div style={{marginBottom:'8px', textAlign:'right'}}>
                <FullscreenOutlined onClick={() => marketsFullScreen.enter()} className="fs-18 text-white ml-8 fw-500" />
                <ReloadOutlined  onClick={fetchMarketCapsInfo} className="fs-18 text-white ml-8 fw-500"/>
                </div>
                <Table sortDirections={["ascend","descend"]} style={{background:"grey"}} scroll={{y:isDetailView?750:400}} pagination={false} columns={isDetailView?detailInfoColumns:infoColumns} dataSource={marketCaps} loading={isLoading} className="custom-table" />
            </div>
        </FullScreen>
    </div>

}
export default MarketCap;