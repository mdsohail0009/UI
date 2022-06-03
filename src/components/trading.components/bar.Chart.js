import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const BarChart = ({ data }) => {
    let pnlData = [];
    let btcData = [];
    let dateData = [];
    for (let d of data.categories) {
        dateData.push(d.slice(0, 10))
    }
    for (let d of data.series[0].data) {
        pnlData.push(parseFloat((d).toFixed(2)))
    }
    for (let d of data.series[1].data) {
        btcData.push(parseFloat((d).toFixed(2)))
    }

    const options = {
        chart: {
            type: 'column',
            style: {
                fontFamily: 'SF Pro Text, sans-serif !important'
            },
            backgroundColor: "transparent"
        },
        title: {
            text: '',
            align: 'left'
        },
        xAxis: {
            categories: dateData,
            labels: {
                autoRotation: [0, -90],
                step: 6,
                formatter: function () {
                    return this.value
                }
            },
            gridLineColor: 'transparent',
        },
        yAxis: {
            title: {
                text: ""
            },
            labels: {
                format: '{text}',
            },
            gridLineColor: 'transparent',
        },
        credits: {
            enabled: false
        },
        legend: {
            itemHoverStyle: { "color": "#9797AA" },
            itemStyle: { "color": "#9797AA" }
        },
        colorAxis: [{
            gridLineColor: "#FFDB1A",
            gridLineWidth: 0
        }],
        tooltip: {
            valueSuffix: '%',
            valueDecimals: 2,
            borderColor: 'transparent',
            backgroundColor: '#F5FCFF',
            borderRadius: 20,
        },
        series: [{
            name: "Cumulative PNL(%)",
            data: pnlData,
            type: 'column',
            color: 'red'
        },
        {
            name: "Cumulative BTC Trend",
            data: btcData,
            type: 'column',
            color: 'blue'
        }
        ],
    }

    return (
        <div>
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
            />
        </div>
    );
};

export default BarChart;