import os

files = [
    r'src\pages\PatientDashboard.tsx',
    r'src\pages\DoctorDashboard.tsx',
    r'src\pages\AppointmentsPage.tsx',
    r'src\pages\BookingWizard.tsx'
]

for f in files:
    if os.path.exists(f):
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # Replace escaped backticks
        content = content.replace(r'\`', '`')
        # Replace escaped dollar signs inside template literals
        content = content.replace(r'\${', '${')
        
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f'Fixed {f}')
