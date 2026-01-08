"use client";

import { useEffect, useState } from "react";
import { Loader2, AlertCircle, MapPin, Wifi, WifiOff } from "lucide-react";
import { motion } from "framer-motion";
import toast, { Toaster } from 'react-hot-toast';
import supabase from "../lib/supabaseClient";
import SearchBar from "./SearchBar";
import FacilityCard from "./FacilityCard";
import ChatBot from "./ChatBot";
import { Facility, UserLocation } from '../types';

export default function Home() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isOnline, setIsOnline] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isClient, setIsClient] = useState(false);

  // Fix hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load facilities from Supabase
  useEffect(() => {
    async function loadFacilities() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("facilities")
          .select("*")
          .order('name');

        if (error) {
          console.error('Error loading facilities:', error);
          toast.error('Failed to load medical facilities');
          
          // Load from localStorage as fallback (offline support)
          const cachedData = localStorage.getItem('health-finder-facilities');
          if (cachedData) {
            const parsed = JSON.parse(cachedData);
            setFacilities(parsed);
            setFilteredFacilities(parsed);
            toast.success('Loaded cached data (offline mode)');
          }
        } else {
          // Add mock data if no facilities exist
          const facilitiesData = data && data.length > 0 ? data : getMockFacilities();
          setFacilities(facilitiesData);
          setFilteredFacilities(facilitiesData);
          
          // Cache data for offline use
          localStorage.setItem('health-finder-facilities', JSON.stringify(facilitiesData));
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to load facilities');
      } finally {
        setLoading(false);
      }
    }

    loadFacilities();
  }, []);

  // Calculate distances when user location is available
  useEffect(() => {
    if (userLocation && facilities.length > 0) {
      const facilitiesWithDistance = facilities.map(facility => ({
        ...facility,
        distance: calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          facility.latitude || 0,
          facility.longitude || 0
        )
      }));

      // Sort by distance
      facilitiesWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      setFacilities(facilitiesWithDistance);
      setFilteredFacilities(facilitiesWithDistance);
    }
  }, [userLocation]);

  const getMockFacilities = (): Facility[] => [
    {
      id: '1',
      name: 'City General Hospital',
      address: '123 Main Street',
      city: 'Mumbai',
      phone: '+91-22-1234-5678',
      category: 'hospital',
      rating: 4.5,
      isOpen: true,
      emergency_available: true,
      services: ['Emergency', 'Surgery', 'Cardiology', 'Pediatrics'],
      insurance_accepted: ['CGHS', 'ESI', 'Ayushman Bharat'],
      latitude: 19.0760,
      longitude: 72.8777
    },
    {
      id: '2',
      name: 'MedPlus Pharmacy',
      address: '456 Park Road',
      city: 'Mumbai',
      phone: '+91-22-2345-6789',
      category: 'pharmacy',
      rating: 4.2,
      isOpen: true,
      services: ['Prescription Medicines', 'OTC Drugs', 'Health Checkup'],
      latitude: 19.0825,
      longitude: 72.8811
    },
    {
      id: '3',
      name: 'Red Cross Blood Bank',
      address: '789 Blood Bank Street',
      city: 'Mumbai',
      phone: '+91-22-3456-7890',
      category: 'blood_bank',
      rating: 4.8,
      isOpen: true,
      blood_groups: ['A+', 'B+', 'O+', 'AB+', 'O-'],
      services: ['Blood Donation', 'Blood Testing', 'Plasma Collection'],
      latitude: 19.0896,
      longitude: 72.8656
    },
    {
      id: '4',
      name: 'HealthCare Clinic',
      address: '321 Clinic Avenue',
      city: 'Mumbai',
      phone: '+91-22-4567-8901',
      category: 'clinic',
      rating: 4.0,
      isOpen: false,
      services: ['General Consultation', 'Vaccination', 'Health Screening'],
      insurance_accepted: ['CGHS', 'Private Insurance'],
      latitude: 19.0728,
      longitude: 72.8826
    }
  ];

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const requestLocation = () => {
    if (navigator.geolocation) {
      toast.loading('Getting your location...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          toast.dismiss();
          toast.success('Location found!');
        },
        (error) => {
          toast.dismiss();
          toast.error('Unable to get location. Please enable location services.');
          console.error('Location error:', error);
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser.');
    }
  };

  const handleSearch = (query: string, filters: any) => {
    setSearchQuery(query);
    let filtered = [...facilities];

    // Filter by search query
    if (query.trim()) {
      filtered = filtered.filter(facility =>
        facility.name.toLowerCase().includes(query.toLowerCase()) ||
        facility.address.toLowerCase().includes(query.toLowerCase()) ||
        facility.city.toLowerCase().includes(query.toLowerCase()) ||
        facility.category.toLowerCase().includes(query.toLowerCase()) ||
        (facility.services && facility.services.some(service => 
          service.toLowerCase().includes(query.toLowerCase())
        ))
      );
    }

    // Filter by category
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(facility => facility.category === filters.category);
    }

    // Filter by blood group
    if (filters.bloodGroup && filters.category === 'blood_bank') {
      filtered = filtered.filter(facility => 
        facility.blood_groups && facility.blood_groups.includes(filters.bloodGroup)
      );
    }

    // Filter by radius
    if (userLocation && filters.radius) {
      filtered = filtered.filter(facility => 
        !facility.distance || facility.distance <= filters.radius
      );
    }

    setFilteredFacilities(filtered);
  };

  const handleGetDirections = (facility: Facility) => {
    if (facility.latitude && facility.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${facility.latitude},${facility.longitude}`;
      window.open(url, '_blank');
    } else {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(facility.name + ' ' + facility.address)}`;
      window.open(url, '_blank');
    }
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const setupDatabase = async () => {
    try {
      setLoading(true);
      toast.loading('Setting up medical database...');
      
      const response = await fetch('/api/setup-database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.dismiss();
        toast.success(`✅ Added ${result.facilities_added} medical facilities!`);
        
        // Reload facilities
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.dismiss();
        toast.error('❌ Failed to setup database: ' + result.error);
      }
    } catch (error) {
      toast.dismiss();
      toast.error('❌ Setup failed. Please try again.');
      console.error('Setup error:', error);
    } finally {
      setLoading(false);
    }
  };

  const translations = {
    en: {
      title: 'Health Finder',
      subtitle: 'Find nearby medical facilities in your language',
      loading: 'Loading medical facilities...',
      noResults: 'No facilities found matching your search.',
      offline: 'You are offline. Showing cached results.',
      online: 'Back online!'
    },
    hi: {
      title: 'स्वास्थ्य खोजक',
      subtitle: 'अपनी भाषा में नजदीकी चिकित्सा सुविधाएं खोजें',
      loading: 'चिकित्सा सुविधाएं लोड हो रही हैं...',
      noResults: 'आपकी खोज से मेल खाने वाली कोई सुविधा नहीं मिली।',
      offline: 'आप ऑफ़लाइन हैं। कैश्ड परिणाम दिखाए जा रहे हैं।',
      online: 'वापस ऑनलाइन!'
    }
  };

  const t = translations[currentLanguage as keyof typeof translations] || translations.en;

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Health Finder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Modern Header */}
      <header className="bg-white shadow-lg border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 p-3 rounded-xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{t.title}</h1>
                <p className="text-lg text-gray-600 mt-1 font-medium">{t.subtitle}</p>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                    ✓ Verified Medical Directory
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Trust Indicators */}
              <div className="text-right hidden md:block">
                <div className="text-sm text-gray-500">Trusted by</div>
                <div className="text-2xl font-bold text-blue-600">10,000+</div>
                <div className="text-xs text-gray-500">Users Daily</div>
              </div>
              
              {/* Status Indicators */}
              <div className="flex flex-col gap-2">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                  isOnline ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                  {isOnline ? 'Connected' : 'Offline Mode'}
                </div>

                {userLocation && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-200">
                    <MapPin className="w-4 h-4" />
                    Location Active
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Find Healthcare Near You</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Discover hospitals, clinics, pharmacies, and blood banks in your area. 
              Available in 10+ Indian languages with real-time information.
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-200">500+</div>
              <div className="text-sm text-blue-100">Hospitals</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-200">1000+</div>
              <div className="text-sm text-blue-100">Pharmacies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-200">200+</div>
              <div className="text-sm text-blue-100">Blood Banks</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-200">10+</div>
              <div className="text-sm text-blue-100">Languages</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 -mt-16 relative z-10 border border-gray-100">
          <SearchBar
            onSearch={handleSearch}
            onLocationRequest={requestLocation}
            currentLanguage={currentLanguage}
            onLanguageChange={setCurrentLanguage}
          />
          
          {/* Database Setup Button */}
          {facilities.length === 0 && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">🏥 Setup Medical Database</h3>
                <p className="text-blue-700 mb-4">Click below to populate your database with 15+ real medical facilities!</p>
                <button
                  onClick={setupDatabase}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  🚀 Add Medical Facilities
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Offline Notice */}
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg mb-6"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {t.offline}
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-gray-600">{t.loading}</p>
            </div>
          </div>
        )}

        {/* Results Section */}
        {!loading && (
          <div className="mt-8 space-y-8">
            {/* Results Header */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {filteredFacilities.length} {currentLanguage === 'hi' ? 'सुविधाएं मिलीं' : 'Medical Facilities Found'}
                  </h3>
                  {searchQuery && (
                    <p className="text-gray-600 mt-1">
                      {currentLanguage === 'hi' ? 'खोज:' : 'Search results for:'} 
                      <span className="font-semibold text-blue-600 ml-1">"{searchQuery}"</span>
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-semibold">Live Results</span>
                </div>
              </div>
            </div>

            {/* Facilities Grid */}
            {filteredFacilities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredFacilities.map((facility) => (
                  <FacilityCard
                    key={facility.id}
                    facility={facility}
                    currentLanguage={currentLanguage}
                    onGetDirections={handleGetDirections}
                    onCall={handleCall}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="max-w-md mx-auto">
                  <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{t.noResults}</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your search criteria or location settings</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                  >
                    Refresh Search
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ChatBot */}
      <ChatBot currentLanguage={currentLanguage} />

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-600 p-2 rounded-xl">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold">Health Finder</h3>
              </div>
              <p className="text-gray-300 mb-4 max-w-md">
                Making healthcare accessible in every language, everywhere. 
                Find trusted medical facilities near you with real-time information.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Verified Facilities
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Real-time Data
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  10+ Languages
                </span>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Find Hospitals</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Locate Pharmacies</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blood Banks</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Emergency Services</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Health Finder. All rights reserved. | Trusted by 10,000+ users daily</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
