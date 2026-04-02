from django.core.management.base import BaseCommand
from django.db import transaction
from users.models import User
from patients.models import Patient
import random
from datetime import date


class Command(BaseCommand):
    help = "Seed many patients"

    def handle(self, *args, **kwargs):
        first_names = [
            "Lorin", "Ayse", "Fatma", "Zeynep", "Elif", "Merve", "Buse",
            "Seda", "Esra", "Hande", "Nazli", "Deniz", "Canan", "Derya",
            "Gizem", "Pelin", "Selin", "Emine", "Yasemin", "Ceren"
        ]

        last_names = [
            "Yilmaz", "Kaya", "Demir", "Sahin", "Celik", "Arslan",
            "Aydin", "Ozdemir", "Kilic", "Aslan", "Polat", "Kurt",
            "Koc", "Ersoy", "Tas", "Bulut", "Acar", "Yildiz"
        ]

        start_no = User.objects.filter(username__startswith="hasta").count() + 1

        users_to_create = []
        patient_plan = []

        for i in range(start_no, start_no + 500):
            username = f"hasta{i}"

            users_to_create.append(
                User(
                    username=username,
                    first_name=random.choice(first_names),
                    last_name=random.choice(last_names),
                    email=f"{username}@example.com",
                    role="patient",
                )
            )

            patient_plan.append({
                "tc_no": str(10000000000 + i),
                "phone": f"0555{random.randint(1000000, 9999999)}",
                "birth_date": date(
                    random.randint(1970, 2005),
                    random.randint(1, 12),
                    random.randint(1, 28)
                )
            })

        with transaction.atomic():
            created_users = []
            for user in users_to_create:
                user.set_password("123456Aa!")
                created_users.append(user)

            User.objects.bulk_create(created_users)

            saved_users = list(
                User.objects.filter(username__startswith="hasta").order_by("-id")[:len(patient_plan)]
            )
            saved_users.reverse()

            patients_to_create = []
            for user, plan in zip(saved_users, patient_plan):
                patients_to_create.append(
                    Patient(
                        user=user,
                        tc_no=plan["tc_no"],
                        phone=plan["phone"],
                        birth_date=plan["birth_date"],
                    )
                )

            Patient.objects.bulk_create(patients_to_create)

        self.stdout.write(self.style.SUCCESS(f"{len(patient_plan)} hasta eklendi."))