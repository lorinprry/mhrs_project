import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Star, MapPin, Filter, User } from 'lucide-react';
import client from '../api/client';
import type { Doctor, Specialty, Paginated } from '../types';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Pill from '../components/Pill';

const DoctorDiscovery: React.FC = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);

  useEffect(() => {
    client.get<Specialty[]>('/hospitals/specialties/')
      .then(res => setSpecialties(res.data))
      .catch(console.error);

    fetchAllDoctors();
  }, []);

  const fetchAllDoctors = () => {
    setLoading(true);
    client.get<Paginated<Doctor>>('/doctors/')
      .then(res => setDoctors(res.data.results || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const filteredDoctors = doctors.filter(d => {
    const matchSearch = d.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || d.hospital_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSpecialty = selectedSpecialty ? String(d.specialty) === String(selectedSpecialty) : true;
    return matchSearch && matchSpecialty;
  });

  return (
    <div className="animate-fade-in flex flex-col gap-8">
      <div>
        <h2 className="text-h1">Hekim Keşfi</h2>
        <p className="text-body mt-2">Bölgenizdeki en iyi uzmanları inceleyip hemen randevu alın.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <Card padding="md" className="sticky top-24">
            <h3 className="text-h3 flex items-center gap-2 mb-6"><Filter size={18} /> Filtreler</h3>
            
            <Input 
              placeholder="Hekim veya Hastane Ara..." 
              icon={<Search size={16} />} 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="mb-6"
            />

            <div>
              <p className="input-label mb-3">Uzmanlık Alanı</p>
              <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-2">
                <button 
                  onClick={() => setSelectedSpecialty(null)}
                  className={`text-left text-sm px-3 py-2 rounded-lg transition-all ${!selectedSpecialty ? 'bg-primary-light text-primary font-bold' : 'text-medium hover:bg-slate-50'}`}
                >
                  Tümü
                </button>
                {specialties.map(spec => (
                  <button 
                    key={spec.id}
                    onClick={() => setSelectedSpecialty(String(spec.id))}
                    className={`text-left text-sm px-3 py-2 rounded-lg transition-all ${selectedSpecialty === String(spec.id) ? 'bg-primary-light text-primary font-bold' : 'text-medium hover:bg-slate-50'}`}
                  >
                    {spec.name}
                  </button>
                ))}
              </div>
            </div>
            
            {selectedSpecialty && (
              <Button variant="ghost" className="w-full mt-4 text-xs" onClick={() => { setSelectedSpecialty(null); setSearchTerm(''); }}>Filtreleri Temizle</Button>
            )}
          </Card>
        </div>

        {/* Doctor List */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map(i => <Card key={i} className="animate-pulse h-32 bg-slate-100 border-none" />)}
            </div>
          ) : filteredDoctors.length === 0 ? (
            <Card className="text-center py-16 flex flex-col items-center justify-center border-dashed">
              <div className="icon-box lg bg-slate-50 text-slate-400 mb-4"><User size={32} /></div>
              <h4 className="text-h3 font-bold mb-2">Hekim Bulunamadı</h4>
              <p className="text-body max-w-md">Seçtiğiniz kriterlere uygun veya bu isme sahip kayıtlı bir hekim bulunamadı.</p>
            </Card>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredDoctors.map(doc => (
                <Card key={doc.id} padding="md" className="hover:border-primary transition-all group p-5">
                  <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between">
                    
                    <div className="flex items-center gap-5">
                      <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(doc.full_name)}&background=e0e7ff&color=4f46e5&rounded=true&size=128`} alt={doc.full_name} className="w-16 h-16 rounded-full border-2 border-primary-light" />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-lg font-bold group-hover:text-primary transition-colors">{doc.full_name}</h4>
                          <Pill variant="mint" style={{ padding: '2px 8px', fontSize: '10px' }}>%98 Olumlu</Pill>
                        </div>
                        <p className="text-sm text-medium font-medium mb-1">{doc.specialty_name}</p>
                        <div className="flex items-center gap-1 text-xs text-muted">
                          <MapPin size={12} /> {doc.hospital_name} • Oda {doc.room_no}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-3 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-none border-slate-100">
                      <div className="flex items-center gap-4 w-full justify-between md:justify-end">
                        <div className="flex flex-col md:items-end">
                          <div className="flex items-center gap-1 text-amber-500">
                            <Star size={14} fill="currentColor" />
                            <Star size={14} fill="currentColor" />
                            <Star size={14} fill="currentColor" />
                            <Star size={14} fill="currentColor" />
                            <Star size={14} fill="currentColor" style={{ opacity: 0.5 }} />
                          </div>
                          <span className="text-[11px] text-muted font-medium mt-0.5">85 Değerlendirme</span>
                        </div>
                      </div>
                      <Button className="w-full md:w-auto" onClick={() => navigate('/booking')}>Randevu Al</Button>
                    </div>

                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DoctorDiscovery;
