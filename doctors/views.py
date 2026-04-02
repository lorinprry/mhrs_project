from rest_framework import generics
from .models import Doctor
from .serializers import DoctorSerializer


class DoctorListAPIView(generics.ListAPIView):
    serializer_class = DoctorSerializer

    def get_queryset(self):
        queryset = Doctor.objects.select_related(
            'user', 'specialty', 'hospital'
        ).all().order_by('id')

        hospital_id = self.request.query_params.get('hospital')
        specialty_id = self.request.query_params.get('specialty')
        name = self.request.query_params.get('name')

        if hospital_id:
            queryset = queryset.filter(hospital_id=hospital_id)

        if specialty_id:
            queryset = queryset.filter(specialty_id=specialty_id)

        if name:
            queryset = queryset.filter(
                user__first_name__icontains=name
            ) | queryset.filter(
                user__last_name__icontains=name
            )

        return queryset
