from django.db import models


class City(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class District(models.Model):
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='districts')
    name = models.CharField(max_length=100)

    class Meta:
        unique_together = ('city', 'name')

    def __str__(self):
        return f"{self.name} / {self.city.name}"


class Specialty(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Hospital(models.Model):
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='hospitals')
    district = models.ForeignKey(District, on_delete=models.CASCADE, related_name='hospitals')
    name = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.name} - {self.district.name}/{self.city.name}"
