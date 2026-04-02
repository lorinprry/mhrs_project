import os
import django
import sys

# Setting up django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from users.models import User

def main():
    try:
        qs = User.objects.all()
        print('Total Users:', qs.count())
        for u in qs:
            print(f'User: {u.username}, Role: {u.role}')

        # Create user 11111111111 if not exist
        u, created = User.objects.get_or_create(username='11111111111')
        u.set_password('123456')
        u.role = 'patient'
        u.first_name = 'Ahmet'
        u.last_name = 'Yılmaz'
        u.save()
        
        print(f"User 11111111111 {'created' if created else 'updated'}. Password: 123456")

        u2, created2 = User.objects.get_or_create(username='admin')
        u2.set_password('admin123')
        u2.role = 'doctor'
        u2.first_name = 'Dr. Admin'
        u2.save()
        print(f"Doctor admin {'created' if created else 'updated'}. Password: admin123")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    main()
