from rest_framework import serializers
from .models import Doctor


class DoctorSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    specialty_name = serializers.CharField(source='specialty.name', read_only=True)
    hospital_name = serializers.CharField(source='hospital.name', read_only=True)

    class Meta:
        model = Doctor
        fields = [
            'id',
            'user',
            'full_name',
            'specialty',
            'specialty_name',
            'hospital',
            'hospital_name',
            'room_no',
        ]

    def get_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"