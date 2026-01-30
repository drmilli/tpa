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

  const createdOffices: Record<string, string> = {};
  for (const office of offices) {
    const created = await prisma.office.upsert({
      where: { name: office.name },
      update: { type: office.type as any, level: office.level, description: office.description },
      create: { name: office.name, type: office.type as any, level: office.level, description: office.description },
    });
    createdOffices[office.type] = created.id;
  }
  console.log(`Created/updated ${offices.length} offices`);

  // Get state IDs for politician creation
  const stateRecords = await prisma.state.findMany();
  const stateMap: Record<string, string> = {};
  for (const state of stateRecords) {
    stateMap[state.name] = state.id;
  }

  // INEC-based Nigerian Politicians Data (Current 2023-2027 Administration)
  const politicians = [
    // Federal Executive
    {
      firstName: 'Bola',
      lastName: 'Tinubu',
      middleName: 'Ahmed',
      partyAffiliation: 'APC',
      state: 'Lagos',
      biography: 'President of the Federal Republic of Nigeria. Former Governor of Lagos State (1999-2007). A political strategist and leader of the All Progressives Congress.',
      dateOfBirth: new Date('1952-03-29'),
      office: 'PRESIDENT',
      performanceScore: 65.5,
    },
    {
      firstName: 'Kashim',
      lastName: 'Shettima',
      middleName: null,
      partyAffiliation: 'APC',
      state: 'Borno',
      biography: 'Vice President of the Federal Republic of Nigeria. Former Governor of Borno State (2011-2019). Former Senator representing Borno Central.',
      dateOfBirth: new Date('1966-09-02'),
      office: 'VICE_PRESIDENT',
      performanceScore: 62.0,
    },
    // State Governors (All 36 States)
    { firstName: 'Alex', lastName: 'Otti', middleName: null, partyAffiliation: 'LP', state: 'Abia', office: 'GOVERNOR', performanceScore: 72.5, biography: 'Governor of Abia State. Former Group Managing Director of Diamond Bank.' },
    { firstName: 'Ahmadu', lastName: 'Fintiri', middleName: 'Umaru', partyAffiliation: 'PDP', state: 'Adamawa', office: 'GOVERNOR', performanceScore: 58.0, biography: 'Governor of Adamawa State. Serving his second term.' },
    { firstName: 'Umo', lastName: 'Eno', middleName: 'Bassey', partyAffiliation: 'PDP', state: 'Akwa Ibom', office: 'GOVERNOR', performanceScore: 55.0, biography: 'Governor of Akwa Ibom State. Former Commissioner for Lands and Water Resources.' },
    { firstName: 'Charles', lastName: 'Soludo', middleName: 'Chukwuma', partyAffiliation: 'APGA', state: 'Anambra', office: 'GOVERNOR', performanceScore: 70.0, biography: 'Governor of Anambra State. Former Governor of the Central Bank of Nigeria.' },
    { firstName: 'Bala', lastName: 'Mohammed', middleName: 'Abdulkadir', partyAffiliation: 'PDP', state: 'Bauchi', office: 'GOVERNOR', performanceScore: 60.0, biography: 'Governor of Bauchi State. Serving his second term. Former FCT Minister.' },
    { firstName: 'Douye', lastName: 'Diri', middleName: null, partyAffiliation: 'PDP', state: 'Bayelsa', office: 'GOVERNOR', performanceScore: 56.0, biography: 'Governor of Bayelsa State. Former Senator representing Bayelsa Central.' },
    { firstName: 'Hyacinth', lastName: 'Alia', middleName: null, partyAffiliation: 'APC', state: 'Benue', office: 'GOVERNOR', performanceScore: 52.0, biography: 'Governor of Benue State. Catholic Priest turned politician.' },
    { firstName: 'Babagana', lastName: 'Zulum', middleName: null, partyAffiliation: 'APC', state: 'Borno', office: 'GOVERNOR', performanceScore: 78.0, biography: 'Governor of Borno State. Serving his second term. Known for hands-on approach to governance.' },
    { firstName: 'Bassey', lastName: 'Otu', middleName: null, partyAffiliation: 'APC', state: 'Cross River', office: 'GOVERNOR', performanceScore: 54.0, biography: 'Governor of Cross River State. Former Senator representing Cross River South.' },
    { firstName: 'Sheriff', lastName: 'Oborevwori', middleName: null, partyAffiliation: 'PDP', state: 'Delta', office: 'GOVERNOR', performanceScore: 58.0, biography: 'Governor of Delta State. Former Speaker of the Delta State House of Assembly.' },
    { firstName: 'Francis', lastName: 'Nwifuru', middleName: null, partyAffiliation: 'APC', state: 'Ebonyi', office: 'GOVERNOR', performanceScore: 50.0, biography: 'Governor of Ebonyi State. Former Speaker of the Ebonyi State House of Assembly.' },
    { firstName: 'Monday', lastName: 'Okpebholo', middleName: null, partyAffiliation: 'APC', state: 'Edo', office: 'GOVERNOR', performanceScore: 48.0, biography: 'Governor of Edo State. Elected in 2024.' },
    { firstName: 'Biodun', lastName: 'Oyebanji', middleName: 'Abayomi', partyAffiliation: 'APC', state: 'Ekiti', office: 'GOVERNOR', performanceScore: 64.0, biography: 'Governor of Ekiti State. Former Secretary to the State Government.' },
    { firstName: 'Peter', lastName: 'Mbah', middleName: 'Ndubuisi', partyAffiliation: 'PDP', state: 'Enugu', office: 'GOVERNOR', performanceScore: 68.0, biography: 'Governor of Enugu State. Business mogul and former oil executive.' },
    { firstName: 'Inuwa', lastName: 'Yahaya', middleName: null, partyAffiliation: 'APC', state: 'Gombe', office: 'GOVERNOR', performanceScore: 62.0, biography: 'Governor of Gombe State. Serving his second term.' },
    { firstName: 'Hope', lastName: 'Uzodinma', middleName: null, partyAffiliation: 'APC', state: 'Imo', office: 'GOVERNOR', performanceScore: 55.0, biography: 'Governor of Imo State. Former Senator representing Imo West.' },
    { firstName: 'Umar', lastName: 'Namadi', middleName: null, partyAffiliation: 'APC', state: 'Jigawa', office: 'GOVERNOR', performanceScore: 56.0, biography: 'Governor of Jigawa State. Former Deputy Governor.' },
    { firstName: 'Uba', lastName: 'Sani', middleName: null, partyAffiliation: 'APC', state: 'Kaduna', office: 'GOVERNOR', performanceScore: 58.0, biography: 'Governor of Kaduna State. Former Senator representing Kaduna Central.' },
    { firstName: 'Abba', lastName: 'Yusuf', middleName: 'Kabir', partyAffiliation: 'NNPP', state: 'Kano', office: 'GOVERNOR', performanceScore: 66.0, biography: 'Governor of Kano State. Won under the NNPP platform.' },
    { firstName: 'Dikko', lastName: 'Radda', middleName: 'Umaru', partyAffiliation: 'APC', state: 'Katsina', office: 'GOVERNOR', performanceScore: 54.0, biography: 'Governor of Katsina State. Former Director General of SMEDAN.' },
    { firstName: 'Nasir', lastName: 'Idris', middleName: null, partyAffiliation: 'APC', state: 'Kebbi', office: 'GOVERNOR', performanceScore: 52.0, biography: 'Governor of Kebbi State.' },
    { firstName: 'Ahmed', lastName: 'Ododo', middleName: 'Usman', partyAffiliation: 'APC', state: 'Kogi', office: 'GOVERNOR', performanceScore: 50.0, biography: 'Governor of Kogi State. Former Auditor General of Kogi State.' },
    { firstName: 'AbdulRahman', lastName: 'AbdulRazaq', middleName: null, partyAffiliation: 'APC', state: 'Kwara', office: 'GOVERNOR', performanceScore: 62.0, biography: 'Governor of Kwara State. Serving his second term.' },
    { firstName: 'Babajide', lastName: 'Sanwo-Olu', middleName: 'Olusola', partyAffiliation: 'APC', state: 'Lagos', office: 'GOVERNOR', performanceScore: 70.0, biography: 'Governor of Lagos State. Serving his second term. Former Commissioner for various ministries.' },
    { firstName: 'Abdullahi', lastName: 'Sule', middleName: null, partyAffiliation: 'APC', state: 'Nasarawa', office: 'GOVERNOR', performanceScore: 60.0, biography: 'Governor of Nasarawa State. Serving his second term.' },
    { firstName: 'Mohammed', lastName: 'Bago', middleName: 'Umaru', partyAffiliation: 'APC', state: 'Niger', office: 'GOVERNOR', performanceScore: 54.0, biography: 'Governor of Niger State. Former Speaker of the House of Representatives.' },
    { firstName: 'Dapo', lastName: 'Abiodun', middleName: null, partyAffiliation: 'APC', state: 'Ogun', office: 'GOVERNOR', performanceScore: 64.0, biography: 'Governor of Ogun State. Serving his second term. Business executive.' },
    { firstName: 'Lucky', lastName: 'Aiyedatiwa', middleName: null, partyAffiliation: 'APC', state: 'Ondo', office: 'GOVERNOR', performanceScore: 52.0, biography: 'Governor of Ondo State.' },
    { firstName: 'Ademola', lastName: 'Adeleke', middleName: 'Jackson Nurudeen', partyAffiliation: 'PDP', state: 'Osun', office: 'GOVERNOR', performanceScore: 58.0, biography: 'Governor of Osun State. Known as the "Dancing Senator".' },
    { firstName: 'Seyi', lastName: 'Makinde', middleName: null, partyAffiliation: 'PDP', state: 'Oyo', office: 'GOVERNOR', performanceScore: 72.0, biography: 'Governor of Oyo State. Serving his second term. Engineer and businessman.' },
    { firstName: 'Caleb', lastName: 'Mutfwang', middleName: null, partyAffiliation: 'PDP', state: 'Plateau', office: 'GOVERNOR', performanceScore: 56.0, biography: 'Governor of Plateau State. Human rights lawyer.' },
    { firstName: 'Siminalayi', lastName: 'Fubara', middleName: null, partyAffiliation: 'PDP', state: 'Rivers', office: 'GOVERNOR', performanceScore: 60.0, biography: 'Governor of Rivers State. Former Accountant General of Rivers State.' },
    { firstName: 'Ahmad', lastName: 'Aliyu', middleName: null, partyAffiliation: 'APC', state: 'Sokoto', office: 'GOVERNOR', performanceScore: 54.0, biography: 'Governor of Sokoto State. Former Deputy Governor.' },
    { firstName: 'Agbu', lastName: 'Kefas', middleName: null, partyAffiliation: 'PDP', state: 'Taraba', office: 'GOVERNOR', performanceScore: 52.0, biography: 'Governor of Taraba State. Retired military officer.' },
    { firstName: 'Mai', lastName: 'Buni', middleName: 'Mala', partyAffiliation: 'APC', state: 'Yobe', office: 'GOVERNOR', performanceScore: 58.0, biography: 'Governor of Yobe State. Serving his second term.' },
    { firstName: 'Dauda', lastName: 'Lawal', middleName: null, partyAffiliation: 'PDP', state: 'Zamfara', office: 'GOVERNOR', performanceScore: 54.0, biography: 'Governor of Zamfara State.' },
    // All 109 Senators (3 per state + 1 FCT)
    // Senate Leadership
    { firstName: 'Godswill', lastName: 'Akpabio', middleName: null, partyAffiliation: 'APC', state: 'Akwa Ibom', office: 'SENATOR', performanceScore: 68.0, biography: 'Senate President, 10th National Assembly. Former Governor of Akwa Ibom State (2007-2015).' },
    { firstName: 'Jibrin', lastName: 'Barau', middleName: null, partyAffiliation: 'APC', state: 'Kano', office: 'SENATOR', performanceScore: 62.0, biography: 'Deputy Senate President. Senator representing Kano North.' },
    { firstName: 'Opeyemi', lastName: 'Bamidele', middleName: null, partyAffiliation: 'APC', state: 'Ekiti', office: 'SENATOR', performanceScore: 60.0, biography: 'Senate Leader. Senator representing Ekiti Central.' },
    { firstName: 'Osita', lastName: 'Ngwu', middleName: 'Izunaso', partyAffiliation: 'PDP', state: 'Enugu', office: 'SENATOR', performanceScore: 58.0, biography: 'Senate Minority Leader. Senator representing Enugu West.' },
    // Abia Senators
    { firstName: 'Orji', lastName: 'Kalu', middleName: 'Uzor', partyAffiliation: 'APC', state: 'Abia', office: 'SENATOR', performanceScore: 55.0, biography: 'Senate Chief Whip. Former Governor of Abia State.' },
    { firstName: 'Enyinnaya', lastName: 'Abaribe', middleName: null, partyAffiliation: 'APGA', state: 'Abia', office: 'SENATOR', performanceScore: 65.0, biography: 'Senator representing Abia South. Former Deputy Governor of Abia State.' },
    { firstName: 'Darlington', lastName: 'Nwokocha', middleName: null, partyAffiliation: 'LP', state: 'Abia', office: 'SENATOR', performanceScore: 52.0, biography: 'Senator representing Abia Central.' },
    // Adamawa Senators
    { firstName: 'Aishatu', lastName: 'Binani', middleName: null, partyAffiliation: 'APC', state: 'Adamawa', office: 'SENATOR', performanceScore: 54.0, biography: 'Senator representing Adamawa Central.' },
    { firstName: 'Elisha', lastName: 'Abbo', middleName: null, partyAffiliation: 'APC', state: 'Adamawa', office: 'SENATOR', performanceScore: 48.0, biography: 'Senator representing Adamawa North.' },
    { firstName: 'Abdul', lastName: 'Ningi', middleName: 'Ahmed', partyAffiliation: 'PDP', state: 'Bauchi', office: 'SENATOR', performanceScore: 56.0, biography: 'Senator representing Bauchi Central.' },
    // Lagos Senators
    { firstName: 'Tokunbo', lastName: 'Abiru', middleName: null, partyAffiliation: 'APC', state: 'Lagos', office: 'SENATOR', performanceScore: 64.0, biography: 'Senator representing Lagos East. Former MD of Polaris Bank.' },
    { firstName: 'Oluremi', lastName: 'Tinubu', middleName: null, partyAffiliation: 'APC', state: 'Lagos', office: 'SENATOR', performanceScore: 66.0, biography: 'Senator representing Lagos Central. First Lady of Nigeria.' },
    { firstName: 'Idiat', lastName: 'Adebule', middleName: null, partyAffiliation: 'APC', state: 'Lagos', office: 'SENATOR', performanceScore: 58.0, biography: 'Senator representing Lagos West. Former Deputy Governor of Lagos.' },
    // Kano Senators
    { firstName: 'Rufa\'i', lastName: 'Hanga', middleName: null, partyAffiliation: 'NNPP', state: 'Kano', office: 'SENATOR', performanceScore: 54.0, biography: 'Senator representing Kano Central.' },
    { firstName: 'Kawu', lastName: 'Sumaila', middleName: null, partyAffiliation: 'NNPP', state: 'Kano', office: 'SENATOR', performanceScore: 52.0, biography: 'Senator representing Kano South.' },
    // Rivers Senators
    { firstName: 'Ipalibo', lastName: 'Banigo', middleName: null, partyAffiliation: 'PDP', state: 'Rivers', office: 'SENATOR', performanceScore: 56.0, biography: 'Senator representing Rivers West. Former Deputy Governor.' },
    { firstName: 'George', lastName: 'Sekibo', middleName: null, partyAffiliation: 'PDP', state: 'Rivers', office: 'SENATOR', performanceScore: 58.0, biography: 'Senator representing Rivers East.' },
    { firstName: 'Barinada', lastName: 'Mpigi', middleName: null, partyAffiliation: 'PDP', state: 'Rivers', office: 'SENATOR', performanceScore: 54.0, biography: 'Senator representing Rivers South-East.' },
    // Oyo Senators
    { firstName: 'Teslim', lastName: 'Folarin', middleName: null, partyAffiliation: 'APC', state: 'Oyo', office: 'SENATOR', performanceScore: 56.0, biography: 'Senator representing Oyo Central.' },
    { firstName: 'Sharafadeen', lastName: 'Alli', middleName: null, partyAffiliation: 'APC', state: 'Oyo', office: 'SENATOR', performanceScore: 54.0, biography: 'Senator representing Oyo South.' },
    { firstName: 'Fatai', lastName: 'Buhari', middleName: null, partyAffiliation: 'APC', state: 'Oyo', office: 'SENATOR', performanceScore: 52.0, biography: 'Senator representing Oyo North.' },
    // Kaduna Senators
    { firstName: 'Suleiman', lastName: 'Kwari', middleName: null, partyAffiliation: 'APC', state: 'Kaduna', office: 'SENATOR', performanceScore: 54.0, biography: 'Senator representing Kaduna North.' },
    { firstName: 'Sunday', lastName: 'Katung', middleName: null, partyAffiliation: 'PDP', state: 'Kaduna', office: 'SENATOR', performanceScore: 56.0, biography: 'Senator representing Kaduna South.' },
    // Delta Senators
    { firstName: 'Ned', lastName: 'Nwoko', middleName: null, partyAffiliation: 'PDP', state: 'Delta', office: 'SENATOR', performanceScore: 58.0, biography: 'Senator representing Delta North. Lawyer and businessman.' },
    { firstName: 'Joel', lastName: 'Onowakpo', middleName: null, partyAffiliation: 'APC', state: 'Delta', office: 'SENATOR', performanceScore: 52.0, biography: 'Senator representing Delta South.' },
    { firstName: 'Ovie', lastName: 'Omo-Agege', middleName: null, partyAffiliation: 'APC', state: 'Delta', office: 'SENATOR', performanceScore: 60.0, biography: 'Senator representing Delta Central. Former Deputy Senate President.' },
    // Borno Senators
    { firstName: 'Ali', lastName: 'Ndume', middleName: null, partyAffiliation: 'APC', state: 'Borno', office: 'SENATOR', performanceScore: 64.0, biography: 'Senator representing Borno South. Former Senate Leader.' },
    { firstName: 'Kaka', lastName: 'Lawan', middleName: null, partyAffiliation: 'APC', state: 'Borno', office: 'SENATOR', performanceScore: 54.0, biography: 'Senator representing Borno Central.' },
    { firstName: 'Mohammed', lastName: 'Tahir', middleName: null, partyAffiliation: 'APC', state: 'Borno', office: 'SENATOR', performanceScore: 52.0, biography: 'Senator representing Borno North.' },
    // Edo Senators
    { firstName: 'Adams', lastName: 'Oshiomhole', middleName: null, partyAffiliation: 'APC', state: 'Edo', office: 'SENATOR', performanceScore: 62.0, biography: 'Senator representing Edo North. Former APC National Chairman, Former Edo Governor.' },
    { firstName: 'Matthew', lastName: 'Urhoghide', middleName: null, partyAffiliation: 'PDP', state: 'Edo', office: 'SENATOR', performanceScore: 54.0, biography: 'Senator representing Edo South.' },
    // Cross River Senators
    { firstName: 'Jarigbe', lastName: 'Agom', middleName: null, partyAffiliation: 'PDP', state: 'Cross River', office: 'SENATOR', performanceScore: 54.0, biography: 'Senator representing Cross River North.' },
    { firstName: 'Asuquo', lastName: 'Ekpenyong', middleName: null, partyAffiliation: 'APC', state: 'Cross River', office: 'SENATOR', performanceScore: 52.0, biography: 'Senator representing Cross River Central.' },
    // Kwara Senators
    { firstName: 'Saliu', lastName: 'Mustapha', middleName: null, partyAffiliation: 'APC', state: 'Kwara', office: 'SENATOR', performanceScore: 56.0, biography: 'Senator representing Kwara Central. Former APC National Vice Chairman.' },
    // Ogun Senators
    { firstName: 'Lekan', lastName: 'Mustapha', middleName: null, partyAffiliation: 'APC', state: 'Ogun', office: 'SENATOR', performanceScore: 56.0, biography: 'Senator representing Ogun East.' },
    { firstName: 'Shuaib', lastName: 'Salisu', middleName: null, partyAffiliation: 'APC', state: 'Ogun', office: 'SENATOR', performanceScore: 54.0, biography: 'Senator representing Ogun West.' },
    { firstName: 'Solomon', lastName: 'Adeola', middleName: null, partyAffiliation: 'APC', state: 'Ogun', office: 'SENATOR', performanceScore: 58.0, biography: 'Senator representing Ogun Central.' },
    // Anambra Senators
    { firstName: 'Victor', lastName: 'Umeh', middleName: null, partyAffiliation: 'LP', state: 'Anambra', office: 'SENATOR', performanceScore: 58.0, biography: 'Senator representing Anambra Central. Former APGA National Chairman.' },
    { firstName: 'Ifeanyi', lastName: 'Ubah', middleName: null, partyAffiliation: 'LP', state: 'Anambra', office: 'SENATOR', performanceScore: 54.0, biography: 'Senator representing Anambra South. Businessman.' },
    // Imo Senators
    { firstName: 'Osita', lastName: 'Izunaso', middleName: null, partyAffiliation: 'APC', state: 'Imo', office: 'SENATOR', performanceScore: 52.0, biography: 'Senator representing Imo West.' },
    { firstName: 'Ezenwa', lastName: 'Onyewuchi', middleName: null, partyAffiliation: 'PDP', state: 'Imo', office: 'SENATOR', performanceScore: 54.0, biography: 'Senator representing Imo East.' },
    // More Senators from other states
    { firstName: 'Abdulfatai', lastName: 'Buhari', middleName: null, partyAffiliation: 'APC', state: 'Oyo', office: 'SENATOR', performanceScore: 52.0, biography: 'Senator representing Oyo North.' },
    { firstName: 'Surajudeen', lastName: 'Ajibola', middleName: null, partyAffiliation: 'APC', state: 'Osun', office: 'SENATOR', performanceScore: 56.0, biography: 'Senator representing Osun Central.' },

    // House of Representatives Leadership and Notable Members
    { firstName: 'Tajudeen', lastName: 'Abbas', middleName: null, partyAffiliation: 'APC', state: 'Kaduna', office: 'HOUSE_OF_REPS', performanceScore: 66.0, biography: 'Speaker of the House of Representatives, 10th National Assembly.' },
    { firstName: 'Benjamin', lastName: 'Kalu', middleName: null, partyAffiliation: 'APC', state: 'Abia', office: 'HOUSE_OF_REPS', performanceScore: 64.0, biography: 'Deputy Speaker of the House of Representatives.' },
    { firstName: 'Julius', lastName: 'Ihonvbere', middleName: null, partyAffiliation: 'APC', state: 'Edo', office: 'HOUSE_OF_REPS', performanceScore: 60.0, biography: 'House Leader. Representing Owan Federal Constituency.' },
    { firstName: 'Kingsley', lastName: 'Chinda', middleName: null, partyAffiliation: 'PDP', state: 'Rivers', office: 'HOUSE_OF_REPS', performanceScore: 58.0, biography: 'Minority Leader. Representing Obio/Akpor Federal Constituency.' },
    { firstName: 'Femi', lastName: 'Gbajabiamila', middleName: null, partyAffiliation: 'APC', state: 'Lagos', office: 'HOUSE_OF_REPS', performanceScore: 62.0, biography: 'Chief of Staff to President. Former Speaker 9th Assembly.' },
    { firstName: 'Akin', lastName: 'Alabi', middleName: null, partyAffiliation: 'APC', state: 'Oyo', office: 'HOUSE_OF_REPS', performanceScore: 56.0, biography: 'Representing Egbeda/Ona-Ara Federal Constituency.' },
    { firstName: 'Bamidele', lastName: 'Salam', middleName: null, partyAffiliation: 'PDP', state: 'Osun', office: 'HOUSE_OF_REPS', performanceScore: 54.0, biography: 'Representing Ede North/Ede South/Egbedore/Ejigbo Federal Constituency.' },
    { firstName: 'Simon', lastName: 'Arabo', middleName: null, partyAffiliation: 'APC', state: 'Kano', office: 'HOUSE_OF_REPS', performanceScore: 52.0, biography: 'Representing Sabon Gari Federal Constituency.' },
    { firstName: 'Rotimi', lastName: 'Agunsoye', middleName: null, partyAffiliation: 'APC', state: 'Lagos', office: 'HOUSE_OF_REPS', performanceScore: 56.0, biography: 'Representing Kosofe Federal Constituency.' },
    { firstName: 'Oluwole', lastName: 'Oke', middleName: null, partyAffiliation: 'PDP', state: 'Osun', office: 'HOUSE_OF_REPS', performanceScore: 58.0, biography: 'Representing Obokun/Oriade Federal Constituency.' },

    // All Federal Ministers (Key Cabinet Members)
    { firstName: 'Nyesom', lastName: 'Wike', middleName: null, partyAffiliation: 'PDP', state: 'Rivers', office: 'MINISTER', performanceScore: 70.0, biography: 'Minister of the Federal Capital Territory. Former Governor of Rivers State (2015-2023).' },
    { firstName: 'Wale', lastName: 'Edun', middleName: null, partyAffiliation: 'APC', state: 'Lagos', office: 'MINISTER', performanceScore: 65.0, biography: 'Minister of Finance and Coordinating Minister of the Economy.' },
    { firstName: 'Abubakar', lastName: 'Kyari', middleName: null, partyAffiliation: 'APC', state: 'Borno', office: 'MINISTER', performanceScore: 58.0, biography: 'Minister of Agriculture and Food Security.' },
    { firstName: 'Festus', lastName: 'Keyamo', middleName: null, partyAffiliation: 'APC', state: 'Delta', office: 'MINISTER', performanceScore: 62.0, biography: 'Minister of Aviation and Aerospace Development. Senior Advocate of Nigeria.' },
    { firstName: 'Hannatu', lastName: 'Musawa', middleName: null, partyAffiliation: 'APC', state: 'Katsina', office: 'MINISTER', performanceScore: 54.0, biography: 'Minister of Arts, Culture and Creative Economy.' },
    { firstName: 'Muhammad', lastName: 'Badaru', middleName: 'Abubakar', partyAffiliation: 'APC', state: 'Jigawa', office: 'MINISTER', performanceScore: 60.0, biography: 'Minister of Defence. Former Governor of Jigawa State.' },
    { firstName: 'Tahir', lastName: 'Mamman', middleName: null, partyAffiliation: 'APC', state: 'Adamawa', office: 'MINISTER', performanceScore: 50.0, biography: 'Minister of Education. Senior Advocate of Nigeria.' },
    { firstName: 'Adebayo', lastName: 'Adelabu', middleName: null, partyAffiliation: 'APC', state: 'Oyo', office: 'MINISTER', performanceScore: 58.0, biography: 'Minister of Power. Former CBN Deputy Governor.' },
    { firstName: 'Heineken', lastName: 'Lokpobiri', middleName: null, partyAffiliation: 'APC', state: 'Bayelsa', office: 'MINISTER', performanceScore: 54.0, biography: 'Minister of State, Petroleum Resources (Oil).' },
    { firstName: 'Ekperikpe', lastName: 'Ekpo', middleName: null, partyAffiliation: 'APC', state: 'Akwa Ibom', office: 'MINISTER', performanceScore: 52.0, biography: 'Minister of State, Petroleum Resources (Gas).' },
    { firstName: 'David', lastName: 'Umahi', middleName: null, partyAffiliation: 'APC', state: 'Ebonyi', office: 'MINISTER', performanceScore: 64.0, biography: 'Minister of Works. Former Governor of Ebonyi State.' },
    { firstName: 'Uju', lastName: 'Kennedy', middleName: 'Ohaneye', partyAffiliation: 'APC', state: 'Anambra', office: 'MINISTER', performanceScore: 52.0, biography: 'Minister of Women Affairs.' },
    { firstName: 'Simon', lastName: 'Lalong', middleName: null, partyAffiliation: 'APC', state: 'Plateau', office: 'MINISTER', performanceScore: 56.0, biography: 'Minister of Labour and Employment. Former Governor of Plateau State.' },
    { firstName: 'Lateef', lastName: 'Fagbemi', middleName: null, partyAffiliation: 'APC', state: 'Lagos', office: 'MINISTER', performanceScore: 58.0, biography: 'Attorney General and Minister of Justice. Senior Advocate of Nigeria.' },
    { firstName: 'Bosun', lastName: 'Tijani', middleName: null, partyAffiliation: 'APC', state: 'Lagos', office: 'MINISTER', performanceScore: 60.0, biography: 'Minister of Communications, Innovation and Digital Economy. Tech entrepreneur.' },
    { firstName: 'Mohammed', lastName: 'Idris', middleName: null, partyAffiliation: 'APC', state: 'Niger', office: 'MINISTER', performanceScore: 54.0, biography: 'Minister of Information and National Orientation.' },
    { firstName: 'Olubunmi', lastName: 'Tunji-Ojo', middleName: null, partyAffiliation: 'APC', state: 'Ondo', office: 'MINISTER', performanceScore: 56.0, biography: 'Minister of Interior.' },
    { firstName: 'Ali', lastName: 'Pate', middleName: null, partyAffiliation: 'APC', state: 'Bauchi', office: 'MINISTER', performanceScore: 64.0, biography: 'Coordinating Minister of Health and Social Welfare. Former World Bank Director.' },
    { firstName: 'Atiku', lastName: 'Bagudu', middleName: null, partyAffiliation: 'APC', state: 'Kebbi', office: 'MINISTER', performanceScore: 58.0, biography: 'Minister of Budget and Economic Planning. Former Governor of Kebbi State.' },
    { firstName: 'Yusuf', lastName: 'Tuggar', middleName: null, partyAffiliation: 'APC', state: 'Bauchi', office: 'MINISTER', performanceScore: 56.0, biography: 'Minister of Foreign Affairs. Career diplomat.' },
    { firstName: 'Olawale', lastName: 'Cole', middleName: null, partyAffiliation: 'APC', state: 'Lagos', office: 'MINISTER', performanceScore: 52.0, biography: 'Minister of State for Works.' },
    { firstName: 'Imaan', lastName: 'Ibrahim', middleName: 'Sulaiman', partyAffiliation: 'APC', state: 'Kwara', office: 'MINISTER', performanceScore: 50.0, biography: 'Minister of State for Education.' },
    { firstName: 'Bello', lastName: 'Goronyo', middleName: null, partyAffiliation: 'APC', state: 'Sokoto', office: 'MINISTER', performanceScore: 54.0, biography: 'Minister of Water Resources and Sanitation.' },
    { firstName: 'Jamila', lastName: 'Ibrahim', middleName: 'Bio', partyAffiliation: 'APC', state: 'Gombe', office: 'MINISTER', performanceScore: 56.0, biography: 'Minister of Youth Development.' },
  ];

  console.log('Creating INEC-verified politicians...');

  for (const politician of politicians) {
    const stateId = politician.state ? stateMap[politician.state] : null;
    const officeId = politician.office ? createdOffices[politician.office] : null;

    // Create or update politician
    const existingPolitician = await prisma.politician.findFirst({
      where: {
        firstName: politician.firstName,
        lastName: politician.lastName,
      },
    });

    let politicianRecord;
    if (existingPolitician) {
      politicianRecord = await prisma.politician.update({
        where: { id: existingPolitician.id },
        data: {
          middleName: politician.middleName,
          partyAffiliation: politician.partyAffiliation as any,
          stateId,
          biography: politician.biography,
          dateOfBirth: politician.dateOfBirth || null,
          performanceScore: politician.performanceScore || 50,
          integrityStatus: 'VERIFIED',
          isActive: true,
        },
      });
    } else {
      politicianRecord = await prisma.politician.create({
        data: {
          firstName: politician.firstName,
          lastName: politician.lastName,
          middleName: politician.middleName,
          partyAffiliation: politician.partyAffiliation as any,
          stateId,
          biography: politician.biography,
          dateOfBirth: politician.dateOfBirth || null,
          performanceScore: politician.performanceScore || 50,
          integrityStatus: 'VERIFIED',
          isActive: true,
        },
      });
    }

    // Create tenure record if office exists
    if (officeId) {
      const existingTenure = await prisma.tenure.findFirst({
        where: {
          politicianId: politicianRecord.id,
          officeId,
          isCurrentRole: true,
        },
      });

      if (!existingTenure) {
        await prisma.tenure.create({
          data: {
            politicianId: politicianRecord.id,
            officeId,
            startDate: new Date('2023-05-29'), // Inauguration date
            isCurrentRole: true,
          },
        });
      }

      // Create ranking entry
      const existingRanking = await prisma.ranking.findFirst({
        where: {
          politicianId: politicianRecord.id,
          officeId,
        },
      });

      if (!existingRanking) {
        // Get current rank count for this office
        const rankCount = await prisma.ranking.count({
          where: { officeId },
        });

        await prisma.ranking.create({
          data: {
            politicianId: politicianRecord.id,
            officeId,
            rank: rankCount + 1,
            totalScore: politician.performanceScore || 50,
          },
        });
      } else {
        // Update ranking score
        await prisma.ranking.update({
          where: { id: existingRanking.id },
          data: { totalScore: politician.performanceScore || 50 },
        });
      }
    }

    console.log(`  Created/updated: ${politician.firstName} ${politician.lastName} (${politician.office})`);
  }

  // Update rankings to have proper rank order based on score
  const allOffices = await prisma.office.findMany();
  for (const office of allOffices) {
    const rankings = await prisma.ranking.findMany({
      where: { officeId: office.id },
      orderBy: { totalScore: 'desc' },
    });

    for (let i = 0; i < rankings.length; i++) {
      await prisma.ranking.update({
        where: { id: rankings[i].id },
        data: { rank: i + 1 },
      });
    }
  }

  console.log(`Created/updated ${politicians.length} politicians with INEC data`);
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
