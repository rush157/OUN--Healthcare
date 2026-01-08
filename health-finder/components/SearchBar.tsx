"use client";

import { useState, useEffect } from 'react';
import { Search, Mic, MicOff, MapPin } from 'lucide-react';
import Select, { SingleValue } from 'react-select';
import { SearchBarProps, SearchFilters, LanguageOption, CategoryOption, BloodGroupOption } from '../types';

// Extend window interface for speech recognition
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    speechRecognition: any;
  }
}

const languages: LanguageOption[] = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिंदी' },
  { value: 'bn', label: 'বাংলা' },
  { value: 'te', label: 'తెలుగు' },
  { value: 'mr', label: 'मराठी' },
  { value: 'ta', label: 'தமிழ்' },
  { value: 'gu', label: 'ગુજરાતી' },
  { value: 'kn', label: 'ಕನ್ನಡ' },
  { value: 'ml', label: 'മലയാളം' },
  { value: 'pa', label: 'ਪੰਜਾਬੀ' }
];

const categories: CategoryOption[] = [
  { value: 'all', label: 'All Medical Facilities' },
  { value: 'hospital', label: 'Hospitals' },
  { value: 'clinic', label: 'Clinics' },
  { value: 'pharmacy', label: 'Pharmacies' },
  { value: 'blood_bank', label: 'Blood Banks' },
  { value: 'diagnostic', label: 'Diagnostic Centers' }
];

const bloodGroups: BloodGroupOption[] = [
  { value: 'A+', label: 'A+' },
  { value: 'A-', label: 'A-' },
  { value: 'B+', label: 'B+' },
  { value: 'B-', label: 'B-' },
  { value: 'AB+', label: 'AB+' },
  { value: 'AB-', label: 'AB-' },
  { value: 'O+', label: 'O+' },
  { value: 'O-', label: 'O-' }
];

export default function SearchBar({ onSearch, onLocationRequest, currentLanguage, onLanguageChange }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    category: 'all',
    radius: 5
  });

  // Fix hydration by ensuring client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Voice recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        handleSearch(transcript);
      };

      (window as any).speechRecognition = recognition;
    }
  }, [currentLanguage]);

  const startVoiceSearch = () => {
    if ((window as any).speechRecognition) {
      (window as any).speechRecognition.start();
    }
  };

  const stopVoiceSearch = () => {
    if ((window as any).speechRecognition) {
      (window as any).speechRecognition.stop();
    }
  };

  const handleSearch = (searchQuery?: string) => {
    const searchTerm = searchQuery || query;
    if (searchTerm.trim()) {
      onSearch(searchTerm, filters);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Search Medical Facilities</h3>
        <p className="text-gray-600">Find the healthcare you need, when you need it</p>
      </div>

      {/* Language Selector */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">
            🌐 Choose Your Language
          </label>
          {isClient ? (
            <Select<LanguageOption>
              instanceId="language-select"
              value={languages.find(lang => lang.value === currentLanguage)}
              onChange={(selected: SingleValue<LanguageOption>) => selected && onLanguageChange(selected.value)}
              options={languages}
              className="w-64"
              placeholder="Select Language"
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: '12px',
                  borderColor: '#d1d5db',
                  padding: '4px',
                  boxShadow: 'none',
                  '&:hover': {
                    borderColor: '#3b82f6'
                  }
                })
              }}
            />
          ) : (
            <div className="w-64 h-12 bg-gray-100 rounded-xl border animate-pulse"></div>
          )}
        </div>
      </div>

      {/* Main Search Bar */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 w-6 h-6" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={currentLanguage === 'hi' ? 'अस्पताल, क्लिनिक, दवाखाना खोजें...' : 'Search hospitals, clinics, pharmacies...'}
              className="w-full pl-12 pr-4 py-4 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-lg placeholder-gray-500 bg-white shadow-sm"
            />
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={isListening ? stopVoiceSearch : startVoiceSearch}
              className={`px-6 py-4 rounded-xl transition-all font-medium shadow-lg ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-200' 
                  : 'bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-gray-300'
              }`}
            >
              {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>

            <button
              onClick={onLocationRequest}
              className="px-6 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all font-medium shadow-lg shadow-blue-200 hover:shadow-blue-300"
            >
              <MapPin className="w-6 h-6" />
            </button>

            <button
              onClick={() => handleSearch()}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl transition-all font-bold text-lg shadow-lg shadow-green-200 hover:shadow-green-300"
            >
              {currentLanguage === 'hi' ? 'खोजें' : 'Search'}
            </button>
          </div>
        </div>
        
        {isListening && (
          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              {currentLanguage === 'hi' ? 'सुन रहा हूं...' : 'Listening...'}
            </div>
          </div>
        )}
      </div>

      {/* Advanced Filters */}
      <div className="bg-white border-2 border-gray-100 rounded-2xl p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          🔍 Advanced Filters
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              🏥 {currentLanguage === 'hi' ? 'श्रेणी' : 'Category'}
            </label>
            {isClient ? (
              <Select<CategoryOption>
                instanceId="category-select"
                value={categories.find(cat => cat.value === filters.category)}
                onChange={(selected: SingleValue<CategoryOption>) => selected && setFilters({...filters, category: selected.value})}
                options={categories}
                className="w-full"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: '12px',
                    borderColor: '#d1d5db',
                    padding: '4px',
                    borderWidth: '2px',
                    boxShadow: 'none',
                    '&:hover': {
                      borderColor: '#3b82f6'
                    }
                  })
                }}
              />
            ) : (
              <div className="w-full h-12 bg-gray-100 rounded-xl border animate-pulse"></div>
            )}
          </div>

          {filters.category === 'blood_bank' && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                🩸 {currentLanguage === 'hi' ? 'रक्त समूह' : 'Blood Group'}
              </label>
              {isClient ? (
                <Select<BloodGroupOption>
                  instanceId="blood-group-select"
                  value={bloodGroups.find(bg => bg.value === filters.bloodGroup)}
                  onChange={(selected: SingleValue<BloodGroupOption>) => setFilters({...filters, bloodGroup: selected?.value})}
                  options={bloodGroups}
                  className="w-full"
                  isClearable
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: '12px',
                      borderColor: '#d1d5db',
                      padding: '4px',
                      borderWidth: '2px',
                      boxShadow: 'none',
                      '&:hover': {
                        borderColor: '#ef4444'
                      }
                    })
                  }}
                />
              ) : (
                <div className="w-full h-12 bg-gray-100 rounded-xl border animate-pulse"></div>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              📍 {currentLanguage === 'hi' ? 'दूरी (किमी)' : 'Search Radius'}
            </label>
            <select
              value={filters.radius}
              onChange={(e) => setFilters({...filters, radius: parseInt(e.target.value)})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all bg-white text-gray-900 font-medium"
            >
              <option value={1}>Within 1 km</option>
              <option value={5}>Within 5 km</option>
              <option value={10}>Within 10 km</option>
              <option value={25}>Within 25 km</option>
              <option value={50}>Within 50 km</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}