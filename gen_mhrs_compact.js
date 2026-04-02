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
    { id: 10, name: "Genel Cerrahi" }, { id: 11, name: "Kadın Doğum" }
];

const firstNames = ["Ahmet", "Mehmet", "Ayşe", "Fatma", "Ali", "Hülya", "Mustafa", "Zeynep", "Emre", "Selin"];
const lastNames = ["Yılmaz", "Kaya", "Demir", "Şahin", "Çelik", "Öztürk", "Aydın", "Özdemir", "Arslan", "Doğan"];
const titles = ["Prof. Dr.", "Doç. Dr.", "Uzm. Dr.", "Op. Dr.", "Dr."];

let mockCities = [], mockDistricts = [], mockHospitals = [], mockDoctors = [];
let distId = 1000, hospId = 10000, docId = 200000;

CITIES.forEach((cityName, cityIndex) => {
    const cityId = cityIndex + 1;
    mockCities.push({ id: cityId, name: cityName });
    for (let d = 1; d <= 2; d++) {
        const districtId = distId++;
        mockDistricts.push({ id: districtId, city_id: cityId, name: `${cityName} İlçe ${d}` });
        const hospitalId = hospId++;
        const hospName = `${cityName} ${d % 2 === 0 ? "Şehir" : "Devlet"} Hastanesi`;
        mockHospitals.push({ id: hospitalId, city_id: cityId, district_id: districtId, name: hospName });
        for (let docIdx = 0; docIdx < 3; docIdx++) {
            const specialty = SPECIALTIES[Math.floor(Math.random() * SPECIALTIES.length)];
            mockDoctors.push({
                id: docId++,
                full_name: `${titles[Math.floor(Math.random()*titles.length)]} ${firstNames[Math.floor(Math.random()*firstNames.length)]} ${lastNames[Math.floor(Math.random()*lastNames.length)]}`,
                specialty_id: specialty.id, specialty_name: specialty.name,
                hospital_id: hospitalId, hospital_name: hospName,
                room_no: `A-${docIdx+1}`, rating: 4.5, reviews: 100, available: true, experience: 10, title: `${specialty.name} Uzmanı`
            });
        }
    }
});

const content = `/* AUTO GENERATED MOCK DATA */
export interface MockCity { id: number; name: string; }
export interface MockDistrict { id: number; city_id: number; name: string; }
export interface MockHospital { id: number; city_id: number; district_id: number; name: string; }
export interface MockDoctor { id: number; full_name: string; specialty_id: number; specialty_name: string; hospital_id: number; hospital_name: string; room_no: string; rating: number; reviews: number; available: boolean; experience: number; title: string; }

export const MOCK_CITIES: MockCity[] = ${JSON.stringify(mockCities)};
export const MOCK_DISTRICTS: MockDistrict[] = ${JSON.stringify(mockDistricts)};
export const MOCK_HOSPITALS: MockHospital[] = ${JSON.stringify(mockHospitals)};
export const MOCK_SPECIALTIES = ${JSON.stringify(SPECIALTIES)};
export const MOCK_DOCTORS_DB: MockDoctor[] = ${JSON.stringify(mockDoctors)};
export const MOCK_REVIEWS = [];
export const MOCK_TAHLILLER = [{ id: 1, test_name: 'Hemogram', date: '02.04.2026', status: 'Sonuçlandı', result: 'Normal', hospital: 'Merkez Hastanesi' }];
export const MOCK_RECETELER = [{ id: 1, drug_name: 'Parol', date: '01.04.2026', usage: 'Günde 2x1', doctor: 'Dr. Test', code: 'EY123' }];
`;

fs.writeFileSync(path.join('frontend', 'src', 'utils', 'mockData.ts'), content);
console.log("Mock data generated.");
