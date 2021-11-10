import Highcharts from 'highcharts';
import { useEffect } from 'react';

//import './chart.css'

const PieChart = ({ data }) => {

    useEffect(() => {
        Highcharts.chart('piecontainer', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
                style: {
                    fontFamily: 'SF Pro Text, sans-serif !important'
                }
            },
            title: {
                text: ''
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            accessibility: {
                point: {
                    valueSuffix: '%'
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                    }
                }
            },
            series: [{
                name: 'Brands',
                colorByPoint: true,
                data: data || []
            }]
        });
    }, []);
    return <div id="piecontainer"></div>
}

export default PieChart;