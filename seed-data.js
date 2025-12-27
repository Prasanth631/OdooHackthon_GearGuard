// Run this script to add sample data to GearGuard
// Execute using: node seed-data.js

const BASE_URL = 'http://localhost:8088/api';

// You need to update this token after running the script once
let AUTH_TOKEN = '';

async function fetchToken() {
    try {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'prasanthgolla29@gmail.com', password: 'Admin@1234' })
        });
        const data = await response.json();
        AUTH_TOKEN = data.token;
        console.log('✅ Got auth token');
        return data.token;
    } catch (e) {
        console.error('❌ Failed to get token:', e.message);
        process.exit(1);
    }
}

async function apiCall(endpoint, method = 'GET', body = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${AUTH_TOKEN}`
        }
    };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`API ${endpoint} failed: ${text}`);
    }
    return response.json().catch(() => ({}));
}

async function seedUsers() {
    console.log('\n📥 Adding Users...');
    const users = [
        { fullName: 'John Manager', email: 'john.manager@gearguard.com', password: 'password123', role: 'MANAGER' },
        { fullName: 'Sarah Tech', email: 'sarah.tech@gearguard.com', password: 'password123', role: 'TECHNICIAN' },
        { fullName: 'Mike Repair', email: 'mike.repair@gearguard.com', password: 'password123', role: 'TECHNICIAN' },
        { fullName: 'Lisa Johnson', email: 'lisa.johnson@gearguard.com', password: 'password123', role: 'TECHNICIAN' },
        { fullName: 'Bob User', email: 'bob.user@gearguard.com', password: 'password123', role: 'USER' },
        { fullName: 'Alice Smith', email: 'alice.smith@gearguard.com', password: 'password123', role: 'USER' },
        { fullName: 'David Brown', email: 'david.brown@gearguard.com', password: 'password123', role: 'USER' }
    ];

    for (const user of users) {
        try {
            await apiCall('/auth/create-user', 'POST', { ...user, username: user.email.split('@')[0] });
            console.log(`  ✅ Created user: ${user.fullName}`);
        } catch (e) {
            console.log(`  ⚠️ ${user.fullName}: ${e.message.includes('exists') ? 'Already exists' : e.message}`);
        }
    }
}

async function seedDepartments() {
    console.log('\n📥 Adding Departments...');
    const departments = [
        { name: 'Manufacturing', description: 'Production floor operations', location: 'Building A' },
        { name: 'IT Department', description: 'Information technology and systems', location: 'Building B' },
        { name: 'Facilities', description: 'Building maintenance and operations', location: 'Building C' },
        { name: 'Warehouse', description: 'Storage and logistics', location: 'Building D' }
    ];

    for (const dept of departments) {
        try {
            await apiCall('/departments', 'POST', dept);
            console.log(`  ✅ Created department: ${dept.name}`);
        } catch (e) {
            console.log(`  ⚠️ ${dept.name}: Already exists or failed`);
        }
    }
}

async function seedEquipment() {
    console.log('\n📥 Adding Equipment...');
    const equipment = [
        { name: 'CNC Milling Machine', serialNumber: 'CNC-2024-001', category: 'Machinery', location: 'Factory Floor A', status: 'ACTIVE', healthScore: 95, notes: 'Primary CNC machine for precision parts' },
        { name: 'Industrial Laser Cutter', serialNumber: 'ILC-2024-002', category: 'Machinery', location: 'Factory Floor A', status: 'ACTIVE', healthScore: 88, notes: 'High-precision laser cutting' },
        { name: 'Dell PowerEdge Server', serialNumber: 'SRV-2024-003', category: 'IT Equipment', location: 'Server Room', status: 'ACTIVE', healthScore: 100, notes: 'Main application server' },
        { name: 'Forklift - Toyota', serialNumber: 'FLT-2024-004', category: 'Vehicles', location: 'Warehouse', status: 'ACTIVE', healthScore: 72, notes: 'Warehouse material handling' },
        { name: 'HVAC Unit - North Wing', serialNumber: 'HVAC-2024-005', category: 'HVAC', location: 'Building A', status: 'MAINTENANCE', healthScore: 58, notes: 'Scheduled for filter replacement' },
        { name: '3D Printer Ultimaker', serialNumber: '3DP-2024-006', category: 'Machinery', location: 'Design Lab', status: 'ACTIVE', healthScore: 91, notes: 'Prototype printing' },
        { name: 'Cisco Network Switch', serialNumber: 'NET-2024-007', category: 'IT Equipment', location: 'Server Room', status: 'ACTIVE', healthScore: 100, notes: 'Core network infrastructure' },
        { name: 'Electric Generator', serialNumber: 'GEN-2024-008', category: 'Electrical', location: 'Utility Room', status: 'ACTIVE', healthScore: 85, notes: 'Backup power supply' },
        { name: 'Conveyor Belt System', serialNumber: 'CBS-2024-009', category: 'Machinery', location: 'Factory Floor B', status: 'ACTIVE', healthScore: 78, notes: 'Assembly line transport' },
        { name: 'HP LaserJet Printer', serialNumber: 'PRT-2024-010', category: 'Office Equipment', location: 'Admin Office', status: 'INACTIVE', healthScore: 45, notes: 'Awaiting repair parts' }
    ];

    for (const eq of equipment) {
        try {
            await apiCall('/equipment', 'POST', eq);
            console.log(`  ✅ Created equipment: ${eq.name}`);
        } catch (e) {
            console.log(`  ⚠️ ${eq.name}: Already exists or failed`);
        }
    }
}

async function seedTeams() {
    console.log('\n📥 Adding Teams...');
    const teams = [
        { name: 'Electrical Team', description: 'Handles electrical repairs and maintenance', color: '#eab308' },
        { name: 'Mechanical Team', description: 'Mechanical systems and machinery', color: '#3b82f6' },
        { name: 'IT Support Team', description: 'IT equipment and network support', color: '#8b5cf6' },
        { name: 'HVAC Team', description: 'Heating, ventilation, and AC systems', color: '#22c55e' }
    ];

    for (const team of teams) {
        try {
            await apiCall('/teams', 'POST', team);
            console.log(`  ✅ Created team: ${team.name}`);
        } catch (e) {
            console.log(`  ⚠️ ${team.name}: Already exists or failed`);
        }
    }
}

async function seedRequests() {
    console.log('\n📥 Adding Maintenance Requests...');

    // Get equipment IDs first
    const equipmentList = await apiCall('/equipment');
    if (!equipmentList.length) {
        console.log('  ⚠️ No equipment found, skipping requests');
        return;
    }

    const today = new Date();
    const requests = [
        { subject: 'CNC Machine Calibration Needed', equipmentId: equipmentList[0]?.id, description: 'Machine is showing slight deviation in precision cuts', type: 'CORRECTIVE', priority: 'HIGH' },
        { subject: 'Laser Cutter Lens Replacement', equipmentId: equipmentList[1]?.id, description: 'Lens has visible scratches affecting cut quality', type: 'CORRECTIVE', priority: 'MEDIUM' },
        { subject: 'Server Backup Failure Alert', equipmentId: equipmentList[2]?.id, description: 'Automated backup failed for 3 consecutive nights', type: 'CORRECTIVE', priority: 'CRITICAL' },
        { subject: 'Forklift Hydraulic Leak', equipmentId: equipmentList[3]?.id, description: 'Oil leak detected near hydraulic cylinder', type: 'CORRECTIVE', priority: 'HIGH' },
        { subject: 'HVAC Filter Replacement - Scheduled', equipmentId: equipmentList[4]?.id, description: 'Quarterly filter replacement as per maintenance schedule', type: 'PREVENTIVE', priority: 'LOW' },
        { subject: '3D Printer Nozzle Clog', equipmentId: equipmentList[5]?.id, description: 'Nozzle is partially clogged, prints have gaps', type: 'CORRECTIVE', priority: 'MEDIUM' },
        { subject: 'Network Switch Firmware Update', equipmentId: equipmentList[6]?.id, description: 'Security patch available, needs scheduled downtime', type: 'PREVENTIVE', priority: 'MEDIUM' },
        { subject: 'Generator Monthly Inspection', equipmentId: equipmentList[7]?.id, description: 'Monthly routine inspection and oil level check', type: 'PREVENTIVE', priority: 'LOW' }
    ];

    for (const req of requests) {
        if (!req.equipmentId) continue;
        try {
            await apiCall('/requests', 'POST', req);
            console.log(`  ✅ Created request: ${req.subject}`);
        } catch (e) {
            console.log(`  ⚠️ ${req.subject}: Failed - ${e.message}`);
        }
    }
}

async function seedCalendarEvents() {
    console.log('\n📥 Adding Calendar Events...');

    const today = new Date();
    const events = [
        { title: 'Monthly Safety Inspection', description: 'Full facility safety audit', eventType: 'INSPECTION', startDate: formatDate(addDays(today, 2)), endDate: formatDate(addDays(today, 2)), allDay: true, color: '#ef4444' },
        { title: 'HVAC Preventive Maintenance', description: 'Quarterly HVAC system check', eventType: 'MAINTENANCE', startDate: formatDate(addDays(today, 5)), endDate: formatDate(addDays(today, 5)), allDay: false, color: '#22c55e' },
        { title: 'Equipment Calibration Day', description: 'Annual calibration for precision machinery', eventType: 'MAINTENANCE', startDate: formatDate(addDays(today, 7)), endDate: formatDate(addDays(today, 7)), allDay: true, color: '#3b82f6' },
        { title: 'IT Infrastructure Review', description: 'Network and server health assessment', eventType: 'MEETING', startDate: formatDate(addDays(today, 10)), endDate: formatDate(addDays(today, 10)), allDay: false, color: '#8b5cf6' },
        { title: 'Fire Safety Drill', description: 'Mandatory quarterly fire drill', eventType: 'OTHER', startDate: formatDate(addDays(today, 14)), endDate: formatDate(addDays(today, 14)), allDay: false, color: '#f59e0b' },
        { title: 'Forklift Certification Training', description: 'New operator certification program', eventType: 'MEETING', startDate: formatDate(addDays(today, 1)), endDate: formatDate(addDays(today, 1)), allDay: false, color: '#06b6d4' }
    ];

    for (const event of events) {
        try {
            await apiCall('/calendar', 'POST', event);
            console.log(`  ✅ Created event: ${event.title}`);
        } catch (e) {
            console.log(`  ⚠️ ${event.title}: Failed - ${e.message}`);
        }
    }
}

function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

// Main execution
async function main() {
    console.log('🚀 GearGuard Data Seeder');
    console.log('========================\n');

    await fetchToken();
    await seedUsers();
    await seedDepartments();
    await seedEquipment();
    await seedTeams();
    await seedRequests();
    await seedCalendarEvents();

    console.log('\n✅ Data seeding complete!');
    console.log('========================');
    console.log('\n📋 Sample Logins:');
    console.log('  Admin:      admin@gearguard.com / admin123');
    console.log('  Manager:    john.manager@gearguard.com / password123');
    console.log('  Technician: sarah.tech@gearguard.com / password123');
    console.log('  User:       bob.user@gearguard.com / password123');
}

main().catch(console.error);
