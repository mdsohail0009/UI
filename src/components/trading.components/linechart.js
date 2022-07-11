import { createChart, ColorType, PriceScaleMode } from "lightweight-charts";
import React, { useEffect, useState, useRef } from 'react';

const LineChart = ({ data }) => {
    const lineGraphRef = useRef();
    const [, setChart] = useState(null)
    useEffect(() => {
        let _chart = createChart(lineGraphRef.current, {
            height: 400,
            localization: {
                dateFormat: "dd MMM yy",
            },
            priceScale: { position: "left", mode: PriceScaleMode.Normal },
            crosshair: {
                vertLine: {
                    color: '#FFDB1A',
                    width: 1,
                    style: 1,
                    visible: true,
                    labelVisible: false,
                },
                horzLine: {
                    color: '#FFDB1A',
                    width: 1,
                    style: 0,
                    visible: true,
                    labelVisible: true,
                },
                mode: 1,
            },
            layout: {
                background: {
                    type: ColorType.VerticalGradient,
                    topColor: 'transparent',
                    bottomColor: 'transparent',
                },
                textColor: '#9797AA',
                fontSize: 16,
                fontFamily: 'SF Pro Text, sans-serif !important',
                lineColor: "#ECF1F4"
            },
            grid: {
                vertLines: {
                    color: '#313c46',
                    style: 1,
                    visible: true,
                },
                horzLines: {
                    color: '#313c46',
                    style: 1,
                    visible: true,
                },
            },
            handleScroll: {
                mouseWheel: true,
                pressedMouseMove: true,
            },
            handleScale: {
                axisPressedMouseMove: true,
                mouseWheel: true,
                pinch: true,
            },
        });
        const areaSeries = _chart.addAreaSeries({
            topColor: 'rgba(98, 126, 234, 0.35)',
            bottomColor: 'rgba(98, 126, 234, 0)',
            lineColor: 'rgba(98, 12, 250, 1)',
            lineWidth: 3,
            autoscaleInfoProvider: () => ({
                priceRange: {
                    minValue: -9999999,
                    maxValue: 9999999,
                },
            }),
        });
        const areaSeries2 = _chart.addAreaSeries({
            topColor: 'rgba(77, 178, 5, 0.35)',
            bottomColor: 'rgba(77, 178, 5, 0)',
            lineColor: 'rgba(255, 61, 0, 1)',
            lineWidth: 3,
            autoscaleInfoProvider: () => {
                return ({
                    priceRange: {
                        minValue: -9999999,
                        maxValue: 9999999,
                    },
                });
            },
        });
        const data1 = { BTC: ((data && data?.cpnl) ? (data?.cpnl.map(item => { return { time: item.time, value: item.value } })) : []) }
        const data2 = { BTC: ((data && data?.btcTrend) ? (data?.btcTrend.map(item => { return { time: item.time, value: item.value } })) : []) }
        areaSeries.setData(data1.BTC);
        areaSeries2.setData(data2.BTC);
        _chart.timeScale().setVisibleLogicalRange({
            from: 0,
            to: 30,
        });
        _chart.timeScale().fitContent();
        setChart(_chart);
    }, [data]);// eslint-disable-line react-hooks/exhaustive-deps
    return <>
        <div id="graph-container" ref={lineGraphRef}></div>
    </>
}
export default LineChart