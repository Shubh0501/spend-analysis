import React, { useState, useEffect } from "react";
import "./App.css";

import Table from "./components/Table";
import Chart from "./components/Chart";
import Searchbar from "./components/Searchbar";
import TopCategories from "./components/TopCategories";

function App() {
  // State Variables START
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [selectedBankAccounts, setSelectedBankAccounts] = useState([]);
  const [bankAccountInputVal, setBankAccountInputVal] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [selectedView, setSelectedView] = useState("table");
  const [bankDropdown, setBankDropdown] = useState(false);
  const [totalCredits, setTotalCredits] = useState(0);
  const [totalDebits, setTotalDebits] = useState(0);
  const [topSpendCategories, setTopSpendCategories] = useState([]);
  const [topIncomeCategories, setTopIncomeCategories] = useState([]);
  // State Variables END

  // Lifecycle Methods Start
  useEffect(() => {
    setLoading(true);
    getData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      var groupedMap = {};
      var timeSeriesGroupedData = {};
      var t_credits = 0,
        t_debits = 0,
        total_debits = 0,
        total_credits = 0;
      var spendCategories = {},
        incomeCategories = {};
      //For all value in the backend dataset
      for (var i of data) {
        var date = formatDate(i[0]);
        var desc = String(i[1]).trim();
        desc = desc[0].toUpperCase() + desc.substring(1).toLowerCase();
        var debit = Number(i[2]);
        var credit = Number(i[3]);
        var bankAccount = i[5];
        if ((debit === NaN || debit === 0) && (credit !== NaN || credit > 0)) {
          total_credits += credit;
          if (incomeCategories[desc]) {
            incomeCategories[desc] += credit;
          } else {
            incomeCategories[desc] = credit;
          }
        }
        if ((credit === NaN || credit === 0) && (debit !== NaN || debit > 0)) {
          total_debits += debit;
          if (spendCategories[desc]) {
            spendCategories[desc] += debit;
          } else {
            spendCategories[desc] = debit;
          }
        }
        if (debit === NaN) {
          debit = 0;
        }
        if (credit === NaN) {
          credit = 0;
        }

        // If the values satisfy the filter conditions applied
        if (
          date >= fromDate &&
          date <= toDate &&
          selectedBankAccounts.includes(bankAccount) &&
          (filterText === "" ||
            String(desc).toLowerCase().includes(filterText.toLowerCase()))
        ) {
          t_credits += credit;
          t_debits += debit;
          if (groupedMap[desc]) {
            groupedMap[desc] += debit - credit;
          } else {
            groupedMap[desc] = debit - credit;
          }
          if (timeSeriesGroupedData[date]) {
            timeSeriesGroupedData[date] += debit - credit;
          } else {
            timeSeriesGroupedData[date] = debit - credit;
          }
        }
      }
      var finalData = [];
      var labels = [];
      var dataset = [];
      for (var [key, value] of Object.entries(groupedMap)) {
        finalData.push([key, value]);
      }
      for (var [key, value] of Object.entries(timeSeriesGroupedData)) {
        labels.push(key);
        dataset.push(value);
      }

      var spendCategoriesArray = [],
        incomeCategoriesArray = [];
      for (var [key, value] of Object.entries(spendCategories)) {
        var perc_contri = Number(Number(value) / total_debits).toFixed(2);
        spendCategoriesArray.push([key, Number(value), perc_contri]);
      }

      for (var [key, value] of Object.entries(incomeCategories)) {
        var perc_contri = Number(Number(value) / total_credits).toFixed(2);
        incomeCategoriesArray.push([key, Number(value), perc_contri]);
      }
      sortAndSave(spendCategoriesArray, setTopSpendCategories);
      sortAndSave(incomeCategoriesArray, setTopIncomeCategories);

      // Assigning values in state variables
      setChartData({
        labels: labels,
        datasets: [
          {
            label: "Value",
            data: dataset,
            borderColor: "green",
            backgroundColor: "white",
          },
        ],
      });
      setFilteredData(finalData);
      setTotalCredits("₹ " + Number(t_credits.toFixed()).toLocaleString());
      setTotalDebits("₹ " + Number(t_debits.toFixed()).toLocaleString());
    }
  }, [data, selectedBankAccounts, fromDate, toDate, filterText]);
  // Lifecycle Methods END

  // Custom function to sort a 2D Array
  const sortArray = (a, b) => {
    return Number(b[1]) - Number(a[1]);
  };

  // Function to save the array in State variable after sorting
  const sortAndSave = async (arr1, saveFn) => {
    arr1 = arr1.sort(sortArray);
    saveFn(arr1);
  };

  // Function to format date and return in YYYY-MM-DD Format
  const formatDate = (date) => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  // Function to get the data from the backend
  const getData = async () => {
    // backend call
    const resp = await fetch("http://localhost:5002/get_data");
    var respData = await resp.json();

    // Set data in the state variables
    setData(respData);
    setFilteredData(respData);

    var setOfMaps = new Set();
    var bankAccountArray = [];
    var minDate = new Date();
    var maxDate = new Date(1900, 0, 1);

    // Promise to find list of bank accounts and maximum and minimum date from the dataset
    var promises = respData.map((i) => {
      var bankName = i[5];
      if (!setOfMaps.has(bankName)) {
        setOfMaps.add(bankName);
        bankAccountArray.push(bankName);
      }
      var curDate = Date.parse(i[0]);
      if (curDate < minDate) {
        minDate = curDate;
      }
      if (curDate > maxDate) {
        maxDate = curDate;
      }
    });
    await Promise.all(promises);

    // Assigning state variables
    setBankAccounts(bankAccountArray);
    setSelectedBankAccounts(bankAccountArray);
    if (bankAccountArray.length > 1) {
      setBankAccountInputVal("Multiple");
    } else if (bankAccountArray.length === 1) {
      setBankAccountInputVal(bankAccountArray[0]);
    }
    setFromDate(formatDate(minDate));
    setToDate(formatDate(maxDate));
    setLoading(false);
  };

  // Function to update selected bank account by the user
  const updateSelectedBankAccounts = (bank) => {
    var ind = selectedBankAccounts.indexOf(bank);
    var newArr = [];

    // If the bank was not selected before, then adding it to selected array
    if (ind === -1) {
      console.log("NOt FOund");
      newArr = selectedBankAccounts.slice(0);
      newArr.push(bank);
    }
    // Else removing the value from the array
    else {
      console.log("FOunded");
      newArr = selectedBankAccounts.slice(0);
      newArr.splice(ind, 1);
    }
    setSelectedBankAccounts(newArr);

    // Updating the Valye to show the user in the single input bar
    if (newArr.length === 0) {
      setBankAccountInputVal("None");
    } else if (newArr.length === 1) {
      setBankAccountInputVal(newArr[0]);
    } else {
      setBankAccountInputVal("Multiple");
    }
  };

  const showTopCategoryChart = (val) => {
    setFilterText(val);
    setSelectedView("chart");
  };

  // JSX Return statement
  return (
    <div className="App">
      <div className="header-container">
        <h1 className="header">Spend Analysis</h1>
      </div>
      <div className="top-container">
        <div className="searchbar-container">
          <label className="name-label">Filter the statement</label>
          <Searchbar
            value={filterText}
            placeholderText="Filter Statement"
            onChangeFunction={setFilterText}
          />
        </div>
        <div className="bank-name-selector">
          <label className="name-label">Bank Name</label>
          <input
            className="bank-name"
            value={bankAccountInputVal}
            readOnly
            onClick={() => setBankDropdown(!bankDropdown)}
          />
          <div
            className="dropdown-menu"
            style={{
              visibility: bankDropdown ? "visible" : "hidden",
            }}
          >
            {bankAccounts.map((bank, index) => {
              return (
                <div>
                  <p
                    className="bank-dropdown-item"
                    onClick={() => updateSelectedBankAccounts(bank)}
                  >
                    <input
                      type="checkbox"
                      className="bank-dropdown-checkbox"
                      checked={selectedBankAccounts.includes(bank)}
                    />
                    {bank}
                  </p>
                  {index === bankAccounts.length - 1 ? null : (
                    <div className="horizontal-divider" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="date-range-selector">
          <div className="date-selector-container from-date-container">
            <label className="name-label">From</label>
            <input
              type="date"
              className="date-selector from-date"
              value={fromDate}
              onChange={(e) => setFromDate(formatDate(e.target.valueAsDate))}
            />
          </div>

          <div className="date-selector-container to-date-container">
            <label className="name-label">To</label>
            <input
              type="date"
              className="date-selector to-date"
              value={toDate}
              onChange={(e) => setToDate(formatDate(e.target.valueAsDate))}
            />
          </div>
        </div>
      </div>
      <div className="data-container">
        <div className="view-toggle">
          <div
            className="view-toggle-button table-view-button"
            onClick={() => setSelectedView("table")}
            style={{
              backgroundColor: selectedView === "table" ? "white" : "black",
              color: selectedView === "table" ? "black" : "white",
            }}
          >
            <p className="view-toggle-button-text">Table View</p>
          </div>
          <div
            className="view-toggle-button chart-view-button"
            onClick={() => setSelectedView("chart")}
            style={{
              backgroundColor: selectedView === "chart" ? "white" : "black",
              color: selectedView === "chart" ? "black" : "white",
            }}
          >
            <p className="view-toggle-button-text">Chart View</p>
          </div>
          <div
            className="view-toggle-button top-categories-button"
            onClick={() => setSelectedView("top_categories")}
            style={{
              backgroundColor:
                selectedView === "top_categories" ? "white" : "black",
              color: selectedView === "top_categories" ? "black" : "white",
            }}
          >
            <p className="view-toggle-button-text">Top Categories</p>
          </div>
        </div>
        {selectedView === "table" ? (
          <Table filteredData={filteredData} />
        ) : selectedView === "chart" ? (
          <Chart
            chartData={chartData}
            totalCredits={totalCredits}
            totalDebits={totalDebits}
          />
        ) : (
          <TopCategories
            spend={topSpendCategories}
            income={topIncomeCategories}
            onClickFunction={showTopCategoryChart}
          />
        )}
      </div>
    </div>
  );
}

export default App;
