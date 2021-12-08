import Highcharts from 'highcharts';
import { useEffect } from "react";



const LineChart = ({ data, type,id,coinType }) => {
    
    useEffect(() => {
        Highcharts.chart((id||'linecontainer'), {
            chart: {
                
                backgroundColor:'var(--bgGloom)'
            },
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                type: 'datetime',
                gridLineColor:'transparent',
            },
            yAxis: {
                title: {
                    text: ''
                },
                gridLineColor:'transparent',

            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[6]],
                            [1, Highcharts.color(Highcharts.getOptions().colors[6]).setOpacity(6).get('rgba')]
                        ],
                        
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },

            series: [{
                type: 'area',
                name: coinType,
                data: data[type]
            }]
        });
    }, [data,type,coinType]);
    return <div id={id||"linecontainer"}></div>
}
export default LineChart