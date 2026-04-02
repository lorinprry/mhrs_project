from django.core.management.base import BaseCommand
from hospitals.models import City, District, Hospital, Specialty
import random


class Command(BaseCommand):
    help = 'Seed MHRS data (cities, districts, hospitals, specialties)'

    def handle(self, *args, **kwargs):

        self.stdout.write("Veriler temizleniyor...")
        City.objects.all().delete()
        District.objects.all().delete()
        Hospital.objects.all().delete()
        Specialty.objects.all().delete()

        # 81 il listesi
        cities = [
            "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Aksaray",
            "Amasya", "Ankara", "Antalya", "Ardahan", "Artvin",
            "Aydın", "Balıkesir", "Bartın", "Batman", "Bayburt",
            "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur",
            "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli",
            "Diyarbakır", "Düzce", "Edirne", "Elazığ", "Erzincan",
            "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane",
            "Hakkari", "Hatay", "Iğdır", "Isparta", "İstanbul",
            "İzmir", "Kahramanmaraş", "Karabük", "Karaman", "Kars",
            "Kastamonu", "Kayseri", "Kırıkkale", "Kırklareli", "Kırşehir",
            "Kilis", "Kocaeli", "Konya", "Kütahya", "Malatya",
            "Manisa", "Mardin", "Mersin", "Muğla", "Muş",
            "Nevşehir", "Niğde", "Ordu", "Osmaniye", "Rize",
            "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas",
            "Şanlıurfa", "Şırnak", "Tekirdağ", "Tokat", "Trabzon",
            "Tunceli", "Uşak", "Van", "Yalova", "Yozgat", "Zonguldak"
        ]

        # uzmanlıklar
        specialties = [
            "Kardiyoloji",
            "Dahiliye",
            "Göz Hastalıkları",
            "Ortopedi",
            "Dermatoloji",
            "Nöroloji",
            "Kulak Burun Boğaz",
            "Psikiyatri"
        ]

        specialty_objs = []
        for s in specialties:
            specialty_objs.append(Specialty.objects.create(name=s))

        self.stdout.write("Uzmanlıklar eklendi.")

        for city_name in cities:
            city = City.objects.create(name=city_name)

            # her ile 3 ilçe
            for i in range(1, 4):
                district = District.objects.create(
                    name=f"{city_name} İlçe {i}",
                    city=city
                )

                # her ilçeye 2 hastane
                for j in range(1, 3):
                    Hospital.objects.create(
                        name=f"{city_name} Devlet Hastanesi {j}",
                        city=city,
                        district=district
                    )

        self.stdout.write(self.style.SUCCESS("81 il + ilçeler + hastaneler eklendi!"))