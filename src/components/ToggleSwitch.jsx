import React, { useState } from "react";
import "./Styles/BotonToggle.css";

function ToggleSwitch({ onToggle }) {
  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = () => {
    const newValue = !isToggled;
    setIsToggled(newValue);
    onToggle(newValue); // Devuelve el nuevo valor (true o false)
  };

  return (
    <label className="toggle-switch">
      <input type="checkbox" checked={isToggled} onChange={handleToggle} />
      <span className="slider"></span>
    </label>
  );
}

export default ToggleSwitch;
