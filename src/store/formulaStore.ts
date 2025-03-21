
import { create } from 'zustand';

export type FormulaTag = {
  id: string;
  name: string;
  value: number;
};

export type FormulaState = {
  formula: (FormulaTag | string)[];
  variables: FormulaTag[];
  cursorPosition: number;
  addToFormula: (item: FormulaTag | string) => void;
  removeLastItem: () => void;
  setCursorPosition: (position: number) => void;
  calculateResult: () => number | null;
  setVariableValue: (id: string, value: number) => void;
};

export const useFormulaStore = create<FormulaState>((set, get) => ({
  formula: [],
  variables: [
    { id: '1', name: 'Revenue', value: 100 },
    { id: '2', name: 'Cost', value: 50 },
    { id: '3', name: 'Profit Margin', value: 0.4 },
    { id: '4', name: 'Growth Rate', value: 0.1 },
    { id: '5', name: 'Expenses', value: 30 },
  ],
  cursorPosition: 0,
  
  addToFormula: (item) => {
    set((state) => {
      const newFormula = [...state.formula];
      newFormula.splice(state.cursorPosition, 0, item);
      return { 
        formula: newFormula, 
        cursorPosition: state.cursorPosition + 1 
      };
    });
  },
  
  removeLastItem: () => {
    set((state) => {
      if (state.cursorPosition > 0) {
        const newFormula = [...state.formula];
        newFormula.splice(state.cursorPosition - 1, 1);
        return { 
          formula: newFormula, 
          cursorPosition: state.cursorPosition - 1 
        };
      }
      return state;
    });
  },
  
  setCursorPosition: (position) => {
    set({ cursorPosition: position });
  },
  
  setVariableValue: (id, value) => {
    set((state) => ({
      variables: state.variables.map(variable => 
        variable.id === id ? { ...variable, value } : variable
      )
    }));
  },
  
  calculateResult: () => {
    const { formula, variables } = get();
    if (formula.length === 0) return null;
    
    // Convert formula to a string expression
    let expression = '';
    for (const item of formula) {
      if (typeof item === 'string') {
        expression += item;
      } else {
        // Find the variable value
        const variable = variables.find(v => v.id === item.id);
        if (variable) {
          expression += variable.value;
        }
      }
    }
    
    try {
      // Using Function constructor to evaluate the expression safely
      // eslint-disable-next-line no-new-func
      return Function(`"use strict"; return (${expression})`)();
    } catch (error) {
      console.error('Error calculating formula:', error);
      return null;
    }
  }
}));
