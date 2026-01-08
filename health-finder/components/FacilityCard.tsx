"use client";

import { Phone, MapPin, Clock, Star, Navigation, Heart, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { Facility, FacilityCardProps } from '../types';

const translations = {
  en: {
    getDirections: 'Get Directions',
    call: 'Call',
    open: 'Open',
    closed: 'Closed',
    bloodAvailable: 'Blood Available',
    emergency: 'Emergency Available',
    insurance: 'Insurance Accepted',
    services: 'Services',
    rating: 'Rating'
  },
  hi: {
    getDirections: 'दिशा प्राप्त करें',
    call: 'कॉल करें',
    open: 'खुला',
    closed: 'बंद',
    bloodAvailable: 'रक्त उपलब्ध',
    emergency: 'आपातकाल उपलब्ध',
    insurance: 'बीमा स्वीकृत',
    services: 'सेवाएं',
    rating: 'रेटिंग'
  }
};

export default function FacilityCard({ facility, currentLanguage, onGetDirections, onCall }: FacilityCardProps) {
  const t = translations[currentLanguage as keyof typeof translations] || translations.en;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'hospital':
        return '🏥';
      case 'clinic':
        return '🏥';
      case 'pharmacy':
        return '💊';
      case 'blood_bank':
        return '🩸';
      case 'diagnostic':
        return '🔬';
      default:
        return '🏥';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'hospital':
        return 'bg-red-100 text-red-800';
      case 'clinic':
        return 'bg-blue-100 text-blue-800';
      case 'pharmacy':
        return 'bg-green-100 text-green-800';
      case 'blood_bank':
        return 'bg-purple-100 text-purple-800';
      case 'diagnostic':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-2 border-gray-100 hover:border-blue-200 transform hover:-translate-y-1"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-blue-100 p-2 rounded-xl">
              <span className="text-2xl">{getCategoryIcon(facility.category)}</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 leading-tight">{facility.name}</h3>
              {facility.emergency_available && (
                <span className="inline-flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold mt-1">
                  🚨 {t.emergency}
                </span>
              )}
            </div>
          </div>
          
          <span className={`inline-block px-4 py-2 rounded-xl text-sm font-bold ${getCategoryColor(facility.category)}`}>
            {facility.category.charAt(0).toUpperCase() + facility.category.slice(1).replace('_', ' ')}
          </span>
        </div>

        <div className="text-right">
          {facility.rating && (
            <div className="flex items-center gap-1 mb-2 bg-yellow-50 px-3 py-1 rounded-lg">
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
              <span className="text-lg font-bold text-yellow-700">{facility.rating}</span>
            </div>
          )}
          
          {facility.distance && (
            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-semibold">
              📍 {facility.distance.toFixed(1)} km away
            </div>
          )}
        </div>
      </div>

      {/* Address */}
      <div className="flex items-start gap-2 mb-3">
        <MapPin className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
        <div className="text-gray-700">
          <div>{facility.address}</div>
          <div className="text-sm text-gray-500">{facility.city}</div>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className={`text-sm font-medium ${facility.isOpen ? 'text-green-600' : 'text-red-600'}`}>
            {facility.isOpen ? t.open : t.closed}
          </span>
        </div>

        {facility.phone && (
          <div className="flex items-center gap-1">
            <Phone className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">{facility.phone}</span>
          </div>
        )}
      </div>

      {/* Blood Groups (for blood banks) */}
      {facility.blood_groups && facility.blood_groups.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium text-gray-700">{t.bloodAvailable}:</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {facility.blood_groups.map((group) => (
              <span
                key={group}
                className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium"
              >
                {group}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Insurance */}
      {facility.insurance_accepted && facility.insurance_accepted.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">{t.insurance}:</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {facility.insurance_accepted.slice(0, 3).map((insurance) => (
              <span
                key={insurance}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
              >
                {insurance}
              </span>
            ))}
            {facility.insurance_accepted.length > 3 && (
              <span className="text-xs text-gray-500">
                +{facility.insurance_accepted.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Services */}
      {facility.services && facility.services.length > 0 && (
        <div className="mb-4">
          <div className="text-sm font-medium text-gray-700 mb-2">{t.services}:</div>
          <div className="flex flex-wrap gap-1">
            {facility.services.slice(0, 4).map((service) => (
              <span
                key={service}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
              >
                {service}
              </span>
            ))}
            {facility.services.length > 4 && (
              <span className="text-xs text-gray-500">
                +{facility.services.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-6 border-t-2 border-gray-100">
        <button
          onClick={() => onGetDirections(facility)}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-6 rounded-xl transition-all font-bold shadow-lg shadow-blue-200 hover:shadow-blue-300 transform hover:scale-105"
        >
          <Navigation className="w-5 h-5" />
          {t.getDirections}
        </button>
        
        {facility.phone && (
          <button
            onClick={() => onCall(facility.phone!)}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 px-6 rounded-xl transition-all font-bold shadow-lg shadow-green-200 hover:shadow-green-300 transform hover:scale-105"
          >
            <Phone className="w-5 h-5" />
            {t.call}
          </button>
        )}
      </div>
    </motion.div>
  );
}