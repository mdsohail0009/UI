import { Fragment, useEffect, useRef, useState } from "react";
import { createChart, LineStyle } from "lightweight-charts"; //npm install --save lightweight-charts
//import LoadingSpinner from "../components/ui/LoadingSpinner";

const apiDummyData = {"prices":[]}

const assets = Object.keys(apiDummyData);
const assetColors = [];
assets.splice(assets.indexOf("total"), 1); // now assets is an array of all the coins (i.e. it removed 'total' from the array)

const rndInt = () => {
  return Math.floor(Math.random() * 150) + 75;
};

const TradingViewChart = ({data}) => {
  const ref = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  /* need useEffect in order to interact with the chart
  note: format for the chart data must be like this:
   [{time: yyyy-mm-dd, value: 123},{time: yyyy-mm-dd, value: 123},.... ] */
  useEffect(() => {
    // creates an empty grid for the chart
    const chart = createChart(ref.current, {
      width: 400,
      height: 300,
      localization: {
        dateFormat: "dd MMM yy",
      },
      watermark: {
        color: "rgba(11, 94, 29, 0.4)",
        visible: true,
        text: "Your portfolio",
        fontSize: 24,
        horzAlign: "left",
        vertAlign: "bottom",
      },
    });

    // for total ; adds an area series to the chart
    const areaSeries = chart.addAreaSeries();
    areaSeries.setData(data.prices.map(item => { return { time: formatDate(new Date(1000*item[0])), value: item[1] } }));
    areaSeries.applyOptions({
      lineColor: "#8B0000",
      topColor: "rgba(100,0,0,0.5)",
      bottomColor: "rgba(100,0,0,0.05)",
      lineStyle: LineStyle.Solid,
      lineWidth: 2,
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
  }, []);

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
  const formatDate=(d)=> {
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        let year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

  return (
    <Fragment>
      <div ref={ref} />
      <div>{assetLabels}</div>
    </Fragment>
  );
};

export default TradingViewChart;