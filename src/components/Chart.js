import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  defaults,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "./Chart.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: "Trend Plot",
      color: "#ffffff",
      size: "40px",
    },
  },
};

const Chart = ({ chartData, totalCredits, totalDebits }) => {
  return (
    <div className="chart-container">
      <div className="card-container">
        <div className="card debit-card">
          <p className="card-value">{totalDebits}</p>
          <p className="card-label">Total Debit</p>
        </div>
        <div className="card credit-card">
          <p className="card-value">{totalCredits}</p>
          <p className="card-label">Total Credit</p>
        </div>
      </div>
      <Line
        className="chart"
        options={options}
        data={chartData}
        redraw={true}
      />
    </div>
  );
};

export default Chart;
