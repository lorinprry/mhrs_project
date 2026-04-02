export type UserRole = 'patient' | 'doctor' | 'admin'

export type UserInfo = {
  id: number
  username: string
  email?: string
  first_name: string
  last_name: string
  full_name?: string
  role: UserRole
  patient_id?: number | null
  doctor_id?: number | null
}

export type AuthResponse = {
  message: string
  access: string
  refresh: string
  user: {
    id: number
    username: string
    role: UserRole
    first_name: string
    last_name: string
  }
}

export type Paginated<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export type City = {
  id: number
  name: string
}

export type District = {
  id: number
  name: string
  city: number
}

export type Specialty = {
  id: number
  name: string
}

export type HospitalType = {
  id: number
  name: string
  city: number
  district: number
  city_name: string
  district_name: string
}

export type Doctor = {
  id: number
  user: number
  full_name: string
  specialty: number
  specialty_name: string
  hospital: number
  hospital_name: string
  room_no: string
  busy_slots?: string[]
}

export type Appointment = {
  id: number
  patient?: number
  doctor: number
  hospital: number
  appointment_date: string
  appointment_time: string
  status: string
  notes: string
  patient_name?: string
  doctor_name?: string
  hospital_name?: string
}
