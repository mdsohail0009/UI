import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const LineChart = ({ data, showPnl, showBtc }) => {
    const dateConverter = (d) => {
        d = d.split("/")
        d[1] = d[1].length === 1 ? d[1] === '0' + d[1] : d[1]
        return `${d[2]}-${d[0]}-${d[1]}`
    }
    let dateData = [];
    let pnlData = [];
    let btcData = [];
    data.cpnl.forEach((d) => {
        pnlData.push(parseFloat((d.value).toFixed(2)))
        dateData.push(dateConverter(d.time))
    })
    if (data.btcTrend == null) {
        btcData.push([]);
    } else {
        data.btcTrend.forEach((d) => {
            btcData.push(parseFloat((d.value).toFixed(2)))
        })
    }
    const options = {
        title: {
            text: '',
            align: 'left'
        },
        chart: {
            height: 400,
            style: {
                fontFamily: 'SF Pro Text, sans-serif !important',
            },
            backgroundColor: "transparent"
        },
        legend: {
            enabled: (showPnl && showBtc),
            itemHoverStyle: { "color": "#9797AA" },
            itemStyle: { "color": "#9797AA" }
        },
        xAxis: {
            categories: dateData,
            labels: {
                autoRotation: [0, -90],
                step: 6
            },
            gridLineColor: 'transparent',
        },
        yAxis: {
            title: {
                text: "",
            },
            labels: {
                format: '{text}',
            },
            gridLineColor: 'transparent',
        },
        tooltip: {
            borderColor: 'transparent',
            backgroundColor: '#F5FCFF',
            borderRadius: 20,
        },
        credits: {
            enabled: false
        },
        series: [{
            name: "Cumulative PNL",
            data: pnlData,
            type: 'areaspline',
            visible: showPnl,
            lineColor: 'rgb(255,0,0)',
            threshold: null,
            fillColor: {
                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                stops: [
                    [0, 'rgba(0,200,0,0.3)'],
                    [1, 'rgba(0,100,0,0.01)']
                ]
            },
            color: 'rgb(255,0,0)',
            marker: {
                symbol: 'circle',
                fillColor: '#FFFFFF',
                lineColor: 'rgb(255,0,0)',
                lineWidth: 2,
            },
        },
        {
            name: "Cumulative BTC Trend",
            data: btcData,
            type: 'areaspline',
            visible: showBtc,
            lineColor: 'rgb(0,0,255)',
            color: 'rgb(0,0,255)',
            threshold: null,
            fillColor: {
                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                stops: [
                    [0, 'rgba(0,0,255,0.2)'],
                    [1, 'transparent']
                ]
            },
            marker: {
                symbol: 'circle',
                fillColor: '#FFFFFF',
                lineColor: 'rgb(0,0,255)',
                lineWidth: 2
            }
        }],
    }

    return (
        <div>
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
            />
        </div>
    )
}
export default LineChart;