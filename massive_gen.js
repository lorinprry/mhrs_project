const fs = require('fs');
const path = require('path');

const CITIES = ["Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman", "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"];

const TIMES = ['09:00','09:30','10:00','10:30','11:00','11:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30'];
const DIST_POOL = {
  "Aydın": ["Efeler", "Kuşadası", "Didim", "Söke", "Nazilli", "Germencik", "İncirliova", "Koçarlı", "Köşk", "Sultanhisar"],
  "İstanbul": ["Kadıköy", "Beşiktaş", "Şişli", "Üsküdar", "Bağcılar", "Esenyurt", "Fatih", "Pendik", "Sarıyer", "Kartal"],
  "Ankara": ["Çankaya", "Keçiören", "Yenimahalle", "Mamak", "Etimesgut", "Sincan", "Altındağ", "Pursaklar", "Gölbaşı", "Polatlı"],
  "İzmir": ["Konak", "Bornova", "Karşıyaka", "Buca", "Çiğli", "Gaziemir", "Bayraklı", "Balçova", "Narlıdere", "Urla"]
};

let cities = [], districts = [], hospitals = [], doctors = [];
let dId = 1000, hId = 10000, docId = 200000;

CITIES.forEach((c, ci) => {
    const cityId = ci + 1;
    cities.push({ id: cityId, name: c });
    for (let i = 0; i < 10; i++) {
        const id = dId++;
        const distName = (DIST_POOL[c] && DIST_POOL[c][i]) ? DIST_POOL[c][i] : `${c} İlçe ${i+1}`;
        districts.push({ id, city_id: cityId, name: distName });
        
        const hospId = hId++;
        hospitals.push({ id: hospId, city_id: cityId, district_id: id, name: `${distName} Devlet Hastanesi` });
        
        // 12 doctors per hospital (810 hospitals * 12 = 9720 doctors total)
        for (let j = 0; j < 12; j++) {
            const specId = j + 1;
            const busy = [];
            for (let b = 0; b < 4; b++) { const s = TIMES[Math.floor(Math.random()*TIMES.length)]; if(!busy.includes(s)) busy.push(s); }
            const specName = ["Kardiyoloji","Cildiye","Ortopedi","Nöroloji","Dahiliye","Göz","KBB","Çocuk","Psikiyatri","Genel Cerrahi","Kadın Doğum","Üroloji"][j];
            doctors.push({
                id: docId++, 
                full_name: `Dr. ${['Ahmet','Mehmet','Ayşe','Fatma','Can','Selin','Murat','Elif','Zeynep','Deniz','Ege','Bora'][j % 12]} ${['Yılmaz','Kaya','Demir','Çelik','Yıldız','Arslan','Öztürk','Aydın'][docId%8]}`,
                specialty_id: specId, 
                specialty_name: specName,
                hospital_id: hospId, hospital_name: `${distName} Devlet Hastanesi`,
                room_no: `A-${docId%100}`, rating: 4.8, reviews: 100, available: true, experience: 8 + (docId%15), title: 'Uzman Doktor',
                busy_slots: busy
            });
        }
    }
});

const content = `/* AUTO GENERATED NATIONWIDE 810 DISTRICTS, 9720 DOCTORS */
export const MOCK_CITIES = ${JSON.stringify(cities)};
export const MOCK_DISTRICTS = ${JSON.stringify(districts)};
export const MOCK_HOSPITALS = ${JSON.stringify(hospitals)};
export const MOCK_SPECIALTIES = [{"id":1,"name":"Kardiyoloji"},{"id":2,"name":"Cildiye"},{"id":3,"name":"Ortopedi"},{"id":4,"name":"Nöroloji"},{"id":5,"name":"Dahiliye"},{"id":6,"name":"Göz"},{"id":7,"name":"KBB"},{"id":8,"name":"Çocuk"},{"id":9,"name":"Psikiyatri"},{"id":10,"name":"Genel Cerrahi"},{"id":11,"name":"Kadın Doğum"},{"id":12,"name":"Üroloji"}];
export const MOCK_DOCTORS_DB = ${JSON.stringify(doctors)};
export const MOCK_HEALTH_VITALS = [{id:1,type:'Tansiyon',value:'120/80',unit:'mmHg',date:'01.04.2026',desc:'İdeal.'}];
export const MOCK_VACCINES = [{id:1,name:'Hepatit B',date:'12.01.2026',status:'Tamamlandı'}];
export const MOCK_TAHLILLER = []; export const MOCK_RECETELER = []; export const MOCK_REVIEWS = [];
`;
fs.writeFileSync(path.join('frontend', 'src', 'utils', 'mockData.ts'), content);
console.log("Done.");
