import Highcharts from 'highcharts';
import { useEffect } from "react";

const LineChart = ({ data, type, id, coinType }) => {
    useEffect(() => {
        Highcharts.chart((id || 'linecontainer'), {
            chart: {
                height: 400,
                style: {
                    fontFamily: 'SF Pro Text, sans-serif !important',
                },
                backgroundColor: "transparent"
            },
            xAxis: {
                type: 'datetime',
                gridLineColor: 'transparent',
            },
            yAxis: {
                title: {
                    text: ''
                },
                gridLineColor: 'transparent',
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            tooltip: {
                borderColor: 'transparent',
                backgroundColor: '#F5FCFF',
                borderRadius: 20,
            },
            series: [{
                type: 'area',
                name: coinType,
                data: data[type],
                lineColor: 'rgb(255,219,26)',
                threshold: null,
                fillColor: {
                    linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                    stops: [
                        [0, 'rgba(255,219,26,0.5)'],
                        [1, 'rgba(255,219,26,0.025)']
                    ]
                },
                color: 'rgb(255,0,0)',
                marker: {
                    symbol: 'circle',
                    fillColor: '#FFFFFF',
                    lineColor: 'rgb(255,0,0)',
                    lineWidth: 1,
                },
            }]
        });
    }, [data, type, coinType]);//eslint-disable-line react-hooks/exhaustive-deps
    return <div id={id || "linecontainer"}></div>
}
export default LineChart