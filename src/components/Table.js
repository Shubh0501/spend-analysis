import React from "react";
import "./Table.css";

const Table = ({ filteredData }) => {
  return (
    <div className="table-container">
      <table className="table">
        <thead className="table-header-container">
          <th className="table-header-description">Item</th>
          <th className="table-header-data">
            Spend (Negative indicates Credit)
          </th>
        </thead>
        <tbody className="table-body-container">
          {filteredData.map((data, index) => {
            return (
              <tr className="table-row">
                <td
                  className="table-description"
                  style={{
                    borderBottomLeftRadius:
                      index === filteredData.length - 1 ? "10px" : "0",
                  }}
                >
                  {data[0]}
                </td>
                <td
                  className="table-data"
                  style={{
                    borderBottomRightRadius:
                      index === filteredData.length - 1 ? "10px" : "0",
                  }}
                >
                  ₹ {Number(Number(data[1]).toFixed(1)).toLocaleString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
