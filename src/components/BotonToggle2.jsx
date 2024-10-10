import React, { useState, useEffect } from "react";
import "./Styles/BotonToggle.css";

function ToggleSwitch2({ isChecked, onToggle }) {
  const [isToggled, setIsToggled] = useState(isChecked);

  useEffect(() => {
    setIsToggled(isChecked);
  }, [isChecked]);

  const handleToggle = () => {
    const newValue = !isToggled;
    setIsToggled(newValue);
    onToggle(newValue); // Notify parent component of the change
  };

  return (
    <label className="toggle-switch">
      <input type="checkbox" checked={isToggled} onChange={handleToggle} />
      <span className="slider"></span>
    </label>
  );
}

export default ToggleSwitch2;
