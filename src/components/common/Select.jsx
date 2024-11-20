// src/components/common/Select.jsx
import React, { useState, useRef, useEffect } from 'react';

const Select = ({
  label,
  options,
  searchable = false,
  placeholder = 'Select an option',
  className = '',
  onChange, // new prop to pass the selected value outside the component
  ...props
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  // Filter options based on the search term if searchable is true
  const filteredOptions = searchable
    ? options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false); // Close dropdown after selection
    setSearchTerm(''); // Clear the search term when an option is selected
    if (onChange) onChange(option); // Pass the selected value to the parent component
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (selectRef.current && !selectRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`mb-4 ${className}`} ref={selectRef}>
      {label && <label className="block mb-1 font-medium text-gray-700">{label}</label>}
      <div className="relative">
        {searchable ? (
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm || selectedOption}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={toggleDropdown}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            readOnly={!searchable}
          />
        ) : (
          <div
            className="w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer bg-white"
            onClick={toggleDropdown}
          >
            {selectedOption || placeholder}
          </div>
        )}
        {isOpen && (
          <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md max-h-40 overflow-y-auto mt-1">
            {filteredOptions.map((option, index) => (
              <div
                key={index}
                className="px-3 py-2 cursor-pointer hover:bg-gray-200"
                onClick={() => handleSelect(option)}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Select;
