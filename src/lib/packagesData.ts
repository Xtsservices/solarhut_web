
export interface SolarPackage {
  id: string;
  name: string;
  capacity: string;
  price: string;
  originalPrice: string;
  savings: string;
  features: string[];
  monthlyGeneration: string;
  recommended: boolean;
  createdAt: string;
}

const defaultPackages: SolarPackage[] = [
  {
    id: 'pkg-001',
    name: 'Starter Home',
    capacity: '3 kW',
    price: '1,80,000',
    originalPrice: '2,40,000',
    savings: 'Save ₹60,000',
    features: [
      '12 High-efficiency solar panels',
      '3 kW string inverter',
      'Net metering setup',
      'Installation & commissioning',
      '5-year warranty'
    ],
    monthlyGeneration: '360-450 units',
    recommended: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'pkg-002',
    name: 'Advanced Home',
    capacity: '5 kW',
    price: '2,85,000',
    originalPrice: '3,75,000',
    savings: 'Save ₹90,000',
    features: [
      '20 High-efficiency solar panels',
      '5 kW string inverter',
      'Smart monitoring system',
      'Net metering setup',
      '10-year warranty',
      'Free maintenance (2 years)'
    ],
    monthlyGeneration: '600-750 units',
    recommended: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'pkg-003',
    name: 'Premium Home',
    capacity: '10 kW',
    price: '5,40,000',
    originalPrice: '7,20,000',
    savings: 'Save ₹1,80,000',
    features: [
      '40 High-efficiency solar panels',
      '10 kW string inverter',
      'Battery storage system',
      'Smart monitoring & control',
      'Net metering setup',
      '25-year warranty',
      'Free maintenance (5 years)'
    ],
    monthlyGeneration: '1200-1500 units',
    recommended: false,
    createdAt: new Date().toISOString()
  }
];

const STORAGE_KEY = 'solarhut_packages';

export function getPackages(): SolarPackage[] {
  if (typeof window === 'undefined') return defaultPackages;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const packages = JSON.parse(stored);
      return packages.length > 0 ? packages : defaultPackages;
    }
  } catch (error) {
    console.error('Error loading packages:', error);
  }
  
  return defaultPackages;
}

export function savePackages(packages: SolarPackage[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(packages));
    window.dispatchEvent(new Event('packagesUpdated'));
  } catch (error) {
    console.error('Error saving packages:', error);
  }
}

export function addPackage(packageData: Omit<SolarPackage, 'id' | 'createdAt'>): SolarPackage {
  const packages = getPackages();
  const newPackage: SolarPackage = {
    ...packageData,
    id: `pkg-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  
  packages.push(newPackage);
  savePackages(packages);
  
  return newPackage;
}

export function updatePackage(id: string, packageData: Partial<SolarPackage>): SolarPackage | null {
  const packages = getPackages();
  const index = packages.findIndex(pkg => pkg.id === id);
  
  if (index === -1) return null;
  
  packages[index] = { ...packages[index], ...packageData };
  savePackages(packages);
  
  return packages[index];
}

export function deletePackage(id: string): boolean {
  const packages = getPackages();
  const filtered = packages.filter(pkg => pkg.id !== id);
  
  if (filtered.length === packages.length) return false;
  
  savePackages(filtered);
  return true;
}

export function resetToDefaults(): void {
  savePackages(defaultPackages);
}
