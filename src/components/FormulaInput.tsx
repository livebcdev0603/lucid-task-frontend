
import React, { useState, useRef, useEffect } from 'react';
import { useSuggestions } from '@/api/suggestionsApi';
import { useFormulaStore, FormulaTag as FormulaTagType } from '@/store/formulaStore';
import FormulaTag from './FormulaTag';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

const operatorRegex = /^[\+\-\*\/\(\)\^\%]$/;

const FormulaInput: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { formula, cursorPosition, addToFormula, removeLastItem, setCursorPosition, setVariableValue } = useFormulaStore();
  
  const { data: suggestions = [] } = useSuggestions(inputValue);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Focus input when container is clicked
  const handleContainerClick = () => {
    inputRef.current?.focus();
    setIsFocused(true);
  };

  // Update cursor position based on click position
  const handleFormulaElementClick = (index: number) => {
    setCursorPosition(index);
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Check if input is an operator
    if (value && operatorRegex.test(value)) {
      addToFormula(value);
      setInputValue('');
      setShowSuggestions(false);
      return;
    }
    
    // Check if input is a number
    if (value && /^\d+$/.test(value)) {
      addToFormula(value);
      setInputValue('');
      setShowSuggestions(false);
      return;
    }
    
    setInputValue(value);
    if (value.trim()) {
      setShowSuggestions(true);
      setSelectedSuggestionIndex(0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && inputValue === '') {
      e.preventDefault();
      removeLastItem();
    } else if (e.key === 'Enter' && showSuggestions && suggestions.length > 0) {
      e.preventDefault();
      const selectedSuggestion = suggestions[selectedSuggestionIndex];
      addToFormula(selectedSuggestion);
      setInputValue('');
      setShowSuggestions(false);
    } else if (e.key === 'ArrowDown' && showSuggestions) {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp' && showSuggestions) {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    } else if (e.key === 'ArrowLeft') {
      if (cursorPosition > 0 && inputValue === '') {
        e.preventDefault();
        setCursorPosition(cursorPosition - 1);
      }
    } else if (e.key === 'ArrowRight') {
      if (cursorPosition < formula.length && inputValue === '') {
        e.preventDefault();
        setCursorPosition(cursorPosition + 1);
      }
    }
  };

  const handleSuggestionClick = (suggestion: FormulaTagType) => {
    addToFormula(suggestion);
    setInputValue('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleBlur = () => {
    // Small delay to allow for suggestion clicks
    setTimeout(() => {
      setIsFocused(false);
      setShowSuggestions(false);
    }, 150);
  };

  // Calculate formula result
  const result = useFormulaStore(state => state.calculateResult());

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div 
        ref={containerRef}
        onClick={handleContainerClick}
        className={cn(
          "min-h-[44px] w-full border rounded-lg px-3 py-2 flex flex-wrap items-center gap-1 transition-all duration-200 relative cursor-text",
          isFocused 
            ? "border-blue-500 ring-2 ring-blue-100" 
            : "border-gray-300 hover:border-gray-400"
        )}
      >
        {formula.map((item, index) => (
          <React.Fragment key={index}>
            {typeof item === 'string' ? (
              <span 
                className="px-1 text-gray-900 font-mono"
                onClick={() => handleFormulaElementClick(index)}
              >
                {item}
              </span>
            ) : (
              <FormulaTag 
                tag={item} 
                onValueChange={setVariableValue}
              />
            )}
            {index === cursorPosition && isFocused && (
              <div className="h-5 w-0.5 bg-blue-500 animate-pulse"></div>
            )}
          </React.Fragment>
        ))}
        {cursorPosition === formula.length && isFocused && (
          <div className="h-5 w-0.5 bg-blue-500 animate-pulse"></div>
        )}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          className="outline-none border-none bg-transparent flex-grow min-w-[60px] text-sm"
          placeholder={formula.length === 0 ? "Enter a formula..." : ""}
        />
      </div>
      
      {/* Result display */}
      <div className="mt-2 text-right">
        <div className="text-sm text-gray-500">Result:</div>
        <div className="text-lg font-medium">
          {result !== null ? result : 'N/A'}
        </div>
      </div>
      
      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute mt-1 w-full max-w-md bg-white rounded-md shadow-lg max-h-60 overflow-auto z-50 border border-gray-200">
          <ul className="py-1">
            {suggestions.map((suggestion, index) => (
              <li
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className={cn(
                  "px-4 py-2 flex items-center text-sm cursor-pointer",
                  selectedSuggestionIndex === index
                    ? "bg-blue-50 text-blue-700"
                    : "hover:bg-gray-50"
                )}
              >
                <span className="flex-grow">{suggestion.name}</span>
                {selectedSuggestionIndex === index && (
                  <Check size={16} className="text-blue-500" />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FormulaInput;
