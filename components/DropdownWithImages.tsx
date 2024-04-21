"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import pizza from '../public/pizza.png';

const DropdownOption = ({ option, contentMapping, onSelect }) => (
    <li onClick={() => onSelect(option)}>
        <Image
            src={contentMapping[option.name.toLowerCase()]}
            alt={option.name}
            width={64}
            height={64}
        />
        <span className="dropdown-option-label">{option.name}</span>
    </li>
);

const DropdownToggle = ({ selectedOption, contentMapping, onToggle }) => (
    <div className="dropdown-toggle" onClick={onToggle}>
        <Image
            src={selectedOption ? contentMapping[selectedOption.name.toLowerCase()] : pizza}
            alt={selectedOption ? selectedOption.name : 'Default Image'}
            width={64}
            height={64}
        />
        <span className="dropdown-option-label">
            {selectedOption ? selectedOption.name : 'Select an option'}
        </span>
        <span className="dropdown-caret"></span>
    </div>
);

function DropdownWithImages({ options, contentMapping, onSelectOption }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    const selectOption = (option) => {
        setSelectedOption(option);
        setIsDropdownOpen(false);
        onSelectOption(option);
    };

    return (
        <div className='container'>
            <div className="dropdown">
                <DropdownToggle
                    selectedOption={selectedOption}
                    contentMapping={contentMapping}
                    onToggle={toggleDropdown}
                />
                <ul className={`dropdown-menu ${isDropdownOpen ? 'open' : ''}`}>
                    {options.map(option => (
                        <DropdownOption
                            key={option.id || option.name}
                            option={option}
                            contentMapping={contentMapping}
                            onSelect={selectOption}
                        />
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default DropdownWithImages;