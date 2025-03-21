
import { useQuery } from '@tanstack/react-query';

type Suggestion = {
  id: string;
  name: string;
  value: number;
};

// Mock API function that simulates fetching suggestions
const fetchSuggestions = async (query: string): Promise<Suggestion[]> => {
  // For demonstration purposes, we're simulating an API call
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // These would typically come from an API
  const allSuggestions = [
    { id: '1', name: 'Revenue', value: 100 },
    { id: '2', name: 'Cost', value: 50 },
    { id: '3', name: 'Profit Margin', value: 0.4 },
    { id: '4', name: 'Growth Rate', value: 0.1 },
    { id: '5', name: 'Expenses', value: 30 },
    { id: '6', name: 'Tax Rate', value: 0.2 },
    { id: '7', name: 'Sales Volume', value: 200 },
    { id: '8', name: 'Customer Acquisition Cost', value: 15 },
    { id: '9', name: 'Conversion Rate', value: 0.03 },
    { id: '10', name: 'Average Order Value', value: 75 },
  ];
  
  // Filter based on query
  if (!query) return allSuggestions;
  
  const lowerQuery = query.toLowerCase();
  return allSuggestions.filter(suggestion => 
    suggestion.name.toLowerCase().includes(lowerQuery)
  );
};

export const useSuggestions = (query: string) => {
  return useQuery({
    queryKey: ['suggestions', query],
    queryFn: () => fetchSuggestions(query),
    staleTime: 60000, // 1 minute
    enabled: query !== null
  });
};
