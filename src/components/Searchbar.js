import React from "react";
import "./Searchbar.css";

const Searchbar = ({ value, placeholderText, onChangeFunction }) => {
  return (
    <input
      className="searchbar"
      placeholder={placeholderText}
      value={value}
      onChange={(e) => onChangeFunction(e.target.value)}
    />
  );
};

export default Searchbar;
