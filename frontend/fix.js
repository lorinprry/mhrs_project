const fs = require('fs');
const path = require('path');

const files = [
  'src/pages/PatientDashboard.tsx',
  'src/pages/DoctorDashboard.tsx',
  'src/pages/AppointmentsPage.tsx',
  'src/pages/BookingWizard.tsx'
];

files.forEach(f => {
  const p = path.join(__dirname, f);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    content = content.replace(/\\`/g, '`');
    content = content.replace(/\\\${/g, '${');
    fs.writeFileSync(p, content, 'utf8');
    console.log('Fixed', f);
  }
});
