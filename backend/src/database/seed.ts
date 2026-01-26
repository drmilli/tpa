import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create or update Super Admin user
  const superAdminEmail = 'admin@thepeoplesaffairs.com';
  const superAdminPassword = 'admin123';
  const hashedPassword = await bcrypt.hash(superAdminPassword, 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: superAdminEmail },
    update: {
      role: Role.SUPER_ADMIN,
      firstName: 'Super',
      lastName: 'Admin',
    },
    create: {
      email: superAdminEmail,
      password: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      role: Role.SUPER_ADMIN,
      isActive: true,
    },
  });

  console.log(`Super Admin created/updated: ${superAdmin.email} (Role: ${superAdmin.role})`);

  // Create Nigerian States
  const states = [
    { name: 'Abia', code: 'AB', region: 'South East' },
    { name: 'Adamawa', code: 'AD', region: 'North East' },
    { name: 'Akwa Ibom', code: 'AK', region: 'South South' },
    { name: 'Anambra', code: 'AN', region: 'South East' },
    { name: 'Bauchi', code: 'BA', region: 'North East' },
    { name: 'Bayelsa', code: 'BY', region: 'South South' },
    { name: 'Benue', code: 'BE', region: 'North Central' },
    { name: 'Borno', code: 'BO', region: 'North East' },
    { name: 'Cross River', code: 'CR', region: 'South South' },
    { name: 'Delta', code: 'DE', region: 'South South' },
    { name: 'Ebonyi', code: 'EB', region: 'South East' },
    { name: 'Edo', code: 'ED', region: 'South South' },
    { name: 'Ekiti', code: 'EK', region: 'South West' },
    { name: 'Enugu', code: 'EN', region: 'South East' },
    { name: 'FCT Abuja', code: 'FC', region: 'North Central' },
    { name: 'Gombe', code: 'GO', region: 'North East' },
    { name: 'Imo', code: 'IM', region: 'South East' },
    { name: 'Jigawa', code: 'JI', region: 'North West' },
    { name: 'Kaduna', code: 'KD', region: 'North West' },
    { name: 'Kano', code: 'KN', region: 'North West' },
    { name: 'Katsina', code: 'KT', region: 'North West' },
    { name: 'Kebbi', code: 'KE', region: 'North West' },
    { name: 'Kogi', code: 'KO', region: 'North Central' },
    { name: 'Kwara', code: 'KW', region: 'North Central' },
    { name: 'Lagos', code: 'LA', region: 'South West' },
    { name: 'Nasarawa', code: 'NA', region: 'North Central' },
    { name: 'Niger', code: 'NI', region: 'North Central' },
    { name: 'Ogun', code: 'OG', region: 'South West' },
    { name: 'Ondo', code: 'ON', region: 'South West' },
    { name: 'Osun', code: 'OS', region: 'South West' },
    { name: 'Oyo', code: 'OY', region: 'South West' },
    { name: 'Plateau', code: 'PL', region: 'North Central' },
    { name: 'Rivers', code: 'RI', region: 'South South' },
    { name: 'Sokoto', code: 'SO', region: 'North West' },
    { name: 'Taraba', code: 'TA', region: 'North East' },
    { name: 'Yobe', code: 'YO', region: 'North East' },
    { name: 'Zamfara', code: 'ZA', region: 'North West' },
  ];

  for (const state of states) {
    await prisma.state.upsert({
      where: { code: state.code },
      update: { name: state.name, region: state.region },
      create: state,
    });
  }
  console.log(`Created/updated ${states.length} states`);

  // Create Offices
  const offices = [
    { name: 'President of Nigeria', type: 'PRESIDENT', level: 'Federal', description: 'Head of State and Government' },
    { name: 'Vice President of Nigeria', type: 'VICE_PRESIDENT', level: 'Federal', description: 'Deputy Head of State' },
    { name: 'Governor', type: 'GOVERNOR', level: 'State', description: 'State Chief Executive' },
    { name: 'Deputy Governor', type: 'DEPUTY_GOVERNOR', level: 'State', description: 'Deputy State Chief Executive' },
    { name: 'Senator', type: 'SENATOR', level: 'Federal', description: 'Member of the Senate' },
    { name: 'House of Representatives Member', type: 'HOUSE_OF_REPS', level: 'Federal', description: 'Member of the House of Representatives' },
    { name: 'State House of Assembly Member', type: 'STATE_ASSEMBLY', level: 'State', description: 'State Legislator' },
    { name: 'Minister', type: 'MINISTER', level: 'Federal', description: 'Federal Cabinet Member' },
    { name: 'Local Government Chairman', type: 'LG_CHAIRMAN', level: 'Local', description: 'LGA Chief Executive' },
  ];

  for (const office of offices) {
    await prisma.office.upsert({
      where: { name: office.name },
      update: { type: office.type as any, level: office.level, description: office.description },
      create: { name: office.name, type: office.type as any, level: office.level, description: office.description },
    });
  }
  console.log(`Created/updated ${offices.length} offices`);

  console.log('Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
