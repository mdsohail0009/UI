import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const PotfolioChart = ({ data }) => {
    let dateData = [];
    let pData = [];
    data?.map((d) => {
        pData.push(parseFloat((d.value).toFixed(2)))
        dateData.push(new Date(d.datetime).toLocaleDateString())
    })
    const options = {
        title: {
            text: '',
            align: 'left'
        },
        chart: {
            //height: 400,
            style: {
                fontFamily: 'SF Pro Text, sans-serif !important',
            },
            backgroundColor: 'transparent'
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
        legend: {
            enabled: false
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
            data: pData,
            type: 'area',
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
export default PotfolioChart;