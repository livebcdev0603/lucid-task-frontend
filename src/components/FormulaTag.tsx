
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { FormulaTag as FormulaTagType } from '@/store/formulaStore';

interface FormulaTagProps {
  tag: FormulaTagType;
  onValueChange: (id: string, value: number) => void;
}

const FormulaTag: React.FC<FormulaTagProps> = ({ tag, onValueChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [inputValue, setInputValue] = useState(tag.value.toString());
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue)) {
      onValueChange(tag.id, numValue);
    } else {
      setInputValue(tag.value.toString());
    }
  };

  const handleToggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="relative inline-flex items-center rounded-md bg-blue-100 px-2 py-1 text-sm text-blue-800 group">
      <span className="mr-1">{tag.name}</span>
      <button
        onClick={handleToggleDropdown}
        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        aria-label="Toggle dropdown"
      >
        <ChevronDown size={14} />
      </button>
      
      {isDropdownOpen && (
        <div 
          ref={dropdownRef}
          className="absolute top-full left-0 mt-1 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50 overflow-hidden"
        >
          <div className="p-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Value
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={handleValueChange}
              onBlur={handleBlur}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-1 border"
              autoFocus
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FormulaTag;
