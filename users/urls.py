from django.urls import path
from .views import PatientRegisterAPIView, DoctorRegisterAPIView, LoginAPIView, MeAPIView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/patient/', PatientRegisterAPIView.as_view(), name='register-patient'),
    path('register/doctor/', DoctorRegisterAPIView.as_view(), name='register-doctor'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('me/', MeAPIView.as_view(), name='me'),
]