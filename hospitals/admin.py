from django.contrib import admin
from .models import City, District, Hospital, Specialty

admin.site.register(City)
admin.site.register(District)
admin.site.register(Hospital)
admin.site.register(Specialty)
