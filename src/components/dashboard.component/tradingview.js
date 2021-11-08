import { Fragment, useEffect, useRef, useState } from "react";
import { createChart, LineStyle } from "lightweight-charts"; //npm install --save lightweight-charts
//import LoadingSpinner from "../components/ui/LoadingSpinner";

const apiDummyData = {
  total: [
    { time: "1539043200000", value: 13636 },
    { time: "2021-09-02", value: 10006 },
    { time: "2021-09-03", value: 13945 },
    { time: "2021-09-04", value: 17282 },
    { time: "2021-09-05", value: 19482 },
  ],
  BTC: [
    { time: "2021-09-01", value: 8312 },
    { time: "2021-09-02", value: 8601 },
    { time: "2021-09-03", value: 7399 },
    { time: "2021-09-04", value: 6656 },
    { time: "2021-09-05", value: 11358 },
  ],
  ETH: [
    { time: "2021-09-01", value: 5324 },
    { time: "2021-09-02", value: 1405 },
    { time: "2021-09-03", value: 6546 },
    { time: "2021-09-04", value: 10626 },
    { time: "2021-09-05", value: 8124 },
  ],
};

const assets = Object.keys(apiDummyData);
const assetColors = [];
assets.splice(assets.indexOf("total"), 1); // now assets is an array of all the coins (i.e. it removed 'total' from the array)

const rndInt = () => {
  return Math.floor(Math.random() * 150) + 75;
};

const TradingViewChart = () => {
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
    areaSeries.setData(apiDummyData.total);
    areaSeries.applyOptions({
      lineColor: "#8B0000",
      topColor: "rgba(100,0,0,0.5)",
      bottomColor: "rgba(100,0,0,0.05)",
      lineStyle: LineStyle.Solid,
      lineWidth: 2,
    });

    // generates a line series for each asset to the chart
    for (let asset of assets) {
      const assetColor = `rgb(${rndInt()},${rndInt()},${rndInt()})`;
      const assetColorObject={};
      assetColorObject[asset] = assetColor;
      assetColors.push(assetColorObject);
      const lineSeries = chart.addLineSeries();
      lineSeries.setData(apiDummyData[asset]);
      lineSeries.applyOptions({
        color: assetColor,
        lineWidth: 2,
      });
    }
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

  return (
    <Fragment>
      <div ref={ref} />
      <div>{assetLabels}</div>
    </Fragment>
  );
};

export default TradingViewChart;