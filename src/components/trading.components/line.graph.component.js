import { createChart, ColorType, PriceScaleMode } from "lightweight-charts";
import React, { useEffect, useState } from 'react';
import { useRef } from "react";


const LineChart = ({ data, lineColor, id, height }) => {
    const lineGraphRef = useRef();
    const [chart, setChart] = useState(null)
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
            autoscaleInfoProvider: () => ({
                priceRange: {
                    minValue: -9999999,
                    maxValue: 9999999,
                },
            }),
        });
        let objData = {
            week: [
                { time: "2021-09-30", value: 19 },
                { time: "2021-10-01", value: 30 },
                { time: "2021-10-02", value: 25 },
                { time: "2021-10-03", value: 10 },
                { time: "2021-10-04", value: 15 },
                { time: "2021-10-05", value: 25 },
                { time: "2021-10-06", value: 59.57 }
            ],
            month: [
                { time: "2021-09-06", value: 58.74 },
                { time: "2021-09-07", value: 30 },
                { time: "2021-09-08", value: 44 },
                { time: "2021-09-09", value: 57.78 },
                { time: "2021-09-10", value: 30 },
                { time: "2021-09-11", value: 58.37 },
                { time: "2021-09-12", value: 20 },
                { time: "2021-09-13", value: 25 },
                { time: "2021-09-14", value: 5 },
                { time: "2021-09-15", value: 56.58 },
                { time: "2021-09-16", value: 6 },
                { time: "2021-09-17", value: 10 },
                { time: "2021-09-18", value: 56.52 },
                { time: "2021-09-19", value: 56.99 },
                { time: "2021-09-20", value: 57.24 },
                { time: "2021-09-21", value: 60 },
                { time: "2021-09-22", value: 56.63 },
                { time: "2021-09-23", value: 50 },
                { time: "2021-09-24", value: 56.48 },
                { time: "2021-09-25", value: 45 },
                { time: "2021-09-26", value: 56.75 },
                { time: "2021-09-27", value: 56.55 },
                { time: "2021-09-28", value: 30 },
                { time: "2021-09-29", value: 33 },
                { time: "2021-09-30", value: 45 },
                { time: "2021-10-01", value: 23 },
                { time: "2021-10-02", value: 29 },
                { time: "2021-10-03", value: 59.25 },
                { time: "2021-10-04", value: 40 },
                { time: "2021-10-05", value: 45 },
                { time: "2021-10-06", value: 59.57 }

            ],
            year: [
                { time: "2021-09-01", value: 50 },
                { time: "2021-08-01", value: 80 },
                { time: "2021-07-01", value: 70 },
                { time: "2021-06-01", value: 55 },
                { time: "2021-05-01", value: 77 },
                { time: "2021-04-01", value: 45 },
                { time: "2021-03-01", value: 20 },
                { time: "2021-02-01", value: 33 },
                { time: "2021-01-01", value: 41 },
                { time: "2020-12-01", value: 57 },
                { time: "2020-11-01", value: 70 },
                { time: "2020-10-01", value: 62 },

            ]
        }
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
    }, [data]);
    return <>
        <div id="graph-container" ref={lineGraphRef}></div>
    </>
}
export default LineChart