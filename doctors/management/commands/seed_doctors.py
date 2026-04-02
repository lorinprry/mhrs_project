from django.core.management.base import BaseCommand
from django.db import transaction
from users.models import User
from doctors.models import Doctor
from hospitals.models import Hospital, Specialty
import random


class Command(BaseCommand):
    help = "Seed many doctors into hospitals"

    def handle(self, *args, **kwargs):
        first_names = [
            "Ahmet", "Mehmet", "Ayse", "Fatma", "Zeynep", "Ali", "Veli",
            "Can", "Deniz", "Ece", "Merve", "Selin", "Burak", "Emre",
            "Hakan", "Cem", "Elif", "Buse", "Seda", "Yusuf",
            "Murat", "Esra", "Gizem", "Omer", "Derya", "Nazli",
            "Tolga", "Pelin", "Serkan", "Hande"
        ]

        last_names = [
            "Yilmaz", "Kaya", "Demir", "Sahin", "Celik", "Arslan",
            "Aydin", "Ozdemir", "Kilic", "Aslan", "Polat", "Kurt",
            "Koc", "Ersoy", "Tas", "Bulut", "Acar", "Yildiz",
            "Gunes", "Bozkurt", "Karaca", "Eren", "Tekin", "Avci"
        ]

        hospitals = list(Hospital.objects.all())
        specialties = list(Specialty.objects.all())

        if not hospitals:
            self.stdout.write(self.style.ERROR("Hastane verisi yok. Once seed_mhrs calistir."))
            return

        if not specialties:
            self.stdout.write(self.style.ERROR("Uzmanlik verisi yok. Once seed_mhrs calistir."))
            return

        doctor_number = User.objects.filter(username__startswith="doctor").count() + 1
        created_count = 0

        users_to_create = []
        doctor_plan = []

        # Her hastaneye 8 doktor
        for hospital in hospitals:
            for _ in range(8):
                first_name = random.choice(first_names)
                last_name = random.choice(last_names)
                specialty = random.choice(specialties)

                username = f"doctor{doctor_number}"
                while User.objects.filter(username=username).exists():
                    doctor_number += 1
                    username = f"doctor{doctor_number}"

                users_to_create.append(
                    User(
                        username=username,
                        first_name=first_name,
                        last_name=last_name,
                        email=f"{username}@example.com",
                        role="doctor",
                    )
                )

                doctor_plan.append({
                    "hospital": hospital,
                    "specialty": specialty,
                    "room_no": str(random.randint(100, 499)),
                })

                doctor_number += 1

        with transaction.atomic():
            created_users = []
            for user in users_to_create:
                user.set_password("123456Aa!")
                created_users.append(user)

            User.objects.bulk_create(created_users)

            saved_users = list(
                User.objects.filter(username__startswith="doctor").order_by("-id")[:len(doctor_plan)]
            )
            saved_users.reverse()

            doctors_to_create = []
            for user, plan in zip(saved_users, doctor_plan):
                doctors_to_create.append(
                    Doctor(
                        user=user,
                        specialty=plan["specialty"],
                        hospital=plan["hospital"],
                        room_no=plan["room_no"],
                    )
                )

            Doctor.objects.bulk_create(doctors_to_create)
            created_count = len(doctors_to_create)

        self.stdout.write(self.style.SUCCESS(f"{created_count} doktor eklendi."))
