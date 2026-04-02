from django.db import models
from users.models import User


class Doctor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='doctor_profile')
    specialty = models.ForeignKey('hospitals.Specialty', on_delete=models.SET_NULL, null=True)
    hospital = models.ForeignKey('hospitals.Hospital', on_delete=models.SET_NULL, null=True)
    room_no = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return f"Dr. {self.user.first_name} {self.user.last_name}"
