// types/index.ts

export interface Facility {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string | null;
  category: 'hospital' | 'clinic' | 'pharmacy' | 'blood_bank' | 'diagnostic';
  rating?: number;
  distance?: number;
  isOpen?: boolean;
  blood_groups?: string[];
  insurance_accepted?: string[];
  services?: string[];
  emergency_available?: boolean;
  latitude?: number;
  longitude?: number;
  created_at?: string;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
}

export interface SearchFilters {
  category: string;
  bloodGroup?: string;
  radius: number;
}

export interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export interface LanguageOption {
  value: string;
  label: string;
}

export interface CategoryOption {
  value: string;
  label: string;
}

export interface BloodGroupOption {
  value: string;
  label: string;
}

export type SupportedLanguage = 'en' | 'hi' | 'bn' | 'te' | 'mr' | 'ta' | 'gu' | 'kn' | 'ml' | 'pa';

export interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

// API Response types
export interface SupabaseResponse<T> {
  data: T[] | null;
  error: any;
}

// Component Props
export interface SearchBarProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  onLocationRequest: () => void;
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

export interface FacilityCardProps {
  facility: Facility;
  currentLanguage: string;
  onGetDirections: (facility: Facility) => void;
  onCall: (phone: string) => void;
}

export interface ChatBotProps {
  currentLanguage: string;
}

// Environment variables
export interface EnvConfig {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?: string;
  OPENAI_API_KEY?: string;
  NEXT_PUBLIC_APP_NAME?: string;
  NEXT_PUBLIC_DEFAULT_LANGUAGE?: string;
  NEXT_PUBLIC_SUPPORTED_LANGUAGES?: string;
}