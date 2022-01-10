import Highcharts from 'highcharts';
import { useEffect } from 'react';

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
                },
                backgroundColor: "transparent",
            },
            title: {
                text: ''
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            credits: {
                enabled: false
            },
            accessibility: {
                point: {
                    valueSuffix: '%'
                }
            },
            tooltip: {
                borderColor: 'transparent',
                backgroundColor: '#F5FCFF',
                borderRadius: 20,
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<span style="color: var(--textWhite50);stroke-width: 0px !important;">{point.name}:{point.percentage:.1f} %</span>'
                    }
                }
            },
            series: [{
                name: 'Brands',
                colorByPoint: true,
                data: data || [],
            }]
        });
    }, []);
    return <div id="piecontainer"></div>
}

export default PieChart;