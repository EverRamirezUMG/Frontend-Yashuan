import React from "react";
import "./Styles/ProgressBar.css";

const ProgressBar = ({ capacidad, progreso }) => {
  const percentage = capacidad > 0 ? (progreso / capacidad) * 100 : 0;

  return (
    <div className="progress-container">
      <div className="progress-label">
        Capacidad de bodega: {percentage.toFixed(2)}%
      </div>
      {/* <div className="progress-value">{percentage.toFixed(0)}%</div> */}
      <div className="progress-bar">
        <div className="progress" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};

export default ProgressBar;
