from django.urls import path
from .views import DoctorListAPIView

urlpatterns = [
    path('', DoctorListAPIView.as_view(), name='doctor-list'),
]