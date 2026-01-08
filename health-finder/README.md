# Health Finder - Multilingual Health Resource Locator

A comprehensive multilingual web application that helps users find nearby medical facilities including hospitals, clinics, pharmacies, and blood banks. Built with accessibility and inclusivity in mind, supporting multiple Indian languages and offline functionality.

## 🌟 Features

### Core Functionality
- **Multilingual Support**: Available in 10+ Indian languages including Hindi, Bengali, Telugu, Marathi, Tamil, Gujarati, Kannada, Malayalam, and Punjabi
- **Voice Search**: Speech-to-text functionality in multiple languages
- **Real-time Location**: GPS-based facility discovery with distance calculation
- **Smart Filtering**: Filter by category, blood group, radius, and insurance acceptance
- **Offline Support**: Cached data for low connectivity areas

### Medical Resources
- **Hospitals & Clinics**: Find nearby healthcare facilities with ratings and services
- **Pharmacies**: Locate medicine stores with availability information
- **Blood Banks**: Search by blood group with real-time availability
- **Diagnostic Centers**: Find labs and imaging centers
- **Emergency Services**: Quick access to emergency facilities

### Additional Features
- **AI Chatbot**: Multilingual health assistant for quick queries
- **Insurance Integration**: Filter facilities by accepted insurance plans
- **Google Maps Integration**: Turn-by-turn directions to facilities
- **Real-time Status**: Open/closed status and availability information
- **Responsive Design**: Works on all devices and screen sizes

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (for database)
- Google Maps API key (optional, for enhanced maps)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd health-finder
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Copy the `.env.local` file and update the following variables:
   
   ```env
   # Supabase Configuration (Required)
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Google Maps API (Optional - for enhanced maps)
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   
   # OpenAI API (Optional - for enhanced chatbot)
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Set up Supabase Database**
   
   Create a table called `facilities` with the following structure:
   
   ```sql
   CREATE TABLE facilities (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name TEXT NOT NULL,
     address TEXT NOT NULL,
     city TEXT NOT NULL,
     phone TEXT,
     category TEXT NOT NULL,
     rating DECIMAL(2,1),
     latitude DECIMAL(10,8),
     longitude DECIMAL(11,8),
     is_open BOOLEAN DEFAULT true,
     blood_groups TEXT[],
     insurance_accepted TEXT[],
     services TEXT[],
     emergency_available BOOLEAN DEFAULT false,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
health-finder/
├── app/                    # Next.js 13+ app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── Home.tsx          # Main application component
│   ├── SearchBar.tsx     # Search and filter component
│   ├── FacilityCard.tsx  # Individual facility display
│   └── ChatBot.tsx       # AI health assistant
├── lib/                  # Utility libraries
│   └── supabaseClient.ts # Supabase configuration
└── public/               # Static assets
```

## 🛠️ Technologies Used

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions
- **Lucide React**: Modern icon library

### Backend & Services
- **Supabase**: Backend-as-a-Service (database, auth, real-time)
- **Google Maps API**: Location services and directions
- **Web Speech API**: Voice recognition functionality
- **Service Workers**: Offline functionality and caching

### Key Libraries
- **react-speech-recognition**: Voice input handling
- **react-select**: Enhanced dropdown components
- **react-hot-toast**: User notifications
- **@googlemaps/js-api-loader**: Google Maps integration

## 🌐 Multilingual Support

The application supports the following languages:
- English (en)
- Hindi (hi) - हिंदी
- Bengali (bn) - বাংলা
- Telugu (te) - తెలుగు
- Marathi (mr) - मराठी
- Tamil (ta) - தமிழ்
- Gujarati (gu) - ગુજરાતી
- Kannada (kn) - ಕನ್ನಡ
- Malayalam (ml) - മലയാളം
- Punjabi (pa) - ਪੰਜਾਬੀ

### Adding New Languages
1. Add language code to `NEXT_PUBLIC_SUPPORTED_LANGUAGES` in `.env.local`
2. Update translation objects in components
3. Add voice recognition support in SearchBar and ChatBot components

## 📱 Offline Functionality

The app includes robust offline support:
- **Data Caching**: Facilities data cached in localStorage
- **Offline Detection**: Visual indicators for connection status
- **Graceful Degradation**: Core functionality works without internet
- **Progressive Enhancement**: Enhanced features when online

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API key | No |
| `OPENAI_API_KEY` | OpenAI API for enhanced chatbot | No |
| `NEXT_PUBLIC_DEFAULT_LANGUAGE` | Default app language | No |

### Supabase Setup

1. Create a new Supabase project
2. Run the SQL schema provided above
3. Enable Row Level Security (RLS) if needed
4. Add sample data or use the mock data provided

### Google Maps Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Maps JavaScript API and Places API
3. Create an API key and restrict it to your domain
4. Add the key to your environment variables

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms
The app can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the FAQ section

## 🎯 Roadmap

- [ ] Mobile app version (React Native)
- [ ] Government health scheme integration
- [ ] Telemedicine appointment booking
- [ ] Health camp notifications
- [ ] Medicine delivery integration
- [ ] Emergency alert system
- [ ] Health record integration

---

**Health Finder** - Making healthcare accessible in every language, everywhere.
