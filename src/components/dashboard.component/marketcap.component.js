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
                <FullscreenOutlined onClick={() => marketsFullScreen.enter()} />
                <ReloadOutlined onClick={fetchMarketCapsInfo}/>
                <Table sortDirections={["ascend","descend"]} style={{background:"grey"}} scroll={{y:isDetailView?750:400}} pagination={false} columns={isDetailView?detailInfoColumns:infoColumns} dataSource={marketCaps} loading={isLoading} />
            </div>
        </FullScreen>
    </div>

}
export default MarketCap;