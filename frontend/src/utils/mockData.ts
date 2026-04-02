export interface MockCity { id: number; name: string; }
export interface MockDistrict { id: number; city_id: number; name: string; }
export interface MockHospital { id: number; city_id: number; district_id: number; name: string; }
export interface MockDoctor {
  id: number;
  full_name: string;
  specialty: number;
  specialty_name: string;
  hospital: number;
  hospital_name: string;
  room_no: string;
  rating: number;
  reviews: number;
  available: boolean;
  experience: number;
  title: string;
  busy_slots: string[];
}

export const MOCK_CITIES: MockCity[] = [
  {"id":1,"name":"Adana"},{"id":2,"name":"Adıyaman"},{"id":3,"name":"Afyonkarahisar"},{"id":4,"name":"Ağrı"},{"id":5,"name":"Amasya"},{"id":6,"name":"Ankara"},{"id":7,"name":"Antalya"},{"id":8,"name":"Artvin"},{"id":9,"name":"Aydın"},{"id":10,"name":"Balıkesir"},{"id":11,"name":"Bilecik"},{"id":12,"name":"Bingöl"},{"id":13,"name":"Bitlis"},{"id":14,"name":"Bolu"},{"id":15,"name":"Burdur"},{"id":16,"name":"Bursa"},{"id":17,"name":"Çanakkale"},{"id":18,"name":"Çankırı"},{"id":19,"name":"Çorum"},{"id":20,"name":"Denizli"},{"id":21,"name":"Diyarbakır"},{"id":22,"name":"Edirne"},{"id":23,"name":"Elazığ"},{"id":24,"name":"Erzincan"},{"id":25,"name":"Erzurum"},{"id":26,"name":"Eskişehir"},{"id":27,"name":"Gaziantep"},{"id":28,"name":"Giresun"},{"id":29,"name":"Gümüşhane"},{"id":30,"name":"Hakkari"},{"id":31,"name":"Hatay"},{"id":32,"name":"Isparta"},{"id":33,"name":"Mersin"},{"id":34,"name":"İstanbul"},{"id":35,"name":"İzmir"},{"id":36,"name":"Kars"},{"id":37,"name":"Kastamonu"},{"id":38,"name":"Kayseri"},{"id":39,"name":"Kırklareli"},{"id":40,"name":"Kırşehir"},{"id":41,"name":"Kocaeli"},{"id":42,"name":"Konya"},{"id":43,"name":"Kütahya"},{"id":44,"name":"Malatya"},{"id":45,"name":"Manisa"},{"id":46,"name":"Kahramanmaraş"},{"id":47,"name":"Mardin"},{"id":48,"name":"Muğla"},{"id":49,"name":"Muş"},{"id":50,"name":"Nevşehir"},{"id":51,"name":"Niğde"},{"id":52,"name":"Ordu"},{"id":53,"name":"Rize"},{"id":54,"name":"Sakarya"},{"id":55,"name":"Samsun"},{"id":56,"name":"Siirt"},{"id":57,"name":"Sinop"},{"id":58,"name":"Sivas"},{"id":59,"name":"Tekirdağ"},{"id":60,"name":"Tokat"},{"id":61,"name":"Trabzon"},{"id":62,"name":"Tunceli"},{"id":63,"name":"Şanlıurfa"},{"id":64,"name":"Uşak"},{"id":65,"name":"Van"},{"id":66,"name":"Yozgat"},{"id":67,"name":"Zonguldak"},{"id":68,"name":"Aksaray"},{"id":69,"name":"Bayburt"},{"id":70,"name":"Karaman"},{"id":71,"name":"Kırıkkale"},{"id":72,"name":"Batman"},{"id":73,"name":"Şırnak"},{"id":74,"name":"Bartın"},{"id":75,"name":"Ardahan"},{"id":76,"name":"Iğdır"},{"id":77,"name":"Yalova"},{"id":78,"name":"Karabük"},{"id":79,"name":"Kilis"},{"id":80,"name":"Osmaniye"},{"id":81,"name":"Düzce"}
];

export const MOCK_SPECIALTIES = [
  { id: 1, name: "Kardiyoloji" }, { id: 2, name: "Cildiye" }, { id: 3, name: "Ortopedi" },
  { id: 4, name: "Nöroloji" }, { id: 5, name: "Dahiliye" }, { id: 6, name: "Göz" },
  { id: 7, name: "KBB" }, { id: 8, name: "Çocuk" }, { id: 9, name: "Psikiyatri" },
  { id: 10, name: "Genel Cerrahi" }, { id: 11, name: "Kadın Doğum" }, { id: 12, name: "Üroloji" }
];

const LOCAL_DISTRICTS: Record<string, string[]> = {
  "Aydın": ["Efeler", "Kuşadası", "Didim", "Söke", "Nazilli", "Germencik", "İncirliova", "Koçarlı", "Köşk", "Bozdoğan"],
  "İstanbul": ["Kadıköy", "Beşiktaş", "Şişli", "Üsküdar", "Bağcılar", "Esenyurt", "Fatih", "Pendik", "Sarıyer", "Beşiktaş"],
  "Ankara": ["Çankaya", "Keçiören", "Yenimahalle", "Mamak", "Etimesgut", "Sincan", "Altındağ", "Pursaklar", "Gölbaşı", "Polatlı"],
  "İzmir": ["Konak", "Bornova", "Karşıyaka", "Buca", "Çiğli", "Gaziemir", "Bayraklı", "Balçova", "Narlıdere", "Urla"]
};

// DYNAMIC RUNTIME GENERATION
export const MOCK_DISTRICTS: MockDistrict[] = MOCK_CITIES.flatMap(c => {
    const names = LOCAL_DISTRICTS[c.name] || Array.from({length: 10}, (_, i) => `${c.name} İlçe ${i + 1}`);
    return names.map((name, i) => ({ id: c.id * 100 + i, city_id: c.id, name }));
});

export const MOCK_HOSPITALS: MockHospital[] = MOCK_DISTRICTS.map((d, i) => ({
  id: 10000 + i,
  city_id: d.city_id,
  district_id: d.id,
  name: `${d.name} ${i % 2 === 0 ? 'Devlet' : 'Şehir'} Hastanesi`
}));

export const MOCK_DOCTORS_DB: MockDoctor[] = MOCK_HOSPITALS.flatMap((h, i) => {
    // Generate one doctor for EACH specialty (12 doctors per hospital)
    return MOCK_SPECIALTIES.map(s => {
        const docId = 200000 + h.id * 20 + s.id;
        const namePool = ['Ahmet','Mehmet','Ayşe','Fatma','Can','Selin','Murat','Elif','Zeynep','Deniz','Ege','Bora'];
        const surnamePool = ['Yılmaz','Kaya','Demir','Çelik','Yıldız','Arslan','Öztürk','Aydın'];
        return {
          id: docId,
          full_name: `Dr. ${namePool[docId % namePool.length]} ${surnamePool[docId % surnamePool.length]}`,
          specialty: s.id,
          specialty_name: s.name,
          hospital: h.id,
          hospital_name: h.name,
          room_no: `K-${s.id}-${h.id % 50}`,
          rating: 4.5 + (docId % 5) / 10,
          reviews: 50 + (docId % 100),
          available: true,
          experience: 5 + (docId % 20),
          title: 'Uzman Doktor',
          busy_slots: ['09:00', '11:30', '15:00']
        };
    });
});

export const MOCK_HEALTH_VITALS = [{id:1,type:'Tansiyon',value:'120/80',unit:'mmHg',date:'01.04.2026',desc:'İdeal.'}];
export const MOCK_VACCINES = [{id:1,name:'Hepatit B',date:'12.01.2026',status:'Tamamlandı'}];
export const MOCK_TAHLILLER = []; export const MOCK_RECETELER = []; export const MOCK_REVIEWS = [];
