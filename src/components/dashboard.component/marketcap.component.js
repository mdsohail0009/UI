import { Table, Tooltip, Input, Empty, Drawer, Typography } from 'antd';
import { FullscreenOutlined, ReloadOutlined } from '@ant-design/icons'
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
    const showDrawer = () => {
        setIsOpen(true);
        setSearchVal("");
        let _data = [...originalMarketCaps]
        setFullViewLoading(true);
        setTimeout(() => {
            setFullViewData(_data);
            setFullViewLoading(false);
        }, 1000)
        marketsTack();
    }
    const marketsTack = () => {
        apiCalls.trackEvent({ "Type": 'User', "Action": 'Markets page view', "Username": member?.userName, "customerId": member?.id, "Feature": 'Markets', "Remarks": 'Markets page view', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Markets' });
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

                <div className="d-flex">
                    <div className="d-flex align-center">
                        <Translate content="markets_title" component={Title} className="db-titles" />
                        <div className = 'search-box'><input className = "search-text" type="text" placeholder = "Search Anything" />
                      <a href="#" className = "search-btnexpand">
                      <span className="icon lg search-angle icon-space" />
                      </a>
                  </div> 
                        {/* <Translate content="markets_subtitle" component={Paragraph} className="text-white-50 fs-16 mb-0 l-height-normal" /> */}
                    </div>
                    {/* <div className="market-actions">
                        <Tooltip title={apiCalls.convertLocalLang('full_screen')}><FullscreenOutlined onClick={() => showDrawer()} className="fs-18 text-white ml-8 fw-500" /></Tooltip>
                        <Tooltip title={apiCalls.convertLocalLang('reload')}><ReloadOutlined onClick={fetchMarketCapsInfo} className="fs-18 text-white ml-16 fw-500" /></Tooltip>
                    </div> */}
                </div>
                {/* <Search placeholder={apiCalls.convertLocalLang('searchCurrency')} value={searchVal} addonAfter={<span className="icon md search-white" />} onChange={(value) => onSearch(value)} size="middle" bordered={false} className="grey-search mt-12" /> */}
                <div className='bash-market-table responsive_table bg-none dashb-btmtable'>
                
                
                <Table  locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={apiCalls.convertLocalLang('No_data')} /> }} sortDirections={["ascend", "descend"]} style={{ background: "daryGrey" }} scroll={{ y: '' }} pagination={false} columns={infoColumns} dataSource={marketCaps} loading={isLoading} className="pay-grid view mb-view" />
                </div>
            </div>
            <Drawer
                title={[<div className="side-drawer-header">
                    <Translate content="markets_title" component={Title} className="fs-26 fw-400 mb-0 text-white-30" />
                    <span onClick={() => onClose()} className="icon md close-white c-pointer" />
                </div>]}
                placement="right"
                width="100%"
                closable={true}
                visible={isOpen}
                closeIcon={null}
                onClose={() => setIsOpen(false)}
                className="side-drawer-full"
                destroyOnClose={true}
            >
                <div className="markets-panel mr-0 markets-popup">
                    <div className="full-screenable-node" style={{ overflow: "hidden", height: "100%", background: "daryGrey" }}>
                  
                        <div style={{ marginBottom: '8px', textAlign: 'right' }}>
                            <Search 
                            value={searchVal} 
                            placeholder={apiCalls.convertLocalLang('search_currency')} 
                            addonAfter={<span className="icon md search-white" />} 
                            onChange={(value) => onSearch(value, true)} 
                            size="middle"
                             bordered={false} 
                             className="mt-8 mb-8 dark-search"
                              />
                              
                            <Table className='' locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={apiCalls.convertLocalLang('No_data')} /> }} sortDirections={["ascend", "descend"]} pagination={false} columns={detailInfoColumns} style={{ backgroundColor: 'var(--bgGrey)' }} scroll={{ y: '100vh' }} dataSource={fullViewData} loading={fullViewLoading} />
                        </div>
                    </div>
                </div>
            </Drawer>
        {/* </div> */}
    </>

}
const connectStateToProps = ({ userConfig }) => {
    return { member: userConfig.userProfileInfo }
}
export default connect(connectStateToProps, null)(MarketCap);