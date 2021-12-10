import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const LineChart = ({ data, showPnl, showBtc }) => {
    const dateConverter = (d) => {
        d = d.split("/")
        d[1] = d[1].length == 1 ? d[1] = '0' + d[1] : d[1]
        return `${d[2]}-${d[0]}-${d[1]}`
    }
    let dateData = [];
    let pnlData = [];
    let btcData = [];
    data.cpnl.map((d) => {
        pnlData.push(parseFloat((d.value).toFixed(2)))
        dateData.push(dateConverter(d.time))
    })
    if (data.btcTrend == null) {
        btcData.push([]);
    } else {
        data.btcTrend.map((d) => {
            btcData.push(parseFloat((d.value).toFixed(2)))
        })
    }

    // for (let d of data.cpnl) {
    //     pnlData.push(parseFloat((d.value).toFixed(2)))
    //     dateData.push(dateConverter(d.time)) //yyyy-mm-dd format
    // }
    // for (let d of data.btcTrend) {
    //     btcData.push(parseFloat((d.value).toFixed(2)))
    // }
    const options = {
        title: {
            text: '',
            align: 'left'
        },
        chart: {
            height: 400,
            //width: 600,
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
            }
        },
        yAxis: {
            title: {
                text: "",
            },
            labels: {
                format: '{text}',
            }
        },
        tooltip: {
            borderColor: 'transparent',
            backgroundColor: '#F5FCFF',
            borderRadius: 20,
        },
        credits: {
            enabled: false
        },
        // chart related data and formatting
        series: [{
            // first series
            name: "Cumulative PNL",
            data: pnlData, // data must be in array form
            type: 'areaspline',
            visible: showPnl,
            lineColor: 'rgb(255,0,0)', // line chart color
            threshold: null, // if values are negative, fill area will still be below the line
            fillColor: { //area below chart color
                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                stops: [
                    [0, 'rgba(0,200,0,0.3)'],
                    [1, 'rgba(0,100,0,0.01)']
                ]
            },
            color: 'rgb(255,0,0)', // color for legend
            marker: { // the dot on the plot
                symbol: 'circle',
                fillColor: '#FFFFFF',
                lineColor: 'rgb(255,0,0)', // 
                lineWidth: 2,
            },
        }, // 2nd series
        {
            name: "Cumulative BTC Trend",
            data: btcData, // data must be in array form
            type: 'areaspline',
            visible: showBtc,
            lineColor: 'rgb(0,0,255)',
            color: 'rgb(0,0,255)',
            threshold: null,
            fillColor: { //area below chart color
                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                stops: [
                    [0, 'rgba(0,0,255,0.2)'],
                    [1, 'transparent']
                ]
            },
            marker: {
                symbol: 'circle',
                fillColor: '#FFFFFF', // circle fill color
                lineColor: 'rgb(0,0,255)', // circle line color
                lineWidth: 2
            }
        }], // end of chart related data
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