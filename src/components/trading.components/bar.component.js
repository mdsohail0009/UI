import Highcharts from 'highcharts';
import { useEffect } from 'react';

//import './chart.css'

const BarChart = ({ data, title, categories, id }) => {

    useEffect(() => {
        Highcharts.chart((id || 'container'), {
            chart: {
                type: 'column',
                style: {
                    fontFamily: 'SF Pro Text, sans-serif !important'
                }
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