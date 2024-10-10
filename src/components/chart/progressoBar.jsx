// import ProgressBar from "react-bootstrap/ProgressBar";

// function ProgressoBar(progreso) {
//   return <ProgressBar now={progreso} />;
// }

// export default ProgressoBar;

import React from "react";

function ProgressoBar({ progreso }) {
  let cap = 1200;
  const pross = (progreso / cap) * 100;
  let now = pross.toFixed(2);

  // Cambia este valor para ajustar el progreso
  return (
    <div>
      <h4>Capacidad de bodega</h4>
      <div className="progress">
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${now}%` }}
          aria-valuenow={now}
          aria-valuemin="0"
          aria-valuemax={cap}
        >
          {now}%
        </div>
      </div>
    </div>
  );
}

export default ProgressoBar;
