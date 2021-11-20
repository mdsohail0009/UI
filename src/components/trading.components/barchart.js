import Highcharts from 'highcharts';
import { useEffect } from 'react';

const BarChart = ({ data, title, categories, id }) => {

    useEffect(() => {
        Highcharts.chart((id || 'container'), {
            chart: {
                type: 'column',
                style: {
                    fontFamily: 'SF Pro Text, sans-serif !important'
                },
                backgroundColor: "transparent",
            },
            title: {
                text: '',
            },
            xAxis: {
                categories: categories
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
            series: data || [],
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 300
                    },
                }]
            }
        });
    }, []);
    return <div id={id || "container"}></div>

}

export default BarChart;