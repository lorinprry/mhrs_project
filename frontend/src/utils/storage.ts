import type { Appointment } from '../types';

const APPOINTMENTS_KEY = 'mhrs_appointments';

export const storage = {
  getAppointments: (): Appointment[] => {
    const data = localStorage.getItem(APPOINTMENTS_KEY);
    return data ? JSON.parse(data) : [];
  },
  
  saveAppointment: (appointment: Omit<Appointment, 'id'>): Appointment => {
    const list = storage.getAppointments();
    const newApp: Appointment = {
      ...appointment,
      id: Date.now(), // Simple mock ID
      status: 'booked'
    };
    list.push(newApp);
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(list));
    return newApp;
  },
  
  updateAppointmentStatus: (id: number, status: string): void => {
    const list = storage.getAppointments();
    const index = list.findIndex(a => a.id === id);
    if (index !== -1) {
      list[index].status = status as any;
      localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(list));
    }
  },

  clearAppointments: (): void => {
    localStorage.removeItem(APPOINTMENTS_KEY);
  }
};
