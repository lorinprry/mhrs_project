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
    { id: 1, name: "Kardiyoloji" }, { id: 2, name: "Cildiye" }, { id: 3, name: "Ortopedi" },
    { id: 4, name: "Nöroloji" }, { id: 5, name: "Dahiliye" }, { id: 6, name: "Göz" },
    { id: 7, name: "KBB" }, { id: 8, name: "Çocuk" }, { id: 9, name: "Psikiyatri" },
    { id: 10, name: "Genel Cerrahi" }, { id: 11, name: "Kadın Doğum" }, { id: 12, name: "Üroloji" },
    { id: 13, name: "Göğüs Hastalıkları" }, { id: 14, name: "Enfeksiyon" }, { id: 15, name: "Beyin Cerrahi" }
];

const firstNames = ["Ahmet", "Mehmet", "Ayşe", "Fatma", "Ali", "Hülya", "Mustafa", "Zeynep", "Emre", "Selin"];
const lastNames = ["Yılmaz", "Kaya", "Demir", "Şahin", "Çelik", "Öztürk", "Aydın", "Özdemir", "Arslan", "Doğan"];
const titles = ["Prof. Dr.", "Doç. Dr.", "Uzm. Dr.", "Op. Dr.", "Dr."];

let mockCities = [], mockDistricts = [], mockHospitals = [], mockDoctors = [];
let distId = 1000, hospId = 10000, docId = 200000;

CITIES.forEach((cityName, cityIndex) => {
    const cityId = cityIndex + 1;
    mockCities.push({ id: cityId, name: cityName });
    
    // 3 districts per city
    for (let d = 1; d <= 3; d++) {
        const districtId = distId++;
        const districtName = `${cityName} İlçe ${d}`;
        mockDistricts.push({ id: districtId, city_id: cityId, name: districtName });
        
        // 1 hospital per district (3 hospitals total per city)
        const hospitalId = hospId++;
        const hospName = `${districtName} ${d === 1 ? "Devlet" : (d === 2 ? "Şehir" : "Eğitim")} Hastanesi`;
        mockHospitals.push({ id: hospitalId, city_id: cityId, district_id: districtId, name: hospName });
        
        // 8 doctors per hospital
        for (let docIdx = 0; docIdx < 8; docIdx++) {
            const specialty = SPECIALTIES[Math.floor(Math.random() * SPECIALTIES.length)];
            mockDoctors.push({
                id: docId++,
                full_name: `${titles[Math.floor(Math.random()*titles.length)]} ${firstNames[Math.floor(Math.random()*firstNames.length)]} ${lastNames[Math.floor(Math.random()*lastNames.length)]}`,
                specialty_id: specialty.id, specialty_name: specialty.name,
                hospital_id: hospitalId, hospital_name: hospName,
                room_no: `${specialty.name.substring(0,2).toUpperCase()}-${Math.floor(Math.random()*900+100)}`,
                rating: parseFloat((Math.random() * 1 + 4).toFixed(1)), 
                reviews: Math.floor(Math.random()*200+50), available: true, experience: Math.floor(Math.random()*25+5), 
                title: `${specialty.name} Uzmanı`
            });
        }
    }
});

const content = `/* AUTO GENERATED MIVE MOCK DATA - 81 CITIES, 243 DISTRICTS, 243 HOSPITALS, 1944 DOCTORS */
export interface MockCity { id: number; name: string; }
export interface MockDistrict { id: number; city_id: number; name: string; }
export interface MockHospital { id: number; city_id: number; district_id: number; name: string; }
export interface MockDoctor { id: number; full_name: string; specialty_id: number; specialty_name: string; hospital_id: number; hospital_name: string; room_no: string; rating: number; reviews: number; available: boolean; experience: number; title: string; }

export const MOCK_CITIES: MockCity[] = ${JSON.stringify(mockCities)};
export const MOCK_DISTRICTS: MockDistrict[] = ${JSON.stringify(mockDistricts)};
export const MOCK_HOSPITALS: MockHospital[] = ${JSON.stringify(mockHospitals)};
export const MOCK_SPECIALTIES = ${JSON.stringify(SPECIALTIES)};
export const MOCK_DOCTORS_DB: MockDoctor[] = ${JSON.stringify(mockDoctors)};

export const MOCK_REVIEWS = [
  { id: 1, doctor_id: 200001, user_name: 'Metin Ş.', rating: 5, date: '15 Mart 2026', comment: 'Çok güler yüzlü bir personel.' }
];

export const MOCK_HEALTH_VITALS = [
  { id: 1, type: 'Tansiyon', value: '120/80', unit: 'mmHg', date: '01.04.2026', desc: 'Sistolik ve diyastolik basınç ideal seviyede.' },
  { id: 2, type: 'Şeker', value: '95', unit: 'mg/dL', date: '02.04.2026', desc: 'Açlık kan şekeri normal sinirlarda.' },
  { id: 3, type: 'BMI', value: '23.4', unit: 'kg/m2', date: '02.04.2026', desc: 'Vücut kitle indeksiniz sağlıklı aralıkta.' }
];

export const MOCK_VACCINES = [
  { id: 1, name: 'Hepatit B', date: '12.01.2026', status: 'Tamamlandı' },
  { id: 2, name: 'Tetanoz', date: '15.02.2026', status: 'Tamamlandı' },
  { id: 3, name: 'Grip (İnfluenza)', date: '20.10.2026', status: 'Planlandı' }
];

export const MOCK_TAHLILLER = [
  { id: 1, test_name: 'Hemogram (Tam Kan)', date: '28.03.2026', status: 'Sonuçlandı', result: 'Normal', hospital: 'Aydın İlçe 1 Devlet Hastanesi' },
  { id: 2, test_name: 'B12 Vitamini', date: '25.03.2026', status: 'Sonuçlandı', result: 'Düşük', hospital: 'İstanbul İlçe 1 Şehir Hastanesi' }
];

export const MOCK_RECETELER = [
  { id: 1, drug_name: 'Parol 500mg', date: '02.04.2026', usage: 'Günde 2x1 Tok', doctor: 'Dr. Ahmet Yılmaz', code: 'W9S21X' },
  { id: 2, drug_name: 'Arveles 25mg', date: '01.04.2026', usage: 'Ağrı Durumunda 1x1', doctor: 'Dr. Ayşe Demir', code: 'B3Q91Z' }
];
`;

fs.writeFileSync(path.join('frontend', 'src', 'utils', 'mockData.ts'), content);
console.log("Massive Mock Data Set (81 Cities, 243 Hospitals, 1944 Doctors) generated.");
