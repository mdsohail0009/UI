import React, { Component } from 'react'
import { Card, Row, Col, Typography, Radio, Tooltip, Empty, Spin } from 'antd';
import apiCalls from "../../api/apiCalls";
import { connect } from 'react-redux';
import BarChart from '../trading.components/barchart';
import PieChart from '../trading.components/piechart';
import LineChart from '../trading.components/linechart';
import { Link } from 'react-router-dom';
import BChart from '../trading.components/bar.Chart';
import LChart from '../trading.components/line.Chart';
const { Title, Paragraph, Text } = Typography;

class CockpitCharts extends Component {
    state = {
        reports: [],
        c: null,
        cumulativePNL: null,
        assetAlloction: null,
        dailyPnl: null,
        profits: null,
        assetnetWorth: null
    }

    componentDidMount() {
        this.loadKpis();
        this.loadDashboards(30);
        this.cokpitKpiTrack();
    }
    cokpitKpiTrack = () => {
        apiCalls.trackEvent({ "Type": 'User', "Action": 'Cockpit KPI page view', "Username": this.props.userProfileInfo?.userName, "MemeberId": this.props.userProfileInfo?.id, "Feature": 'Cockpit', "Remarks": 'Cockpit KPI page view', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Cockpit' });
    }
    loadDashboards = async (days) => {
        this.setState({ ...this.state, cumulativePNL: null, profits: null, dailyPnl: null, assetnetWorth: null, assetAlloction: null })
        await Promise.all([
            apiCalls.getdshcumulativePnl(this.props.userConfig.id, days).then(_response => {
                if (_response.ok) {
                    this.setState({ ...this.state, cumulativePNL: _response.data })
                }
            }),
            apiCalls.getprofits(this.props.userConfig.id, days).then(_res => {
                if (_res.ok) {
                    this.setState({ ...this.state, profits: _res.data })
                }
            }),
            apiCalls.getdailypnl(this.props.userConfig.id, days).then(_dailyPnlres => {
                if (_dailyPnlres.ok) {
                    this.setState({ ...this.state, dailyPnl: _dailyPnlres.data })
                }
            }),
            apiCalls.getAssetNetwroth(this.props.userConfig.id, days).then(assetnetWorthres => {
                if (assetnetWorthres.ok) {
                    this.setState({ ...this.state, assetnetWorth: assetnetWorthres.data })
                }
            }),
            apiCalls.getAssetAllowcation(this.props.userConfig.id, days).then(assetAlloctionres => {
                if (assetAlloctionres.ok) {
                    this.setState({ ...this.state, assetAlloction: assetAlloctionres.data })
                }
            }),
        ]);
    }
    loadData = async () => {
        let response = await apiCalls.getreports('getReports');
        if (response.ok) {
            this.setState({ reports: response.data })
        }
    }
    loadKpis = async () => {
        let response = await apiCalls.getdshKpis(this.props?.userConfig?.id);
        if (response.ok) {
            this.setState({ ...this.state, kpis: response.data })
        }
    }

    viewReport = (elem) => {
        this.props.history.push('/cockpit/reportview/' + elem.name);
        apiCalls.trackEvent({ "Action": 'View Reports', "Feature": 'Dashboard', "Remarks": "View Reports", "FullFeatureName": 'Dashboard View Reports', "userName": this.props.userConfig.userName, id: this.props.userConfig.id });
    }

    render() {
        return (<>
            <div className="main-container db-container">
                <div className="mb-36 text-white-50 fs-24"><Link className="icon md leftarrow mr-16 c-pointer" to="/cockpit" />Back</div>
                {this.state.kpis && <Row gutter={16} className="mb-8">
                    <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={6}>
                        <div className="db-kpi">
                            <Text className="db-kpi-label">{'Crypto Balance'} </Text>
                            <Text className="db-kpi-val"> ${this.state.kpis.cryptoBalance}</Text><Text className="badge">BTC=${this.state.kpis.cryptoBTC} </Text>
                        </div>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={6}>
                        <div className="db-kpi">
                            <Text className="db-kpi-label">{'Fiat Balance'}</Text>
                            <Text className="db-kpi-val">${this.state.kpis.currency}{this.state.kpis.fiatBalance}</Text><Text className="badge">BTC<span>=</span>${this.state.kpis.cryptoBTC}</Text>
                        </div>
                    </Col>

                    {this.state.kpis?.yesterdayPNL != 0 && <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={6}>
                        <div className="db-kpi vthicon">
                            <div className="icon-bg">
                                <span className={`icon md ${this.state.kpis?.monthPNL > 0 ? "profit" : "lose"}-arw`} />
                            </div>
                            <div>
                                <Text className="db-kpi-label">{"Yesterday's PNL"}<Tooltip title="See for more info"><span className="icon md info ml-4" /></Tooltip></Text>
                                {this.state.kpis?.yesterdayPNL < 0 && <>
                                    <Text className="db-kpi-val text-red">{this.state.kpis.currency}{this.state.kpis.yesterdayPNL}</Text><Text className="badge ml-16"><span>-</span>{this.state.kpis.percentage}</Text></>}
                                {this.state.kpis?.yesterdayPNL > 0 && <>
                                    <Text className="db-kpi-val text-red">{this.state.kpis.currency}{this.state.kpis.yesterdayPNL}</Text><Text className="badge"><span>-</span>{this.state.kpis.percentage}</Text></>}
                            </div>
                        </div>
                    </Col>}
                    {this.state.kpis?.monthPNL != 0 && <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={6}>
                        <div className="db-kpi vthicon">
                            <div className="icon-bg">
                                <span className={`icon md ${this.state.kpis?.monthPNL > 0 ? "profit" : "lose"}-arw`} />
                            </div>
                            <div>
                                <Text className="db-kpi-label">{'30 Days PNL'}</Text>
                                {this.state.kpis?.monthPNL > 0 && <>
                                    <Text className="db-kpi-val text-green">${this.state.kpis.monthPNL}</Text>
                                </>}
                                {this.state.kpis?.monthPNL < 0 && <>
                                    <Text className="db-kpi-val text-red"><span>$</span>{this.state.kpis.monthPNL}</Text><Text className="badge">${this.state.kpis.monthPNL}</Text>
                                </>}
                            </div>
                        </div>
                    </Col>}
                </Row>}
                <Radio.Group defaultValue={30} buttonStyle="solid" className="my-16 wmy-graph" onChange={(e) => this.loadDashboards(e.target.value)}>
                    <Radio.Button value={1}>1 Day</Radio.Button>
                    <Radio.Button value={7}>7 Days</Radio.Button>
                    <Radio.Button value={14}>14 Days</Radio.Button>
                    <Radio.Button value={30}>30 Days</Radio.Button>
                </Radio.Group>
                <Row gutter={16}>
                    <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                        <Card size="small" className="graph" title={<><Text className="text-white-30 fs-14">Cumulative PNL(%)</Text><Tooltip title="Search for more info"><span className="icon md info ml-4" /></Tooltip></>} extra={<Text className="fs-18 l-height-normal fw-500 text-red"></Text>} headStyle={{ padding: "4px 16px" }}>
                            {this.state.cumulativePNL ? <LChart data={this.state.cumulativePNL} showPnl={true} showBtc={true} /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={apiCalls.convertLocalLang('No_data')} />}
                        </Card>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                        <Card size="small" className="graph" title={<><Text className="text-white-30 fs-14">Daily PNL(%)</Text><Tooltip title="Search for more info"><span className="icon md info ml-4" /></Tooltip></>} extra={<Text className="fs-18 l-height-normal fw-500 text-red"></Text>} headStyle={{ padding: "4px 16px" }}>
                            {this.state.dailyPnl ? <BChart data={this.state.dailyPnl} /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={apiCalls.convertLocalLang('No_data')} />}
                        </Card>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col xs={24} sm={24} md={24} lg={12} xl={11} xxl={11}>
                        <Card size="small" className="graph" title={<><Text className="text-white-30 fs-14">Asset Allocation</Text><Tooltip title="Search for more info"><span className="icon md info ml-4" /></Tooltip></>} headStyle={{ padding: "4px 16px" }}>
                            {this.state.assetAlloction ? <PieChart data={this.state.assetAlloction} /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={apiCalls.convertLocalLang('No_data')} />}
                        </Card>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={12} xl={13} xxl={13}>
                        <Card size="small" className="graph" title={<><Text className="text-white-30 fs-14">Assets Net Worth</Text><Tooltip title="Search for more info"><span className="icon md info ml-4" /></Tooltip></>} extra={<Text className="fs-18 l-height-normal fw-500 text-green"></Text>} headStyle={{ padding: "4px 16px" }}>
                            {this.state.assetnetWorth ? <LChart data={this.state.assetnetWorth} showPnl={true} showBtc={true} /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={apiCalls.convertLocalLang('No_data')} />}
                        </Card>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                        <Card size="small" className="graph" title={<><Text className="text-white-30 fs-14">Profits</Text><Tooltip title="Search for more info"><span className="icon md info ml-4" /></Tooltip></>} extra={<Text className="fs-18 l-height-normal fw-500 text-green"></Text>} headStyle={{ padding: "4px 16px" }}>
                            {this.state.profits ? <LChart data={this.state.profits} showPnl={true} showBtc={true} /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={apiCalls.convertLocalLang('No_data')} />}
                        </Card>
                    </Col>
                </Row>
            </div>
            <Row gutter={16}>
                {this.state.reports && <>{this.state.reports.map(elem => (
                    <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={8}>
                        <Card className="db-card" onClick={() => this.viewReport(elem)}>
                            <div className="d-flex">
                                <span className='icon lg dashboard mr-16' />
                                <div style={{ flex: 1 }}>
                                    <Title className="fs-20 fw-600 mb-0 text-white-30">{elem.name}</Title>
                                    <Paragraph className="text-white-30 fs-14 fw-200 mb-0">{elem.description}</Paragraph>
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}</>}
            </Row>


        </>)

    }
}
const connectStateToProps = ({ breadCrumb, oidc, userConfig }) => {
    return { breadCrumb, oidc, userConfig: userConfig.userProfileInfo, }
}
export default connect(connectStateToProps, (dispatch) => { return { dispatch } })(CockpitCharts);
