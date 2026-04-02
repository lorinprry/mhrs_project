from rest_framework import generics
from .models import City, District, Hospital, Specialty
from .serializers import CitySerializer, DistrictSerializer, HospitalSerializer, SpecialtySerializer


class CityListAPIView(generics.ListAPIView):
    queryset = City.objects.all().order_by('name')
    serializer_class = CitySerializer


class DistrictListAPIView(generics.ListAPIView):
    serializer_class = DistrictSerializer

    def get_queryset(self):
        city_id = self.request.query_params.get('city')
        queryset = District.objects.all().order_by('name')

        if city_id:
            queryset = queryset.filter(city_id=city_id)

        return queryset


class HospitalListAPIView(generics.ListAPIView):
    serializer_class = HospitalSerializer

    def get_queryset(self):
        queryset = Hospital.objects.all().order_by('name')

        city_id = self.request.query_params.get('city')
        district_id = self.request.query_params.get('district')

        if city_id:
            queryset = queryset.filter(city_id=city_id)

        if district_id:
            queryset = queryset.filter(district_id=district_id)

        return queryset


class SpecialtyListAPIView(generics.ListAPIView):
    queryset = Specialty.objects.all().order_by('name')
    serializer_class = SpecialtySerializer
