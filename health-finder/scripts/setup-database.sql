-- Health Finder Database Setup Script
-- Run this in your Supabase SQL editor

-- Create the facilities table
CREATE TABLE IF NOT EXISTS facilities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  phone TEXT,
  category TEXT NOT NULL CHECK (category IN ('hospital', 'clinic', 'pharmacy', 'blood_bank', 'diagnostic')),
  rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  is_open BOOLEAN DEFAULT true,
  blood_groups TEXT[],
  insurance_accepted TEXT[],
  services TEXT[],
  emergency_available BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_facilities_category ON facilities(category);
CREATE INDEX IF NOT EXISTS idx_facilities_city ON facilities(city);
CREATE INDEX IF NOT EXISTS idx_facilities_location ON facilities(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_facilities_emergency ON facilities(emergency_available);

-- Enable Row Level Security (optional)
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow public read access
CREATE POLICY "Allow public read access" ON facilities
  FOR SELECT USING (true);

-- Insert comprehensive medical facilities data across major Indian cities
INSERT INTO facilities (name, address, city, phone, category, rating, latitude, longitude, is_open, blood_groups, insurance_accepted, services, emergency_available) VALUES

-- MUMBAI HOSPITALS
('Kokilaben Dhirubhai Ambani Hospital', 'Rao Saheb Achutrao Patwardhan Marg, Four Bunglows, Andheri West', 'Mumbai', '+91-22-4269-6969', 'hospital', 4.7, 19.1136, 72.8697, true, NULL, ARRAY['CGHS', 'ESI', 'Ayushman Bharat', 'Private Insurance', 'Mediclaim'], ARRAY['Emergency', 'Cardiology', 'Oncology', 'Neurology', 'Orthopedics', 'ICU', 'Surgery'], true),

('Lilavati Hospital', 'A-791, Bandra Reclamation, Bandra West', 'Mumbai', '+91-22-2675-1000', 'hospital', 4.6, 19.0596, 72.8295, true, NULL, ARRAY['CGHS', 'ESI', 'Private Insurance', 'Mediclaim'], ARRAY['Emergency', 'Cardiology', 'Gastroenterology', 'Nephrology', 'Pediatrics', 'Maternity'], true),

('Hinduja Hospital', 'Veer Savarkar Marg, Mahim', 'Mumbai', '+91-22-2445-2222', 'hospital', 4.5, 19.0330, 72.8397, true, NULL, ARRAY['CGHS', 'ESI', 'Ayushman Bharat', 'Private Insurance'], ARRAY['Emergency', 'Cardiology', 'Neurology', 'Oncology', 'Orthopedics', 'ICU'], true),

('Breach Candy Hospital', '60-A, Bhulabhai Desai Road, Breach Candy', 'Mumbai', '+91-22-2367-8888', 'hospital', 4.4, 18.9735, 72.8112, true, NULL, ARRAY['Private Insurance', 'Mediclaim', 'International Insurance'], ARRAY['Emergency', 'Cardiology', 'Maternity', 'Pediatrics', 'Surgery'], true),

('Jaslok Hospital', '15, Dr. Deshmukh Marg, Pedder Road', 'Mumbai', '+91-22-6657-3333', 'hospital', 4.3, 18.9647, 72.8081, true, NULL, ARRAY['CGHS', 'ESI', 'Private Insurance', 'Mediclaim'], ARRAY['Emergency', 'Cardiology', 'Neurology', 'Oncology', 'Gastroenterology'], true),

-- MUMBAI CLINICS
('Dr. Ravi Clinic', 'Shop 12, Linking Road, Bandra West', 'Mumbai', '+91-22-2640-1234', 'clinic', 4.2, 19.0544, 72.8294, true, NULL, ARRAY['CGHS', 'ESI'], ARRAY['General Medicine', 'Consultation', 'Basic Tests'], false),

('Family Care Clinic', '2nd Floor, Turner Road, Bandra West', 'Mumbai', '+91-22-2642-5678', 'clinic', 4.0, 19.0521, 72.8281, true, NULL, ARRAY['Private Insurance'], ARRAY['Family Medicine', 'Pediatrics', 'Vaccination'], false),

('Metro Clinic', 'Near Andheri Station, Andheri East', 'Mumbai', '+91-22-2836-9012', 'clinic', 3.9, 19.1197, 72.8464, true, NULL, ARRAY['CGHS'], ARRAY['General Medicine', 'Minor Surgery', 'Health Checkup'], false),

-- MUMBAI PHARMACIES
('Apollo Pharmacy', 'Hill Road, Bandra West', 'Mumbai', '+91-22-2640-7890', 'pharmacy', 4.3, 19.0544, 72.8294, true, NULL, ARRAY['CGHS', 'ESI', 'Mediclaim'], ARRAY['Prescription Medicines', 'OTC Drugs', 'Health Products', '24/7 Service'], false),

('MedPlus Pharmacy', 'SV Road, Andheri West', 'Mumbai', '+91-22-2674-1234', 'pharmacy', 4.1, 19.1197, 72.8464, true, NULL, ARRAY['CGHS', 'ESI'], ARRAY['Prescription Medicines', 'Generic Drugs', 'Home Delivery'], false),

('Wellness Forever', 'Linking Road, Santacruz West', 'Mumbai', '+91-22-2660-5678', 'pharmacy', 4.2, 19.0825, 72.8347, true, NULL, ARRAY['All Insurance'], ARRAY['Medicines', 'Health Supplements', 'Medical Equipment'], false),

-- MUMBAI BLOOD BANKS
('Tata Memorial Blood Bank', 'Dr. E Borges Road, Parel', 'Mumbai', '+91-22-2417-7000', 'blood_bank', 4.9, 19.0095, 72.8295, true, ARRAY['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], ARRAY['Government Schemes', 'Free Service'], ARRAY['Blood Donation', 'Blood Components', 'Rare Blood Groups', 'Emergency Supply'], true),

('KEM Hospital Blood Bank', 'Acharya Donde Marg, Parel', 'Mumbai', '+91-22-2413-6051', 'blood_bank', 4.7, 19.0176, 72.8417, true, ARRAY['A+', 'B+', 'O+', 'AB+', 'O-'], ARRAY['Government Schemes'], ARRAY['Blood Donation', 'Blood Testing', 'Platelet Donation'], true),

-- MUMBAI DIAGNOSTICS
('SRL Diagnostics', 'Multiple Locations, Bandra', 'Mumbai', '+91-22-2640-3456', 'diagnostic', 4.4, 19.0544, 72.8294, true, NULL, ARRAY['All Major Insurance'], ARRAY['Blood Tests', 'X-Ray', 'MRI', 'CT Scan', 'Home Collection'], false),

('Dr. Lal PathLabs', 'Andheri West', 'Mumbai', '+91-22-2674-7890', 'diagnostic', 4.3, 19.1197, 72.8464, true, NULL, ARRAY['CGHS', 'ESI', 'Private Insurance'], ARRAY['Pathology', 'Radiology', 'Cardiology Tests'], false),

-- DELHI HOSPITALS
('All India Institute of Medical Sciences (AIIMS)', 'Ansari Nagar, New Delhi', 'Delhi', '+91-11-2658-8500', 'hospital', 4.8, 28.5672, 77.2100, true, NULL, ARRAY['CGHS', 'ESI', 'Ayushman Bharat', 'Free Treatment'], ARRAY['Emergency', 'All Specialties', 'Research', 'Teaching Hospital'], true),

('Fortis Escorts Heart Institute', 'Okhla Road, New Delhi', 'Delhi', '+91-11-4713-5000', 'hospital', 4.6, 28.5355, 77.2503, true, NULL, ARRAY['CGHS', 'ESI', 'Private Insurance', 'Mediclaim'], ARRAY['Cardiology', 'Cardiac Surgery', 'Emergency', 'ICU'], true),

('Max Super Speciality Hospital', 'Press Enclave Road, Saket', 'Delhi', '+91-11-2651-5050', 'hospital', 4.5, 28.5245, 77.2066, true, NULL, ARRAY['CGHS', 'ESI', 'Private Insurance'], ARRAY['Multi-Specialty', 'Emergency', 'Oncology', 'Neurology'], true),

('Apollo Hospital', 'Mathura Road, Sarita Vihar', 'Delhi', '+91-11-2692-5858', 'hospital', 4.4, 28.5355, 77.2503, true, NULL, ARRAY['All Major Insurance'], ARRAY['Multi-Specialty', 'Emergency', 'Transplant', 'Oncology'], true),

-- DELHI CLINICS
('Delhi Heart & Lung Institute', 'Panchsheel Park', 'Delhi', '+91-11-4270-0000', 'clinic', 4.3, 28.5245, 77.2066, true, NULL, ARRAY['Private Insurance'], ARRAY['Cardiology', 'Pulmonology', 'Consultation'], false),

('Moolchand Medcity', 'Lajpat Nagar', 'Delhi', '+91-11-4200-0000', 'clinic', 4.1, 28.5677, 77.2431, true, NULL, ARRAY['CGHS', 'ESI'], ARRAY['General Medicine', 'Orthopedics', 'Gynecology'], false),

-- DELHI PHARMACIES
('Apollo Pharmacy', 'Connaught Place', 'Delhi', '+91-11-2341-5678', 'pharmacy', 4.2, 28.6315, 77.2167, true, NULL, ARRAY['All Insurance'], ARRAY['24/7 Service', 'Prescription Medicines', 'Health Products'], false),

('Guardian Pharmacy', 'Karol Bagh', 'Delhi', '+91-11-2575-1234', 'pharmacy', 4.0, 28.6507, 77.1909, true, NULL, ARRAY['CGHS', 'ESI'], ARRAY['Medicines', 'Medical Equipment', 'Home Delivery'], false),

-- DELHI BLOOD BANKS
('Red Cross Society Blood Bank', 'Red Cross Road', 'Delhi', '+91-11-2371-6441', 'blood_bank', 4.8, 28.6315, 77.2167, true, ARRAY['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], ARRAY['Free Service', 'Government'], ARRAY['Blood Donation', 'Emergency Supply', 'Blood Components'], true),

-- BANGALORE HOSPITALS
('Manipal Hospital', 'HAL Airport Road', 'Bangalore', '+91-80-2502-4444', 'hospital', 4.6, 12.9716, 77.5946, true, NULL, ARRAY['CGHS', 'ESI', 'Private Insurance'], ARRAY['Multi-Specialty', 'Emergency', 'Oncology', 'Cardiology'], true),

('Fortis Hospital', 'Bannerghatta Road', 'Bangalore', '+91-80-6621-4444', 'hospital', 4.5, 12.9141, 77.5963, true, NULL, ARRAY['All Major Insurance'], ARRAY['Emergency', 'Neurology', 'Orthopedics', 'Gastroenterology'], true),

('Apollo Hospital', 'Bannerghatta Road', 'Bangalore', '+91-80-2630-0300', 'hospital', 4.4, 12.9141, 77.5963, true, NULL, ARRAY['CGHS', 'ESI', 'Private Insurance'], ARRAY['Multi-Specialty', 'Emergency', 'Transplant'], true),

-- BANGALORE CLINICS
('Cloudnine Hospital', 'Jayanagar', 'Bangalore', '+91-80-4092-2222', 'clinic', 4.3, 12.9279, 77.5619, true, NULL, ARRAY['Private Insurance'], ARRAY['Maternity', 'Pediatrics', 'Gynecology'], false),

-- BANGALORE PHARMACIES
('MedPlus Pharmacy', 'Koramangala', 'Bangalore', '+91-80-4112-3456', 'pharmacy', 4.1, 12.9352, 77.6245, true, NULL, ARRAY['All Insurance'], ARRAY['Medicines', 'Health Products', 'Home Delivery'], false),

-- CHENNAI HOSPITALS
('Apollo Hospital', 'Greams Lane', 'Chennai', '+91-44-2829-3333', 'hospital', 4.7, 13.0827, 80.2707, true, NULL, ARRAY['All Major Insurance'], ARRAY['Multi-Specialty', 'Emergency', 'Transplant', 'Oncology'], true),

('Fortis Malar Hospital', 'Adyar', 'Chennai', '+91-44-4289-2222', 'hospital', 4.5, 13.0067, 80.2206, true, NULL, ARRAY['CGHS', 'ESI', 'Private Insurance'], ARRAY['Cardiology', 'Neurology', 'Emergency'], true),

-- CHENNAI PHARMACIES
('Apollo Pharmacy', 'T. Nagar', 'Chennai', '+91-44-2434-5678', 'pharmacy', 4.2, 13.0418, 80.2341, true, NULL, ARRAY['All Insurance'], ARRAY['24/7 Service', 'Prescription Medicines'], false),

-- HYDERABAD HOSPITALS
('Apollo Hospital', 'Jubilee Hills', 'Hyderabad', '+91-40-2360-7777', 'hospital', 4.6, 17.4065, 78.4772, true, NULL, ARRAY['All Major Insurance'], ARRAY['Multi-Specialty', 'Emergency', 'Oncology'], true),

('CARE Hospital', 'Banjara Hills', 'Hyderabad', '+91-40-6719-1000', 'hospital', 4.4, 17.4126, 78.4071, true, NULL, ARRAY['CGHS', 'ESI', 'Private Insurance'], ARRAY['Cardiology', 'Neurology', 'Emergency'], true),

-- KOLKATA HOSPITALS
('Apollo Gleneagles Hospital', 'EM Bypass', 'Kolkata', '+91-33-2320-3040', 'hospital', 4.5, 22.5726, 88.3639, true, NULL, ARRAY['All Major Insurance'], ARRAY['Multi-Specialty', 'Emergency', 'Cardiology'], true),

('AMRI Hospital', 'Salt Lake', 'Kolkata', '+91-33-6606-3800', 'hospital', 4.3, 22.5726, 88.3639, true, NULL, ARRAY['CGHS', 'ESI', 'Private Insurance'], ARRAY['Emergency', 'Orthopedics', 'Gastroenterology'], true),

-- PUNE HOSPITALS
('Ruby Hall Clinic', 'Sassoon Road', 'Pune', '+91-20-2612-1212', 'hospital', 4.4, 18.5204, 73.8567, true, NULL, ARRAY['All Major Insurance'], ARRAY['Multi-Specialty', 'Emergency', 'Maternity'], true),

('Jehangir Hospital', 'Sassoon Road', 'Pune', '+91-20-2605-5215', 'hospital', 4.3, 18.5204, 73.8567, true, NULL, ARRAY['CGHS', 'ESI', 'Private Insurance'], ARRAY['Emergency', 'Cardiology', 'Neurology'], true),

-- AHMEDABAD HOSPITALS
('Apollo Hospital', 'Plot No. 1A, GIDC', 'Ahmedabad', '+91-79-6670-1000', 'hospital', 4.5, 23.0225, 72.5714, true, NULL, ARRAY['All Major Insurance'], ARRAY['Multi-Specialty', 'Emergency', 'Oncology'], true),

-- JAIPUR HOSPITALS
('Fortis Escorts Hospital', 'Malviya Nagar', 'Jaipur', '+91-141-254-7000', 'hospital', 4.4, 26.9124, 75.7873, true, NULL, ARRAY['CGHS', 'ESI', 'Private Insurance'], ARRAY['Cardiology', 'Emergency', 'Orthopedics'], true),

-- LUCKNOW HOSPITALS
('Sahara Hospital', 'Viraj Khand, Gomti Nagar', 'Lucknow', '+91-522-395-8800', 'hospital', 4.2, 26.8467, 80.9462, true, NULL, ARRAY['CGHS', 'ESI', 'Ayushman Bharat'], ARRAY['Multi-Specialty', 'Emergency'], true),

-- CHANDIGARH HOSPITALS
('PGI Chandigarh', 'Sector 12', 'Chandigarh', '+91-172-274-7585', 'hospital', 4.7, 30.7333, 76.7794, true, NULL, ARRAY['CGHS', 'ESI', 'Free Treatment'], ARRAY['All Specialties', 'Emergency', 'Research'], true),

-- KOCHI HOSPITALS
('Aster Medcity', 'Kuttisahib Road', 'Kochi', '+91-484-669-4000', 'hospital', 4.5, 10.0261, 76.3125, true, NULL, ARRAY['All Major Insurance'], ARRAY['Multi-Specialty', 'Emergency', 'Transplant'], true),

-- COIMBATORE HOSPITALS
('Kovai Medical Center', 'Avinashi Road', 'Coimbatore', '+91-422-459-9000', 'hospital', 4.4, 11.0168, 76.9558, true, NULL, ARRAY['CGHS', 'ESI', 'Private Insurance'], ARRAY['Multi-Specialty', 'Emergency'], true);

('Guardian Pharmacy', '147 Medical Street, Thane', 'Thane', '+91-22-7890-1234', 'pharmacy', 4.1, 19.2183, 72.9781, true, NULL, ARRAY['ESI', 'CGHS'], ARRAY['24/7 Service', 'Prescription Medicines', 'Medical Equipment'], false),

('Tata Memorial Blood Bank', '258 Cancer Road, Parel', 'Mumbai', '+91-22-8901-2345', 'blood_bank', 4.9, 19.0095, 72.8295, true, ARRAY['O-', 'AB-', 'A+', 'B+', 'O+', 'AB+'], ARRAY['Government Schemes', 'Tata Trust'], ARRAY['Rare Blood Groups', 'Cancer Patient Support', 'Blood Components'], true),

('Suburban Clinic', '369 Suburb Lane, Borivali', 'Mumbai', '+91-22-9012-3456', 'clinic', 3.8, 19.2307, 72.8567, true, NULL, ARRAY['Private Insurance'], ARRAY['Family Medicine', 'Pediatrics', 'Dermatology'], false),

('LifeCare Diagnostics', '741 Test Avenue, Vashi', 'Navi Mumbai', '+91-22-0123-4567', 'diagnostic', 4.4, 19.0330, 73.0297, true, NULL, ARRAY['All Insurance Accepted'], ARRAY['Pathology', 'Radiology', 'Cardiology Tests', 'Home Collection'], false);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_facilities_updated_at BEFORE UPDATE ON facilities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();