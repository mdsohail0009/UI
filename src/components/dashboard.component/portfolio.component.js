import React, { Component } from 'react';
import { Typography, Radio } from 'antd';
import Translate from 'react-translate-component';
import ConnectStateProps from '../../utils/state.connect';
import Currency from '../shared/number.formate';
import { fetchPortfolioData } from '../../reducers/dashboardReducer';
import { createChart, ColorType, PriceScaleMode, LineStyle } from "lightweight-charts";
import { getPortfolioGraph } from './api';
import { Link } from 'react-router-dom';
import PortfolioChart from './portfolioChart';
class Portfolio extends Component {
    chart;
    state = {
        loading: true,
        info: {},
        portfolioData: null
    }
    portFolioGraphRef = React.createRef();
    async fetchInfo() {
        this.props.dispatch(fetchPortfolioData(this.props.userProfile?.id));
    }
    componentDidMount() {
        this.fetchInfo();
        this.getGraph("week");
    }
    getGraph = async (type) => {
        const response = await getPortfolioGraph(this.props.userProfile?.id, type);
        if (response.ok) {
            this.setState({ ...this.state, portfolioData: response.data });
        } else {
            this.setState({ ...this.state, portfolioData: [] });
        }
        // this.portFolioGraphRef.current.innerHTML = ""
        // this.chart = createChart(this.portFolioGraphRef.current, {
        //     height: 300,
        //     localization: {
        //         dateFormat: "dd MMM yy",
        //     },

        //     priceScale: { position: "left", mode: PriceScaleMode.Normal },
        //     crosshair: {
        //         vertLine: {
        //             color: '#FFDB1A',
        //             width: 2,
        //             style: 1,
        //             visible: true,
        //             labelVisible: false,
        //         },
        //         horzLine: {
        //             color: '#FFDB1A',
        //             width: 2,
        //             style: 0,
        //             visible: true,
        //             labelVisible: true,
        //         },
        //         mode: 1,
        //     },
        //     layout: {
        //         background: {
        //             type: ColorType.VerticalGradient,
        //             topColor: 'transparent',
        //             bottomColor: 'transparent',
        //         },
        //         textColor: '#9797AA',
        //         fontSize: 16,
        //         fontFamily: 'SF Pro Text, sans-serif !important',
        //     },
        //     grid: {
        //         vertLines: {
        //             color: '#CECECE',
        //             style: 1,
        //             visible: false,
        //         },
        //         horzLines: {
        //             color: '#CECECE',
        //             style: 1,
        //             visible: false,
        //         },
        //     },
        //     handleScroll: {
        //         mouseWheel: true,
        //         pressedMouseMove: true,
        //     },
        //     handleScale: {
        //         axisPressedMouseMove: true,
        //         mouseWheel: true,
        //         pinch: true,
        //     },
        // });
        // const response = await getPortfolioGraph(this.props.userProfile?.id, type);
        // if (response.ok) {
        //     const areaSeries = this.chart.addAreaSeries({
        //         autoscaleInfoProvider: () => ({
        //             priceRange: {
        //                 minValue: 0,
        //                 maxValue: 70,
        //             },
        //         }),
        //     });
        //     areaSeries.applyOptions({
        //         lineColor: "rgba(255,219,26,1)",
        //         lineStyle: LineStyle.Solid,
        //         lineWidth: 2,
        //     });
        //     let objData = response.data
        //     // {week : [
        //     //     { time: "2021-09-30", value: 19 },
        //     //     { time: "2021-10-01", value: 30 },
        //     //     { time: "2021-10-02", value: 25 },
        //     //     { time: "2021-10-03", value: 10 },
        //     //     { time: "2021-10-04", value: 15 },
        //     //     { time: "2021-10-05", value: 25 },
        //     //     { time: "2021-10-06", value: 59.57 }
        //     //   ],
        //     //   month : [
        //     //     { time: "2021-09-06", value: 58.74 },
        //     //     { time: "2021-09-07", value: 30 },
        //     //     { time: "2021-09-08", value: 44 },
        //     //     { time: "2021-09-09", value: 57.78 },
        //     //     { time: "2021-09-10", value: 30 },
        //     //     { time: "2021-09-11", value: 58.37 },
        //     //     { time: "2021-09-12", value: 20 },
        //     //     { time: "2021-09-13", value: 25 },
        //     //     { time: "2021-09-14", value: 5 },
        //     //     { time: "2021-09-15", value: 56.58 },
        //     //     { time: "2021-09-16", value: 6 },
        //     //     { time: "2021-09-17", value: 10 },
        //     //     { time: "2021-09-18", value: 56.52 },
        //     //     { time: "2021-09-19", value: 56.99 },
        //     //     { time: "2021-09-20", value: 57.24 },
        //     //     { time: "2021-09-21", value: 60 },
        //     //     { time: "2021-09-22", value: 56.63 },
        //     //     { time: "2021-09-23", value: 50 },
        //     //     { time: "2021-09-24", value: 56.48 },
        //     //     { time: "2021-09-25", value: 45 },
        //     //     { time: "2021-09-26", value: 56.75 },
        //     //     { time: "2021-09-27", value: 56.55 },
        //     //     { time: "2021-09-28", value: 30 },
        //     //     { time: "2021-09-29", value: 33 },
        //     //     { time: "2021-09-30", value: 45 },
        //     //     { time: "2021-10-01", value: 23 },
        //     //     { time: "2021-10-02", value: 29 },
        //     //     { time: "2021-10-03", value: 59.25 },
        //     //     { time: "2021-10-04", value: 40 },
        //     //     { time: "2021-10-05", value: 45 },
        //     //     { time: "2021-10-06", value: 59.57 }

        //     //   ],
        //     //  year : [
        //     //     { time: "2021-09-01", value: 50 },
        //     //     { time: "2021-08-01", value: 80 },
        //     //     { time: "2021-07-01", value: 70 },
        //     //     { time: "2021-06-01", value: 55 },
        //     //     { time: "2021-05-01", value: 77 },
        //     //     { time: "2021-04-01", value: 45 },
        //     //     { time: "2021-03-01", value: 20 },
        //     //     { time: "2021-02-01", value: 33 },
        //     //     { time: "2021-01-01", value: 41 },
        //     //     { time: "2020-12-01", value: 57 },
        //     //     { time: "2020-11-01", value: 70 },
        //     //     { time: "2020-10-01", value: 62 },

        //     //   ]}
        //     const data = { BTC: objData.map(item => { return { time: item.datetime, value: item.value } }) }
        //     areaSeries.setData(data.BTC);
        //     this.chart.timeScale().setVisibleLogicalRange({
        //         from: 0,
        //         to: 30,
        //     });
        //     this.chart.timeScale().fitContent();
        // }
    }
    render() {
        const { Title } = Typography;
        const { totalCryptoValue, totalFiatValue } = this.props.dashboard.portFolio.data;

        return (
            <div className="mb-24">
                {/* <Translate content="Portfolio_title" component={Title} level={3} className="fs-24 fw-600 mb-0 text-white-30" /> */}
                <div className="portfolio-count py-36">
                    {/* <div className="summary-count mr-16">
                        <Currency defaultValue={totalFiatValue} className={`fs-40 m-0 fw-600 ${totalFiatValue < 0 ? 'text-red' : 'text-green'}`} style={{ lineHeight: '54px' }} />
                        <div style={{ display: 'flex' }}><Currency defaultValue={totalCryptoValue} prefix={""} suffixText={"BTC"} className={`text-white-30 fs-16 m-0 ${totalCryptoValue < 0 ? 'text-red' : 'text-green'}`} style={{ lineHeight: '18px' }} />
                        <Link to="/cockpitCharts" className="dbchart-link fs-14 fw-500"><Translate content="cockpit" /><span className="icon sm right-angle ml-4" /></Link>
                        </div>
                    </div> */}
                </div>
                <div className="text-center mb-16 wmy-graph" >
                    <Radio.Group defaultValue="week" buttonStyle="solid" onChange={({ target: { value } }) => {
                        this.getGraph(value)
                    }}>
                        <Radio.Button value="week">
                            1<Translate content='W' /></Radio.Button>
                        <Radio.Button value="month">1
                            <Translate content='M' /></Radio.Button>
                        <Radio.Button value="year">1
                            <Translate content='Y' /></Radio.Button>
                    </Radio.Group>
                </div>
                {/* <div ref={this.portFolioGraphRef} /> */}
                <PortfolioChart data={this.state.portfolioData} />
            </div>
        );
    }
}

export default ConnectStateProps(Portfolio);