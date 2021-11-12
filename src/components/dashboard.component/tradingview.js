import { Fragment, useEffect, useRef, useState } from "react";
import { createChart, LineStyle, ColorType, PriceScaleMode, isBusinessDay } from "lightweight-charts"; //npm install --save lightweight-charts
//import LoadingSpinner from "../components/ui/LoadingSpinner";
import moment from 'moment'

const apiDummyData = { "prices": [] }

const assets = Object.keys(apiDummyData);
const assetColors = [];
assets.splice(assets.indexOf("total"), 1); // now assets is an array of all the coins (i.e. it removed 'total' from the array)

const rndInt = () => {
  return Math.floor(Math.random() * 150) + 75;
};

const TradingViewChart = ({ data, type }) => {
  const ref = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  /* need useEffect in order to interact with the chart
  note: format for the chart data must be like this:
   [{time: yyyy-mm-dd, value: 123},{time: yyyy-mm-dd, value: 123},.... ] */
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
        },
        // watermark: {
        //   color: "rgba(11, 94, 29, 0.4)",
        //   visible: true,
        //   text: "Your portfolio",
        //   fontSize: 24,
        //   horzAlign: "left",
        //   vertAlign: "bottom",
        // },
      });
      // for total ; adds an area series to the chart
      const areaSeries = chart.addAreaSeries();
    //   areaSeries.setData(data[type].map(item => { return { time: formatDate(item[0].toString().substr(0,10)), value: item[1] } }));
    const chartdata = { BTC: data[type].map(item => { return { time: formatDate(item[0]), value: item[1] } }) }
    areaSeries.setData(chartdata.BTC);
    // areaSeries.setData(data[type].map(item => { return { time: formatDate(item[0]), value: item[1] } }));
      areaSeries.applyOptions({
        lineColor: "rgba(255,219,26,1)",
        topColor: "rgba(255,219,26,0.15)",
        bottomColor: "rgba(255,219,26,0)",
        lineStyle: LineStyle.Solid,
        lineWidth: 2,
        timeScale: {
          rightOffset: 12,
          barSpacing: 3,
          fixLeftEdge: true,
          lockVisibleTimeRangeOnResize: true,
          rightBarStaysOnScroll: true,
          borderVisible: false,
          borderColor: '#fff000',
          visible: true,
          timeVisible: true,
          secondsVisible: false,
          tickMarkFormatter: (time, tickMarkType, locale) => {
              console.log(time, tickMarkType, locale);
              const year = isBusinessDay(time) ? time.year : new Date(time * 1000).getUTCFullYear();
              return String(year);
          },
      }
      });
  
      // generates a line series for each asset to the chart
      // for (let asset of assets) {
      //   const assetColor = `rgb(${rndInt()},${rndInt()},${rndInt()})`;
      //   const assetColorObject={};
      //   assetColorObject[asset] = assetColor;
      //   assetColors.push(assetColorObject);
      //   const lineSeries = chart.addLineSeries();
      //   lineSeries.setData(apiDummyData[asset].map(item => { return { time: formatDate(new Date(1000*item[0])), value: item[1] } }));
      //   lineSeries.applyOptions({
      //     color: assetColor,
      //     lineWidth: 2,
      //   });
      // }
      setIsLoading(false);
  }

  // setting the labels for the asset at the bottom of the chart
  const assetLabels = isLoading ? (
    <></>
  ) : (
    assetColors.map((item) => (
      <span key={Object.keys(item)[0]}>
        <span style={{ color: `${Object.values(item)[0]}`, fontSize: "30px" }}>
          &#9632;{" "}
        </span>
        <span>{Object.keys(item)[0]} </span>
      </span>
    ))
  );
  const formatDate = (d) => {
    
    let date = new Date(d)
    // console.log(moment(date).format('YYYY-MM-DD hh:mm'))
    return moment(date).format('YYYY-MM-DD hh:mm');
  }

  return (
    <Fragment>
      <div ref={ref} />
      <div>{assetLabels}</div>
    </Fragment>
  );
};

export default TradingViewChart;