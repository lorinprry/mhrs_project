from rest_framework import generics
from .models import Appointment
from .serializers import AppointmentSerializer


class AppointmentListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = AppointmentSerializer

    def get_queryset(self):
        queryset = Appointment.objects.select_related(
            'patient__user', 'doctor__user', 'hospital'
        ).all().order_by('-appointment_date', '-appointment_time')

        patient_id = self.request.query_params.get('patient')
        doctor_id = self.request.query_params.get('doctor')
        hospital_id = self.request.query_params.get('hospital')
        appointment_date = self.request.query_params.get('date')

        if patient_id:
            queryset = queryset.filter(patient_id=patient_id)

        if doctor_id:
            queryset = queryset.filter(doctor_id=doctor_id)

        if hospital_id:
            queryset = queryset.filter(hospital_id=hospital_id)

        if appointment_date:
            queryset = queryset.filter(appointment_date=appointment_date)

        return queryset


class AppointmentDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer