const fs = require('fs');

const cities = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Amasya', 'Ankara', 'Antalya', 'Artvin', 'Aydın', 'Balıkesir',
  'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli',
  'Diyarbakır', 'Edirne', 'Elazığ', 'Erzincan', 'Ezurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari',
  'Hatay', 'Isparta', 'Mersin', 'İstanbul', 'İzmir', 'Kars', 'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir',
  'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Kahramanmaraş', 'Mardin', 'Muğla', 'Muş', 'Nevşehir',
  'Niğde', 'Ordu', 'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Tekirdağ', 'Tokat',
  'Trabzon', 'Tunceli', 'Şanlıurfa', 'Uşak', 'Van', 'Yozgat', 'Zonguldak', 'Aksaray', 'Bayburt', 'Karaman',
  'Kırıkkale', 'Batman', 'Şırnak', 'Bartın', 'Ardahan', 'Iğdır', 'Yalova', 'Karabük', 'Kilis', 'Osmaniye', 'Düzce'
];

const firstNames = ['Ahmet', 'Mehmet', 'Ali', 'Can', 'Cem', 'Burak', 'Hakan', 'Ayşe', 'Fatma', 'Zeynep', 'Selin', 'Elif', 'Derya', 'Merve', 'Kaan', 'Efe', 'Emre', 'Pelin', 'Ceren', 'Büşra', 'Osman', 'Orhan'];
const lastNames = ['Yılmaz', 'Çelik', 'Demir', 'Kaya', 'Şahin', 'Yıldız', 'Öztürk', 'Aydın', 'Özdemir', 'Kılıç', 'Erdoğan', 'Yavuz', 'Koç', 'Çetin', 'Güneş'];
const titles = ['Prof. Dr.', 'Doç. Dr.', 'Uzm. Dr.', 'Op. Dr.', 'Dr.'];

const specialties = [
  { id: 1, name: 'Kardiyoloji' },
  { id: 2, name: 'Cildiye' },
  { id: 3, name: 'Ortopedi ve Travmatoloji' },
  { id: 4, name: 'Nöroloji' },
  { id: 5, name: 'Dahiliye' },
  { id: 6, name: 'Göz Hastalıkları' },
  { id: 7, name: 'Kulak Burun Boğaz' },
  { id: 8, name: 'Çocuk Sağlığı ve Hastalıkları' },
  { id: 9, name: 'Psikiyatri' },
  { id: 10, name: 'Genel Cerrahi' },
  { id: 11, name: 'Kadın Hastalıkları ve Doğum' },
];

let MOCK_CITIES = [];
let MOCK_DISTRICTS = [];
let MOCK_HOSPITALS = [];
let MOCK_DOCTORS_DB = [];

let distId = 1;
let hospId = 1;
let docId = 101;

cities.forEach((city, index) => {
  const cityId = index + 1;
  MOCK_CITIES.push(`  { id: ${cityId}, name: '${city}' }`);

  // generate 3 districts
  for (let d = 1; d <= 3; d++) {
    const dId = cityId * 100 + d;
    MOCK_DISTRICTS.push(`  { id: ${dId}, city_id: ${cityId}, name: 'Merkez İlçe ${d}' }`);

    // 1 hospital per district
    const hospitalName = `${city} Devlet Hastanesi - ${d}`;
    MOCK_HOSPITALS.push(`  { id: ${hospId}, city_id: ${cityId}, district_id: ${dId}, name: '${hospitalName}' }`);

    // Generate 5 doctors per hospital
    for (let doc = 1; doc <= 5; doc++) {
      const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const title = titles[Math.floor(Math.random() * titles.length)];
      const spec = specialties[Math.floor(Math.random() * specialties.length)];
      
      const isAvailable = Math.random() > 0.3 ? 'true' : 'false';
      const rating = (Math.random() * 2 + 3).toFixed(1); // 3.0 to 5.0
      const exp = Math.floor(Math.random() * 30) + 2;

      MOCK_DOCTORS_DB.push(`  { id: ${docId}, full_name: '${title} ${fName} ${lName}', specialty_id: ${spec.id}, specialty_name: '${spec.name}', hospital_id: ${hospId}, hospital_name: '${hospitalName}', room_no: '${spec.name.substring(0,3).toUpperCase()}-${doc}', rating: ${rating}, reviews: ${Math.floor(Math.random()*400+10)}, available: ${isAvailable}, experience: ${exp}, title: '${spec.name} Uzmanı' }`);
      docId++;
    }
    hospId++;
  }
});

const fileData = `export interface MockCity { id: number; name: string; }
export interface MockDistrict { id: number; city_id: number; name: string; }
export interface MockHospital { id: number; city_id: number; district_id: number; name: string; }
export interface MockDoctor {
  id: number; user_id?: number; full_name: string; specialty_id: number; specialty_name: string;
  hospital_id: number; hospital_name: string; room_no: string; rating: number; reviews: number;
  available: boolean; experience: number; about?: string; title?: string; imageUrl?: string;
}

export const MOCK_CITIES: MockCity[] = [
${MOCK_CITIES.join(',\n')}
];

export const MOCK_DISTRICTS: MockDistrict[] = [
${MOCK_DISTRICTS.join(',\n')}
];

export const MOCK_HOSPITALS: MockHospital[] = [
${MOCK_HOSPITALS.join(',\n')}
];

export const MOCK_SPECIALTIES = [
  { id: 1, name: 'Kardiyoloji' },
  { id: 2, name: 'Cildiye' },
  { id: 3, name: 'Ortopedi ve Travmatoloji' },
  { id: 4, name: 'Nöroloji' },
  { id: 5, name: 'Dahiliye' },
  { id: 6, name: 'Göz Hastalıkları' },
  { id: 7, name: 'Kulak Burun Boğaz' },
  { id: 8, name: 'Çocuk Sağlığı ve Hastalıkları' },
  { id: 9, name: 'Psikiyatri' },
  { id: 10, name: 'Genel Cerrahi' },
  { id: 11, name: 'Kadın Hastalıkları ve Doğum' },
];

export const MOCK_DOCTORS_DB: MockDoctor[] = [
${MOCK_DOCTORS_DB.join(',\n')}
];

export const MOCK_REVIEWS = [
  { id: 1, doctor_id: 101, user_name: 'Ayşe P.', rating: 5, date: '12 Mart 2026', comment: 'Çok ilgili ve uzman bir doktor. Tedavi sürecinden çok memnun kaldım.' }
];
`;

fs.writeFileSync('frontend/src/utils/mockData.ts', fileData);
console.log('Mock data generated for 81 cities successfully!');
