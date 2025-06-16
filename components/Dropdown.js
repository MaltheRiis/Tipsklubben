// components/Dropdown.js
import React from 'react';

const Dropdown = ({ selectedSeason, onChange }) => {
  return (
    <div className="dropdown">
      <select value={selectedSeason} onChange={(e) => onChange(e.target.value)}>
        <option value="Sæson2">Sæson 2</option>
        <option value="Sæson3">Sæson 3</option>
        <option value="Sæson4">Sæson 4</option>
      </select>
    </div>
  );
};

export default Dropdown;
