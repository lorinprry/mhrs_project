from rest_framework import serializers
from django.contrib.auth import authenticate
from users.models import User
from patients.models import Patient
from doctors.models import Doctor


class PatientRegisterSerializer(serializers.ModelSerializer):
    tc_no = serializers.CharField(max_length=11, write_only=True)
    phone = serializers.CharField(max_length=15, write_only=True, required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = [
            'password',
            'first_name',
            'last_name',
            'email',
            'tc_no',
            'phone',
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
        }

    def validate_tc_no(self, value):
        if not value.isdigit() or len(value) != 11:
            raise serializers.ValidationError("T.C. Kimlik No 11 haneli sayısal bir değer olmalıdır.")
        return value

    def create(self, validated_data):
        tc_no = validated_data.pop('tc_no')
        phone = validated_data.pop('phone', '')
        email = validated_data.get('email', '')

        if User.objects.filter(username=tc_no).exists():
            raise serializers.ValidationError({"tc_no": "Bu T.C. Kimlik No ile kayıt zaten var."})

        user = User.objects.create_user(
            username=tc_no,
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            email=email,
            role='patient'
        )

        Patient.objects.create(
            user=user,
            tc_no=tc_no,
            phone=phone
        )

        return user


class DoctorRegisterSerializer(serializers.ModelSerializer):
    specialty = serializers.IntegerField(write_only=True)
    hospital = serializers.IntegerField(write_only=True)
    room_no = serializers.CharField(max_length=20, write_only=True)

    class Meta:
        model = User
        fields = [
            'username',
            'password',
            'first_name',
            'last_name',
            'email',
            'specialty',
            'hospital',
            'room_no'
        ]
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        specialty_id = validated_data.pop('specialty')
        hospital_id = validated_data.pop('hospital')
        room_no = validated_data.pop('room_no')

        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            email=validated_data.get('email', ''),
            role='doctor'
        )

        Doctor.objects.create(
            user=user,
            specialty_id=specialty_id,
            hospital_id=hospital_id,
            room_no=room_no
        )

        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        user = authenticate(username=username, password=password)

        if not user:
            raise serializers.ValidationError("Kullanıcı adı veya şifre hatalı.")

        attrs['user'] = user
        return attrs
class UserMeSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    patient_id = serializers.SerializerMethodField()
    doctor_id = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'full_name',
            'role',
            'patient_id',
            'doctor_id',
        ]

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()

    def get_patient_id(self, obj):
        if hasattr(obj, 'patient_profile'):
            return obj.patient_profile.id
        return None

    def get_doctor_id(self, obj):
        if hasattr(obj, 'doctor_profile'):
            return obj.doctor_profile.id
        return None    