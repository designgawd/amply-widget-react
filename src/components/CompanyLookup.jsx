import React, { useState, useEffect, useRef } from 'react';

const CompanyLookup = ({
  value,
  onChange,
  placeholder = "Search your employer to see if they match...",
  className = "",
  onCompanySelect,
  disabled = false
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [matchingResult, setMatchingResult] = useState(null);
  
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const debounceRef = useRef(null);

  // Mock company data based on what I observed from the original widget
  const mockCompanies = [
    { id: 1, name: "Microsoft", domain: "microsoft.com", hasMatching: true, matchRatio: "1:1", maxAmount: 15000 },
    { id: 2, name: "Microsoft Canada", domain: "microsoft.com", hasMatching: true, matchRatio: "1:1", maxAmount: 15000 },
    { id: 3, name: "Apple Inc.", domain: "apple.com", hasMatching: true, matchRatio: "1:1", maxAmount: 10000 },
    { id: 4, name: "Google LLC", domain: "google.com", hasMatching: true, matchRatio: "1:1", maxAmount: 12000 },
    { id: 5, name: "Amazon.com Inc.", domain: "amazon.com", hasMatching: true, matchRatio: "1:1", maxAmount: 8000 },
    { id: 6, name: "Meta Platforms Inc.", domain: "meta.com", hasMatching: true, matchRatio: "1:1", maxAmount: 10000 },
    { id: 7, name: "Tesla Inc.", domain: "tesla.com", hasMatching: false },
    { id: 8, name: "Netflix Inc.", domain: "netflix.com", hasMatching: true, matchRatio: "1:1", maxAmount: 5000 },
    { id: 9, name: "Adobe Inc.", domain: "adobe.com", hasMatching: true, matchRatio: "1:1", maxAmount: 7500 },
    { id: 10, name: "Salesforce Inc.", domain: "salesforce.com", hasMatching: true, matchRatio: "1:1", maxAmount: 10000 },
    { id: 11, name: "Oracle Corporation", domain: "oracle.com", hasMatching: true, matchRatio: "1:1", maxAmount: 8000 },
    { id: 12, name: "IBM Corporation", domain: "ibm.com", hasMatching: true, matchRatio: "1:1", maxAmount: 12000 },
    { id: 13, name: "Intel Corporation", domain: "intel.com", hasMatching: true, matchRatio: "1:1", maxAmount: 10000 },
    { id: 14, name: "Cisco Systems Inc.", domain: "cisco.com", hasMatching: true, matchRatio: "1:1", maxAmount: 8000 },
    { id: 15, name: "Walmart", domain: "walmart.com", hasMatching: false },
    { id: 16, name: "Walmart Supply Chain", domain: "walmart.com", hasMatching: false },
    { id: 17, name: "JPMorgan Chase & Co.", domain: "jpmorganchase.com", hasMatching: true, matchRatio: "1:1", maxAmount: 15000 },
    { id: 18, name: "Bank of America Corp.", domain: "bankofamerica.com", hasMatching: true, matchRatio: "1:1", maxAmount: 12000 },
    { id: 19, name: "Wells Fargo & Company", domain: "wellsfargo.com", hasMatching: true, matchRatio: "1:1", maxAmount: 10000 },
    { id: 20, name: "Goldman Sachs Group Inc.", domain: "goldmansachs.com", hasMatching: true, matchRatio: "1:1", maxAmount: 20000 },
    { id: 21, name: "Morgan Stanley", domain: "morganstanley.com", hasMatching: true, matchRatio: "1:1", maxAmount: 15000 },
    { id: 22, name: "Johnson & Johnson", domain: "jnj.com", hasMatching: true, matchRatio: "1:1", maxAmount: 8000 },
    { id: 23, name: "Procter & Gamble Co.", domain: "pg.com", hasMatching: true, matchRatio: "1:1", maxAmount: 7500 },
    { id: 24, name: "Coca-Cola Company", domain: "coca-cola.com", hasMatching: true, matchRatio: "1:1", maxAmount: 5000 },
    { id: 25, name: "PepsiCo Inc.", domain: "pepsico.com", hasMatching: true, matchRatio: "1:1", maxAmount: 5000 },
    { id: 26, name: "McDonald's Corporation", domain: "mcdonalds.com", hasMatching: false },
    { id: 27, name: "Walt Disney Company", domain: "disney.com", hasMatching: true, matchRatio: "1:1", maxAmount: 10000 },
    { id: 28, name: "Nike Inc.", domain: "nike.com", hasMatching: true, matchRatio: "1:1", maxAmount: 7500 },
    { id: 29, name: "Starbucks Corporation", domain: "starbucks.com", hasMatching: false },
    { id: 30, name: "Home Depot Inc.", domain: "homedepot.com", hasMatching: false },
    { id: 31, name: "Target Corporation", domain: "target.com", hasMatching: false },
    // Adding companies that start with "Wal" for testing
    { id: 32, name: "Wal-Martsams Clubs", domain: "walmart.com", hasMatching: false },
    { id: 33, name: "Walden Savings Bank", domain: "waldensavings.com", hasMatching: true, matchRatio: "1:1", maxAmount: 2500 },
    { id: 34, name: "Waldo Real Estate", domain: "waldorealestate.com", hasMatching: false },
    { id: 35, name: "Waldo's Sports Center", domain: "waldosports.com", hasMatching: false },
    { id: 36, name: "Waldorf Fd", domain: "waldorffd.com", hasMatching: false },
    // Adding companies that start with "mart" for testing
    { id: 37, name: "Martha Ken Duff", domain: "marthakenduff.com", hasMatching: false },
    { id: 38, name: "Martha's Vineyard Savings Bank", domain: "mvbank.com", hasMatching: true, matchRatio: "1:1", maxAmount: 1000 },
    { id: 39, name: "Martin", domain: "martin.com", hasMatching: false },
    { id: 40, name: "Martin County Florida", domain: "martin.fl.us", hasMatching: false },
    { id: 41, name: "Martin Guitar", domain: "martinguitar.com", hasMatching: false },
    { id: 42, name: "Martin Logan Ltd", domain: "martinlogan.com", hasMatching: false },
    // New company added for demonstration
    { id: 43, name: "Acme Corporation", domain: "acme.com", hasMatching: true, matchRatio: "2:1", maxAmount: 5000 }
  ];

  // Simulate API search with debouncing
  const searchCompanies = async (query) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const filtered = mockCompanies.filter(company =>
      company.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 8); // Limit to 8 results
    
    setSuggestions(filtered);
    setIsLoading(false);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      searchCompanies(value);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [value]);

  // Handle input change
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    setMatchingResult(null); // Clear previous matching result
  };

  // Handle company selection
  const handleCompanySelect = (company) => {
    onChange(company.name);
    setIsOpen(false);
    setSuggestions([]);
    setHighlightedIndex(-1);
    
    // Show matching result
    if (company.hasMatching) {
      setMatchingResult({
        type: 'success',
        message: `Yes! ${company.name} matches gifts to Amply`,
        details: `Matches gifts up to $${company.maxAmount.toLocaleString()} at ${company.matchRatio} ratio.`
      });
    } else {
      setMatchingResult({
        type: 'error',
        message: `Unfortunately, ${company.name} does not match gifts to Amply`,
        details: null
      });
    }
    
    if (onCompanySelect) {
      onCompanySelect(company);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          handleCompanySelect(suggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative w-full">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-4 py-3 pr-10 border-2 border-gray-300 rounded-md text-base transition-colors duration-200 box-border bg-white focus:outline-none focus:border-blue-500 focus:shadow-outline"
          autoComplete="off"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      
      {isOpen && suggestions.length > 0 && (
        <div ref={dropdownRef} className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-1000 max-h-72 overflow-y-auto mt-0.5">
          {suggestions.map((company, index) => (
            <div
              key={company.id}
              className={`flex items-center justify-between px-4 py-3 cursor-pointer border-b border-gray-100 transition-colors duration-200 last:border-b-0 ${index === highlightedIndex ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
              onClick={() => handleCompanySelect(company)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-700 text-sm mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis">{company.name}</div>
                {company.domain && (
                  <div className="text-xs text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">{company.domain}</div>
                )}
              </div>
              {company.hasMatching && (
                <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium whitespace-nowrap ml-2">
                  ✓ Matches donations
                </div>
              )}
            </div>
          ))}
          <div className="px-4 py-3 bg-gray-50 text-gray-600 text-sm font-medium border-t border-gray-200 cursor-pointer transition-colors duration-200 hover:bg-gray-100">
            Other
          </div>
        </div>
      )}
      
      {isOpen && suggestions.length === 0 && value && value.length >= 3 && !isLoading && (
        <div ref={dropdownRef} className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-1000 max-h-72 overflow-y-auto mt-0.5">
          <div className="p-4 text-center text-gray-600 text-sm">
            No companies found. You can still enter your employer manually.
          </div>
        </div>
      )}

      {matchingResult && (
        <div className={`flex items-start gap-3 mt-3 p-4 rounded-md border-l-4 ${matchingResult.type === 'success' ? 'bg-blue-50 border-blue-500' : 'bg-red-50 border-red-500'}`}>
          <div className="text-xl leading-none mt-0.5">
            {matchingResult.type === 'success' ? '👍' : '❌'}
          </div>
          <div className="flex-1 min-w-0">
            <div className={`font-semibold mb-1 text-sm ${matchingResult.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>{matchingResult.message}</div>
            {matchingResult.details && (
              <div className={`text-xs leading-tight ${matchingResult.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>{matchingResult.details}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyLookup;


