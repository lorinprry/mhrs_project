const fs = require('fs');
const path = require('path');

const CITIES = [
  'Adana','Adıyaman','Afyonkarahisar','Ağrı','Amasya','Ankara','Antalya','Artvin',
  'Aydın','Balıkesir','Bilecik','Bingöl','Bitlis','Bolu','Burdur','Bursa',
  'Çanakkale','Çankırı','Çorum','Denizli','Diyarbakır','Edirne','Elazığ','Erzincan',
  'Erzurum','Eskişehir','Gaziantep','Giresun','Gümüşhane','Hakkari','Hatay','Isparta',
  'Mersin','İstanbul','İzmir','Kars','Kastamonu','Kayseri','Kırklareli','Kırşehir',
  'Kocaeli','Konya','Kütahya','Malatya','Manisa','Kahramanmaraş','Mardin','Muğla',
  'Muş','Nevşehir','Niğde','Ordu','Rize','Sakarya','Samsun','Siirt','Sinop','Sivas',
  'Tekirdağ','Tokat','Trabzon','Tunceli','Şanlıurfa','Uşak','Van','Yozgat','Zonguldak',
  'Aksaray','Bayburt','Karaman','Kırıkkale','Batman','Şırnak','Bartın','Ardahan',
  'Iğdır','Yalova','Karabük','Kilis','Osmaniye','Düzce'
];

const DISTRICT_NAMES = {
  'İstanbul': ['Kadıköy','Beşiktaş','Şişli','Üsküdar','Bakırköy','Beylikdüzü','Fatih','Ataşehir','Pendik','Maltepe'],
  'Ankara': ['Çankaya','Keçiören','Yenimahalle','Mamak','Etimesgut','Altındağ','Sincan','Polatlı'],
  'İzmir': ['Karşıyaka','Bornova','Konak','Buca','Bayraklı','Çiğli','Gaziemir','Karabağlar'],
  'Bursa': ['Osmangazi','Nilüfer','Yıldırım','İnegöl','Mudanya','Gemlik'],
  'Antalya': ['Muratpaşa','Kepez','Konyaaltı','Alanya','Manavgat','Serik'],
  'Adana': ['Seyhan','Çukurova','Yüreğir','Sarıçam','Ceyhan'],
  'Konya': ['Selçuklu','Meram','Karatay','Ereğli','Akşehir'],
  'Gaziantep': ['Şahinbey','Şehitkamil','Nizip','İslahiye'],
  'Kayseri': ['Melikgazi','Kocasinan','Talas','Develi'],
  'Mersin': ['Yenişehir','Mezitli','Akdeniz','Toroslar','Tarsus'],
  'Diyarbakır': ['Bağlar','Kayapınar','Sur','Yenişehir'],
  'Samsun': ['İlkadım','Atakum','Canik','Bafra'],
  'Denizli': ['Merkezefendi','Pamukkale','Çivril'],
  'Eskişehir': ['Odunpazarı','Tepebaşı','Sivrihisar'],
  'Kocaeli': ['İzmit','Gebze','Darıca','Kocaeli Merkez'],
  'Trabzon': ['Ortahisar','Akçaabat','Of','Araklı'],
  'Malatya': ['Battalgazi','Yeşilyurt','Doğanşehir'],
  'Manisa': ['Yunusemre','Şehzadeler','Akhisar','Turgutlu'],
};

const fNames = ['Ahmet','Mehmet','Ali','Can','Cem','Burak','Hakan','Kerem','Emre','Osman','Murat','Serkan','Tolga','Barış','Erdem',
  'Ayşe','Fatma','Zeynep','Selin','Elif','Derya','Merve','Pelin','Ceren','Büşra','Gamze','Esra','Gülşen','Neslihan','Aslı'];
const lNames = ['Yılmaz','Çelik','Demir','Kaya','Şahin','Yıldız','Öztürk','Aydın','Özdemir','Kılıç','Erdoğan','Yavuz','Koç','Çetin','Güneş','Arslan','Polat','Korkmaz','Taş','Aksoy'];
const acTitles = ['Prof. Dr.','Doç. Dr.','Uzm. Dr.','Op. Dr.','Dr.'];
const hospTypes = ['Devlet Hastanesi','Şehir Hastanesi','Eğitim ve Araştırma Hastanesi','Üniversite Hastanesi'];

const specs = [
  {id:1,name:'Kardiyoloji'},{id:2,name:'Cildiye'},{id:3,name:'Ortopedi ve Travmatoloji'},
  {id:4,name:'Nöroloji'},{id:5,name:'Dahiliye'},{id:6,name:'Göz Hastalıkları'},
  {id:7,name:'Kulak Burun Boğaz'},{id:8,name:'Çocuk Sağlığı ve Hastalıkları'},
  {id:9,name:'Psikiyatri'},{id:10,name:'Genel Cerrahi'},{id:11,name:'Kadın Hastalıkları ve Doğum'},
  {id:12,name:'Üroloji'},{id:13,name:'Fizik Tedavi ve Rehabilitasyon'},{id:14,name:'Göğüs Hastalıkları'},
  {id:15,name:'Gastroenteroloji'},{id:16,name:'Endokrinoloji'},{id:17,name:'Hematoloji'},
  {id:18,name:'Enfeksiyon Hastalıkları'},{id:19,name:'Plastik Cerrahi'},{id:20,name:'Beyin ve Sinir Cerrahisi'},
];

function pick(arr) { return arr[Math.floor(Math.random()*arr.length)]; }

let citiesArr = [];
let districtsArr = [];
let hospitalsArr = [];
let doctorsArr = [];
let hospId = 1;
let docId = 101;

CITIES.forEach((cityName, idx) => {
  const cityId = idx + 1;
  citiesArr.push({ id: cityId, name: cityName });

  // Get real district names or generate generic ones
  const realDistricts = DISTRICT_NAMES[cityName];
  const districtNames = realDistricts || [`${cityName} Merkez`, `${cityName} Batı`, `${cityName} Doğu`];

  districtNames.forEach((dName, dIdx) => {
    const dId = cityId * 100 + dIdx + 1;
    districtsArr.push({ id: dId, city_id: cityId, name: dName });

    // 1-2 hospitals per district
    const hospCount = (realDistricts && realDistricts.length > 3) ? 2 : 1;
    for (let h = 0; h < hospCount; h++) {
      const hType = pick(hospTypes);
      const hName = `${dName} ${hType}`;
      hospitalsArr.push({ id: hospId, city_id: cityId, district_id: dId, name: hName });

      // 3-6 doctors per hospital
      const docCount = Math.floor(Math.random() * 4) + 3;
      for (let d = 0; d < docCount; d++) {
        const fn = pick(fNames);
        const ln = pick(lNames);
        const title = pick(acTitles);
        const spec = pick(specs);
        const rating = (3 + Math.random() * 2).toFixed(1);
        const reviews = Math.floor(Math.random() * 500) + 5;
        const exp = Math.floor(Math.random() * 35) + 2;
        const avail = Math.random() > 0.25;

        doctorsArr.push({
          id: docId,
          full_name: `${title} ${fn} ${ln}`,
          specialty_id: spec.id,
          specialty_name: spec.name,
          hospital_id: hospId,
          hospital_name: hName,
          room_no: `${spec.name.substring(0,3).toUpperCase()}-${d+1}`,
          rating: parseFloat(rating),
          reviews,
          available: avail,
          experience: exp,
          title: `${spec.name} Uzmanı`
        });
        docId++;
      }
      hospId++;
    }
  });
});

// Build TypeScript file content
let out = `export interface MockCity { id: number; name: string; }
export interface MockDistrict { id: number; city_id: number; name: string; }
export interface MockHospital { id: number; city_id: number; district_id: number; name: string; }
export interface MockDoctor {
  id: number; user_id?: number; full_name: string; specialty_id: number; specialty_name: string;
  hospital_id: number; hospital_name: string; room_no: string; rating: number; reviews: number;
  available: boolean; experience: number; about?: string; title?: string; imageUrl?: string;
}

// === ${citiesArr.length} İL ===
export const MOCK_CITIES: MockCity[] = ${JSON.stringify(citiesArr)};

// === ${districtsArr.length} İLÇE ===
export const MOCK_DISTRICTS: MockDistrict[] = ${JSON.stringify(districtsArr)};

// === ${hospitalsArr.length} HASTANE ===
export const MOCK_HOSPITALS: MockHospital[] = ${JSON.stringify(hospitalsArr)};

export const MOCK_SPECIALTIES = ${JSON.stringify(specs)};

// === ${doctorsArr.length} DOKTOR ===
export const MOCK_DOCTORS_DB: MockDoctor[] = ${JSON.stringify(doctorsArr)};

export const MOCK_REVIEWS = [
  { id: 1, doctor_id: 101, user_name: 'Ayşe P.', rating: 5, date: '12 Mart 2026', comment: 'Çok ilgili ve uzman bir doktor.' },
  { id: 2, doctor_id: 102, user_name: 'Mehmet Y.', rating: 5, date: '2 Şubat 2026', comment: 'Yılların tecrübesi belli oluyor.' },
  { id: 3, doctor_id: 105, user_name: 'Ali K.', rating: 4, date: '28 Ocak 2026', comment: 'Gayet profesyonel bir yaklaşımı var.' },
  { id: 4, doctor_id: 108, user_name: 'Fatma T.', rating: 5, date: '15 Mart 2026', comment: 'Çocuklarla iletişimi harika.' },
];
`;

const outPath = path.join(__dirname, 'frontend', 'src', 'utils', 'mockData.ts');
fs.writeFileSync(outPath, out, 'utf-8');
console.log('SUCCESS!');
console.log('Cities:', citiesArr.length);
console.log('Districts:', districtsArr.length);
console.log('Hospitals:', hospitalsArr.length);
console.log('Doctors:', doctorsArr.length);
