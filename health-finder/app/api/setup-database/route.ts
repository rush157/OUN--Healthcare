import { NextRequest, NextResponse } from 'next/server';
import supabase from '../../../lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Setting up database with medical facilities...');

    // Check if facilities table exists by trying to select from it
    const { data: existingData, error: checkError } = await supabase
      .from('facilities')
      .select('id')
      .limit(1);

    if (checkError) {
      console.log('Table might not exist, but continuing with insert...');
    }

    // Medical facilities data
    const facilities = [
      // MUMBAI HOSPITALS
      {
        name: 'Kokilaben Dhirubhai Ambani Hospital',
        address: 'Rao Saheb Achutrao Patwardhan Marg, Four Bunglows, Andheri West',
        city: 'Mumbai',
        phone: '+91-22-4269-6969',
        category: 'hospital',
        rating: 4.7,
        latitude: 19.1136,
        longitude: 72.8697,
        is_open: true,
        blood_groups: null,
        insurance_accepted: ['CGHS', 'ESI', 'Ayushman Bharat', 'Private Insurance', 'Mediclaim'],
        services: ['Emergency', 'Cardiology', 'Oncology', 'Neurology', 'Orthopedics', 'ICU', 'Surgery'],
        emergency_available: true
      },
      {
        name: 'Lilavati Hospital',
        address: 'A-791, Bandra Reclamation, Bandra West',
        city: 'Mumbai',
        phone: '+91-22-2675-1000',
        category: 'hospital',
        rating: 4.6,
        latitude: 19.0596,
        longitude: 72.8295,
        is_open: true,
        blood_groups: null,
        insurance_accepted: ['CGHS', 'ESI', 'Private Insurance', 'Mediclaim'],
        services: ['Emergency', 'Cardiology', 'Gastroenterology', 'Nephrology', 'Pediatrics', 'Maternity'],
        emergency_available: true
      },
      {
        name: 'Hinduja Hospital',
        address: 'Veer Savarkar Marg, Mahim',
        city: 'Mumbai',
        phone: '+91-22-2445-2222',
        category: 'hospital',
        rating: 4.5,
        latitude: 19.0330,
        longitude: 72.8397,
        is_open: true,
        blood_groups: null,
        insurance_accepted: ['CGHS', 'ESI', 'Ayushman Bharat', 'Private Insurance'],
        services: ['Emergency', 'Cardiology', 'Neurology', 'Oncology', 'Orthopedics', 'ICU'],
        emergency_available: true
      },
      // MUMBAI PHARMACIES
      {
        name: 'Apollo Pharmacy',
        address: 'Hill Road, Bandra West',
        city: 'Mumbai',
        phone: '+91-22-2640-7890',
        category: 'pharmacy',
        rating: 4.3,
        latitude: 19.0544,
        longitude: 72.8294,
        is_open: true,
        blood_groups: null,
        insurance_accepted: ['CGHS', 'ESI', 'Mediclaim'],
        services: ['Prescription Medicines', 'OTC Drugs', 'Health Products', '24/7 Service'],
        emergency_available: false
      },
      {
        name: 'MedPlus Pharmacy',
        address: 'SV Road, Andheri West',
        city: 'Mumbai',
        phone: '+91-22-2674-1234',
        category: 'pharmacy',
        rating: 4.1,
        latitude: 19.1197,
        longitude: 72.8464,
        is_open: true,
        blood_groups: null,
        insurance_accepted: ['CGHS', 'ESI'],
        services: ['Prescription Medicines', 'Generic Drugs', 'Home Delivery'],
        emergency_available: false
      },
      // MUMBAI BLOOD BANKS
      {
        name: 'Tata Memorial Blood Bank',
        address: 'Dr. E Borges Road, Parel',
        city: 'Mumbai',
        phone: '+91-22-2417-7000',
        category: 'blood_bank',
        rating: 4.9,
        latitude: 19.0095,
        longitude: 72.8295,
        is_open: true,
        blood_groups: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        insurance_accepted: ['Government Schemes', 'Free Service'],
        services: ['Blood Donation', 'Blood Components', 'Rare Blood Groups', 'Emergency Supply'],
        emergency_available: true
      },
      {
        name: 'KEM Hospital Blood Bank',
        address: 'Acharya Donde Marg, Parel',
        city: 'Mumbai',
        phone: '+91-22-2413-6051',
        category: 'blood_bank',
        rating: 4.7,
        latitude: 19.0176,
        longitude: 72.8417,
        is_open: true,
        blood_groups: ['A+', 'B+', 'O+', 'AB+', 'O-'],
        insurance_accepted: ['Government Schemes'],
        services: ['Blood Donation', 'Blood Testing', 'Platelet Donation'],
        emergency_available: true
      },
      // MUMBAI CLINICS
      {
        name: 'Dr. Ravi Clinic',
        address: 'Shop 12, Linking Road, Bandra West',
        city: 'Mumbai',
        phone: '+91-22-2640-1234',
        category: 'clinic',
        rating: 4.2,
        latitude: 19.0544,
        longitude: 72.8294,
        is_open: true,
        blood_groups: null,
        insurance_accepted: ['CGHS', 'ESI'],
        services: ['General Medicine', 'Consultation', 'Basic Tests'],
        emergency_available: false
      },
      // MUMBAI DIAGNOSTICS
      {
        name: 'SRL Diagnostics',
        address: 'Multiple Locations, Bandra',
        city: 'Mumbai',
        phone: '+91-22-2640-3456',
        category: 'diagnostic',
        rating: 4.4,
        latitude: 19.0544,
        longitude: 72.8294,
        is_open: true,
        blood_groups: null,
        insurance_accepted: ['All Major Insurance'],
        services: ['Blood Tests', 'X-Ray', 'MRI', 'CT Scan', 'Home Collection'],
        emergency_available: false
      },
      // DELHI HOSPITALS
      {
        name: 'All India Institute of Medical Sciences (AIIMS)',
        address: 'Ansari Nagar, New Delhi',
        city: 'Delhi',
        phone: '+91-11-2658-8500',
        category: 'hospital',
        rating: 4.8,
        latitude: 28.5672,
        longitude: 77.2100,
        is_open: true,
        blood_groups: null,
        insurance_accepted: ['CGHS', 'ESI', 'Ayushman Bharat', 'Free Treatment'],
        services: ['Emergency', 'All Specialties', 'Research', 'Teaching Hospital'],
        emergency_available: true
      },
      {
        name: 'Fortis Escorts Heart Institute',
        address: 'Okhla Road, New Delhi',
        city: 'Delhi',
        phone: '+91-11-4713-5000',
        category: 'hospital',
        rating: 4.6,
        latitude: 28.5355,
        longitude: 77.2503,
        is_open: true,
        blood_groups: null,
        insurance_accepted: ['CGHS', 'ESI', 'Private Insurance', 'Mediclaim'],
        services: ['Cardiology', 'Cardiac Surgery', 'Emergency', 'ICU'],
        emergency_available: true
      },
      // DELHI PHARMACIES
      {
        name: 'Apollo Pharmacy Delhi',
        address: 'Connaught Place',
        city: 'Delhi',
        phone: '+91-11-2341-5678',
        category: 'pharmacy',
        rating: 4.2,
        latitude: 28.6315,
        longitude: 77.2167,
        is_open: true,
        blood_groups: null,
        insurance_accepted: ['All Insurance'],
        services: ['24/7 Service', 'Prescription Medicines', 'Health Products'],
        emergency_available: false
      },
      // BANGALORE HOSPITALS
      {
        name: 'Manipal Hospital',
        address: 'HAL Airport Road',
        city: 'Bangalore',
        phone: '+91-80-2502-4444',
        category: 'hospital',
        rating: 4.6,
        latitude: 12.9716,
        longitude: 77.5946,
        is_open: true,
        blood_groups: null,
        insurance_accepted: ['CGHS', 'ESI', 'Private Insurance'],
        services: ['Multi-Specialty', 'Emergency', 'Oncology', 'Cardiology'],
        emergency_available: true
      },
      // CHENNAI HOSPITALS
      {
        name: 'Apollo Hospital Chennai',
        address: 'Greams Lane',
        city: 'Chennai',
        phone: '+91-44-2829-3333',
        category: 'hospital',
        rating: 4.7,
        latitude: 13.0827,
        longitude: 80.2707,
        is_open: true,
        blood_groups: null,
        insurance_accepted: ['All Major Insurance'],
        services: ['Multi-Specialty', 'Emergency', 'Transplant', 'Oncology'],
        emergency_available: true
      }
    ];

    console.log(`📊 Inserting ${facilities.length} medical facilities...`);

    // Insert all facilities
    const { data, error } = await supabase
      .from('facilities')
      .insert(facilities as any);

    if (error) {
      console.error('❌ Database error:', error);
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        details: error
      }, { status: 500 });
    }

    console.log('✅ Database setup complete!');
    
    return NextResponse.json({ 
      success: true, 
      message: `Successfully added ${facilities.length} medical facilities to the database!`,
      facilities_added: facilities.length
    });

  } catch (error) {
    console.error('💥 Setup error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to setup database',
      details: error
    }, { status: 500 });
  }
}