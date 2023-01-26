import { Table, Input, Empty, Drawer, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import Translate from 'react-translate-component';
import { fetchMarketCaps } from './api';
import { detailInfoColumns, infoColumns } from './marketcap.columns';
import apiCalls from '../../api/apiCalls';
import { connect } from 'react-redux';
const { Title } = Typography;

const MarketCap = ({ member }) => {
    const { Search } = Input;
    const [isLoading, setIsLoading] = useState(false);
    const [marketCaps, setMarketCaps] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [searchVal, setSearchVal] = useState([])
    const [originalMarketCaps, setOriginalMarketCaps] = useState([]);
    const [fullViewData, setFullViewData] = useState([]);
    const [fullViewLoading, setFullViewLoading] = useState(false);
    useEffect(() => {
        fetchMarketCapsInfo();
    }, [])
    const fetchMarketCapsInfo = async () => {
        setIsLoading(true);
        setSearchVal("");
        const response = await fetchMarketCaps({ pageNo: 1 });
        if (response.ok) {
            setMarketCaps(response.data);
            setOriginalMarketCaps(response.data);
            setIsLoading(false);
        }
    }
    const onSearch = ({ currentTarget: { value } }, isFullScreen) => {
        let matches = originalMarketCaps.filter(item => item.symbol.toLowerCase().includes(value.toLowerCase()));
        setSearchVal(value)
        if (!isFullScreen) { setMarketCaps(matches) } else {
            setFullViewData(matches);
        }

    }

    const onClose = () => {
        setSearchVal("");
        setMarketCaps([...originalMarketCaps]);
        setFullViewData([]);
        setIsOpen(false)
    }

    return <>
        <div className='market-panel-newstyle'></div>
            <div className="full-screenable-node marketcap-mt" >
                <div className="d-flex justify-content align-center">
                <div className="d-flex">
                    <div className="d-flex align-center">
                        <Translate content="markets_title" component={Title} className="db-titles" />
                        <div className = 'search-box markets-search'>
                        <Search
                            placeholder={apiCalls.convertLocalLang('search_currency')} 
                            value={searchVal}
                            onChange={(value) => onSearch(value)}
                            size="middle"
                            bordered={false}
                            className="search-text" />
                        <a className="search-btnexpand">
                            <span className="icon lg search-angle icon-space" />
                        </a>
                    </div> 
                    </div>
                </div>
                </div>
                <div className='bash-market-table responsive_table bg-none dashb-btmtable'>
                
                
                <Table  locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={apiCalls.convertLocalLang('No_data')} /> }} sortDirections={["ascend", "descend"]}  scroll={{ y: '' }} pagination={false} columns={infoColumns} dataSource={marketCaps} loading={isLoading} className="pay-grid view mb-view marketcap-coinsize" />
                </div>
            </div>
            <Drawer
                title={[<div className="side-drawer-header">
                    <Translate content="markets_title" component={Title} className="grid-title" />
                    <span onClick={() => onClose()} className="icon md close-white c-pointer" />
                </div>]}
                placement="right"
                width="100%"
                closable={true}
                visible={isOpen}
                closeIcon={null}
                onClose={() => setIsOpen(false)}
                className="side-drawer-full markets-drawer"
                destroyOnClose={true}
            > 
                <div className="markets-panel mr-0 markets-popup">
                    <div className="full-screenable-node" >
                  
                        <div style={{ marginBottom: '8px', textAlign: 'right' }}>
                            <Table className='markets-grid' locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={apiCalls.convertLocalLang('No_data')} /> }} sortDirections={["ascend", "descend"]}  pagination={false} columns={detailInfoColumns}  dataSource={fullViewData} loading={fullViewLoading} />
                        </div>
                    </div>
                </div>
                </Drawer>

    </>

}
const connectStateToProps = ({ userConfig }) => {
    return { member: userConfig.userProfileInfo }
}
export default connect(connectStateToProps, null)(MarketCap);