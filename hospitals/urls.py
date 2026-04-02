from django.urls import path
from .views import CityListAPIView, DistrictListAPIView, HospitalListAPIView, SpecialtyListAPIView

urlpatterns = [
    path('cities/', CityListAPIView.as_view(), name='city-list'),
    path('districts/', DistrictListAPIView.as_view(), name='district-list'),
    path('hospitals/', HospitalListAPIView.as_view(), name='hospital-list'),
    path('specialties/', SpecialtyListAPIView.as_view(), name='specialty-list'),
]