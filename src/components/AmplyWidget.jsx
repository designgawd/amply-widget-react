import React, { useState, useEffect, useRef } from 'react';
import CompanyLookup from './CompanyLookup';

const AmplyWidget = ({
  submitType = 'donation',
  organizationId,
  fieldId = {},
  donationForm,
  submitId,
  watchField,
  watchValue,
  messageDataMap = {},
  messageSubmitMap,
  messageSubmitValue,
  retry = true,
  instantMatch = true,
  onSubmit,
  onMatch,
  onError
}) => {
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [employer, setEmployer] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [matchingInfo, setMatchingInfo] = useState(null);
  const [errors, setErrors] = useState({});
  
  const widgetRef = useRef(null);
  const watchFieldRef = useRef(null);

  // Predefined amount options
  const amountOptions = [5, 10, 25, 50, 100];

  useEffect(() => {
    // Handle watch submit type
    if (submitType === 'watch' && watchField) {
      const fieldElement = document.getElementById(watchField);
      if (fieldElement) {
        watchFieldRef.current = fieldElement;
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
              if (fieldElement.value === watchValue) {
                handleSubmit();
              }
            }
          });
        });
        observer.observe(fieldElement, { attributes: true });
        
        return () => observer.disconnect();
      }
    }

    // Handle message submit type
    if (submitType === 'message') {
      const handleMessage = (event) => {
        try {
          const data = event.data;
          if (messageDataMap) {
            // Map message data to form fields
            Object.keys(messageDataMap).forEach(key => {
              const path = messageDataMap[key];
              const value = getNestedValue(data, path);
              if (value) {
                switch (key) {
                  case 'donor_name':
                    setDonorName(value);
                    break;
                  case 'donor_email':
                    setDonorEmail(value);
                    break;
                  case 'company_name':
                    setEmployer(value);
                    break;
                  case 'amount':
                    setAmount(value);
                    break;
                }
              }
            });
          }
          
          // Check if submit condition is met
          if (messageSubmitMap && messageSubmitValue) {
            const submitValue = getNestedValue(data, messageSubmitMap);
            if (submitValue === messageSubmitValue) {
              handleSubmit();
            }
          }
        } catch (error) {
          console.error('Error processing message:', error);
          onError && onError(error);
        }
      };

      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
    }

    // Handle button submit type
    if (submitType === 'button' && submitId && donationForm) {
      const form = document.getElementById(donationForm);
      const submitButton = document.getElementById(submitId);
      
      if (form && submitButton) {
        const handleFormSubmit = (e) => {
          e.preventDefault();
          handleSubmit();
        };
        
        submitButton.addEventListener('click', handleFormSubmit);
        return () => submitButton.removeEventListener('click', handleFormSubmit);
      }
    }
  }, [submitType, watchField, watchValue, messageDataMap, messageSubmitMap, messageSubmitValue, submitId, donationForm]);

  // Helper function to get nested object values
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current && current[key], obj);
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    
    if (!donorName.trim()) {
      newErrors.donorName = 'Full name is required';
    }
    
    if (!donorEmail.trim()) {
      newErrors.donorEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(donorEmail)) {
      newErrors.donorEmail = 'Please enter a valid email address';
    }
    
    if (submitType === 'donation') {
      const finalAmount = selectedAmount === 'custom' ? customAmount : selectedAmount || amount;
      if (!finalAmount || parseFloat(finalAmount) <= 0) {
        newErrors.amount = 'Please select or enter a valid donation amount';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const formData = {
        donor_name: donorName,
        donor_email: donorEmail,
        company_name: employer,
        amount: selectedAmount === 'custom' ? customAmount : selectedAmount || amount,
        organization_id: organizationId
      };

      // Handle different submit types
      switch (submitType) {
        case 'donation':
          await processDonation(formData);
          break;
        case 'button':
          await processButtonSubmit(formData);
          break;
        case 'policy':
          await displayMatchingPolicy(employer);
          break;
        default:
          onSubmit && onSubmit(formData);
      }
    } catch (error) {
      console.error('Submission error:', error);
      onError && onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Process donation
  const processDonation = async (formData) => {
    // This would integrate with Stripe or other payment processor
    console.log('Processing donation:', formData);
    onSubmit && onSubmit(formData);
  };

  // Process button submit
  const processButtonSubmit = async (formData) => {
    const form = document.getElementById(donationForm);
    if (form) {
      // Add matching data to form
      const matchInput = document.createElement('input');
      matchInput.type = 'hidden';
      matchInput.name = 'amply_match_id';
      matchInput.value = matchingInfo?.matchId || '';
      form.appendChild(matchInput);
      
      // Submit the original form
      form.submit();
    }
  };

  // Display matching policy
  const displayMatchingPolicy = async (companyName) => {
    if (companyName) {
      // The CompanyLookup component will handle this automatically
    }
  };

  // Handle company selection from lookup
  const handleCompanySelect = (company) => {
    setEmployer(company.name);
    
    if (company.hasMatching) {
      const matchingData = {
        hasMatching: true,
        matchRatio: company.matchRatio,
        maxAmount: company.maxAmount,
        companyName: company.name
      };
      
      setMatchingInfo(matchingData);
      onMatch && onMatch(matchingData);
    } else {
      setMatchingInfo(null);
    }
  };

  // Handle amount selection
  const handleAmountSelect = (value) => {
    setSelectedAmount(value);
    if (value !== 'custom') {
      setCustomAmount('');
      setAmount(value);
    }
  };

  // Render different widget types
  const renderWidget = () => {
    switch (submitType) {
      case 'policy':
        return (
          <div className="amply-widget policy-widget p-6 bg-white border border-gray-200 rounded-lg shadow-md md:p-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-5">Check if your employer will match your donation</h3>
            <div className="mb-5">
              <label htmlFor="employer" className="block text-sm font-semibold text-gray-700 mb-2">Employer</label>
              <CompanyLookup
                value={employer}
                onChange={setEmployer}
                onCompanySelect={handleCompanySelect}
                placeholder="Search your employer to see if they match..."
                className={errors.employer ? 'border-red-500' : ''}
              />
              {errors.employer && <span className="text-red-500 text-xs mt-1 block">{errors.employer}</span>}
            </div>
            
            <button onClick={handleSubmit} disabled={isLoading} className="w-full px-6 py-4 bg-blue-600 text-white font-semibold rounded-md text-lg cursor-pointer transition-colors duration-200 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed relative">
              {isLoading ? 'Checking...' : 'Check Matching'}
            </button>
          </div>
        );

      default:
        return (
          <div className="amply-widget donation-widget p-6 bg-white border border-gray-200 rounded-lg shadow-md md:p-8">
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label htmlFor="donorName" className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  id="donorName"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="Your full name"
                  className={`w-full px-4 py-3 border-2 border-gray-300 rounded-md text-base transition-colors duration-200 focus:outline-none focus:border-blue-500 focus:shadow-outline ${errors.donorName ? 'border-red-500' : ''}`}
                />
                {errors.donorName && <span className="text-red-500 text-xs mt-1 block">{errors.donorName}</span>}
              </div>

              <div className="mb-5">
                <label htmlFor="donorEmail" className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  id="donorEmail"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  placeholder="Your email address"
                  className={`w-full px-4 py-3 border-2 border-gray-300 rounded-md text-base transition-colors duration-200 focus:outline-none focus:border-blue-500 focus:shadow-outline ${errors.donorEmail ? 'border-red-500' : ''}`}
                />
                {errors.donorEmail && <span className="text-red-500 text-xs mt-1 block">{errors.donorEmail}</span>}
              </div>

              <div className="mb-5">
                <label htmlFor="employer" className="block text-sm font-semibold text-gray-700 mb-2">Employer</label>
                <CompanyLookup
                  value={employer}
                  onChange={setEmployer}
                  onCompanySelect={handleCompanySelect}
                  placeholder="Search your employer to see if they match..."
                />
                <small className="block text-xs text-gray-600 mt-1">Powered by Amply</small>
              </div>

              {submitType === 'donation' && (
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Select a Gift Amount</label>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {amountOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`px-4 py-3 border-2 border-gray-300 rounded-md text-base font-medium cursor-pointer transition-all duration-200 ${selectedAmount === option ? 'border-blue-500 bg-blue-500 text-white' : 'bg-white hover:border-blue-500 hover:bg-gray-50'}`}
                        onClick={() => handleAmountSelect(option)}
                      >
                        ${option}
                      </button>
                    ))}
                    <button
                      type="button"
                      className={`px-4 py-3 border-2 border-gray-300 rounded-md text-base font-medium cursor-pointer transition-all duration-200 ${selectedAmount === 'custom' ? 'border-blue-500 bg-blue-500 text-white' : 'bg-white hover:border-blue-500 hover:bg-gray-50'}`}
                      onClick={() => handleAmountSelect('custom')}
                    >
                      Custom
                    </button>
                  </div>
                  
                  {selectedAmount === 'custom' && (
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="Enter custom amount"
                      min="1"
                      step="0.01"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-md text-base transition-colors duration-200 focus:outline-none focus:border-blue-500 focus:shadow-outline"
                    />
                  )}
                  
                  {errors.amount && <span className="text-red-500 text-xs mt-1 block">{errors.amount}</span>}
                </div>
              )}

              {matchingInfo && (
                <div className="bg-blue-50 border border-blue-300 rounded-md p-4 my-4">
                  <h4 className="text-blue-800 text-base font-semibold mb-2">🎉 Your employer offers matching donations!</h4>
                  <p className="text-blue-800 text-sm mb-1">Match Ratio: {matchingInfo.matchRatio}</p>
                  <p className="text-blue-800 text-sm">Your ${selectedAmount === 'custom' ? customAmount : selectedAmount || amount} donation could be doubled!</p>
                </div>
              )}

              <button type="submit" disabled={isLoading} className="w-full px-6 py-4 bg-blue-600 text-white font-semibold rounded-md text-lg cursor-pointer transition-colors duration-200 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed relative">
                {isLoading ? 'Processing...' : 'Continue to Payment'}
              </button>
            </form>
          </div>
        );
    }
  };

  return (
    <div ref={widgetRef} className="max-w-xl mx-auto font-sans">
      {renderWidget()}
    </div>
  );
};

export default AmplyWidget;


