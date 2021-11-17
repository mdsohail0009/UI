import { Fragment, useEffect, useRef } from "react";
import { createChart, LineStyle, ColorType} from "lightweight-charts"; //npm install --save lightweight-charts
import moment from 'moment'

const apiDummyData = { "prices": [] }

const assets = Object.keys(apiDummyData);
assets.splice(assets.indexOf("total"), 1); // now assets is an array of all the coins (i.e. it removed 'total' from the array)


const TradingViewChart = ({ data, type }) => {
  const ref = useRef(null);

  useEffect(() => {
    loadGrph()
  }, [type]);
  useEffect(() => {
    loadGrph()
  }, [data]);

  const loadGrph = () =>{
    ref.current.innerHTML = '';
    const chart = createChart(ref.current, {
        height: 340,
        priceScale: { position: "left" },
        crosshair: {
          vertLine: {
            color: '#FFDB1A',
            width: 1,
            style: 1,
            visible: true,
            labelVisible: false,
          },
          horzLine: {
            color: '#FFDB1A',
            width: 1,
            style: 0,
            visible: true,
            labelVisible: true,
          },
          mode: 1,
        },
        layout: {
          background: {
            type: ColorType.VerticalGradient,
            topColor: 'transparent',
            bottomColor: 'transparent',
          },
          textColor: '#9797AA',
          fontSize: 16,
          fontFamily: 'SF Pro Text, sans-serif !important',
        },
        grid: {
          vertLines: {
            color: '#313c46',
            style: 1,
            visible: true,
          },
          horzLines: {
            color: '#313c46',
            style: 1,
            visible: true,
          },
        },
        handleScroll: {
          mouseWheel: true,
          pressedMouseMove: true,
        },
        handleScale: {
          axisPressedMouseMove: true,
          mouseWheel: true,
          pinch: true,
        }
        });
      const areaSeries = chart.addAreaSeries();
    const chartdata = { BTC: data[type].map(item => { return { time: formatDate(item[0]), value: item[1] } }) }
    areaSeries.setData(chartdata.BTC);
      areaSeries.applyOptions({
        lineColor: "rgba(255,219,26,1)",
        topColor: "rgba(255,219,26,0.15)",
        bottomColor: "rgba(255,219,26,0)",
        lineStyle: LineStyle.Solid,
        lineWidth: 2
      });
      // setIsLoading(false);
  }

  // const assetLabels = <span key={Object.keys(item)[0]}>
  //       <span style={{ color: `${Object.values(item)[0]}`, fontSize: "30px" }}>
  //         &#9632;{" "}
  //       </span>
  //       <span>{Object.keys(item)[0]} </span>
  //     </span>

  const formatDate = (d) => {
    
    let date = new Date(d)
    return moment(date).format('YYYY-MM-DD hh:mm');
  }

  return (
    <Fragment>
      <div ref={ref} />
      {/* <div>{assetLabels}</div> */}
    </Fragment>
  );
};

export default TradingViewChart;