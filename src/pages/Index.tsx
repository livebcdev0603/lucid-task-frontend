
import React from 'react';
import FormulaInput from '@/components/FormulaInput';
import { motion } from 'framer-motion';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mx-auto"
        >
          <header className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-gray-900 mb-2">
              Formula Builder
            </h1>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Create powerful formulas by combining variables and mathematical operations. 
              Try adding tags like "Revenue" or "Cost" and operators like +, -, *, / between them.
            </p>
          </header>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 backdrop-blur-sm bg-white/90"
          >
            <div className="mb-4">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Enter your formula</h2>
              <p className="text-sm text-gray-500 mb-4">
                Type variable names for autocomplete, use operators (+, -, *, /) between variables, 
                and click on tags to edit their values.
              </p>
              <FormulaInput />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-8 bg-white/80 rounded-xl p-6 border border-gray-200 backdrop-blur-sm"
          >
            <h2 className="text-lg font-medium text-gray-900 mb-3">Tips</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Type variable names for autocomplete suggestions</li>
              <li>• Use mathematical operators between variables (+, -, *, /, ^, (, ))</li>
              <li>• Click on a tag to see and edit its value</li>
              <li>• Press backspace to delete tags or operators</li>
              <li>• Use arrow keys to navigate your formula</li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
