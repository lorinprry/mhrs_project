const fs = require('fs');
const path = require('path');

const CITIES = [
    "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin",
    "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa",
    "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan",
    "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Isparta",
    "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir",
    "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla",
    "Muş", "Nevşehir", "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas",
    "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak",
    "Aksaray", "Bayburt", "Karaman", "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan",
    "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"
];

const SPECIALTIES = [
    { id: 1, name: "Kardiyoloji" },
    { id: 2, name: "Cildiye" },
    { id: 3, name: "Ortopedi ve Travmatoloji" },
    { id: 4, name: "Nöroloji" },
    { id: 5, name: "Dahiliye" },
    { id: 6, name: "Göz Hastalıkları" },
    { id: 7, name: "Kulak Burun Boğaz" },
    { id: 8, name: "Çocuk Sağlığı ve Hastalıkları" },
    { id: 9, name: "Psikiyatri" },
    { id: 10, name: "Genel Cerrahi" },
    { id: 11, name: "Kadın Hastalıkları ve Doğum" }
];

const firstNames = ["Ahmet", "Mehmet", "Ayşe", "Fatma", "Ali", "Hülya", "Mustafa", "Zeynep", "Emre", "Selin"];
const lastNames = ["Yılmaz", "Kaya", "Demir", "Şahin", "Çelik", "Öztürk", "Aydın", "Özdemir", "Arslan", "Doğan"];
const titles = ["Prof. Dr.", "Doç. Dr.", "Uzm. Dr.", "Op. Dr.", "Dr."];

let mockCities = [];
let mockDistricts = [];
let mockHospitals = [];
let mockDoctors = [];

let distId = 1000;
let hospId = 10000;
let docId = 200000;

CITIES.forEach((cityName, cityIndex) => {
    const cityId = cityIndex + 1;
    mockCities.push({ id: cityId, name: cityName });

    // Generate 3 districts per city
    for (let d = 1; d <= 3; d++) {
        const districtId = distId++;
        const districtName = `${cityName} Merkez ${d}`;
        mockDistricts.push({ id: districtId, city_id: cityId, name: districtName });

        // Generate 1 hospital per district
        const hospitalId = hospId++;
        const hospitalName = `${districtName} ${d % 2 === 0 ? "Şehir" : "Devlet"} Hastanesi`;
        mockHospitals.push({ id: hospitalId, city_id: cityId, district_id: districtId, name: hospitalName });

        // Generate 4-8 doctors per hospital
        const docCount = Math.floor(Math.random() * 5) + 4;
        for (let docIdx = 0; docIdx < docCount; docIdx++) {
            const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const title = titles[Math.floor(Math.random() * titles.length)];
            const specialty = SPECIALTIES[Math.floor(Math.random() * SPECIALTIES.length)];

            mockDoctors.push({
                id: docId++,
                full_name: `${title} ${fName} ${lName}`,
                specialty_id: specialty.id,
                specialty_name: specialty.name,
                hospital_id: hospitalId,
                hospital_name: hospitalName,
                room_no: `${specialty.name.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 500) + 100}`,
                rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)),
                reviews: Math.floor(Math.random() * 1000) + 50,
                available: Math.random() > 0.2,
                experience: Math.floor(Math.random() * 30) + 5,
                title: `${specialty.name} Uzmanı`
            });
        }
    }
});

const content = `// National MHRS Mock Data Engine
// Generated Content: 81 Cities, 243 Districts, 243 Hospitals, ~1500 Doctors

export interface MockCity { id: number; name: string; }
export interface MockDistrict { id: number; city_id: number; name: string; }
export interface MockHospital { id: number; city_id: number; district_id: number; name: string; }
export interface MockDoctor {
  id: number;
  user_id?: number;
  full_name: string;
  specialty_id: number;
  specialty_name: string;
  hospital_id: number;
  hospital_name: string;
  room_no: string;
  rating: number;
  reviews: number;
  available: boolean;
  experience: number;
  about?: string;
  title?: string;
  imageUrl?: string;
}

export const MOCK_CITIES: MockCity[] = ${JSON.stringify(mockCities, null, 2)};
export const MOCK_DISTRICTS: MockDistrict[] = ${JSON.stringify(mockDistricts, null, 2)};
export const MOCK_HOSPITALS: MockHospital[] = ${JSON.stringify(mockHospitals, null, 2)};
export const MOCK_SPECIALTIES = ${JSON.stringify(SPECIALTIES, null, 2)};
export const MOCK_DOCTORS_DB: MockDoctor[] = ${JSON.stringify(mockDoctors, null, 2)};

export const MOCK_REVIEWS = [
  { id: 1, doctor_id: 200001, user_name: 'Ayşe P.', rating: 5, date: '12 Mart 2026', comment: 'Çok ilgili bir hekim.' }
];

export const MOCK_TAHLILLER = [
  { id: 101, test_name: 'Hemogram (Tam Kan)', date: '28 Mart 2026', status: 'Sonuçlandı', result: 'Normal', hospital: 'Ankara Şehir Hastanesi' },
  { id: 102, test_name: 'Vitamin D', date: '25 Mart 2026', status: 'Sonuçlandı', result: 'Düşük', hospital: 'Başakşehir Çam ve Sakura Şehir Hastanesi' },
  { id: 103, test_name: 'B12 Vitamini', date: '15 Şubat 2026', status: 'Arşivlendi', result: 'Normal', hospital: 'İzmir Şehir Hastanesi' }
];

export const MOCK_RECETELER = [
  { id: 501, drug_name: 'Parol 500mg Tablet', date: '2 Nisan 2026', usage: 'Günde 2 defa Tok', doctor: 'Dr. Ahmet Yılmaz', code: 'EY5W21' },
  { id: 502, drug_name: 'Arveles 25mg', date: '15 Mart 2026', usage: 'Gerektiğinde 1 defa', doctor: 'Dr. Ayşe Demir', code: 'ZX9Q11' }
];
`;

fs.writeFileSync(path.join('frontend', 'src', 'utils', 'mockData.ts'), content);
console.log("Mock data generated successfully!");
