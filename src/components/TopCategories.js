import React from "react";
import "./TopCategories.css";

const TopCategories = ({ spend, income, onClickFunction }) => {
  return (
    <div className="top-categories-container">
      <div className="top-income-container">
        <div className="top-header-container">
          <p className="header">Top Income Categories</p>
        </div>
        {income.map((val) => {
          return (
            <div className="category" onClick={() => onClickFunction(val[0])}>
              <div
                className="fill-denoter income-fill"
                style={{ width: String(Number(val[2]) * 100) + "%" }}
              >
                <div className="fill-tooltip">
                  <p className="fill-percentage">
                    Contributes: {(Number(val[2]) * 100).toFixed(1) + "%"}
                  </p>
                </div>
              </div>
              <p>{val[0]}</p>
            </div>
          );
        })}
      </div>
      <div className="top-spend-container">
        <div className="top-header-container">
          <p className="header">Top Spend Categories</p>
        </div>
        {spend.map((val) => {
          return (
            <div className="category" onClick={() => onClickFunction(val[0])}>
              <div
                className="fill-denoter spend-fill"
                style={{ width: String(Number(val[2]) * 100) + "%" }}
              >
                <div className="fill-tooltip">
                  <p className="fill-percentage">
                    Contributes: {(Number(val[2]) * 100).toFixed(1) + "%"}
                  </p>
                </div>
              </div>
              <p>{val[0]}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopCategories;
