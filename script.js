// Function to remove initials from names and ensure only first and last name remain
// Examples: "J. John Smith" -> "John Smith", "●J John Smith" -> "John Smith", 
// "John M. Smith" -> "John Smith", "Jesse P. Pinkman" -> "Jesse Pinkman"
function removeInitialFromName(name) {
    if (!name) return name;
    
    // Remove any leading whitespace first
    let cleaned = name.trim();
    const originalCleaned = cleaned;
    
    // Step 1: Remove leading initials (before first name)
    // Match patterns (in order of specificity):
    // 1. Circle/bullet + optional space + letter + optional period + space(s): "●J John", "● J. John", "•J John"
    cleaned = cleaned.replace(/^[●•○▪▫]\s*[A-Za-z]\.?\s+/, '');
    
    // 2. Single letter + period + space(s): "J. John", "J.  John"
    cleaned = cleaned.replace(/^[A-Za-z]\.\s+/, '');
    
    // 3. Single letter + one or more spaces before a capital letter followed by lowercase (first name): "J  John", "J John"
    cleaned = cleaned.replace(/^[A-Za-z]\s+(?=[A-Z][a-z])/, '');
    
    // 4. Single letter directly before a capital letter followed by lowercase (no space): "JJesse", "JJohn"
    cleaned = cleaned.replace(/^[A-Za-z](?=[A-Z][a-z])/, '');
    
    // 5. Handle cases where there might be a single letter followed by any whitespace and then a name
    cleaned = cleaned.replace(/^[A-Za-z][\s\u00A0\u2000-\u200B]+(?=[A-Z][a-z])/, '');
    
    // 6. More aggressive: If name starts with a single letter (A-Z) followed by space(s) and then any word starting with capital,
    // remove the initial letter and space.
    if (cleaned === originalCleaned) {
        cleaned = cleaned.replace(/^([A-Za-z])\s+([A-Z][a-zA-Z]+.*)$/, '$2');
    }
    
    // Step 2: Remove middle initials (between first and last name)
    // Pattern: Word + space + single letter (with optional period) + space + word
    // Examples: "John M. Smith" -> "John Smith", "Jesse P Pinkman" -> "Jesse Pinkman"
    cleaned = cleaned.replace(/\s+[A-Za-z]\.?\s+(?=[A-Z][a-z])/g, ' ');
    
    // Step 3: Ensure only first and last name remain (remove any extra parts)
    // Split by spaces and keep only first and last if there are more than 2 parts
    const parts = cleaned.trim().split(/\s+/).filter(part => part.length > 0);
    if (parts.length > 2) {
        // Keep only first and last name
        cleaned = parts[0] + ' ' + parts[parts.length - 1];
    }
    
    return cleaned.trim();
}

// Function to clean all lead names by removing initials
function cleanLeadNames() {
    let updated = false;
    leads.forEach(lead => {
        const originalName = lead.name;
        const cleanedName = removeInitialFromName(lead.name);
        if (cleanedName !== originalName) {
            lead.name = cleanedName;
            updated = true;
        }
    });
    if (updated) {
        saveLeads();
        // Force a refresh of the display if leads are currently shown
        if (document.getElementById('leads-table-body')) {
            filterLeads();
        }
    }
}

// Function to clean all user names by removing initials
function cleanUserNames() {
    let updated = false;
    users.forEach(user => {
        const cleanedName = removeInitialFromName(user.name);
        if (cleanedName !== user.name) {
            user.name = cleanedName;
            updated = true;
        }
    });
    if (updated) {
        saveUsers();
    }
}

// Data Storage (using localStorage)
let leads = JSON.parse(localStorage.getItem('crm_leads')) || [];
let tasks = JSON.parse(localStorage.getItem('crm_tasks')) || [];
let users = JSON.parse(localStorage.getItem('crm_users')) || [
    { id: 1, name: 'Admin User', email: 'admin@crm.com', role: 'Sales Manager', password: 'admin123', lastActivity: new Date().toISOString() },
    { id: 2, name: 'Walter White', email: 'walter.white@crm.com', role: 'Sales Rep', password: 'walter123', lastActivity: new Date().toISOString() },
    { id: 3, name: 'Jesse Pinkman', email: 'jesse.pinkman@crm.com', role: 'Sales Rep', password: 'jesse123', lastActivity: new Date().toISOString() }
];
let communications = JSON.parse(localStorage.getItem('crm_communications')) || [];
let testDrives = JSON.parse(localStorage.getItem('crm_testdrives')) || [];
let vehicles = JSON.parse(localStorage.getItem('crm_vehicles')) || [];
// Initialize sample vehicles if none exist
if (vehicles.length === 0) {
    vehicles = [
        {
            id: 1,
            make: 'Toyota',
            model: 'Land Cruiser Prado',
            year: 2023,
            color: 'White',
            vin: 'JTMCY7AJ9M4012345',
            stock: 'TD-001',
            price: 8500000,
            cost: 7200000,
            status: 'Available',
            features: 'Leather seats, Sunroof, Navigation system, 4WD',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 2,
            make: 'Mercedes-Benz',
            model: 'C-Class C200',
            year: 2024,
            color: 'Black',
            vin: 'WDDWF4KB8MR123456',
            stock: 'MB-002',
            price: 6500000,
            cost: 5800000,
            status: 'Available',
            features: 'Premium Package, AMG Line, Panoramic roof, MBUX',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ];
    localStorage.setItem('crm_vehicles', JSON.stringify(vehicles));
}
let targets = JSON.parse(localStorage.getItem('crm_targets')) || [];
let currentUserId = parseInt(localStorage.getItem('currentUserId')) || 1; // Default to admin, or saved user

// Initialize sample leads if none exist
if (leads.length === 0) {
    const now = new Date();
    const threeDaysAgo = new Date(now);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const twoWeeksAgo = new Date(now);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    
    leads = [
        {
            id: 1,
            name: 'Kamau Wanjiru',
            email: 'kamau.wanjiru@email.com',
            phone: '+254 712 345 678',
            company: 'Nairobi Tech Solutions',
            jobTitle: 'Operations Manager',
            source: 'website',
            status: 'Qualified',
            assignedTo: 2,
            value: 450000,
            closeDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            vehicleInterest: 'SUV',
            tradeIn: 'yes',
            timeline: '1-3 months',
            notes: 'Very interested in the new SUV models. Has a 2018 Toyota RAV4 for trade-in. Budget is flexible. Prefers automatic transmission.',
            createdAt: twoWeeksAgo.toISOString(),
            updatedAt: threeDaysAgo.toISOString()
        },
        {
            id: 2,
            name: 'Amina Ochieng',
            email: 'amina.ochieng@gmail.com',
            phone: '+254 723 456 789',
            company: 'Mombasa Logistics Ltd',
            jobTitle: 'CEO',
            source: 'referral',
            status: 'Proposal',
            assignedTo: 3, // Jesse Pinkman
            value: 1200000,
            closeDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            vehicleInterest: 'Sedan, Luxury',
            tradeIn: 'no',
            timeline: 'immediate',
            notes: 'High-value client referred by existing customer. Looking for luxury sedan for business use. Needs financing options. Very responsive to communications.',
            createdAt: oneWeekAgo.toISOString(),
            updatedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 3,
            name: 'James Kipchoge',
            email: 'j.kipchoge@yahoo.com',
            phone: '+254 734 567 890',
            company: 'Eldoret Trading Co.',
            jobTitle: 'Business Owner',
            source: 'walk-in',
            status: 'Contacted',
            assignedTo: 3, // Jesse Pinkman
            value: 280000,
            closeDate: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString(),
            vehicleInterest: 'Pickup Truck',
            tradeIn: 'yes',
            timeline: '3-6 months',
            notes: 'Walked into showroom last week. Interested in pickup trucks for his trading business. Needs to transport goods. Considering Toyota Hilux or Isuzu D-Max. Will follow up next week.',
            createdAt: threeDaysAgo.toISOString(),
            updatedAt: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 4,
            name: 'Grace Muthoni',
            email: 'grace.muthoni@email.com',
            phone: '+254 745 678 901',
            company: 'Kisumu Enterprises',
            jobTitle: 'Marketing Director',
            source: 'website',
            status: 'New',
            assignedTo: 2,
            value: 350000,
            closeDate: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString(),
            vehicleInterest: 'Hatchback',
            tradeIn: 'no',
            timeline: '1-3 months',
            notes: 'New inquiry from website. Interested in fuel-efficient hatchback for city driving.',
            createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 5,
            name: 'David Omondi',
            email: 'd.omondi@gmail.com',
            phone: '+254 756 789 012',
            company: 'Nakuru Holdings',
            jobTitle: 'Finance Manager',
            source: 'phone',
            status: 'New',
            assignedTo: 3, // Jesse Pinkman
            value: 520000,
            closeDate: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000).toISOString(),
            vehicleInterest: 'Sedan',
            tradeIn: 'yes',
            timeline: 'immediate',
            notes: 'Called yesterday. Looking for reliable sedan. Has 2015 Honda Civic for trade-in.',
            createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 6,
            name: 'Sarah Wambui',
            email: 'sarah.wambui@yahoo.com',
            phone: '+254 767 890 123',
            company: 'Thika Manufacturing',
            jobTitle: 'Operations Director',
            source: 'referral',
            status: 'Won',
            assignedTo: 2,
            value: 850000,
            closeDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            vehicleInterest: 'SUV, Luxury',
            tradeIn: 'no',
            timeline: 'immediate',
            notes: 'Successfully closed deal. Purchased luxury SUV. Very satisfied customer.',
            createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 7,
            name: 'Peter Kariuki',
            email: 'p.kariuki@email.com',
            phone: '+254 778 901 234',
            company: 'Meru Trading',
            jobTitle: 'Business Owner',
            source: 'social-media',
            status: 'Won',
            assignedTo: 3,
            value: 420000,
            closeDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            vehicleInterest: 'Pickup Truck',
            tradeIn: 'yes',
            timeline: 'immediate',
            notes: 'Closed deal on pickup truck. Found us through social media campaign.',
            createdAt: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 8,
            name: 'Mary Njeri',
            email: 'mary.njeri@gmail.com',
            phone: '+254 789 012 345',
            company: 'Eldoret Retail',
            jobTitle: 'Store Manager',
            source: 'website',
            status: 'Lost',
            assignedTo: 2,
            value: 380000,
            closeDate: null,
            vehicleInterest: 'Sedan',
            tradeIn: 'no',
            timeline: '3-6 months',
            notes: 'Customer decided to purchase from competitor. Price was main factor.',
            createdAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 9,
            name: 'John Otieno',
            email: 'j.otieno@yahoo.com',
            phone: '+254 790 123 456',
            company: 'Nairobi Imports',
            jobTitle: 'Sales Manager',
            source: 'walk-in',
            status: 'Lost',
            assignedTo: 3,
            value: 650000,
            closeDate: null,
            vehicleInterest: 'SUV',
            tradeIn: 'yes',
            timeline: '1-3 months',
            notes: 'Lost to competitor. Customer found better financing options elsewhere.',
            createdAt: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 10,
            name: 'Lucy Akinyi',
            email: 'lucy.akinyi@email.com',
            phone: '+254 701 234 567',
            company: 'Mombasa Shipping',
            jobTitle: 'Logistics Coordinator',
            source: 'referral',
            status: 'Negotiation',
            assignedTo: 2,
            value: 750000,
            closeDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            vehicleInterest: 'SUV',
            tradeIn: 'yes',
            timeline: 'immediate',
            notes: 'Currently negotiating final price and trade-in value. Very close to closing.',
            createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 11,
            name: 'Michael Waweru',
            email: 'm.waweru@gmail.com',
            phone: '+254 712 345 679',
            company: 'Kakamega Construction',
            jobTitle: 'Project Manager',
            source: 'phone',
            status: 'Negotiation',
            assignedTo: 3, // Jesse Pinkman
            value: 580000,
            closeDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            vehicleInterest: 'Pickup Truck',
            tradeIn: 'no',
            timeline: 'immediate',
            notes: 'Negotiating financing terms. Customer needs flexible payment plan.',
            createdAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 12,
            name: 'Faith Chebet',
            email: 'faith.chebet@email.com',
            phone: '+254 711 222 333',
            company: 'Kericho Tea Estates',
            jobTitle: 'Administrator',
            source: 'website',
            status: 'New',
            assignedTo: 2,
            value: 290000,
            closeDate: new Date(now.getTime() + 35 * 24 * 60 * 60 * 1000).toISOString(),
            vehicleInterest: 'Sedan',
            tradeIn: 'no',
            timeline: '1-3 months',
            notes: 'New lead from website contact form. Interested in economical sedan for personal use.',
            createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 13,
            name: 'Brian Mutua',
            email: 'b.mutua@gmail.com',
            phone: '+254 722 333 444',
            company: 'Machakos Transport',
            jobTitle: 'Fleet Manager',
            source: 'phone',
            status: 'New',
            assignedTo: 3,
            value: 680000,
            closeDate: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000).toISOString(),
            vehicleInterest: 'Pickup Truck',
            tradeIn: 'yes',
            timeline: 'immediate',
            notes: 'Called this morning. Needs pickup truck for fleet expansion. Willing to trade in old vehicles.',
            createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 14,
            name: 'Esther Nyambura',
            email: 'esther.nyambura@yahoo.com',
            phone: '+254 733 444 555',
            company: 'Nyeri Agriculture Co-op',
            jobTitle: 'Operations Manager',
            source: 'walk-in',
            status: 'New',
            assignedTo: 2,
            value: 410000,
            closeDate: new Date(now.getTime() + 40 * 24 * 60 * 60 * 1000).toISOString(),
            vehicleInterest: 'SUV',
            tradeIn: 'no',
            timeline: '3-6 months',
            notes: 'Visited showroom today. Looking for SUV suitable for rural roads. Budget conscious.',
            createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 15,
            name: 'Daniel Kiprotich',
            email: 'd.kiprotich@email.com',
            phone: '+254 744 555 666',
            company: 'Eldoret Farmers Union',
            jobTitle: 'Secretary General',
            source: 'referral',
            status: 'Won',
            assignedTo: 2,
            value: 920000,
            closeDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            vehicleInterest: 'SUV, Luxury',
            tradeIn: 'no',
            timeline: 'immediate',
            notes: 'Successfully closed. Purchased luxury SUV. Excellent customer service experience.',
            createdAt: new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 16,
            name: 'Cynthia Adhiambo',
            email: 'cynthia.adhiambo@gmail.com',
            phone: '+254 755 666 777',
            company: 'Kisii Medical Supplies',
            jobTitle: 'Procurement Officer',
            source: 'social-media',
            status: 'Won',
            assignedTo: 3,
            value: 360000,
            closeDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            vehicleInterest: 'Hatchback',
            tradeIn: 'yes',
            timeline: 'immediate',
            notes: 'Closed deal on hatchback. Found us through Facebook ad. Very happy with purchase.',
            createdAt: new Date(now.getTime() - 22 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 17,
            name: 'Robert Mwangi',
            email: 'r.mwangi@yahoo.com',
            phone: '+254 766 777 888',
            company: 'Naivasha Horticulture',
            jobTitle: 'General Manager',
            source: 'website',
            status: 'Won',
            assignedTo: 2,
            value: 780000,
            closeDate: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(),
            vehicleInterest: 'Pickup Truck',
            tradeIn: 'yes',
            timeline: 'immediate',
            notes: 'Closed deal on pickup truck. Needed for farm operations. Trade-in completed successfully.',
            createdAt: new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 18,
            name: 'Patricia Achieng',
            email: 'p.achieng@email.com',
            phone: '+254 777 888 999',
            company: 'Busia Trading',
            jobTitle: 'Business Owner',
            source: 'referral',
            status: 'Lost',
            assignedTo: 3,
            value: 440000,
            closeDate: null,
            vehicleInterest: 'Sedan',
            tradeIn: 'no',
            timeline: '1-3 months',
            notes: 'Customer chose competitor due to better warranty terms offered elsewhere.',
            createdAt: new Date(now.getTime() - 16 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 19,
            name: 'Simon Njoroge',
            email: 's.njoroge@gmail.com',
            phone: '+254 788 999 000',
            company: 'Kiambu Real Estate',
            jobTitle: 'Sales Director',
            source: 'walk-in',
            status: 'Lost',
            assignedTo: 2,
            value: 560000,
            closeDate: null,
            vehicleInterest: 'SUV',
            tradeIn: 'yes',
            timeline: 'immediate',
            notes: 'Lost to competitor. Customer received better trade-in valuation from another dealer.',
            createdAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 20,
            name: 'Ruth Wanjiku',
            email: 'ruth.wanjiku@yahoo.com',
            phone: '+254 799 000 111',
            company: 'Muranga Coffee Co.',
            jobTitle: 'Export Manager',
            source: 'phone',
            status: 'Lost',
            assignedTo: 3,
            value: 490000,
            closeDate: null,
            vehicleInterest: 'Sedan',
            tradeIn: 'no',
            timeline: '3-6 months',
            notes: 'Customer postponed purchase indefinitely. May revisit in future.',
            createdAt: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 21,
            name: 'Kevin Ochieng',
            email: 'k.ochieng@email.com',
            phone: '+254 700 111 222',
            company: 'Homa Bay Fisheries',
            jobTitle: 'Operations Manager',
            source: 'website',
            status: 'Negotiation',
            assignedTo: 2,
            value: 670000,
            closeDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
            vehicleInterest: 'Pickup Truck',
            tradeIn: 'yes',
            timeline: 'immediate',
            notes: 'Negotiating final price. Customer wants extended warranty included. Very close to agreement.',
            createdAt: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 22,
            name: 'Joyce Wanjala',
            email: 'joyce.wanjala@gmail.com',
            phone: '+254 711 222 333',
            company: 'Bungoma Textiles',
            jobTitle: 'Production Manager',
            source: 'referral',
            status: 'Negotiation',
            assignedTo: 3,
            value: 540000,
            closeDate: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000).toISOString(),
            vehicleInterest: 'SUV',
            tradeIn: 'no',
            timeline: '1-3 months',
            notes: 'Negotiating financing terms. Customer needs low monthly payments. Working on solution.',
            createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 23,
            name: 'Francis Kimani',
            email: 'f.kimani@yahoo.com',
            phone: '+254 722 333 444',
            company: 'Narok Tourism Board',
            jobTitle: 'Marketing Manager',
            source: 'social-media',
            status: 'Negotiation',
            assignedTo: 2,
            value: 890000,
            closeDate: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000).toISOString(),
            vehicleInterest: 'SUV, Luxury',
            tradeIn: 'yes',
            timeline: 'immediate',
            notes: 'High-value negotiation. Discussing premium package options. Customer very interested.',
            createdAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 24,
            name: 'Beatrice Nyokabi',
            email: 'beatrice.nyokabi@email.com',
            phone: '+254 733 444 555',
            company: 'Embu Agricultural Co-op',
            jobTitle: 'General Manager',
            source: 'referral',
            status: 'Negotiation',
            assignedTo: 3,
            value: 640000,
            closeDate: new Date(now.getTime() + 9 * 24 * 60 * 60 * 1000).toISOString(),
            vehicleInterest: 'Pickup Truck',
            tradeIn: 'yes',
            timeline: 'immediate',
            notes: 'Negotiating final terms for pickup truck purchase. Customer wants extended warranty and service package included. Very close to closing the deal. Trade-in vehicle: 2016 Nissan Navara.',
            createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 25,
            name: 'Thomas Maina',
            email: 'thomas.maina@gmail.com',
            phone: '+254 744 555 666',
            company: 'Nyeri Dairy Farmers',
            jobTitle: 'Chairman',
            source: 'walk-in',
            status: 'Won',
            assignedTo: 2,
            value: 950000,
            closeDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            vehicleInterest: 'SUV',
            tradeIn: 'no',
            timeline: 'immediate',
            notes: 'Successfully closed deal on premium SUV. Customer very satisfied with the service and vehicle quality. Paid in full. Excellent customer experience.',
            createdAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 26,
            name: 'Nancy Wairimu',
            email: 'nancy.wairimu@yahoo.com',
            phone: '+254 755 666 777',
            company: 'Kiambu Textile Mills',
            jobTitle: 'Production Supervisor',
            source: 'website',
            status: 'Lost',
            assignedTo: 3,
            value: 330000,
            closeDate: null,
            vehicleInterest: 'Sedan',
            tradeIn: 'no',
            timeline: '1-3 months',
            notes: 'Customer decided not to proceed. Found a better deal elsewhere with lower interest rates. May reconsider in future if we can match competitor pricing.',
            createdAt: new Date(now.getTime() - 11 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
        }
    ];
    
    // Add sample communications
    communications = [
        {
            id: 1,
            leadId: 1,
            type: 'call',
            subject: 'Initial Contact',
            notes: 'Called to discuss SUV options. Customer very interested in fuel efficiency and safety features. Mentioned they have a trade-in vehicle (2018 Toyota RAV4). Scheduled test drive for next week.',
            outcome: 'positive',
            createdAt: twoWeeksAgo.toISOString()
        },
        {
            id: 2,
            leadId: 1,
            type: 'email',
            subject: 'SUV Brochure Sent',
            notes: 'Sent detailed brochure of available SUV models with specifications and pricing. Customer responded positively.',
            outcome: 'positive',
            createdAt: new Date(twoWeeksAgo.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 3,
            leadId: 2,
            type: 'meeting',
            subject: 'Initial Consultation',
            notes: 'Met with client at showroom. Discussed luxury sedan options. Client very professional and knows what they want. Showed interest in Mercedes-Benz and BMW models. Discussed financing options.',
            outcome: 'positive',
            createdAt: oneWeekAgo.toISOString()
        },
        {
            id: 4,
            leadId: 2,
            type: 'call',
            subject: 'Follow-up Call',
            notes: 'Followed up on proposal sent. Client reviewing options. Will make decision by end of week.',
            outcome: 'neutral',
            createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 5,
            leadId: 3,
            type: 'note',
            subject: 'Showroom Visit',
            notes: 'Customer visited showroom. Looked at pickup trucks. Very interested in Toyota Hilux. Took business card and said will call back after discussing with business partner.',
            outcome: 'neutral',
            createdAt: threeDaysAgo.toISOString()
        },
        {
            id: 6,
            leadId: 3,
            type: 'call',
            subject: 'Follow-up',
            notes: 'Called to check if customer had any questions. Customer still considering options. Will follow up again next week.',
            outcome: 'neutral',
            createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 7,
            leadId: 24,
            type: 'meeting',
            subject: 'Initial Consultation',
            notes: 'Met with Beatrice at showroom. Discussed pickup truck options suitable for agricultural use. Customer very interested in Toyota Hilux. Showed her different models and discussed trade-in options for her 2016 Nissan Navara.',
            outcome: 'positive',
            createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 8,
            leadId: 24,
            type: 'call',
            subject: 'Price Negotiation',
            notes: 'Called to discuss final pricing. Customer wants extended warranty and service package included. Working on competitive offer that includes these benefits.',
            outcome: 'positive',
            createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 9,
            leadId: 24,
            type: 'email',
            subject: 'Revised Proposal Sent',
            notes: 'Sent revised proposal with extended warranty and service package included. Customer reviewing. Expecting decision within 2 days.',
            outcome: 'neutral',
            createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 10,
            leadId: 25,
            type: 'walk-in',
            subject: 'Showroom Visit',
            notes: 'Thomas visited showroom. Very interested in premium SUV models. Looked at several options, particularly interested in Toyota Land Cruiser. Professional and knowledgeable customer.',
            outcome: 'positive',
            createdAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 11,
            leadId: 25,
            type: 'call',
            subject: 'Follow-up Call',
            notes: 'Called to answer questions about financing and vehicle specifications. Customer very satisfied with information provided. Scheduled second visit.',
            outcome: 'positive',
            createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 12,
            leadId: 25,
            type: 'meeting',
            subject: 'Final Decision Meeting',
            notes: 'Met with Thomas for final decision. Customer decided to purchase premium SUV. Completed all paperwork. Very happy with the process and vehicle.',
            outcome: 'positive',
            createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 13,
            leadId: 26,
            type: 'email',
            subject: 'Initial Inquiry',
            notes: 'Nancy submitted inquiry through website contact form. Interested in economical sedan for personal use. Requested information about available models and pricing.',
            outcome: 'neutral',
            createdAt: new Date(now.getTime() - 11 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 14,
            leadId: 26,
            type: 'call',
            subject: 'Initial Contact Call',
            notes: 'Called Nancy to discuss her requirements. Provided information about sedan options and financing. Customer seemed interested but wanted to compare with other dealers.',
            outcome: 'neutral',
            createdAt: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 15,
            leadId: 26,
            type: 'email',
            subject: 'Proposal Sent',
            notes: 'Sent detailed proposal with pricing and financing options. Customer responded saying she found better deal elsewhere with lower interest rates.',
            outcome: 'negative',
            createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 16,
            leadId: 26,
            type: 'note',
            subject: 'Lost to Competitor',
            notes: 'Customer decided not to proceed. Found better financing terms with competitor. May reconsider in future if we can match pricing. Left door open for future contact.',
            outcome: 'negative',
            createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
        }
    ];
    
    // Add sample tasks
    tasks = [
        {
            id: 1,
            title: 'Schedule test drive for Kamau Wanjiru',
            leadId: 1,
            dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            priority: 'High',
            status: 'Pending',
            assignedTo: 2,
            description: 'Customer wants to test drive SUV models. Preferred time: Saturday morning.',
            createdAt: threeDaysAgo.toISOString(),
            updatedAt: threeDaysAgo.toISOString()
        },
        {
            id: 2,
            title: 'Send proposal to Amina Ochieng',
            leadId: 2,
            dueDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            priority: 'High',
            status: 'Completed',
            assignedTo: 3, // Jesse Pinkman
            description: 'Prepare and send detailed proposal for luxury sedan options with financing terms.',
            createdAt: oneWeekAgo.toISOString(),
            updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 3,
            title: 'Follow up with James Kipchoge',
            leadId: 3,
            dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            priority: 'Medium',
            status: 'Pending',
            assignedTo: 3, // Jesse Pinkman
            description: 'Call customer to discuss pickup truck options and answer any questions.',
            createdAt: threeDaysAgo.toISOString(),
            updatedAt: threeDaysAgo.toISOString()
        },
        {
            id: 4,
            title: 'Send trade-in valuation to Kamau',
            leadId: 1,
            dueDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString(),
            priority: 'Medium',
            status: 'Pending',
            assignedTo: 2,
            description: 'Get trade-in valuation for 2018 Toyota RAV4 and send to customer.',
            createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 5,
            title: 'Finalize negotiation with Beatrice Nyokabi',
            leadId: 24,
            dueDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            priority: 'High',
            status: 'Pending',
            assignedTo: 3,
            description: 'Follow up on revised proposal. Customer reviewing extended warranty and service package offer. Very close to closing.',
            createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 6,
            title: 'Complete trade-in valuation for Beatrice',
            leadId: 24,
            dueDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString(),
            priority: 'Medium',
            status: 'Pending',
            assignedTo: 3,
            description: 'Get trade-in valuation for 2016 Nissan Navara and include in final offer.',
            createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 7,
            title: 'Follow up with Thomas Maina - post sale',
            leadId: 25,
            dueDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            priority: 'Low',
            status: 'Pending',
            assignedTo: 2,
            description: 'Follow up call to ensure customer satisfaction with purchased SUV. Check if any questions or concerns.',
            createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 8,
            title: 'Schedule delivery for Thomas',
            leadId: 25,
            dueDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            priority: 'High',
            status: 'Completed',
            assignedTo: 2,
            description: 'Scheduled vehicle delivery for Thomas Maina. Completed successfully.',
            createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 9,
            title: 'Follow up with Nancy Wairimu - lost lead',
            leadId: 26,
            dueDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            priority: 'Low',
            status: 'Pending',
            assignedTo: 3,
            description: 'Follow up in one month to see if customer situation has changed. May reconsider if we can offer better financing terms.',
            createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
        }
    ];
    
    // Save initial data
    localStorage.setItem('crm_leads', JSON.stringify(leads));
    localStorage.setItem('crm_communications', JSON.stringify(communications));
    localStorage.setItem('crm_tasks', JSON.stringify(tasks));
}

// Function to add new leads if they don't exist
function ensureNewLeadsExist() {
    const now = new Date();
    const existingLeads = JSON.parse(localStorage.getItem('crm_leads')) || [];
    const existingCommunications = JSON.parse(localStorage.getItem('crm_communications')) || [];
    const existingTasks = JSON.parse(localStorage.getItem('crm_tasks')) || [];
    
    // Check if new leads (24, 25, 26) exist
    const lead24Exists = existingLeads.some(l => l.id === 24);
    const lead25Exists = existingLeads.some(l => l.id === 25);
    const lead26Exists = existingLeads.some(l => l.id === 26);
    
    let needsUpdate = false;
    
    // Add Beatrice Nyokabi (ID 24) if missing
    if (!lead24Exists) {
        existingLeads.push({
            id: 24,
            name: 'Beatrice Nyokabi',
            email: 'beatrice.nyokabi@email.com',
            phone: '+254 733 444 555',
            company: 'Embu Agricultural Co-op',
            jobTitle: 'General Manager',
            source: 'referral',
            status: 'Negotiation',
            assignedTo: 3,
            value: 640000,
            closeDate: new Date(now.getTime() + 9 * 24 * 60 * 60 * 1000).toISOString(),
            vehicleInterest: 'Pickup Truck',
            tradeIn: 'yes',
            timeline: 'immediate',
            notes: 'Negotiating final terms for pickup truck purchase. Customer wants extended warranty and service package included. Very close to closing the deal. Trade-in vehicle: 2016 Nissan Navara.',
            createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString()
        });
        needsUpdate = true;
        
        // Add communications for Beatrice
        const commIds = existingCommunications.map(c => c.id);
        const maxCommId = commIds.length > 0 ? Math.max(...commIds) : 0;
        existingCommunications.push(
            {
                id: maxCommId + 1,
                leadId: 24,
                type: 'meeting',
                subject: 'Initial Consultation',
                notes: 'Met with Beatrice at showroom. Discussed pickup truck options suitable for agricultural use. Customer very interested in Toyota Hilux. Showed her different models and discussed trade-in options for her 2016 Nissan Navara.',
                outcome: 'positive',
                createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: maxCommId + 2,
                leadId: 24,
                type: 'call',
                subject: 'Price Negotiation',
                notes: 'Called to discuss final pricing. Customer wants extended warranty and service package included. Working on competitive offer that includes these benefits.',
                outcome: 'positive',
                createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: maxCommId + 3,
                leadId: 24,
                type: 'email',
                subject: 'Revised Proposal Sent',
                notes: 'Sent revised proposal with extended warranty and service package included. Customer reviewing. Expecting decision within 2 days.',
                outcome: 'neutral',
                createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()
            }
        );
        
        // Add tasks for Beatrice
        const taskIds = existingTasks.map(t => t.id);
        const maxTaskId = taskIds.length > 0 ? Math.max(...taskIds) : 0;
        existingTasks.push(
            {
                id: maxTaskId + 1,
                title: 'Finalize negotiation with Beatrice Nyokabi',
                leadId: 24,
                dueDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
                priority: 'High',
                status: 'Pending',
                assignedTo: 3,
                description: 'Follow up on revised proposal. Customer reviewing extended warranty and service package offer. Very close to closing.',
                createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: maxTaskId + 2,
                title: 'Complete trade-in valuation for Beatrice',
                leadId: 24,
                dueDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString(),
                priority: 'Medium',
                status: 'Pending',
                assignedTo: 3,
                description: 'Get trade-in valuation for 2016 Nissan Navara and include in final offer.',
                createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
            }
        );
    }
    
    // Add Thomas Maina (ID 25) if missing
    if (!lead25Exists) {
        existingLeads.push({
            id: 25,
            name: 'Thomas Maina',
            email: 'thomas.maina@gmail.com',
            phone: '+254 744 555 666',
            company: 'Nyeri Dairy Farmers',
            jobTitle: 'Chairman',
            source: 'walk-in',
            status: 'Won',
            assignedTo: 2,
            value: 950000,
            closeDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            vehicleInterest: 'SUV',
            tradeIn: 'no',
            timeline: 'immediate',
            notes: 'Successfully closed deal on premium SUV. Customer very satisfied with the service and vehicle quality. Paid in full. Excellent customer experience.',
            createdAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
        });
        needsUpdate = true;
        
        // Add communications for Thomas
        const commIds = existingCommunications.map(c => c.id);
        const maxCommId = commIds.length > 0 ? Math.max(...commIds) : 0;
        existingCommunications.push(
            {
                id: maxCommId + 1,
                leadId: 25,
                type: 'walk-in',
                subject: 'Showroom Visit',
                notes: 'Thomas visited showroom. Very interested in premium SUV models. Looked at several options, particularly interested in Toyota Land Cruiser. Professional and knowledgeable customer.',
                outcome: 'positive',
                createdAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: maxCommId + 2,
                leadId: 25,
                type: 'call',
                subject: 'Follow-up Call',
                notes: 'Called to answer questions about financing and vehicle specifications. Customer very satisfied with information provided. Scheduled second visit.',
                outcome: 'positive',
                createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: maxCommId + 3,
                leadId: 25,
                type: 'meeting',
                subject: 'Final Decision Meeting',
                notes: 'Met with Thomas for final decision. Customer decided to purchase premium SUV. Completed all paperwork. Very happy with the process and vehicle.',
                outcome: 'positive',
                createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
            }
        );
        
        // Add tasks for Thomas
        const taskIds = existingTasks.map(t => t.id);
        const maxTaskId = taskIds.length > 0 ? Math.max(...taskIds) : 0;
        existingTasks.push(
            {
                id: maxTaskId + 1,
                title: 'Follow up with Thomas Maina - post sale',
                leadId: 25,
                dueDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
                priority: 'Low',
                status: 'Pending',
                assignedTo: 2,
                description: 'Follow up call to ensure customer satisfaction with purchased SUV. Check if any questions or concerns.',
                createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: maxTaskId + 2,
                title: 'Schedule delivery for Thomas',
                leadId: 25,
                dueDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                priority: 'High',
                status: 'Completed',
                assignedTo: 2,
                description: 'Scheduled vehicle delivery for Thomas Maina. Completed successfully.',
                createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()
            }
        );
    }
    
    // Add Nancy Wairimu (ID 26) if missing
    if (!lead26Exists) {
        existingLeads.push({
            id: 26,
            name: 'Nancy Wairimu',
            email: 'nancy.wairimu@yahoo.com',
            phone: '+254 755 666 777',
            company: 'Kiambu Textile Mills',
            jobTitle: 'Production Supervisor',
            source: 'website',
            status: 'Lost',
            assignedTo: 3,
            value: 330000,
            closeDate: null,
            vehicleInterest: 'Sedan',
            tradeIn: 'no',
            timeline: '1-3 months',
            notes: 'Customer decided not to proceed. Found a better deal elsewhere with lower interest rates. May reconsider in future if we can match competitor pricing.',
            createdAt: new Date(now.getTime() - 11 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
        });
        needsUpdate = true;
        
        // Add communications for Nancy
        const commIds = existingCommunications.map(c => c.id);
        const maxCommId = commIds.length > 0 ? Math.max(...commIds) : 0;
        existingCommunications.push(
            {
                id: maxCommId + 1,
                leadId: 26,
                type: 'email',
                subject: 'Initial Inquiry',
                notes: 'Nancy submitted inquiry through website contact form. Interested in economical sedan for personal use. Requested information about available models and pricing.',
                outcome: 'neutral',
                createdAt: new Date(now.getTime() - 11 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: maxCommId + 2,
                leadId: 26,
                type: 'call',
                subject: 'Initial Contact Call',
                notes: 'Called Nancy to discuss her requirements. Provided information about sedan options and financing. Customer seemed interested but wanted to compare with other dealers.',
                outcome: 'neutral',
                createdAt: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: maxCommId + 3,
                leadId: 26,
                type: 'email',
                subject: 'Proposal Sent',
                notes: 'Sent detailed proposal with pricing and financing options. Customer responded saying she found better deal elsewhere with lower interest rates.',
                outcome: 'negative',
                createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: maxCommId + 4,
                leadId: 26,
                type: 'note',
                subject: 'Lost to Competitor',
                notes: 'Customer decided not to proceed. Found better financing terms with competitor. May reconsider in future if we can match pricing. Left door open for future contact.',
                outcome: 'negative',
                createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
            }
        );
        
        // Add tasks for Nancy
        const taskIds = existingTasks.map(t => t.id);
        const maxTaskId = taskIds.length > 0 ? Math.max(...taskIds) : 0;
        existingTasks.push({
            id: maxTaskId + 1,
            title: 'Follow up with Nancy Wairimu - lost lead',
            leadId: 26,
            dueDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            priority: 'Low',
            status: 'Pending',
            assignedTo: 3,
            description: 'Follow up in one month to see if customer situation has changed. May reconsider if we can offer better financing terms.',
            createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
        });
    }
    
    // Save updated data if new leads were added
    if (needsUpdate) {
        localStorage.setItem('crm_leads', JSON.stringify(existingLeads));
        localStorage.setItem('crm_communications', JSON.stringify(existingCommunications));
        localStorage.setItem('crm_tasks', JSON.stringify(existingTasks));
    }
    
    // Return updated arrays
    return {
        leads: existingLeads,
        communications: existingCommunications,
        tasks: existingTasks
    };
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // CRITICAL: Ensure users array is loaded and saved FIRST
    // Reload users from localStorage to ensure we have the latest data
    const savedUsers = JSON.parse(localStorage.getItem('crm_users'));
    if (savedUsers && savedUsers.length > 0) {
        users = savedUsers;
    } else {
        // If no users in localStorage, save the default users
        saveUsers();
    }
    
    // Step 1: Get currentUserId from localStorage (default 1)
    currentUserId = parseInt(localStorage.getItem('currentUserId')) || 1;
    
    // Step 2: Find user in users array
    const currentUser = users.find(u => u.id === currentUserId);
    if (!currentUser) {
        console.error('Current user not found, defaulting to user 1. Available users:', users.map(u => ({id: u.id, name: u.name})));
        currentUserId = 1;
    }
    
    // Step 3: Apply role-based class BEFORE showing any content
    if (currentUser && currentUser.role === 'Sales Rep') {
        document.body.classList.add('salesrep-mode');
    } else {
        document.body.classList.remove('salesrep-mode');
    }
    
    // Setup navigation
    setupNavigation();
    setupMobileMenu();
    setupSidebarToggle();
    // Note: setupUserDropdown() is called later after users are loaded from localStorage
    
    // Ensure new leads exist (adds them if missing)
    const updatedData = ensureNewLeadsExist();
    leads = updatedData.leads;
    communications = updatedData.communications;
    tasks = updatedData.tasks;
    
    // Load initial data - ensure sample data is loaded first
    if (leads.length === 0) {
        // Sample data initialization happens above, but ensure it's saved
        saveLeads();
        saveTasks();
        saveCommunications();
    }
    
    // Reload from localStorage to ensure we have the latest data
    leads = JSON.parse(localStorage.getItem('crm_leads')) || [];
    tasks = JSON.parse(localStorage.getItem('crm_tasks')) || [];
    communications = JSON.parse(localStorage.getItem('crm_communications')) || [];
    
    // Clean names immediately for existing data
    cleanLeadNames();
    cleanUserNames();
    
    // Save users to ensure all users (Admin User as Sales Manager, Walter White and Jesse Pinkman as Sales Reps) are included
    saveUsers();
    
    // Step 4: Load all data
    loadUsers();
    
    // CRITICAL: Setup user dropdown AFTER users are loaded
    // This ensures dropdown is populated with correct user IDs from localStorage
    setupUserDropdown();
    
    // Step 5: Determine initial section based on role
    let initialSection = 'dashboard';
    if (currentUser && currentUser.role === 'Sales Rep') {
        initialSection = 'salesrep-dashboard';
    }
    
    // Apply role-based navigation visibility BEFORE showing section
    applyUserRole();
    
    // Update current user display
    updateCurrentUserDisplay();
    
    // Call showSection with the determined section (it will handle showing the correct dashboard)
    // showSection will update the dashboard data, so we don't need to call updateDashboard/updateSalesRepDashboard here
    showSection(initialSection);
    
    // Step 6: Update all views based on role (but dashboard is already updated by showSection)
    loadLeads();
    loadTasks();
    loadCommunications();
    
    // Load test drives and vehicles
    testDrives = JSON.parse(localStorage.getItem('crm_testdrives')) || [];
    vehicles = JSON.parse(localStorage.getItem('crm_vehicles')) || [];
    loadTestDrives();
    loadVehicles();
    updateVehicleDropdowns();
    
    // Update all views with filtered data based on role
    updatePipeline();
    
    // Update reports if admin (dashboard already updated by showSection)
    if (currentUser && currentUser.role !== 'Sales Rep') {
    updateReports();
    }
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup drag and drop for pipeline
    setupDragAndDrop();
    
    // Update nav previews
    updateAllNavPreviews();
}

// Mobile Menu
function setupMobileMenu() {
    const hamburger = document.getElementById('hamburger-menu');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    
    function toggleSidebar() {
            sidebar.classList.toggle('open');
        if (sidebarOverlay) {
            sidebarOverlay.classList.toggle('active');
        }
        // Prevent body scroll when sidebar is open on mobile
        if (window.innerWidth <= 767) {
            if (sidebar.classList.contains('open')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }
    }
    
    if (hamburger) {
        hamburger.addEventListener('click', toggleSidebar);
    }
    
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', toggleSidebar);
    }
    
    // Close sidebar when clicking a nav item on mobile
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
        if (window.innerWidth <= 767) {
                sidebar.classList.remove('open');
                if (sidebarOverlay) {
                    sidebarOverlay.classList.remove('active');
                }
                document.body.style.overflow = '';
            }
        });
    });
    
    // Close sidebar on window resize if it becomes desktop view
    window.addEventListener('resize', function() {
        if (window.innerWidth > 767) {
            sidebar.classList.remove('open');
            if (sidebarOverlay) {
                sidebarOverlay.classList.remove('active');
            }
            document.body.style.overflow = '';
        }
    });
    
    // Close sidebar when clicking outside on mobile (handled by overlay)
}

// Sidebar Toggle
function setupSidebarToggle() {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    const body = document.body;
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            const isCollapsed = sidebar.classList.toggle('collapsed');
            
            // Add class to body for CSS targeting
            if (isCollapsed) {
                body.classList.add('sidebar-collapsed');
            } else {
                body.classList.remove('sidebar-collapsed');
            }
            
            // Save state to localStorage
            localStorage.setItem('sidebarCollapsed', isCollapsed);
        });
        
        // Also allow clicking on the sidebar edge area (but not on nav items)
        sidebar.addEventListener('click', function(e) {
            // Only trigger if clicking directly on the handle or edge, not on nav items
            if (e.target === sidebarToggle || e.target.closest('.sidebar-resize-handle')) {
                return; // Already handled by handle click
            }
            
            // If clicking near the right edge (within 8px) and not on a nav item
            if (!e.target.closest('.nav-item') && !e.target.closest('.sidebar-nav')) {
                const rect = sidebar.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                if (clickX >= rect.width - 8) {
                    const isCollapsed = sidebar.classList.toggle('collapsed');
                    if (isCollapsed) {
                        body.classList.add('sidebar-collapsed');
                    } else {
                        body.classList.remove('sidebar-collapsed');
                    }
                    localStorage.setItem('sidebarCollapsed', isCollapsed);
                }
            }
        });
        
        // Restore sidebar state from localStorage
        const savedState = localStorage.getItem('sidebarCollapsed');
        if (savedState === 'true') {
            sidebar.classList.add('collapsed');
            body.classList.add('sidebar-collapsed');
        }
    }
}

// User Dropdown
function setupUserDropdown() {
    const dropdown = document.getElementById('user-profile-dropdown');
    const dropdownMenu = document.getElementById('user-dropdown-menu');
    
    if (!dropdown || !dropdownMenu) return;
    
    // CRITICAL: Populate dropdown dynamically from users array
    // This ensures the dropdown always matches the actual users in localStorage
    // Filter out Walter White from the dropdown
    dropdownMenu.innerHTML = '';
    users.filter(user => user.name !== 'Walter White').forEach(user => {
        const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
        const item = document.createElement('div');
        item.className = 'user-dropdown-item';
        item.setAttribute('data-user-id', user.id);
        item.innerHTML = `
            <div class="user-avatar-small">${initials}</div>
            <div>
                <div class="user-dropdown-name">${user.name}</div>
                <div class="user-dropdown-role">${user.role}</div>
            </div>
        `;
        dropdownMenu.appendChild(item);
    });
    
    const dropdownItems = document.querySelectorAll('.user-dropdown-item');
    
    // Toggle dropdown on click
    dropdown.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdown.classList.toggle('active');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    });
    
    // Handle user selection - use event delegation in case items are added dynamically
    if (dropdownMenu) {
        dropdownMenu.addEventListener('click', function(e) {
            e.stopPropagation();
            const item = e.target.closest('.user-dropdown-item');
            if (item) {
                const userId = parseInt(item.getAttribute('data-user-id'));
                if (userId && !isNaN(userId)) {
                    switchUser(userId);
                    dropdown.classList.remove('active');
                }
            }
        });
    }
    
    // Also add direct listeners as backup
    dropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            const userId = parseInt(this.getAttribute('data-user-id'));
            if (userId && !isNaN(userId)) {
                switchUser(userId);
                dropdown.classList.remove('active');
            }
        });
    });
}

function updateCurrentUserDisplay() {
    const currentUser = users.find(u => u.id === currentUserId);
    if (!currentUser) return;
    
    const avatarEl = document.getElementById('user-avatar');
    const usernameEl = document.getElementById('username');
    const dropdownItems = document.querySelectorAll('.user-dropdown-item');
    
    if (avatarEl) {
        const initials = currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase();
        avatarEl.textContent = initials;
    }
    
    if (usernameEl) {
        usernameEl.textContent = currentUser.name;
    }
    
    // Update active state in dropdown
    dropdownItems.forEach(item => {
        const userId = parseInt(item.getAttribute('data-user-id'));
        if (userId === currentUserId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

function switchUser(userId) {
    console.log('switchUser called with userId:', userId);
    
    // CRITICAL: Ensure users array is loaded from localStorage
    const savedUsers = JSON.parse(localStorage.getItem('crm_users'));
    if (savedUsers && savedUsers.length > 0) {
        users = savedUsers;
    } else {
        // If no users, save default users
        saveUsers();
    }
    
    // Step 1: First - Update the currentUserId variable
    currentUserId = userId;
    
    // Step 2: Second - Save to localStorage
    localStorage.setItem('currentUserId', String(userId));
    
    // Step 3: Third - Update the user display (avatar, name)
    updateCurrentUserDisplay();
    
    // Step 4: Fourth - Check the user's role from the users array
    const user = users.find(u => u.id === userId);
    if (!user) {
        console.error('User not found:', userId, 'Available users:', users.map(u => ({id: u.id, name: u.name})));
        // Try to reload users and find again
        const reloadedUsers = JSON.parse(localStorage.getItem('crm_users')) || [];
        if (reloadedUsers.length > 0) {
            users = reloadedUsers;
            const retryUser = users.find(u => u.id === userId);
            if (retryUser) {
                console.log('User found after reload:', retryUser.name);
                // Continue with the switch
            } else {
                console.error('User still not found after reload');
        return;
            }
        } else {
            return;
        }
    }
    
    const finalUser = user || users.find(u => u.id === userId);
    if (!finalUser) {
        console.error('Cannot proceed - user not found');
        return;
    }
    
    console.log('Switching to user:', finalUser.name, 'Role:', finalUser.role);
    
    // Step 5: Fifth - Apply role-based classes and visibility BEFORE showing any section
    if (finalUser.role === 'Sales Rep') {
        document.body.classList.add('salesrep-mode');
    } else {
        document.body.classList.remove('salesrep-mode');
    }
    
    // Apply role-based navigation visibility
    applyUserRole();
    
    // Step 6: Sixth - Determine which dashboard to show
    const targetSection = finalUser.role === 'Sales Rep' ? 'salesrep-dashboard' : 'dashboard';
    
    // Step 7: Seventh - Hide ALL sections first (remove 'active' class from all .content-section)
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    
    // Step 8: Eighth - Show ONLY the target section (add 'active' class)
    // CRITICAL: CSS uses !important rules based on body.salesrep-mode class
    // So we must ensure body class is set BEFORE showing sections
    const targetSectionEl = document.getElementById(targetSection);
    if (targetSectionEl) {
        targetSectionEl.classList.add('active');
    } else {
        console.error('Target section not found:', targetSection);
        return; // Exit if section doesn't exist
    }
    
    // Also explicitly remove active from the other dashboard
    const otherSection = finalUser.role === 'Sales Rep' ? 'dashboard' : 'salesrep-dashboard';
    const otherSectionEl = document.getElementById(otherSection);
    if (otherSectionEl) {
        otherSectionEl.classList.remove('active');
    }
    
    // Step 9: Ninth - Update navigation item active states correctly
    // Use the targetSection we determined in Step 6 to ensure nav matches the actual section shown
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        // The nav item always has data-section="dashboard" for both admin and sales rep dashboards
        // So we mark it active when we're showing either dashboard
        if (item.getAttribute('data-section') === 'dashboard') {
            item.classList.add('active');
        }
    });
    
    // Step 10: Tenth - Reload all data (leads, tasks, communications) - IMMEDIATELY
    // Reload from localStorage first - this ensures we have the latest data
    leads = JSON.parse(localStorage.getItem('crm_leads')) || [];
    tasks = JSON.parse(localStorage.getItem('crm_tasks')) || [];
    communications = JSON.parse(localStorage.getItem('crm_communications')) || [];
    vehicles = JSON.parse(localStorage.getItem('crm_vehicles')) || [];
    testDrives = JSON.parse(localStorage.getItem('crm_testdrives')) || [];
    
    // Clean lead names immediately after loading
    cleanLeadNames();
    
    // Update task lead select dropdown
    updateTaskLeadSelect();
    
    // Filter and display leads (this updates the leads table)
    filterLeads();
    
    // Filter and display tasks (this updates the tasks list)
    filterTasks();
    
    // Load communications
    loadCommunications();
    
    // Update pipeline with filtered data
    updatePipeline();
    
    // Step 11: Finally - Update all views (pipeline, reports, metrics)
    // CRITICAL: Update dashboard AFTER ensuring correct section is visible and data is loaded
    // Use requestAnimationFrame to ensure DOM has time to reflow before metrics update
    requestAnimationFrame(() => {
        // Ensure the section is fully active and visible before updating
        if (targetSectionEl && targetSectionEl.classList.contains('active')) {
            // Force a reflow to ensure the section is rendered
            void targetSectionEl.offsetHeight;
            
            // Now update the dashboard metrics
            if (finalUser.role === 'Sales Rep') {
                updateSalesRepDashboard();
            } else {
                updateDashboard();
                updateReports();
            }
            
            updateAllNavPreviews();
            
            // Force another reflow after updates to ensure rendering
            requestAnimationFrame(() => {
                if (targetSectionEl) {
                    // Force reflow on metric cards directly
                    const metricCards = targetSectionEl.querySelectorAll('.metric-card, .metric-value');
                    metricCards.forEach(card => {
                        void card.offsetHeight;
                    });
                    // Additional reflow triggers
                    void targetSectionEl.getBoundingClientRect();
                }
            });
        }
    });
    
    showToast(`Switched to ${finalUser.name}`, 'success');
}

// Dashboard Display Logic - Phase 1
function applyDashboardDisplayLogic(user) {
    if (!user) {
        const currentUser = users.find(u => u.id === currentUserId);
        if (!currentUser) return;
        user = currentUser;
    }
    
    const body = document.body;
    const adminDashboard = document.getElementById('dashboard');
    const salesrepDashboard = document.getElementById('salesrep-dashboard');
    
    // First, remove active from both dashboards to ensure clean state
    if (adminDashboard) {
        adminDashboard.classList.remove('active');
    }
    if (salesrepDashboard) {
        salesrepDashboard.classList.remove('active');
    }
    
    // Check the new user's role from the users array
    if (user.role === 'Admin' || user.role === 'Sales Manager') {
        // Remove class "salesrep-mode" from body element
        body.classList.remove('salesrep-mode');
        
        // Show section with id="dashboard" (the admin one)
        if (adminDashboard) {
            adminDashboard.classList.add('active');
            // Update admin dashboard data
            updateDashboard();
        }
        
        // Hide section with id="salesrep-dashboard"
        if (salesrepDashboard) {
            salesrepDashboard.classList.remove('active');
        }
    } else if (user.role === 'Sales Rep') {
        // Add class "salesrep-mode" to body element
        body.classList.add('salesrep-mode');
        
        // Show section with id="salesrep-dashboard" (the rep one)
        if (salesrepDashboard) {
            salesrepDashboard.classList.add('active');
            // Update Sales Rep dashboard data
            updateSalesRepDashboard();
        }
        
        // Hide section with id="dashboard"
        if (adminDashboard) {
            adminDashboard.classList.remove('active');
        }
    }
}

function applyUserRole() {
    const currentUser = users.find(u => u.id === currentUserId);
    if (!currentUser) return;
    
    // Navigation Visibility - Instruction Set 1B
    const settingsNav = document.querySelector('[data-section="users"]');
    const reportsNav = document.querySelector('[data-section="reports"]');
    const testDrivesNav = document.querySelector('[data-section="testdrives"]');
    const inventoryNav = document.querySelector('[data-section="inventory"]');
    
    if (currentUser.role === 'Sales Rep') {
        // When switching to Sales Rep:
        // Find the nav item with data-section="users" (Settings)
        if (settingsNav) {
            settingsNav.style.display = 'none';
        }
        // Find the nav item with data-section="reports" (Reports)
        if (reportsNav) {
            reportsNav.style.display = 'none';
        }
        // Hide admin-only sections
        if (testDrivesNav) {
            testDrivesNav.style.display = 'none';
        }
        if (inventoryNav) {
            inventoryNav.style.display = 'none';
        }
    } else {
        // When switching to Admin:
        // Find both nav items above
        // Set their style.display to "flex" (or remove display property)
        if (settingsNav) {
            settingsNav.style.display = 'flex';
        }
        if (reportsNav) {
            reportsNav.style.display = 'flex';
        }
        // Show admin-only sections
        if (testDrivesNav) {
            testDrivesNav.style.display = 'flex';
        }
        if (inventoryNav) {
            inventoryNav.style.display = 'flex';
        }
    }
}

// Get filtered data based on user role
function getFilteredLeads() {
    const currentUser = users.find(u => u.id === currentUserId);
    if (!currentUser) return leads;
    
    // Sales Rep only sees their own leads
    if (currentUser.role === 'Sales Rep') {
        return leads.filter(l => l.assignedTo === currentUserId);
    }
    
    // Admin and Sales Manager see all leads
    return leads;
}

function getFilteredTasks() {
    const currentUser = users.find(u => u.id === currentUserId);
    if (!currentUser) return tasks;
    
    // Sales Rep only sees their own tasks
    if (currentUser.role === 'Sales Rep') {
        const userId = parseInt(currentUserId);
        // Ensure type consistency - convert both to numbers for comparison
        // Show tasks that are either:
        // 1. Assigned directly to the sales rep (task.assignedTo === userId)
        // 2. Assigned to leads that belong to the sales rep (lead.assignedTo === userId)
        return tasks.filter(t => {
            const taskAssignedTo = t.assignedTo ? parseInt(t.assignedTo) : null;
            
            // Check if task is directly assigned to this user
            if (taskAssignedTo === userId) {
                return true;
            }
            
            // If task has no assignedTo, check if the lead belongs to this user
            if (!taskAssignedTo && t.leadId) {
                const lead = leads.find(l => l.id === t.leadId);
                if (lead && parseInt(lead.assignedTo) === userId) {
                    return true;
                }
            }
            
            return false;
        });
    }
    
    // Admin and Sales Manager see all tasks
    return tasks;
}

function getFilteredCommunications() {
    const currentUser = users.find(u => u.id === currentUserId);
    if (!currentUser) return communications;
    
    // Sales Rep only sees communications for their leads
    if (currentUser.role === 'Sales Rep') {
        const userLeadIds = leads.filter(l => l.assignedTo === currentUserId).map(l => l.id);
        return communications.filter(c => userLeadIds.includes(c.leadId));
    }
    
    // Admin and Sales Manager see all communications
    return communications;
}

// Navigation
function setupNavigation() {
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Step 4: Fix Navigation Click Handlers
            // Get the data-section attribute value
            let section = this.getAttribute('data-section');
            
            // Get current user role
            const currentUser = users.find(u => u.id === currentUserId);
            
            // If data-section is "dashboard" AND user is Sales Rep
            if (section === 'dashboard' && currentUser && currentUser.role === 'Sales Rep') {
                // Call showSection("salesrep-dashboard") instead
                section = 'salesrep-dashboard';
            }
            
            // Otherwise call showSection normally
            showSection(section);
            
            // Update active state
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Close mobile menu
            if (window.innerWidth <= 767) {
                document.getElementById('sidebar').classList.remove('open');
            }
        });
        
        // Setup hover preview for collapsed sidebar
        item.addEventListener('mouseenter', function() {
            const sidebar = document.getElementById('sidebar');
            if (sidebar && sidebar.classList.contains('collapsed')) {
                updateNavPreview(this);
            }
        });
    });
    
    // Update all previews initially
    updateAllNavPreviews();
    
    // Setup settings navigation
    setupSettingsNavigation();
}

function updateAllNavPreviews() {
    // Reload data
    leads = JSON.parse(localStorage.getItem('crm_leads')) || [];
    tasks = JSON.parse(localStorage.getItem('crm_tasks')) || [];
    communications = JSON.parse(localStorage.getItem('crm_communications')) || [];
    
    // Update each preview (they will use filtered data internally)
    updateNavPreview(document.querySelector('[data-section="dashboard"]'));
    updateNavPreview(document.querySelector('[data-section="leads"]'));
    updateNavPreview(document.querySelector('[data-section="tasks"]'));
    updateNavPreview(document.querySelector('[data-section="pipeline"]'));
    updateNavPreview(document.querySelector('[data-section="reports"]'));
    updateNavPreview(document.querySelector('[data-section="users"]'));
}

function updateNavPreview(navItem) {
    if (!navItem) return;
    
    const section = navItem.getAttribute('data-section');
    const previewContent = navItem.querySelector('.nav-preview-content');
    if (!previewContent) return;
    
    // Reload data to ensure we have latest
    leads = JSON.parse(localStorage.getItem('crm_leads')) || [];
    tasks = JSON.parse(localStorage.getItem('crm_tasks')) || [];
    communications = JSON.parse(localStorage.getItem('crm_communications')) || [];
    
    let content = '';
    
    // Use filtered data based on user role
    const filteredLeads = getFilteredLeads();
    const filteredTasks = getFilteredTasks();
    const filteredComms = getFilteredCommunications();
    
    switch(section) {
        case 'dashboard':
            const totalLeads = filteredLeads.length;
            const activeLeads = filteredLeads.filter(l => ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation'].includes(l.status)).length;
            const wonLeads = filteredLeads.filter(l => l.status === 'Won').length;
            const revenue = filteredLeads.filter(l => l.status === 'Won').reduce((sum, l) => sum + (l.value || 0), 0);
            const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;
            content = `
                <div class="nav-preview-item"><strong>Total Leads:</strong> ${totalLeads}</div>
                <div class="nav-preview-item"><strong>Active Leads:</strong> ${activeLeads}</div>
                <div class="nav-preview-item"><strong>Conversion Rate:</strong> ${conversionRate}%</div>
                <div class="nav-preview-item"><strong>Revenue:</strong> ${formatCurrency(revenue)}</div>
            `;
            break;
            
        case 'leads':
            const newLeads = filteredLeads.filter(l => l.status === 'New').length;
            const contactedLeads = filteredLeads.filter(l => l.status === 'Contacted').length;
            const qualifiedLeads = filteredLeads.filter(l => l.status === 'Qualified').length;
            content = `
                <div class="nav-preview-item"><strong>Total Leads:</strong> ${filteredLeads.length}</div>
                <div class="nav-preview-item"><strong>New:</strong> ${newLeads}</div>
                <div class="nav-preview-item"><strong>Contacted:</strong> ${contactedLeads}</div>
                <div class="nav-preview-item"><strong>Qualified:</strong> ${qualifiedLeads}</div>
                <div class="nav-preview-item"><strong>View all leads,</strong> edit details, and manage your sales pipeline</div>
            `;
            break;
            
        case 'tasks':
            const pendingTasks = filteredTasks.filter(t => t.status === 'Pending').length;
            const overdueTasks = filteredTasks.filter(t => {
                if (t.status === 'Pending') {
                    const dueDate = new Date(t.dueDate);
                    return dueDate < new Date();
                }
                return false;
            }).length;
            const completedTasks = filteredTasks.filter(t => t.status === 'Completed').length;
            content = `
                <div class="nav-preview-item"><strong>Total Tasks:</strong> ${filteredTasks.length}</div>
                <div class="nav-preview-item"><strong>Pending:</strong> ${pendingTasks}</div>
                <div class="nav-preview-item"><strong>Overdue:</strong> ${overdueTasks}</div>
                <div class="nav-preview-item"><strong>Completed:</strong> ${completedTasks}</div>
                <div class="nav-preview-item"><strong>Manage follow-ups,</strong> set reminders, and track task completion</div>
            `;
            break;
            
        case 'pipeline':
            const stages = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'];
            const stageCounts = stages.map(stage => filteredLeads.filter(l => l.status === stage).length);
            content = `
                <div class="nav-preview-item"><strong>New:</strong> ${stageCounts[0]}</div>
                <div class="nav-preview-item"><strong>Contacted:</strong> ${stageCounts[1]}</div>
                <div class="nav-preview-item"><strong>Qualified:</strong> ${stageCounts[2]}</div>
                <div class="nav-preview-item"><strong>Proposal:</strong> ${stageCounts[3]}</div>
                <div class="nav-preview-item"><strong>Negotiation:</strong> ${stageCounts[4]}</div>
                <div class="nav-preview-item"><strong>Won:</strong> ${stageCounts[5]} | <strong>Lost:</strong> ${stageCounts[6]}</div>
                <div class="nav-preview-item"><strong>Drag and drop</strong> cards to move leads through stages</div>
            `;
            break;
            
        case 'reports':
            const wonCount = filteredLeads.filter(l => l.status === 'Won').length;
            const totalRevenue = filteredLeads.filter(l => l.status === 'Won').reduce((sum, l) => sum + (l.value || 0), 0);
            content = `
                <div class="nav-preview-item"><strong>Won Deals:</strong> ${wonCount}</div>
                <div class="nav-preview-item"><strong>Total Revenue:</strong> ${formatCurrency(totalRevenue)}</div>
                <div class="nav-preview-item"><strong>View analytics,</strong> conversion funnels, source performance, and sales reports</div>
            `;
            break;
            
        case 'users':
            const totalUsers = users.length;
            content = `
                <div class="nav-preview-item"><strong>Team Members:</strong> ${totalUsers}</div>
                <div class="nav-preview-item"><strong>Manage users,</strong> permissions, pipeline stages, and system settings</div>
            `;
            break;
    }
    
    previewContent.innerHTML = content;
}

// Settings navigation (called from setupNavigation)
function setupSettingsNavigation() {
    const settingsNavItems = document.querySelectorAll('.settings-nav-item');
    settingsNavItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const tab = this.getAttribute('data-tab');
            showSettingsTab(tab);
            
            settingsNavItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function showSettingsTab(tabName) {
    const tabs = document.querySelectorAll('.settings-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    const targetTab = document.getElementById(tabName + '-tab');
    if (targetTab) {
        targetTab.classList.add('active');
    }
}

function showSection(sectionName) {
    // At the VERY START: Get the current user from the users array using currentUserId
    const currentUser = users.find(u => u.id === currentUserId);
    if (!currentUser) return;
    
    // Check if user role is "Sales Rep" AND sectionName is "dashboard"
    if (currentUser.role === 'Sales Rep' && sectionName === 'dashboard') {
        // Change sectionName to "salesrep-dashboard"
        sectionName = 'salesrep-dashboard';
    }
    
    // If user role is NOT "Sales Rep" AND sectionName is "salesrep-dashboard"
    if (currentUser.role !== 'Sales Rep' && sectionName === 'salesrep-dashboard') {
        // Change sectionName to "dashboard"
        sectionName = 'dashboard';
    }
    
    // THEN proceed with the rest of the function
    if (sectionName === 'dashboard' || sectionName === 'salesrep-dashboard') {
        // Hide all sections first
        document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
        
        // Show target section
        const targetSectionEl = document.getElementById(sectionName);
        if (targetSectionEl) {
            targetSectionEl.classList.add('active');
        }
        
        // Update dashboard data
        if (currentUser.role === 'Sales Rep') {
            updateSalesRepDashboard();
        } else {
            updateDashboard();
        }
        
        // Update navigation active state
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-section') === 'dashboard') {
                item.classList.add('active');
            }
        });
        
        return;
    } else {
        // For non-dashboard sections, use standard section switching
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Refresh section data - reload from localStorage first to ensure latest data
            leads = JSON.parse(localStorage.getItem('crm_leads')) || [];
            tasks = JSON.parse(localStorage.getItem('crm_tasks')) || [];
            communications = JSON.parse(localStorage.getItem('crm_communications')) || [];
            
            // Refresh section data
            if (sectionName === 'pipeline') {
                updatePipeline();
                // Ensure drag and drop is set up when pipeline is shown
                setTimeout(() => setupDragAndDrop(), 100);
            } else if (sectionName === 'reports') {
                updateReports();
            } else if (sectionName === 'testdrives') {
                loadTestDrives();
            } else if (sectionName === 'inventory') {
                loadVehicles();
            } else if (sectionName === 'leads') {
                loadLeads();
            } else if (sectionName === 'tasks') {
                loadTasks();
            } else if (sectionName === 'users') {
                loadUsers();
                // Initialize targets period selector when settings section is shown
                setTimeout(() => {
                    initializeTargetsPeriodSelector();
                }, 100);
            }
        } else {
            console.error('Section not found:', sectionName);
        }
    }
    
    // Update nav previews when section changes
    updateAllNavPreviews();
}

// Event Listeners
function setupEventListeners() {
    // Lead search and filters
    const leadSearch = document.getElementById('lead-search');
    if (leadSearch) {
        leadSearch.addEventListener('input', filterLeads);
    }
    const statusFilter = document.getElementById('status-filter');
    if (statusFilter) {
        statusFilter.addEventListener('change', filterLeads);
    }
    const sourceFilter = document.getElementById('source-filter');
    if (sourceFilter) {
        sourceFilter.addEventListener('change', filterLeads);
    }
    const assignedFilter = document.getElementById('assigned-filter');
    if (assignedFilter) {
        assignedFilter.addEventListener('change', filterLeads);
    }
    
    // Top search
    const topSearch = document.getElementById('top-search-input');
    if (topSearch) {
        topSearch.addEventListener('input', function(e) {
            if (e.target.value.length > 2) {
                // Global search functionality
                filterLeads();
            }
        });
    }
    
    // Task filters
    const taskStatusFilter = document.getElementById('task-status-filter');
    if (taskStatusFilter) {
        taskStatusFilter.addEventListener('change', filterTasks);
    }
    const taskPriorityFilter = document.getElementById('task-priority-filter');
    if (taskPriorityFilter) {
        taskPriorityFilter.addEventListener('change', filterTasks);
    }
    const taskAssignedFilter = document.getElementById('task-assigned-filter');
    if (taskAssignedFilter) {
        taskAssignedFilter.addEventListener('change', filterTasks);
    }
    
    // Contact search
    const contactSearch = document.getElementById('contact-search');
    if (contactSearch) {
        contactSearch.addEventListener('input', filterContacts);
    }
    
    // Sort leads by value column header
    const valueSortHeader = document.getElementById('value-sort-header');
    if (valueSortHeader) {
        valueSortHeader.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent any default behavior
            sortLeads('value');
        });
    }
    
    // Close modals on escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}


function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
    document.getElementById('lead-detail-panel')?.classList.remove('active');
}

// User Management
function loadUsers() {
    // Clean user names by removing initials
    cleanUserNames();
    saveUsers();
    const usersSelect = document.getElementById('lead-assigned');
    const taskUsersSelect = document.getElementById('task-assigned');
    const assignedFilter = document.getElementById('assigned-filter');
    const taskAssignedFilter = document.getElementById('task-assigned-filter');
    
    // Clear existing options (except first)
    [usersSelect, taskUsersSelect, assignedFilter, taskAssignedFilter].forEach(select => {
        if (select) {
            while (select.options.length > (select.id === 'assigned-filter' || select.id === 'task-assigned-filter' ? 1 : 1)) {
                select.remove(1);
            }
        }
    });
    
    users.forEach(user => {
        const option1 = new Option(user.name, user.id);
        const option2 = new Option(user.name, user.id);
        const option3 = new Option(user.name, user.id);
        const option4 = new Option(user.name, user.id);
        if (usersSelect) usersSelect.appendChild(option1);
        if (taskUsersSelect) taskUsersSelect.appendChild(option2);
        if (assignedFilter) assignedFilter.appendChild(option3);
        if (taskAssignedFilter) taskAssignedFilter.appendChild(option4);
    });
    
    updateUsersTable();
}

function updateUsersTable() {
    const tbody = document.getElementById('users-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td><span class="status-badge status-new">${user.role}</span></td>
            <td><span class="status-badge" style="color: #06d6a0;">Active</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-primary" onclick="editUser(${user.id})">Edit</button>
                    ${user.id !== currentUserId ? `<button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})">Delete</button>` : ''}
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Load Lead Sources (Read-only)
function loadLeadSources() {
    const container = document.getElementById('lead-sources-list');
    if (!container) return;
    
    const sources = [
        { key: 'website', name: 'Website' },
        { key: 'referral', name: 'Referral' },
        { key: 'walk-in', name: 'Walk-in' },
        { key: 'phone', name: 'Phone' },
        { key: 'social-media', name: 'Social Media' }
    ];
    
    container.innerHTML = '';
    sources.forEach(source => {
        const item = document.createElement('div');
        item.style.cssText = 'padding: var(--spacing-md); border: 1px solid var(--light-gray); border-radius: 6px; margin-bottom: var(--spacing-sm); background: var(--pure-white); display: flex; align-items: center; justify-content: space-between;';
        item.innerHTML = `
            <span style="font-size: 14px; font-weight: 500; color: var(--charcoal);">${source.name}</span>
        `;
        container.appendChild(item);
    });
}

// Load Pipeline Stages (Read-only)
function loadPipelineStages() {
    const container = document.getElementById('pipeline-stages-list');
    if (!container) return;
    
    const stages = [
        { name: 'New', color: '#118ab2' },
        { name: 'Contacted', color: '#2c7da0' },
        { name: 'Qualified', color: '#06d6a0' },
        { name: 'Proposal', color: '#d97706' },
        { name: 'Negotiation', color: '#014f86' },
        { name: 'Won', color: '#06d6a0' },
        { name: 'Lost', color: '#ef476f' }
    ];
    
    container.innerHTML = '';
    stages.forEach(stage => {
        const item = document.createElement('div');
        item.style.cssText = 'padding: var(--spacing-md); border: 1px solid var(--light-gray); border-radius: 6px; margin-bottom: var(--spacing-sm); background: var(--pure-white); display: flex; align-items: center; justify-content: space-between;';
        item.innerHTML = `
            <div style="display: flex; align-items: center; gap: var(--spacing-md);">
                <div style="width: 12px; height: 12px; background: ${stage.color}; border-radius: 2px;"></div>
                <span style="font-size: 14px; font-weight: 500; color: var(--charcoal);">${stage.name}</span>
            </div>
        `;
        container.appendChild(item);
    });
}

function openUserModal(userId = null) {
    const modal = document.getElementById('user-modal');
    const form = document.getElementById('user-form');
    const title = document.getElementById('user-modal-title');
    
    form.reset();
    document.getElementById('user-id').value = '';
    
    if (userId) {
        const user = users.find(u => u.id === userId);
        if (user) {
            title.textContent = 'Edit User';
            document.getElementById('user-id').value = user.id;
            document.getElementById('user-name').value = user.name;
            document.getElementById('user-email').value = user.email;
            document.getElementById('user-role').value = user.role;
        }
    } else {
        title.textContent = 'Add New User';
    }
    
    modal.classList.add('active');
}

function saveUser() {
    const id = document.getElementById('user-id').value;
    let name = document.getElementById('user-name').value;
    // Clean name by removing initials
    name = removeInitialFromName(name);
    const email = document.getElementById('user-email').value;
    const role = document.getElementById('user-role').value;
    const password = document.getElementById('user-password').value;
    
    if (!name || !email || !role) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    if (id) {
        // Update existing user
        const userIndex = users.findIndex(u => u.id === parseInt(id));
        if (userIndex !== -1) {
            users[userIndex].name = name;
            users[userIndex].email = email;
            users[userIndex].role = role;
            if (password) {
                users[userIndex].password = password;
            }
        }
    } else {
        // Create new user
        const newUser = {
            id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
            name,
            email,
            role,
            password: password || 'password123',
            lastActivity: new Date().toISOString()
        };
        users.push(newUser);
    }
    
    saveUsers();
    loadUsers();
    showToast('User saved successfully', 'success');
    closeModal('user-modal');
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        users = users.filter(u => u.id !== userId);
        saveUsers();
        loadUsers();
        showToast('User deleted successfully', 'success');
    }
}

function editUser(userId) {
    openUserModal(userId);
}

// Lead Management
function loadLeads() {
    // Reload from localStorage to ensure we have latest data
    leads = JSON.parse(localStorage.getItem('crm_leads')) || [];
    // Clean names by removing initials
    cleanLeadNames();
    saveLeads();
    filterLeads();
    updateTaskLeadSelect();
    updateDashboard();
    updatePipeline();
}

function filterLeads() {
    // Step 6: Hide/Show filters based on user role
    const currentUser = users.find(u => u.id === currentUserId);
    const isSalesRep = currentUser && currentUser.role === 'Sales Rep';
    const assignedFilter = document.getElementById('assigned-filter');
    if (assignedFilter) {
        assignedFilter.style.display = isSalesRep ? 'none' : 'block';
    }
    
    const search = document.getElementById('lead-search')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('status-filter')?.value || '';
    const sourceFilter = document.getElementById('source-filter')?.value || '';
    const assignedFilterValue = assignedFilter?.value || '';
    
    // Use filtered leads based on user role
    const roleFilteredLeads = getFilteredLeads();
    
    const filtered = roleFilteredLeads.filter(lead => {
        const matchesSearch = !search || 
            lead.name.toLowerCase().includes(search) ||
            lead.email.toLowerCase().includes(search) ||
            lead.phone.includes(search);
        const matchesStatus = !statusFilter || lead.status === statusFilter;
        const matchesSource = !sourceFilter || lead.source === sourceFilter;
        const matchesAssigned = !assignedFilterValue || lead.assignedTo === parseInt(assignedFilterValue);
        
        return matchesSearch && matchesStatus && matchesSource && matchesAssigned;
    });
    
    displayLeads(filtered);
}

function displayLeads(leadsToShow) {
    const tbody = document.getElementById('leads-table-body');
    if (!tbody) return;
    
    // Clean all lead names before displaying (ensure they're clean even if missed earlier)
    let needsSave = false;
    leadsToShow.forEach(lead => {
        const originalName = lead.name;
        const cleanedName = removeInitialFromName(lead.name);
        if (cleanedName !== originalName) {
            lead.name = cleanedName;
            // Update in main leads array too
            const mainLead = leads.find(l => l.id === lead.id);
            if (mainLead && mainLead.name === originalName) {
                mainLead.name = cleanedName;
                needsSave = true;
            }
        }
    });
    // Save if any were updated
    if (needsSave) {
        saveLeads();
    }
    
    // Update table header visibility based on user role
    const currentUser = users.find(u => u.id === currentUserId);
    const isAdmin = currentUser && (currentUser.role === 'Admin' || currentUser.role === 'Sales Manager');
    const isSalesRep = currentUser && currentUser.role === 'Sales Rep';
    
    // Hide/show "Assigned To" column header for Sales Reps
    const tableHeaders = document.querySelectorAll('.data-table thead th');
    tableHeaders.forEach((th) => {
        if (th.textContent.trim().includes('Assigned To')) {
            th.style.display = isSalesRep ? 'none' : 'table-cell';
        }
    });
    
    // Ensure table layout is fixed for proper column alignment
    const table = document.querySelector('.data-table');
    if (table) {
        table.style.tableLayout = 'fixed';
    }
    
    tbody.innerHTML = '';
    
    if (leadsToShow.length === 0) {
        const colspan = isSalesRep ? 7 : 8;
        tbody.innerHTML = `<tr><td colspan="${colspan}" class="text-center">No leads found</td></tr>`;
        return;
    }
    
    leadsToShow.forEach(lead => {
        const assignedUser = users.find(u => u.id === lead.assignedTo);
        const lastComm = communications.filter(c => c.leadId === lead.id).sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt))[0];
        
        const row = document.createElement('tr');
        
        // Build row HTML - conditionally include "Assigned To" column
        let rowHTML = `
            <td style="width: 180px; text-align: left;">
                <strong>${lead.name}</strong>
            </td>
            <td style="width: 200px; text-align: left;">
                <div style="font-size: 14px;">${lead.email}</div>
                <div style="font-size: 12px; color: #8d99ae;">${lead.phone}</div>
            </td>
            <td style="width: 120px; text-align: left;"><span class="status-badge" style="color: #014f86;">${formatSource(lead.source)}</span></td>
            <td style="width: 120px; text-align: left;"><span class="status-badge status-${lead.status.toLowerCase()}">${lead.status}</span></td>
            <td style="width: 120px; text-align: right;">${lead.value ? formatCurrency(lead.value) : '-'}</td>
        `;
        
        // Only show "Assigned To" column for Admin/Sales Manager
        if (!isSalesRep) {
            rowHTML += `
            <td style="width: 150px; text-align: left;">
                ${assignedUser ? `
                    <span style="font-size: 14px;">${assignedUser.name}</span>
                ` : '<span style="color: #8d99ae;">Unassigned</span>'}
            </td>
            `;
        }
        
        rowHTML += `
            <td style="width: 130px; text-align: left; font-size: 12px; color: #8d99ae;">${lastComm ? formatDate(lastComm.createdAt) : formatDate(lead.createdAt)}</td>
            <td style="width: 120px; text-align: center;">
                <div class="action-buttons" onclick="event.stopPropagation()">
                    <button class="btn btn-sm btn-secondary" onclick="viewLeadDetails(${lead.id})">View</button>
                </div>
            </td>
        `;
        
        row.innerHTML = rowHTML;
        tbody.appendChild(row);
    });
    
    // Update total count
    const totalCountEl = document.getElementById('total-leads-count');
    if (totalCountEl) {
        totalCountEl.textContent = leadsToShow.length;
    }
    
    // Force a browser reflow to ensure table updates are rendered immediately
    // Reading layout properties forces the browser to calculate layout and render changes
    if (tbody) {
        void tbody.offsetHeight; // Force reflow
        void tbody.offsetWidth; // Force reflow
        void tbody.getBoundingClientRect(); // Strong reflow trigger
    }
    
    // Also force reflow on the table itself
    if (table) {
        void table.offsetHeight;
    }
}

// Sorting state
let leadsSortColumn = null;
let leadsSortDirection = 'asc';

function sortLeads(column) {
    // Only allow sorting by value column
    if (column !== 'value') {
        return;
    }
    
    const filteredLeads = getFilteredLeads();
    
    // Apply current filters first
    const search = document.getElementById('lead-search')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('status-filter')?.value || '';
    const sourceFilter = document.getElementById('source-filter')?.value || '';
    const assignedFilter = document.getElementById('assigned-filter');
    const assignedFilterValue = assignedFilter?.value || '';
    
    let leadsToSort = filteredLeads.filter(lead => {
        const matchesSearch = !search || 
            lead.name.toLowerCase().includes(search) ||
            lead.email.toLowerCase().includes(search) ||
            lead.phone.includes(search);
        const matchesStatus = !statusFilter || lead.status === statusFilter;
        const matchesSource = !sourceFilter || lead.source === sourceFilter;
        const matchesAssigned = !assignedFilterValue || lead.assignedTo === parseInt(assignedFilterValue);
        
        return matchesSearch && matchesStatus && matchesSource && matchesAssigned;
    });
    
    // Toggle sort direction if clicking the same column
    if (leadsSortColumn === column) {
        leadsSortDirection = leadsSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        leadsSortColumn = column;
        leadsSortDirection = 'desc'; // Start with descending (high to low)
    }
    
    // Sort the leads by value
    const sortedLeads = [...leadsToSort].sort((a, b) => {
        const aVal = a.value || 0;
        const bVal = b.value || 0;
        
        if (aVal < bVal) return leadsSortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return leadsSortDirection === 'asc' ? 1 : -1;
        return 0;
    });
    
    // Update sort indicator - toggle between ↑ and ↓
    const sortIndicator = document.getElementById('value-sort-indicator');
    if (sortIndicator) {
        sortIndicator.textContent = leadsSortDirection === 'asc' ? '↑' : '↓';
        // Force reflow on indicator update
        void sortIndicator.offsetHeight;
    }
    
    // Display sorted leads - use requestAnimationFrame to ensure DOM has time to process click event
    // This ensures the table repaints immediately after sorting
    requestAnimationFrame(() => {
        displayLeads(sortedLeads);
        
        // Force additional reflow after display to ensure immediate rendering
        requestAnimationFrame(() => {
            const tbody = document.getElementById('leads-table-body');
            const table = document.querySelector('.data-table');
            if (tbody) {
                void tbody.offsetHeight;
                void tbody.offsetWidth;
                void tbody.getBoundingClientRect();
            }
            if (table) {
                void table.offsetHeight;
                void table.getBoundingClientRect();
            }
            
            // Also force reflow on the leads section container
            const leadsSection = document.getElementById('leads');
            if (leadsSection) {
                void leadsSection.offsetHeight;
            }
        });
    });
}

function openLeadModal(leadId = null) {
    const modal = document.getElementById('lead-modal');
    const form = document.getElementById('lead-form');
    const title = document.getElementById('lead-modal-title');
    
    form.reset();
    document.getElementById('lead-id').value = '';
    
    // Populate vehicle dropdown
    updateVehicleDropdowns();
    
    if (leadId) {
        const lead = leads.find(l => l.id === leadId);
        if (lead) {
            title.textContent = 'Edit Lead';
            document.getElementById('lead-id').value = lead.id;
            document.getElementById('lead-name').value = lead.name;
            document.getElementById('lead-email').value = lead.email;
            document.getElementById('lead-phone').value = lead.phone;
            document.getElementById('lead-company').value = lead.company || '';
            document.getElementById('lead-job-title').value = lead.jobTitle || '';
            document.getElementById('lead-source').value = lead.source;
            document.getElementById('lead-status').value = lead.status;
            document.getElementById('lead-assigned').value = lead.assignedTo || '';
            document.getElementById('lead-value').value = lead.value || '';
            document.getElementById('lead-close-date').value = lead.closeDate ? lead.closeDate.split('T')[0] : '';
            // Set vehicle dropdown - prefer vehicleId over vehicleInterest
            if (lead.vehicleId) {
                document.getElementById('lead-vehicle-interest').value = lead.vehicleId;
            } else {
                document.getElementById('lead-vehicle-interest').value = lead.vehicleInterest || '';
            }
            const tradeInRadio = document.querySelector(`input[name="trade-in"][value="${lead.tradeIn || 'no'}"]`);
            if (tradeInRadio) tradeInRadio.checked = true;
            document.getElementById('lead-timeline').value = lead.timeline || '';
            document.getElementById('lead-notes').value = lead.notes || '';
        }
    } else {
        title.textContent = 'Add New Lead';
    }
    
    modal.classList.add('active');
}

function saveLead() {
    const id = document.getElementById('lead-id').value;
    let name = document.getElementById('lead-name').value;
    // Clean name by removing initials
    name = removeInitialFromName(name);
    const email = document.getElementById('lead-email').value;
    const phone = document.getElementById('lead-phone').value;
    const company = document.getElementById('lead-company').value;
    const jobTitle = document.getElementById('lead-job-title').value;
    const source = document.getElementById('lead-source').value;
    const status = document.getElementById('lead-status').value;
    const assignedTo = document.getElementById('lead-assigned').value;
    const value = document.getElementById('lead-value').value;
    const closeDate = document.getElementById('lead-close-date').value;
    const vehicleInterest = document.getElementById('lead-vehicle-interest').value;
    const vehicleId = vehicleInterest ? parseInt(vehicleInterest) : null;
    const tradeIn = document.querySelector('input[name="trade-in"]:checked')?.value || 'no';
    const timeline = document.getElementById('lead-timeline').value;
    const notes = document.getElementById('lead-notes').value;
    
    if (!name || !email || !phone || !source || !status) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    // If vehicle is selected, get its price for value
    let finalValue = value ? parseFloat(value) : null;
    if (vehicleId && !finalValue) {
        const vehicle = vehicles.find(v => v.id === vehicleId);
        if (vehicle) {
            finalValue = vehicle.price;
        }
    }
    
    if (id) {
        // Update existing lead
        const leadIndex = leads.findIndex(l => l.id === parseInt(id));
        if (leadIndex !== -1) {
            leads[leadIndex] = {
                ...leads[leadIndex],
                name,
                email,
                phone,
                company,
                jobTitle,
                source,
                status,
                assignedTo: assignedTo ? parseInt(assignedTo) : null,
                value: finalValue,
                closeDate: closeDate ? new Date(closeDate).toISOString() : null,
                vehicleId: vehicleId,
                vehicleInterest: vehicleId ? null : vehicleInterest, // Keep text if no vehicle selected
                tradeIn,
                timeline,
                notes,
                updatedAt: new Date().toISOString()
            };
        }
    } else {
        // Create new lead
        const newLead = {
            id: leads.length > 0 ? Math.max(...leads.map(l => l.id)) + 1 : 1,
            name,
            email,
            phone,
            company,
            jobTitle,
            source,
            status,
            assignedTo: assignedTo ? parseInt(assignedTo) : null,
            value: finalValue,
            closeDate: closeDate ? new Date(closeDate).toISOString() : null,
            vehicleId: vehicleId,
            vehicleInterest: vehicleId ? null : vehicleInterest, // Keep text if no vehicle selected
            tradeIn,
            timeline,
            notes,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        leads.push(newLead);
    }
    
    saveLeads();
    loadLeads();
    updateDashboard();
    updatePipeline();
    showToast('Lead saved successfully', 'success');
    closeModal('lead-modal');
}

function deleteLead(leadId) {
    if (confirm('Are you sure you want to delete this lead?')) {
        leads = leads.filter(l => l.id !== leadId);
        tasks = tasks.filter(t => t.leadId !== leadId);
        communications = communications.filter(c => c.leadId !== leadId);
        saveLeads();
        saveTasks();
        saveCommunications();
        loadLeads();
        loadTasks();
        updateDashboard();
        updatePipeline();
        showToast('Lead deleted successfully', 'success');
    }
}

function editLead(leadId) {
    openLeadModal(leadId);
}

function viewLeadDetails(leadId) {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;
    
    const panel = document.getElementById('lead-detail-panel');
    const nameEl = document.getElementById('panel-lead-name');
    const statusEl = document.getElementById('panel-lead-status');
    const contentEl = document.getElementById('lead-detail-content');
    
    nameEl.textContent = lead.name;
    statusEl.textContent = lead.status;
    statusEl.className = 'status-badge status-badge-large status-' + lead.status.toLowerCase();
    
    const assignedUser = users.find(u => u.id === lead.assignedTo);
    const leadComms = communications.filter(c => c.leadId === lead.id);
    const leadTasks = tasks.filter(t => t.leadId === lead.id);
    
    contentEl.innerHTML = `
        <div class="form-section">
            <h4 class="section-title">Contact Information</h4>
            <div class="form-row">
                <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" id="detail-name" value="${lead.name}">
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="detail-email" value="${lead.email}">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Phone</label>
                    <input type="tel" id="detail-phone" value="${lead.phone}">
                </div>
                <div class="form-group">
                    <label>Company</label>
                    <input type="text" id="detail-company" value="${lead.company || ''}">
                </div>
            </div>
        </div>
        
        <div class="form-section">
            <h4 class="section-title">Lead Details</h4>
            <div class="form-row">
                <div class="form-group">
                    <label>Source</label>
                    <select id="detail-source">
                        <option value="website" ${lead.source === 'website' ? 'selected' : ''}>Website</option>
                        <option value="referral" ${lead.source === 'referral' ? 'selected' : ''}>Referral</option>
                        <option value="walk-in" ${lead.source === 'walk-in' ? 'selected' : ''}>Walk-in</option>
                        <option value="phone" ${lead.source === 'phone' ? 'selected' : ''}>Phone</option>
                        <option value="social-media" ${lead.source === 'social-media' ? 'selected' : ''}>Social Media</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <select id="detail-status">
                        <option value="New" ${lead.status === 'New' ? 'selected' : ''}>New</option>
                        <option value="Contacted" ${lead.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
                        <option value="Qualified" ${lead.status === 'Qualified' ? 'selected' : ''}>Qualified</option>
                        <option value="Proposal" ${lead.status === 'Proposal' ? 'selected' : ''}>Proposal</option>
                        <option value="Negotiation" ${lead.status === 'Negotiation' ? 'selected' : ''}>Negotiation</option>
                        <option value="Won" ${lead.status === 'Won' ? 'selected' : ''}>Won</option>
                        <option value="Lost" ${lead.status === 'Lost' ? 'selected' : ''}>Lost</option>
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Estimated Value</label>
                    <input type="number" id="detail-value" value="${lead.value || ''}">
                </div>
                <div class="form-group">
                    <label>Assigned To</label>
                    <select id="detail-assigned">
                        <option value="">Unassigned</option>
                        ${users.map(u => `<option value="${u.id}" ${lead.assignedTo === u.id ? 'selected' : ''}>${u.name}</option>`).join('')}
                    </select>
                </div>
            </div>
        </div>
        
        <div class="form-section">
            <h4 class="section-title">Communication History</h4>
            <button class="btn btn-primary" onclick="openCommunicationModal(${lead.id})" style="margin-bottom: 16px;">+ Log Activity</button>
            <div id="detail-communications">
                ${leadComms.length === 0 ? '<p class="empty-state">No communications recorded</p>' : ''}
                ${leadComms.map(comm => `
                    <div class="communication-item">
                        <h4>
                            <span class="comm-type">${comm.type}</span>
                            <span class="comm-date">${formatDate(comm.createdAt)}</span>
                        </h4>
                        ${comm.subject ? `<p><strong>Subject:</strong> ${comm.subject}</p>` : ''}
                        <p>${comm.notes}</p>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="form-section">
            <h4 class="section-title">Follow-up Tasks</h4>
            <button class="btn btn-primary" onclick="openTaskModalForLead(${lead.id})" style="margin-bottom: 16px;">+ Add Task</button>
            <div id="detail-tasks">
                ${leadTasks.map(task => {
                    const dueDate = new Date(task.dueDate);
                    const isOverdue = task.status === 'Pending' && dueDate < new Date();
                    return `
                        <div class="task-item ${task.status === 'Completed' ? 'completed' : ''}">
                            <input type="checkbox" ${task.status === 'Completed' ? 'checked' : ''} 
                                   onchange="toggleTaskStatus(${task.id})">
                            <div style="flex: 1;">
                                <div class="task-title">${task.title}</div>
                                <div style="font-size: 12px; color: #8d99ae;">${formatDate(task.dueDate)}</div>
                            </div>
                            <span class="priority-badge priority-${task.priority.toLowerCase()}">${task.priority}</span>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
        
        ${lead.vehicleId ? `
        <div class="form-section">
            <h4 class="section-title">Linked Vehicle</h4>
            ${(() => {
                const vehicle = vehicles.find(v => v.id === lead.vehicleId);
                if (vehicle) {
                    return `
                        <div style="padding: 16px; background: #f8f9fa; border-radius: 8px;">
                            <div style="font-weight: 600; font-size: 18px; margin-bottom: 8px;">${vehicle.make} ${vehicle.model} ${vehicle.year}</div>
                            <div style="color: #8d99ae; margin-bottom: 4px;">Color: ${vehicle.color || 'N/A'}</div>
                            <div style="color: #8d99ae; margin-bottom: 4px;">Stock#: ${vehicle.stock || 'N/A'}</div>
                            <div style="font-size: 20px; font-weight: 700; color: #012a4a; margin-top: 8px;">${formatCurrency(vehicle.price)}</div>
                        </div>
                    `;
                }
                return '<p class="empty-state">Vehicle not found</p>';
            })()}
        </div>
        ` : ''}
        
        <div class="form-section">
            <h4 class="section-title">Test Drives</h4>
            <button class="btn btn-primary" onclick="openTestDriveModal(null, ${lead.id})" style="margin-bottom: 16px;">+ Schedule Test Drive</button>
            <div id="detail-testdrives">
                ${(() => {
                    const leadTestDrives = testDrives.filter(td => td.leadId === lead.id);
                    if (leadTestDrives.length === 0) {
                        return '<p class="empty-state">No test drives scheduled</p>';
                    }
                    return leadTestDrives.map(td => {
                        const salesRep = users.find(u => u.id === td.salesRepId);
                        const datetime = new Date(td.datetime);
                        const statusColors = {
                            'Scheduled': '#2c7da0',
                            'Completed': '#06d6a0',
                            'Cancelled': '#ef476f'
                        };
                        return `
                            <div class="communication-item" style="margin-bottom: 12px;">
                                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                                    <div>
                                        <strong>${td.vehicle || 'Vehicle TBD'}</strong>
                                        <div style="font-size: 12px; color: #8d99ae; margin-top: 4px;">
                                            ${formatDate(td.datetime)} ${datetime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                    <span class="status-badge" style="color: ${statusColors[td.status] || '#8d99ae'};"><span>${td.status}</span></span>
                                </div>
                                ${td.notes ? `<p style="font-size: 14px; color: #2b2d42; margin-top: 8px;">${td.notes}</p>` : ''}
                                <div style="font-size: 12px; color: #8d99ae; margin-top: 4px;">Sales Rep: ${salesRep ? salesRep.name : 'N/A'}</div>
                            </div>
                        `;
                    }).join('');
                })()}
            </div>
        </div>
        
        <div class="form-section">
            <div class="expandable-section" style="border: 1px solid var(--light-gray); border-radius: 8px; overflow: hidden;">
                <div class="expandable-header" onclick="toggleExpandable('finance-calc-${lead.id}')" style="padding: 16px; background: #f8f9fa; cursor: pointer; display: flex; justify-content: space-between; align-items: center; user-select: none;">
                    <h4 class="section-title" style="margin: 0;">Financing Calculator</h4>
                    <span id="finance-calc-${lead.id}-arrow" style="font-size: 18px; color: #8d99ae; transition: transform 0.3s;">▶</span>
                </div>
                <div id="finance-calc-${lead.id}" class="expandable-content" style="display: none; padding: 16px; background: #f8f9fa;">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Vehicle Price (KSh)</label>
                            <input type="number" id="calc-price" value="${lead.value || lead.vehicleId ? (() => {
                                if (lead.vehicleId) {
                                    const vehicle = vehicles.find(v => v.id === lead.vehicleId);
                                    return vehicle ? vehicle.price : '';
                                }
                                return lead.value || '';
                            })() : ''}" min="0" step="0.01" oninput="calculateFinancing()">
                        </div>
                        <div class="form-group">
                            <label>Down Payment (KSh)</label>
                            <input type="number" id="calc-downpayment" value="0" min="0" step="0.01" oninput="calculateFinancing()">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Interest Rate (%)</label>
                            <input type="number" id="calc-interest" value="12" min="0" step="0.1" oninput="calculateFinancing()">
                        </div>
                        <div class="form-group">
                            <label>Loan Term</label>
                            <select id="calc-term" onchange="calculateFinancing()">
                                <option value="12">12 months</option>
                                <option value="24">24 months</option>
                                <option value="36">36 months</option>
                                <option value="48">48 months</option>
                                <option value="60" selected>60 months</option>
                            </select>
                        </div>
                    </div>
                    <button class="btn btn-primary" onclick="calculateFinancing()" style="margin-top: 8px;">Calculate</button>
                    <div id="calc-results" style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #edf2f4;">
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
                            <div>
                                <div style="font-size: 12px; color: #8d99ae; margin-bottom: 4px;">Monthly Payment</div>
                                <div id="calc-monthly-payment" style="font-size: 20px; font-weight: 700; color: #012a4a;">KSh 0</div>
                            </div>
                            <div>
                                <div style="font-size: 12px; color: #8d99ae; margin-bottom: 4px;">Total Interest</div>
                                <div id="calc-total-interest" style="font-size: 20px; font-weight: 700; color: #014f86;">KSh 0</div>
                            </div>
                            <div>
                                <div style="font-size: 12px; color: #8d99ae; margin-bottom: 4px;">Total Amount</div>
                                <div id="calc-total-amount" style="font-size: 20px; font-weight: 700; color: #2c7da0;">KSh 0</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="form-section">
            <div class="expandable-section" style="border: 1px solid var(--light-gray); border-radius: 8px; overflow: hidden;">
                <div class="expandable-header" onclick="toggleExpandable('documents-${lead.id}')" style="padding: 16px; background: #f8f9fa; cursor: pointer; display: flex; justify-content: space-between; align-items: center; user-select: none;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <h4 class="section-title" style="margin: 0;">Documents</h4>
                        <strong id="doc-progress-${lead.id}" style="font-size: 14px; color: #8d99ae;">${(() => {
                            if (!lead.documents) return '0/7 documents collected';
                            const docKeys = ['id', 'kra', 'residence', 'bankStatements', 'employment', 'logbook', 'insurance'];
                            const completed = docKeys.filter(key => lead.documents[key] && lead.documents[key].uploaded).length;
                            return `${completed}/7 documents collected`;
                        })()}</strong>
                    </div>
                    <span id="documents-${lead.id}-arrow" style="font-size: 18px; color: #8d99ae; transition: transform 0.3s;">▶</span>
                </div>
                <div id="documents-${lead.id}" class="expandable-content" style="display: none; padding: 16px; background: #f8f9fa;">
                    <div class="document-checklist">
                        ${[
                            { key: 'id', label: 'National ID/Passport' },
                            { key: 'kra', label: 'KRA PIN' },
                            { key: 'residence', label: 'Proof of Residence' },
                            { key: 'bankStatements', label: 'Bank Statements (3 months)' },
                            { key: 'employment', label: 'Employment Letter' },
                            { key: 'logbook', label: 'Logbook (for trade-in)' },
                            { key: 'insurance', label: 'Insurance Quote' }
                        ].map(doc => {
                            const docData = lead.documents && lead.documents[doc.key] ? lead.documents[doc.key] : null;
                            const isChecked = docData && docData.uploaded;
                            const completedBy = docData && docData.completedBy ? users.find(u => u.id === docData.completedBy) : null;
                            return `
                                <div class="document-item" style="display: flex; align-items: start; gap: 12px; padding: 12px; background: ${isChecked ? '#f0fdf4' : '#ffffff'}; border-radius: 6px; margin-bottom: 8px;">
                                    <input type="checkbox" id="doc-${doc.key}-${lead.id}" ${isChecked ? 'checked' : ''} 
                                           onchange="toggleDocument(${lead.id}, '${doc.key}')" style="margin-top: 4px;">
                                    <div style="flex: 1;">
                                        <label for="doc-${doc.key}-${lead.id}" style="font-weight: 500; cursor: pointer; display: block; margin-bottom: 4px;">${doc.label}</label>
                                        <div class="doc-completed-info">
                                            ${isChecked && docData.completedAt ? `
                                                <small style="color: #06d6a0;">
                                                    ✓ Completed ${formatDate(docData.completedAt)} by ${completedBy ? completedBy.name : 'User'}
                                                </small>
                                            ` : ''}
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    panel.dataset.leadId = lead.id;
    panel.classList.add('active');
    
    // Populate reassign dropdown menu with sales reps only
    const reassignOptions = document.getElementById('reassign-dropdown-options');
    if (reassignOptions) {
        reassignOptions.innerHTML = '';
        // Filter to only show sales reps
        const salesReps = users.filter(user => user.role === 'Sales Rep');
        salesReps.forEach(user => {
            const option = document.createElement('div');
            option.className = 'reassign-dropdown-item';
            option.textContent = user.name;
            option.dataset.userId = user.id;
            option.onclick = () => selectReassignUser(user.id, user.name);
            reassignOptions.appendChild(option);
        });
        if (salesReps.length === 0) {
            reassignOptions.innerHTML = '<div style="padding: 12px; color: #8d99ae; text-align: center;">No sales reps available</div>';
        }
    }
    
    // Auto-calculate financing when panel opens
    setTimeout(() => {
        calculateFinancing();
    }, 100);
}

function closeLeadDetail() {
    document.getElementById('lead-detail-panel').classList.remove('active');
    // Close reassign dropdown if open
    const dropdown = document.getElementById('reassign-dropdown-menu');
    const button = document.getElementById('reassign-btn');
    if (dropdown && button) {
        dropdown.style.display = 'none';
        button.classList.remove('active');
    }
}

function saveLeadChanges() {
    const panel = document.getElementById('lead-detail-panel');
    const leadId = parseInt(panel.dataset.leadId);
    const lead = leads.find(l => l.id === leadId);
    
    if (lead) {
        // Clean name by removing initials
        lead.name = removeInitialFromName(document.getElementById('detail-name').value);
        lead.email = document.getElementById('detail-email').value;
        lead.phone = document.getElementById('detail-phone').value;
        lead.company = document.getElementById('detail-company').value;
        lead.source = document.getElementById('detail-source').value;
        lead.status = document.getElementById('detail-status').value;
        lead.value = parseFloat(document.getElementById('detail-value').value) || null;
        lead.assignedTo = parseInt(document.getElementById('detail-assigned').value) || null;
        lead.updatedAt = new Date().toISOString();
        
        saveLeads();
        loadLeads();
        updatePipeline();
        showToast('Lead updated successfully', 'success');
        closeLeadDetail();
    }
}

function deleteLeadFromPanel() {
    const panel = document.getElementById('lead-detail-panel');
    const leadId = parseInt(panel.dataset.leadId);
    if (confirm('Are you sure you want to delete this lead?')) {
        deleteLead(leadId);
        closeLeadDetail();
    }
}

function toggleReassignDropdown(event) {
    event.stopPropagation();
    const dropdown = document.getElementById('reassign-dropdown-menu');
    const button = document.getElementById('reassign-btn');
    const isVisible = dropdown.style.display !== 'none';
    
    // Close all other dropdowns first
    document.querySelectorAll('.reassign-dropdown-menu').forEach(menu => {
        menu.style.display = 'none';
    });
    
    if (isVisible) {
        dropdown.style.display = 'none';
        button.classList.remove('active');
    } else {
        dropdown.style.display = 'block';
        button.classList.add('active');
    }
}

function selectReassignUser(userId, userName) {
    const panel = document.getElementById('lead-detail-panel');
    const leadId = parseInt(panel.dataset.leadId);
    const newUserId = parseInt(userId);
    const lead = leads.find(l => l.id === leadId);
    
    if (!lead) {
        showToast('Lead not found', 'error');
        return;
    }
    
    if (lead.assignedTo === newUserId) {
        showToast('Lead is already assigned to this member', 'error');
        // Close dropdown
        const dropdown = document.getElementById('reassign-dropdown-menu');
        const button = document.getElementById('reassign-btn');
        dropdown.style.display = 'none';
        button.classList.remove('active');
        return;
    }
    
    const oldUserId = lead.assignedTo;
    lead.assignedTo = newUserId;
    lead.updatedAt = new Date().toISOString();
    
    // Initialize reassignmentHistory if it doesn't exist
    if (!lead.reassignmentHistory) {
        lead.reassignmentHistory = [];
    }
    
    // Log reassignment
    const currentUser = users.find(u => u.id === currentUserId);
    lead.reassignmentHistory.push({
        fromUserId: oldUserId,
        toUserId: newUserId,
        reassignedBy: currentUser ? currentUser.id : null,
        reason: '',
        timestamp: new Date().toISOString()
    });
    
    // Save to localStorage
    saveLeads();
    
    // Refresh leads display
    loadLeads();
    
    // Update the panel to reflect new assignment
    viewLeadDetails(leadId);
    
    // Close dropdown
    const dropdown = document.getElementById('reassign-dropdown-menu');
    const button = document.getElementById('reassign-btn');
    dropdown.style.display = 'none';
    button.classList.remove('active');
    
    showToast(`Lead reassigned to ${userName}`, 'success');
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('reassign-dropdown-menu');
    const button = document.getElementById('reassign-btn');
    const dropdownContainer = document.querySelector('.reassign-dropdown');
    
    if (dropdown && button && dropdownContainer && !dropdownContainer.contains(event.target)) {
        dropdown.style.display = 'none';
        button.classList.remove('active');
    }
});

function openTaskModalForLead(leadId) {
    openTaskModal();
    document.getElementById('task-lead').value = leadId;
}

function toggleExpandable(sectionId) {
    const content = document.getElementById(sectionId);
    const arrow = document.getElementById(sectionId + '-arrow');
    if (content && arrow) {
        const isExpanded = content.style.display !== 'none';
        content.style.display = isExpanded ? 'none' : 'block';
        arrow.textContent = isExpanded ? '▶' : '▼';
    }
}

function formatSource(source) {
    const sources = {
        'website': 'Website',
        'referral': 'Referral',
        'walk-in': 'Walk-in',
        'phone': 'Phone',
        'social-media': 'Social Media'
    };
    return sources[source] || source;
}

// Task Management
function loadTasks() {
    saveTasks();
    filterTasks();
    updateDashboard();
}

function filterTasks() {
    const statusFilter = document.getElementById('task-status-filter')?.value || '';
    const priorityFilter = document.getElementById('task-priority-filter')?.value || '';
    const assignedFilter = document.getElementById('task-assigned-filter')?.value || '';
    
    // Hide/show "Assigned To" filter for Sales Reps
    const currentUser = users.find(u => u.id === currentUserId);
    const isSalesRep = currentUser && currentUser.role === 'Sales Rep';
    const taskAssignedFilter = document.getElementById('task-assigned-filter');
    if (taskAssignedFilter) {
        taskAssignedFilter.style.display = isSalesRep ? 'none' : 'block';
    }
    
    // Use filtered tasks based on user role
    let filtered = getFilteredTasks();
    
    if (statusFilter) {
        filtered = filtered.filter(task => {
            const dueDate = new Date(task.dueDate);
            const now = new Date();
            let taskStatus = task.status;
            
            if (taskStatus === 'Pending' && dueDate < now) {
                taskStatus = 'Overdue';
            }
            
            return taskStatus === statusFilter;
        });
    }
    
    if (priorityFilter) {
        filtered = filtered.filter(task => task.priority === priorityFilter);
    }
    
    // Filter by assigned user if selected
    if (assignedFilter) {
        filtered = filtered.filter(task => task.assignedTo === parseInt(assignedFilter));
    }
    
    displayTasks(filtered);
}

function displayTasks(tasksToShow) {
    const container = document.getElementById('task-groups');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (tasksToShow.length === 0) {
        container.innerHTML = '<p class="empty-state">No tasks found</p>';
        return;
    }
    
    // Group tasks by date
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    const today = new Date(now);
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const groups = {
        overdue: [],
        today: [],
        tomorrow: [],
        thisWeek: [],
        later: []
    };
    
    tasksToShow.forEach(task => {
        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        const taskStatus = task.status === 'Pending' && dueDate < now ? 'Overdue' : task.status;
        
        if (taskStatus === 'Overdue') {
            groups.overdue.push({...task, displayStatus: taskStatus});
        } else if (dueDate.getTime() === today.getTime()) {
            groups.today.push({...task, displayStatus: taskStatus});
        } else if (dueDate.getTime() === tomorrow.getTime()) {
            groups.tomorrow.push({...task, displayStatus: taskStatus});
        } else if (dueDate < nextWeek) {
            groups.thisWeek.push({...task, displayStatus: taskStatus});
        } else {
            groups.later.push({...task, displayStatus: taskStatus});
        }
    });
    
    // Update overdue section
    const overdueSection = document.getElementById('overdue-section');
    const overdueCount = groups.overdue.length;
    if (overdueCount > 0) {
        overdueSection.style.display = 'block';
        document.getElementById('overdue-count').textContent = overdueCount;
    } else {
        overdueSection.style.display = 'none';
    }
    
    // Sort each group: undone tasks first, then completed
    const sortTasksByStatus = (tasks) => {
        return tasks.sort((a, b) => {
            // Undone tasks (Pending, Overdue) come first
            const aIsDone = a.displayStatus === 'Completed';
            const bIsDone = b.displayStatus === 'Completed';
            if (aIsDone !== bIsDone) {
                return aIsDone ? 1 : -1; // Undone first
            }
            // If both same status, sort by due date (earlier first)
            return new Date(a.dueDate) - new Date(b.dueDate);
        });
    };
    
    // Sort all groups
    groups.overdue = sortTasksByStatus(groups.overdue);
    groups.today = sortTasksByStatus(groups.today);
    groups.tomorrow = sortTasksByStatus(groups.tomorrow);
    groups.thisWeek = sortTasksByStatus(groups.thisWeek);
    groups.later = sortTasksByStatus(groups.later);
    
    // Render groups
    const groupConfig = [
        { key: 'overdue', label: 'Overdue', tasks: groups.overdue },
        { key: 'today', label: 'Today', tasks: groups.today },
        { key: 'tomorrow', label: 'Tomorrow', tasks: groups.tomorrow },
        { key: 'thisWeek', label: 'This Week', tasks: groups.thisWeek },
        { key: 'later', label: 'Later', tasks: groups.later }
    ];
    
    groupConfig.forEach(group => {
        if (group.tasks.length === 0) return;
        
        const groupDiv = document.createElement('div');
        groupDiv.className = 'task-group';
        groupDiv.innerHTML = `
            <div class="task-group-header">
                <span>${group.label} (${group.tasks.length})</span>
                <span>▼</span>
            </div>
            <div class="task-group-content">
                ${group.tasks.map(task => {
                    const lead = leads.find(l => l.id === task.leadId);
                    const assignedUser = users.find(u => u.id === task.assignedTo);
                    return `
                        <div class="task-item ${task.displayStatus === 'Completed' ? 'completed' : ''}">
                            <input type="checkbox" ${task.displayStatus === 'Completed' ? 'checked' : ''} 
                                   onchange="toggleTaskStatus(${task.id})">
                            <div style="flex: 1;">
                                <div class="task-title" style="font-weight: 600; margin-bottom: 4px;">${task.title}</div>
                                <div style="font-size: 12px; color: #8d99ae;">
                                    ${lead ? lead.name : 'N/A'} • ${formatDate(task.dueDate)}
                                </div>
                            </div>
                            <span class="priority-badge priority-${task.priority.toLowerCase()}">${task.priority}</span>
                            ${assignedUser ? `<div class="user-avatar" style="width: 24px; height: 24px; font-size: 10px;">${assignedUser.name.charAt(0)}</div>` : ''}
                            <button class="btn btn-sm btn-secondary" onclick="editTask(${task.id})">Edit</button>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
        container.appendChild(groupDiv);
        
        // Add collapse functionality
        const header = groupDiv.querySelector('.task-group-header');
        const content = groupDiv.querySelector('.task-group-content');
        header.addEventListener('click', () => {
            content.style.display = content.style.display === 'none' ? 'block' : 'none';
        });
    });
}

function openTaskModal(taskId = null) {
    const modal = document.getElementById('task-modal');
    const form = document.getElementById('task-form');
    const title = document.getElementById('task-modal-title');
    
    form.reset();
    document.getElementById('task-id').value = '';
    updateTaskLeadSelect();
    
    if (taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            title.textContent = 'Edit Task';
            document.getElementById('task-id').value = task.id;
            document.getElementById('task-title').value = task.title;
            document.getElementById('task-lead').value = task.leadId;
            document.getElementById('task-due-date').value = formatDateTimeLocal(task.dueDate);
            document.getElementById('task-priority').value = task.priority;
            document.getElementById('task-assigned').value = task.assignedTo || '';
            document.getElementById('task-description').value = task.description || '';
        }
    } else {
        title.textContent = 'Add New Task';
    }
    
    modal.classList.add('active');
}

function updateTaskLeadSelect() {
    const select = document.getElementById('task-lead');
    while (select.options.length > 1) {
        select.remove(1);
    }
    
    leads.forEach(lead => {
        const option = new Option(lead.name, lead.id);
        select.appendChild(option);
    });
}

function saveTask() {
    const id = document.getElementById('task-id').value;
    const title = document.getElementById('task-title').value;
    const leadId = document.getElementById('task-lead').value;
    const dueDate = document.getElementById('task-due-date').value;
    const priority = document.getElementById('task-priority').value;
    const assignedTo = document.getElementById('task-assigned').value;
    const description = document.getElementById('task-description').value;
    
    if (!title || !leadId || !dueDate || !priority) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    if (id) {
        // Update existing task
        const taskIndex = tasks.findIndex(t => t.id === parseInt(id));
        if (taskIndex !== -1) {
            tasks[taskIndex] = {
                ...tasks[taskIndex],
                title,
                leadId: parseInt(leadId),
                dueDate: new Date(dueDate).toISOString(),
                priority,
                assignedTo: assignedTo ? parseInt(assignedTo) : null,
                description,
                updatedAt: new Date().toISOString()
            };
        }
    } else {
        // Create new task
        const newTask = {
            id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
            title,
            leadId: parseInt(leadId),
            dueDate: new Date(dueDate).toISOString(),
            priority,
            status: 'Pending',
            assignedTo: assignedTo ? parseInt(assignedTo) : null,
            description,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        tasks.push(newTask);
    }
    
    saveTasks();
    loadTasks();
    showToast('Task saved successfully', 'success');
    closeModal('task-modal');
}

function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(t => t.id !== taskId);
        saveTasks();
        loadTasks();
        showToast('Task deleted successfully', 'success');
    }
}

function editTask(taskId) {
    openTaskModal(taskId);
}

function toggleTaskStatus(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.status = task.status === 'Completed' ? 'Pending' : 'Completed';
        task.updatedAt = new Date().toISOString();
        saveTasks();
        loadTasks();
        // Update sales rep tasks list if on sales rep dashboard
        updateSalesRepTasksList();
    }
}


// Contact & Communication History
function loadContacts() {
    const container = document.getElementById('contacts-list-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Use filtered leads based on user role
    const filteredLeads = getFilteredLeads();
    filteredLeads.forEach(lead => {
        const item = document.createElement('div');
        item.className = 'contact-item';
        item.onclick = function(e) {
            // Remove active from all items
            document.querySelectorAll('.contact-item').forEach(i => i.classList.remove('active'));
            // Add active to clicked item
            this.classList.add('active');
            displayContactDetails(lead.id);
        };
        item.innerHTML = `
            <h4>${lead.name}</h4>
            <p>${lead.email}</p>
        `;
        container.appendChild(item);
    });
}

function filterContacts() {
    const search = document.getElementById('contact-search').value.toLowerCase();
    const items = document.querySelectorAll('.contact-item');
    
    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(search) ? 'block' : 'none';
    });
}

function displayContactDetails(leadId) {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;
    
    // Check if user has access to this lead (Sales Rep can only see their own leads)
    const currentUser = users.find(u => u.id === currentUserId);
    if (currentUser && currentUser.role === 'Sales Rep' && lead.assignedTo !== currentUserId) {
        showToast('You do not have access to this lead', 'error');
        return;
    }
    
    // Active state is handled in loadContacts onclick handler
    
    // Hide empty state and show detail panel
    const emptyState = document.getElementById('communication-empty');
    const detailPanel = document.getElementById('communication-detail');
    if (emptyState) emptyState.classList.add('hidden');
    if (detailPanel) detailPanel.classList.remove('hidden');
    
    const details = document.getElementById('communication-detail');
    if (!details) return;
    
    // Use filtered communications based on user role
    const filteredComms = getFilteredCommunications();
    const leadComms = filteredComms.filter(c => c.leadId === leadId);
    
    const assignedUser = users.find(u => u.id === lead.assignedTo);
    
    details.innerHTML = `
        <div class="contact-header">
            <div>
                <h3>${lead.name}</h3>
                <p>${lead.email} | ${lead.phone}</p>
            </div>
            <button class="btn btn-primary" onclick="openCommunicationModal(${lead.id})">+ Add Communication</button>
        </div>
        <div class="contact-info">
            <p><strong>Source:</strong> ${formatSource(lead.source)}</p>
            <p><strong>Status:</strong> <span class="status-badge status-${lead.status.toLowerCase()}">${lead.status}</span></p>
            <p><strong>Assigned To:</strong> ${assignedUser ? assignedUser.name : 'Unassigned'}</p>
            ${lead.value ? `<p><strong>Estimated Value:</strong> ${formatCurrency(lead.value)}</p>` : ''}
            ${lead.vehicleInterest ? `<p><strong>Vehicle Interest:</strong> ${lead.vehicleInterest}</p>` : ''}
            ${lead.tradeIn === 'yes' ? `<p><strong>Trade-In:</strong> Yes</p>` : ''}
            ${lead.timeline ? `<p><strong>Purchase Timeline:</strong> ${lead.timeline}</p>` : ''}
            ${lead.notes ? `<p><strong>Notes:</strong> ${lead.notes}</p>` : ''}
        </div>
        <h4 style="margin-top: 2rem; margin-bottom: 1rem;">Communication History</h4>
        <div id="communications-list">
            ${leadComms.length === 0 ? '<p class="empty-state">No communications recorded</p>' : ''}
            ${leadComms.map(comm => `
                <div class="communication-item">
                    <h4>
                        <span class="comm-type">${comm.type}</span>
                        <span class="comm-date">${formatDate(comm.createdAt)}</span>
                    </h4>
                    ${comm.subject ? `<p><strong>Subject:</strong> ${comm.subject}</p>` : ''}
                    <p>${comm.notes}</p>
                    ${comm.outcome ? `<p><strong>Outcome:</strong> ${comm.outcome}</p>` : ''}
                </div>
            `).join('')}
        </div>
    `;
}

function openCommunicationModal(leadId) {
    const modal = document.getElementById('communication-modal');
    const form = document.getElementById('communication-form');
    
    form.reset();
    document.getElementById('comm-lead-id').value = leadId;
    
    modal.classList.add('active');
}

function saveCommunication() {
    const leadId = parseInt(document.getElementById('comm-lead-id').value);
    const type = document.getElementById('comm-type').value;
    const subject = document.getElementById('comm-subject').value;
    const notes = document.getElementById('comm-notes').value;
    const outcome = document.getElementById('comm-outcome').value;
    
    if (!notes) {
        showToast('Please enter notes', 'error');
        return;
    }
    
    const newComm = {
        id: communications.length > 0 ? Math.max(...communications.map(c => c.id)) + 1 : 1,
        leadId,
        type,
        subject,
        notes,
        outcome,
        createdAt: new Date().toISOString()
    };
    
    communications.push(newComm);
    saveCommunications();
    
    // Refresh displays
    if (document.getElementById('lead-detail-panel').classList.contains('active')) {
        const panelLeadId = parseInt(document.getElementById('lead-detail-panel').dataset.leadId);
        if (panelLeadId === leadId) {
            viewLeadDetails(leadId);
        }
    } else {
        displayContactDetails(leadId);
    }
    
    showToast('Communication logged successfully', 'success');
    closeModal('communication-modal');
}

// Pipeline & Sales Tracking
function updatePipeline() {
    // Use filtered leads based on user role
    const filteredLeads = getFilteredLeads();
    const stages = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'];
    
    stages.forEach(stage => {
        const stageLeads = filteredLeads.filter(l => l.status === stage);
        const stageElement = document.getElementById(`stage-${stage.toLowerCase()}`);
        const countElement = document.querySelector(`[data-stage="${stage}"] .column-count`);
        
        // Update count in column header
        if (countElement) {
            countElement.textContent = stageLeads.length;
        }
        
        if (stageElement) {
            stageElement.innerHTML = '';
            
            stageLeads.forEach(lead => {
                const card = document.createElement('div');
                card.className = 'lead-card';
                card.setAttribute('draggable', 'true');
                card.dataset.leadId = lead.id;
                
                // Get assigned user name and avatar
                const assignedUser = users.find(u => u.id === lead.assignedTo);
                const ownerName = assignedUser ? assignedUser.name : 'Unassigned';
                const ownerInitials = assignedUser ? assignedUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
                
                // Format date created
                const createdDate = lead.createdAt ? formatDate(lead.createdAt) : 'N/A';
                
                card.innerHTML = `
                    <h4>${lead.name}</h4>
                    <p style="font-size: 12px; color: #8d99ae; margin: 4px 0;">${lead.email}</p>
                    <p style="font-size: 11px; color: #8d99ae; margin: 4px 0;">${formatSource(lead.source)}</p>
                    ${lead.value ? `<p class="lead-value" style="font-size: 14px; font-weight: 600; color: #012a4a; margin-top: 8px;">${formatCurrency(lead.value)}</p>` : ''}
                    <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #edf2f4; display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: #8d99ae;">
                        <span style="display: flex; align-items: center; gap: 6px;">
                            <div class="user-avatar" style="width: 20px; height: 20px; font-size: 9px; flex-shrink: 0;">${ownerInitials}</div>
                            <span>${ownerName}</span>
                        </span>
                        <span style="display: flex; align-items: center; gap: 4px;">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink: 0;">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            ${createdDate}
                        </span>
                    </div>
                `;
                
                // Add direct drag event handlers to each card
                card.addEventListener('dragstart', function(e) {
                    this.classList.add('dragging');
                    e.dataTransfer.effectAllowed = 'move';
                    const leadId = this.dataset.leadId || this.getAttribute('data-lead-id');
                    e.dataTransfer.setData('text/plain', String(leadId));
                    e.dataTransfer.setData('application/json', JSON.stringify({ leadId: leadId }));
                }, false);
                
                card.addEventListener('dragend', function(e) {
                    this.classList.remove('dragging');
                    document.querySelectorAll('.column-leads').forEach(col => {
                        col.classList.remove('drag-over');
                    });
                }, false);
                
                stageElement.appendChild(card);
            });
        }
    });
    
    // Setup drag and drop handlers on column containers
    setupDragAndDrop();
    
    // Update metrics
    const totalLeads = filteredLeads.length;
    const wonLeads = filteredLeads.filter(l => l.status === 'Won').length;
    const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;
    const conversionRateEl = document.getElementById('conversion-rate');
    if (conversionRateEl) {
        conversionRateEl.textContent = conversionRate + '%';
    }
    
    // Calculate average time (simplified)
    const activeLeads = filteredLeads.filter(l => l.status !== 'Won' && l.status !== 'Lost');
    let totalDays = 0;
    activeLeads.forEach(lead => {
        const created = new Date(lead.createdAt);
        const now = new Date();
        totalDays += Math.floor((now - created) / (1000 * 60 * 60 * 24));
    });
    const avgDays = activeLeads.length > 0 ? Math.floor(totalDays / activeLeads.length) : 0;
    const avgTimeEl = document.getElementById('avg-time');
    if (avgTimeEl) {
        avgTimeEl.textContent = avgDays + ' days';
    }
}

// Store drag handlers to prevent duplicate listeners
let dragHandlersSetup = false;

function setupDragAndDrop() {
    // Setup drop handlers on all column-leads containers
    const columnLeadsContainers = document.querySelectorAll('.column-leads');
    
    columnLeadsContainers.forEach(container => {
        // Skip if already set up (check for existing listener)
        if (container.hasAttribute('data-drop-setup')) {
            return;
        }
        
        container.setAttribute('data-drop-setup', 'true');
        
        // Setup dragover - allow drop
        container.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.dataTransfer.dropEffect = 'move';
            this.classList.add('drag-over');
        }, false);
        
        // Setup dragleave
        container.addEventListener('dragleave', function(e) {
            // Only remove if we're actually leaving this container
            if (!this.contains(e.relatedTarget)) {
                this.classList.remove('drag-over');
            }
        }, false);
        
        // Setup drop
        container.addEventListener('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.remove('drag-over');
            
            // Get the pipeline column
            const pipelineColumn = this.closest('.pipeline-column');
            if (!pipelineColumn) return;
            
            const newStage = pipelineColumn.dataset.stage;
            if (!newStage) return;
            
            // Get lead ID from drag data
            let leadId = e.dataTransfer.getData('text/plain');
            if (!leadId) {
                try {
                    const jsonData = e.dataTransfer.getData('application/json');
                    if (jsonData) {
                        const data = JSON.parse(jsonData);
                        leadId = data.leadId;
                    }
                } catch (err) {
                    console.error('Error parsing drag data:', err);
                    return;
                }
            }
            
            leadId = parseInt(leadId);
            if (!leadId || isNaN(leadId)) return;
            
            // Reload leads from localStorage
            leads = JSON.parse(localStorage.getItem('crm_leads')) || [];
            
            const lead = leads.find(l => l.id === leadId);
            if (lead && lead.status !== newStage) {
                const oldStatus = lead.status;
                
                // Update lead status
                lead.status = newStage;
                lead.updatedAt = new Date().toISOString();
                
                // If moved to Won, set closeDate if not already set
                if (newStage === 'Won' && !lead.closeDate) {
                    lead.closeDate = new Date().toISOString();
                }
                
                // If moved away from Won, clear closeDate (optional - you may want to keep it)
                // Uncomment if you want to clear closeDate when moved away from Won:
                // if (oldStatus === 'Won' && newStage !== 'Won' && lead.closeDate) {
                //     lead.closeDate = null;
                // }
                
                // Save to localStorage
                saveLeads();
                
                // Reload from localStorage to ensure consistency
                leads = JSON.parse(localStorage.getItem('crm_leads')) || [];
                tasks = JSON.parse(localStorage.getItem('crm_tasks')) || [];
                communications = JSON.parse(localStorage.getItem('crm_communications')) || [];
                
    // Update all views in correct order
    updatePipeline();  // Update pipeline first
    loadLeads();       // Update leads table
    
    // Update dashboard based on user role
    const currentUser = users.find(u => u.id === currentUserId);
    if (currentUser && currentUser.role === 'Sales Rep') {
        updateSalesRepDashboard();
    } else {
        updateDashboard();
    }
    
    updateReports();   // Update all reports
    updateAllNavPreviews(); // Update sidebar previews
                
                // Show success message with revenue info if moved to Won
                let message = `Lead moved to ${newStage}`;
                if (newStage === 'Won' && lead.value) {
                    message += ` - Revenue: ${formatCurrency(lead.value)}`;
                }
                showToast(message, 'success');
            }
        }, false);
    });
    
    dragHandlersSetup = true;
}

// Reports
function updateReports() {
    updateFunnelChart();
    updateSourcePerformance();
    updateSalesActivity();
}

function updateFunnelChart() {
    const container = document.getElementById('funnel-chart');
    if (!container) return;
    
    // Admin Reports use ALL leads (not filtered)
    const allLeads = leads;
    const stages = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won'];
    const stageCounts = stages.map(stage => allLeads.filter(l => l.status === stage).length);
    const maxCount = Math.max(...stageCounts, 1);
    
    container.innerHTML = '';
    stages.forEach((stage, index) => {
        const count = stageCounts[index];
        const percentage = maxCount > 0 ? ((count / maxCount) * 100) : 0;
        const dropoff = index > 0 ? Math.round((stageCounts[index-1] - count) / stageCounts[index-1] * 100) : 0;
        
        const item = document.createElement('div');
        item.style.marginBottom = '16px';
        item.innerHTML = `
            <div style="margin-bottom: 4px;">
                <span style="font-size: 14px; font-weight: 500;">${stage}</span>
            </div>
            <div style="height: 32px; background: #edf2f4; border-radius: 4px; overflow: hidden; position: relative;">
                <div style="height: 100%; width: ${percentage}%; background: #014f86; transition: width 0.3s; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: 600;">${count}</div>
            </div>
        `;
        container.appendChild(item);
    });
}

function updateSourcePerformance() {
    const container = document.getElementById('source-performance');
    if (!container) return;
    
    // Admin Reports use ALL leads (not filtered)
    const allLeads = leads;
    const sourceData = {};
    allLeads.forEach(lead => {
        if (!sourceData[lead.source]) {
            sourceData[lead.source] = { total: 0, won: 0, revenue: 0 };
        }
        sourceData[lead.source].total++;
        if (lead.status === 'Won') {
            sourceData[lead.source].won++;
            sourceData[lead.source].revenue += (lead.value || 0);
        }
    });
    
    if (Object.keys(sourceData).length === 0) {
        container.innerHTML = '<p class="empty-state">No data available</p>';
        return;
    }
    
    // Clear container
    container.innerHTML = '';
    
    // Create table
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.fontSize = '14px';
    
    // Create header
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr style="background-color: #f8f9fa; border-bottom: 2px solid #edf2f4;">
            <th style="padding: 12px; text-align: left; font-weight: 600; color: #2b2d42; border-bottom: 2px solid #edf2f4;">Source</th>
            <th style="padding: 12px; text-align: center; font-weight: 600; color: #2b2d42; border-bottom: 2px solid #edf2f4;">Count</th>
            <th style="padding: 12px; text-align: center; font-weight: 600; color: #2b2d42; border-bottom: 2px solid #edf2f4;">Conversion</th>
            <th style="padding: 12px; text-align: right; font-weight: 600; color: #2b2d42; border-bottom: 2px solid #edf2f4;">Revenue</th>
        </tr>
    `;
    table.appendChild(thead);
    
    // Create body
    const tbody = document.createElement('tbody');
    Object.entries(sourceData).forEach(([source, data], index) => {
        const conversionRate = data.total > 0 ? Math.round((data.won / data.total) * 100) : 0;
        const row = document.createElement('tr');
        row.style.borderBottom = '1px solid #edf2f4';
        row.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f8f9fa';
        row.innerHTML = `
            <td style="padding: 12px; color: #2b2d42; font-weight: 500;">${formatSource(source)}</td>
            <td style="padding: 12px; text-align: center; color: #2b2d42;">${data.total}</td>
            <td style="padding: 12px; text-align: center; color: #014f86; font-weight: 600;">${conversionRate}%</td>
            <td style="padding: 12px; text-align: right; color: #012a4a; font-weight: 600;">${formatCurrency(data.revenue)}</td>
        `;
        tbody.appendChild(row);
    });
    table.appendChild(tbody);
    
    container.appendChild(table);
}

function updateSalesActivity() {
    const container = document.getElementById('sales-activity');
    if (!container) return;
    
    container.innerHTML = '';
    // Filter out Admin User from sales activity
    const salesUsers = users.filter(user => user.name !== 'Admin User');
    
    salesUsers.forEach(user => {
        const userLeads = leads.filter(l => l.assignedTo === user.id);
        const contacted = userLeads.filter(l => ['Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won'].includes(l.status)).length;
        const converted = userLeads.filter(l => l.status === 'Won').length;
        const revenue = userLeads.filter(l => l.status === 'Won').reduce((sum, l) => sum + (l.value || 0), 0);
        
        const item = document.createElement('div');
        item.className = 'report-item';
        item.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <div class="user-avatar" style="width: 40px; height: 40px;">${user.name.charAt(0)}</div>
                <div style="flex: 1;">
                    <div style="font-weight: 600; margin-bottom: 4px;">${user.name}</div>
                    <div style="font-size: 12px; color: #8d99ae;">
                        Leads: ${userLeads.length} | Contacted: ${contacted} | Converted: ${converted} | Revenue: ${formatCurrency(revenue)}
                    </div>
                </div>
            </div>
        `;
        container.appendChild(item);
    });
}


function exportReport(format) {
    showToast(`Export to ${format.toUpperCase()} functionality would generate a downloadable file with the current report data.`, 'success');
}

function changePassword() {
    const newPassword = prompt('Enter new password:');
    if (newPassword) {
        showToast('Password change functionality would be implemented here', 'success');
    }
}

function saveProfile() {
    showToast('Profile updated successfully', 'success');
}


// Dashboard
function updateDashboard() {
    // Admin Dashboard uses ALL leads (not filtered) - this function is only called for Admin/Sales Manager
    const currentUser = users.find(u => u.id === currentUserId);
    const allLeads = (currentUser && (currentUser.role === 'Admin' || currentUser.role === 'Sales Manager')) 
        ? leads  // Admin sees ALL leads
        : getFilteredLeads();  // Fallback to filtered (shouldn't happen, but safe)
    
    // Update metric cards - update each one individually and force reflow
    const metricValues = document.querySelectorAll('.metric-card .metric-value');
    
    if (metricValues.length > 0) {
        const totalLeads = allLeads.length;
        metricValues[0].textContent = totalLeads;
        // Force immediate reflow after first update
        void metricValues[0].offsetHeight;
    }
    
    if (metricValues.length > 1) {
        const activeLeads = allLeads.filter(l => 
            ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation'].includes(l.status)
        ).length;
        metricValues[1].textContent = activeLeads;
        // Force immediate reflow after second update
        void metricValues[1].offsetHeight;
    }
    
    if (metricValues.length > 2) {
        const wonLeads = allLeads.filter(l => l.status === 'Won').length;
        const conversionRate = allLeads.length > 0 ? Math.round((wonLeads / allLeads.length) * 100) : 0;
        metricValues[2].textContent = conversionRate + '%';
        // Force immediate reflow after third update
        void metricValues[2].offsetHeight;
    }
    
    if (metricValues.length > 3) {
        // Calculate revenue from Won leads only
        const revenue = allLeads
            .filter(l => l.status === 'Won')
            .reduce((sum, lead) => sum + (lead.value || 0), 0);
        metricValues[3].textContent = formatCurrency(revenue);
        // Force immediate reflow after fourth update
        void metricValues[3].offsetHeight;
    }
    
    // Update charts (use all leads for Admin)
    updatePipelineChart();
    
    // Team Performance
    updateTeamPerformance();
    
    // Recent activity
    updateRecentActivity();
    
    // Force a reflow to ensure UI updates are rendered immediately
    const dashboardEl = document.getElementById('dashboard');
    if (dashboardEl) {
        void dashboardEl.offsetHeight; // Force reflow
    }
}

// Sales Rep Dashboard
function updateSalesRepDashboard() {
    const currentUser = users.find(u => u.id === currentUserId);
    if (!currentUser) return;
    
    // Use filtered data
    const filteredLeads = getFilteredLeads();
    const filteredTasks = getFilteredTasks();
    
    // Update greeting
    const greetingEl = document.getElementById('salesrep-greeting');
    if (greetingEl) {
        const hour = new Date().getHours();
        let greeting = 'Good morning';
        if (hour >= 12 && hour < 17) {
            greeting = 'Good afternoon';
        } else if (hour >= 17) {
            greeting = 'Good evening';
        }
        greetingEl.textContent = `${greeting}, ${currentUser.name.split(' ')[0]}!`;
    }
    
    // Update metrics - update each one individually and force reflow
    const totalLeadsEl = document.getElementById('salesrep-total-leads');
    if (totalLeadsEl) {
        totalLeadsEl.textContent = filteredLeads.length;
        // Force immediate reflow
        void totalLeadsEl.offsetHeight;
    }
    
    const wonLeadsEl = document.getElementById('salesrep-won-leads');
    if (wonLeadsEl) {
        const wonLeads = filteredLeads.filter(l => l.status === 'Won').length;
        wonLeadsEl.textContent = wonLeads;
        // Force immediate reflow
        void wonLeadsEl.offsetHeight;
    }
    
    const pendingTasksEl = document.getElementById('salesrep-pending-tasks');
    if (pendingTasksEl) {
        const pendingTasks = filteredTasks.filter(t => t.status === 'Pending').length;
        pendingTasksEl.textContent = pendingTasks;
        // Force immediate reflow
        void pendingTasksEl.offsetHeight;
    }
    
    const revenueEl = document.getElementById('salesrep-revenue');
    if (revenueEl) {
        const revenue = filteredLeads
            .filter(l => l.status === 'Won')
            .reduce((sum, lead) => sum + (lead.value || 0), 0);
        revenueEl.textContent = formatCurrency(revenue);
        // Force immediate reflow
        void revenueEl.offsetHeight;
    }
    
    // Update alerts widget
    updateSalesRepAlerts();
    
    // Update upcoming tasks list
    updateSalesRepTasksList();
    
    // Update recent leads list
    updateSalesRepRecentLeads();
    
    // Initialize and load sales rep targets
    initializeSalesRepTargetsPeriodSelector();
    loadSalesRepTargets();
    
    // Force a reflow to ensure UI updates are rendered immediately
    const salesrepDashboardEl = document.getElementById('salesrep-dashboard');
    if (salesrepDashboardEl) {
        void salesrepDashboardEl.offsetHeight; // Force reflow
    }
}

function initializeSalesRepTargetsPeriodSelector() {
    const periodType = document.getElementById('salesrep-target-period-type');
    const periodSelector = document.getElementById('salesrep-target-period-selector');
    
    // Return early if sales targets section doesn't exist
    if (!periodType || !periodSelector) return;
    
    const updatePeriods = () => {
        const type = periodType.value;
        periodSelector.innerHTML = '';
        
        if (type === 'monthly') {
            const now = new Date();
            for (let i = 11; i >= 0; i--) {
                const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                const option = document.createElement('option');
                option.value = value;
                option.textContent = monthYear;
                if (i === 0) option.selected = true;
                periodSelector.appendChild(option);
            }
        } else {
            const now = new Date();
            const currentQuarter = Math.floor(now.getMonth() / 3) + 1;
            for (let i = 3; i >= 0; i--) {
                const quarter = currentQuarter - i;
                const year = now.getFullYear();
                let q, y = year;
                if (quarter <= 0) {
                    q = quarter + 4;
                    y = year - 1;
                } else if (quarter > 4) {
                    q = quarter - 4;
                    y = year + 1;
                } else {
                    q = quarter;
                }
                const value = `${y}-Q${q}`;
                const option = document.createElement('option');
                option.value = value;
                option.textContent = `${y} Q${q}`;
                if (i === 0) option.selected = true;
                periodSelector.appendChild(option);
            }
        }
        
        loadSalesRepTargets();
    };
    
    periodType.addEventListener('change', updatePeriods);
    updatePeriods();
}

function loadSalesRepTargets() {
    const periodType = document.getElementById('salesrep-target-period-type');
    const periodSelector = document.getElementById('salesrep-target-period-selector');
    const display = document.getElementById('salesrep-targets-display');
    
    // Return early if sales targets section doesn't exist
    if (!periodType || !periodSelector || !display) {
        return;
    }
    
    const type = periodType.value;
    const period = periodSelector.value;
    
    // Get current user's target for this period
    const target = targets.find(t => 
        t.salesRepId === currentUserId &&
        t.periodType === type && 
        t.period === period
    );
    
    if (!target) {
        display.innerHTML = '<p class="empty-state">No target set for this period. Click "+ Set Target" to create one.</p>';
        return;
    }
    
    const startDate = new Date(target.startDate);
    const endDate = getPeriodEndDate(startDate, type);
    const actualRevenue = calculateActualRevenue(currentUserId, startDate, endDate);
    const progress = target.amount > 0 ? Math.round((actualRevenue / target.amount) * 100) : 0;
    
    display.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--spacing-md); margin-bottom: var(--spacing-md);">
            <div>
                <div style="font-size: 12px; color: #8d99ae; margin-bottom: 4px;">Target Amount</div>
                <div style="font-size: 24px; font-weight: 700; color: #012a4a;">${formatCurrency(target.amount)}</div>
            </div>
            <div>
                <div style="font-size: 12px; color: #8d99ae; margin-bottom: 4px;">Actual Revenue</div>
                <div style="font-size: 24px; font-weight: 700; color: #014f86;">${formatCurrency(actualRevenue)}</div>
            </div>
        </div>
        <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <div style="font-size: 14px; font-weight: 600; color: #2b2d42;">Progress</div>
                <div style="font-size: 14px; font-weight: 600; color: ${progress >= 100 ? '#06d6a0' : '#ef476f'};">${progress}%</div>
            </div>
            <div class="progress-bar-container">
                <div class="progress-bar ${progress >= 100 ? 'over-target' : 'under-target'}" style="width: ${Math.min(progress, 100)}%">
                    ${progress}%
                </div>
            </div>
        </div>
    `;
}

function updateSalesRepAlerts() {
    const alertsContainer = document.getElementById('salesrep-alerts');
    if (!alertsContainer) return;
    
    const filteredLeads = getFilteredLeads();
    const filteredTasks = getFilteredTasks();
    const filteredTestDrives = testDrives.filter(td => {
        const lead = leads.find(l => l.id === td.leadId);
        return lead && lead.assignedTo === currentUserId;
    });
    
    const now = new Date();
    const threeDaysAgo = new Date(now);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    
    // Find leads not contacted in 3+ days - sort with most urgent first
    const uncontactedLeads = filteredLeads.filter(lead => {
        if (lead.status === 'Won' || lead.status === 'Lost') return false;
        const lastComm = communications
            .filter(c => c.leadId === lead.id)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
        
        if (!lastComm) {
            // No communication at all - check if lead is older than 3 days
            const leadDate = new Date(lead.createdAt || lead.updatedAt);
            return leadDate < threeDaysAgo;
        }
        
        const lastCommDate = new Date(lastComm.createdAt);
        return lastCommDate < threeDaysAgo;
    }).sort((a, b) => {
        // Sort by days since last contact (most urgent first)
        const aLastComm = communications
            .filter(c => c.leadId === a.id)
            .sort((x, y) => new Date(y.createdAt) - new Date(x.createdAt))[0];
        const bLastComm = communications
            .filter(c => c.leadId === b.id)
            .sort((x, y) => new Date(y.createdAt) - new Date(x.createdAt))[0];
        
        const aDate = aLastComm ? new Date(aLastComm.createdAt) : new Date(a.createdAt);
        const bDate = bLastComm ? new Date(bLastComm.createdAt) : new Date(b.createdAt);
        
        return aDate - bDate; // Older (more urgent) first
    });
    
    // Find overdue tasks - sort with undone first
    const overdueTasks = filteredTasks.filter(task => {
        if (task.status === 'Completed') return false;
        const dueDate = new Date(task.dueDate);
        return dueDate < now;
    }).sort((a, b) => {
        // Undone tasks first
        const aIsDone = a.status === 'Completed';
        const bIsDone = b.status === 'Completed';
        if (aIsDone !== bIsDone) {
            return aIsDone ? 1 : -1;
        }
        // Then by due date (earlier first)
        return new Date(a.dueDate) - new Date(b.dueDate);
    });
    
    // Find test drives happening today
    const todayTestDrives = filteredTestDrives.filter(td => {
        const tdDate = new Date(td.datetime);
        return tdDate.toDateString() === now.toDateString() && td.status === 'Scheduled';
    });
    
    // Show/hide alert sections
    const uncontactedSection = document.getElementById('alert-uncontacted-leads');
    const overdueSection = document.getElementById('alert-overdue-tasks');
    const testDrivesSection = document.getElementById('alert-today-testdrives');
    
    let hasAlerts = false;
    
    // Uncontacted leads
    if (uncontactedLeads.length > 0) {
        hasAlerts = true;
        if (uncontactedSection) {
            uncontactedSection.style.display = 'block';
            document.getElementById('uncontacted-count').textContent = uncontactedLeads.length;
            const list = document.getElementById('uncontacted-leads-list');
            list.innerHTML = '';
            uncontactedLeads.slice(0, 5).forEach(lead => {
                // Find last communication for this lead
                const lastComm = communications
                    .filter(c => c.leadId === lead.id)
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
                
                const lastContactDate = lastComm ? new Date(lastComm.createdAt) : new Date(lead.createdAt);
                const daysSinceContact = Math.floor((new Date() - lastContactDate) / (1000 * 60 * 60 * 24));
                
                const item = document.createElement('div');
                item.className = 'alert-item';
                item.style.cssText = 'padding: 12px; border-bottom: 1px solid var(--light-gray); cursor: pointer; display: flex; align-items: center;';
                item.onclick = () => {
                    viewLeadDetails(lead.id);
                    showSection('leads');
                };
                item.innerHTML = `
                    <div style="flex: 1;">
                        <div style="font-weight: 600; color: var(--charcoal); margin-bottom: 4px;">${lead.name}</div>
                        <div style="font-size: 11px; color: #ef476f; font-weight: 500;">
                            Might lose deal if not followed up
                        </div>
                    </div>
                    <div style="flex: 1; text-align: center; font-size: 12px; color: var(--slate-gray);">
                        Last contacted: ${formatDate(lastContactDate)}<br>
                        <span style="font-size: 11px;">(${daysSinceContact} days ago)</span>
                    </div>
                    <div style="width: 24px; height: 24px; position: relative; flex-shrink: 0; margin-left: 12px;">
                        <div style="width: 0; height: 0; border-left: 12px solid transparent; border-right: 12px solid transparent; border-bottom: 24px solid #ef476f; position: relative;">
                            <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-weight: bold; font-size: 14px; line-height: 1;">!</span>
                        </div>
                    </div>
                `;
                list.appendChild(item);
            });
            if (uncontactedLeads.length > 5) {
                const more = document.createElement('div');
                more.style.cssText = 'color: #8d99ae; font-size: 12px; margin-top: 4px;';
                more.textContent = `+${uncontactedLeads.length - 5} more`;
                list.appendChild(more);
            }
        }
    } else {
        if (uncontactedSection) uncontactedSection.style.display = 'none';
    }
    
    // Overdue tasks
    if (overdueTasks.length > 0) {
        hasAlerts = true;
        if (overdueSection) {
            overdueSection.style.display = 'block';
            document.getElementById('overdue-tasks-count').textContent = overdueTasks.length;
            const list = document.getElementById('overdue-tasks-list');
            list.innerHTML = '';
            overdueTasks.slice(0, 5).forEach(task => {
                const lead = leads.find(l => l.id === task.leadId);
                const item = document.createElement('div');
                item.className = 'alert-item';
                item.onclick = () => {
                    showSection('tasks');
                };
                item.innerHTML = `
                    <span style="font-weight: 500;">${task.title}</span>
                    <span style="color: #8d99ae; font-size: 12px;">${lead ? lead.name : 'N/A'} • ${formatDate(task.dueDate)}</span>
                `;
                list.appendChild(item);
            });
            if (overdueTasks.length > 5) {
                const more = document.createElement('div');
                more.style.cssText = 'color: #8d99ae; font-size: 12px; margin-top: 4px;';
                more.textContent = `+${overdueTasks.length - 5} more`;
                list.appendChild(more);
            }
        }
    } else {
        if (overdueSection) overdueSection.style.display = 'none';
    }
    
    // Test drives today
    if (todayTestDrives.length > 0) {
        hasAlerts = true;
        if (testDrivesSection) {
            testDrivesSection.style.display = 'block';
            document.getElementById('today-testdrives-count').textContent = todayTestDrives.length;
            const list = document.getElementById('today-testdrives-list');
            list.innerHTML = '';
            todayTestDrives.slice(0, 5).forEach(td => {
                const lead = leads.find(l => l.id === td.leadId);
                const datetime = new Date(td.datetime);
                const item = document.createElement('div');
                item.className = 'alert-item';
                item.onclick = () => {
                    if (lead) viewLeadDetails(lead.id);
                    showSection('testdrives');
                };
                item.innerHTML = `
                    <span style="font-weight: 500;">${lead ? lead.name : 'N/A'}</span>
                    <span style="color: #8d99ae; font-size: 12px;">${td.vehicle || 'Vehicle TBD'} • ${datetime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                `;
                list.appendChild(item);
            });
            if (todayTestDrives.length > 5) {
                const more = document.createElement('div');
                more.style.cssText = 'color: #8d99ae; font-size: 12px; margin-top: 4px;';
                more.textContent = `+${todayTestDrives.length - 5} more`;
                list.appendChild(more);
            }
        }
    } else {
        if (testDrivesSection) testDrivesSection.style.display = 'none';
    }
    
    // Payment follow-up needed - leads in Proposal or Negotiation stage that need payment follow-up
    const paymentFollowupLeads = filteredLeads.filter(lead => {
        // Show leads in Proposal or Negotiation stage that have a value
        if ((lead.status === 'Proposal' || lead.status === 'Negotiation') && lead.value) {
            // Check if there's been a communication about payment in the last 7 days
            const paymentComms = communications.filter(c => 
                c.leadId === lead.id && 
                (c.notes.toLowerCase().includes('payment') || 
                 c.notes.toLowerCase().includes('deposit') ||
                 c.notes.toLowerCase().includes('financing'))
            );
            
            if (paymentComms.length === 0) {
                // No payment-related communication at all
                return true;
            } else {
                // Check if last payment communication was more than 3 days ago
                const lastPaymentComm = paymentComms.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
                const daysSincePaymentComm = Math.floor((new Date() - new Date(lastPaymentComm.createdAt)) / (1000 * 60 * 60 * 24));
                return daysSincePaymentComm > 3;
            }
        }
        return false;
    }).sort((a, b) => {
        // Sort by most urgent first (leads with no payment communication, then by days since last payment comm)
        const aPaymentComms = communications.filter(c => 
            c.leadId === a.id && 
            (c.notes.toLowerCase().includes('payment') || 
             c.notes.toLowerCase().includes('deposit') ||
             c.notes.toLowerCase().includes('financing'))
        );
        const bPaymentComms = communications.filter(c => 
            c.leadId === b.id && 
            (c.notes.toLowerCase().includes('payment') || 
             c.notes.toLowerCase().includes('deposit') ||
             c.notes.toLowerCase().includes('financing'))
        );
        
        // If one has no payment comms and the other does, prioritize the one without
        if (aPaymentComms.length === 0 && bPaymentComms.length > 0) return -1;
        if (aPaymentComms.length > 0 && bPaymentComms.length === 0) return 1;
        
        // Both have payment comms, sort by most recent (most urgent = older)
        if (aPaymentComms.length > 0 && bPaymentComms.length > 0) {
            const aLast = aPaymentComms.sort((x, y) => new Date(y.createdAt) - new Date(x.createdAt))[0];
            const bLast = bPaymentComms.sort((x, y) => new Date(y.createdAt) - new Date(x.createdAt))[0];
            return new Date(aLast.createdAt) - new Date(bLast.createdAt); // Older first
        }
        
        return 0;
    });
    
    if (paymentFollowupLeads.length > 0) {
        hasAlerts = true;
        const paymentSection = document.getElementById('alert-payment-followup');
        if (paymentSection) {
            paymentSection.style.display = 'block';
            document.getElementById('payment-followup-count').textContent = paymentFollowupLeads.length;
            const list = document.getElementById('payment-followup-list');
            list.innerHTML = '';
            paymentFollowupLeads.slice(0, 5).forEach(lead => {
                const item = document.createElement('div');
                item.className = 'alert-item';
                item.style.cssText = 'padding: 12px; border-bottom: 1px solid var(--light-gray); cursor: pointer; display: flex; align-items: center;';
                item.onclick = () => {
                    viewLeadDetails(lead.id);
                    showSection('leads');
                };
                item.innerHTML = `
                    <div style="flex: 1;">
                        <div style="font-weight: 600; color: var(--charcoal); margin-bottom: 4px;">${lead.name}</div>
                        <div style="font-size: 11px; color: #f59e0b; font-weight: 500;">
                            Follow up on payment needed
                        </div>
                    </div>
                    <div style="flex: 1; text-align: center; font-size: 12px; color: var(--slate-gray);">
                        ${lead.status}<br>
                        <span style="font-size: 11px;">${formatCurrency(lead.value)}</span>
                    </div>
                    <div style="width: 24px; height: 24px; position: relative; flex-shrink: 0; margin-left: 12px;">
                        <div style="width: 0; height: 0; border-left: 12px solid transparent; border-right: 12px solid transparent; border-bottom: 24px solid #f59e0b; position: relative;">
                            <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-weight: bold; font-size: 14px; line-height: 1;">!</span>
                        </div>
                    </div>
                `;
                list.appendChild(item);
            });
            if (paymentFollowupLeads.length > 5) {
                const more = document.createElement('div');
                more.style.cssText = 'color: #8d99ae; font-size: 12px; margin-top: 4px;';
                more.textContent = `+${paymentFollowupLeads.length - 5} more`;
                list.appendChild(more);
            }
        }
    } else {
        const paymentSection = document.getElementById('alert-payment-followup');
        if (paymentSection) paymentSection.style.display = 'none';
    }
    
    // Show/hide entire alerts widget
    alertsContainer.style.display = hasAlerts ? 'block' : 'none';
}

function updateLeadStatusQuick(leadId, newStatus) {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;
    
    lead.status = newStatus;
    lead.updatedAt = new Date().toISOString();
    saveLeads();
    
    // Update the badge in the UI
    const item = document.querySelector(`[onclick*="viewLeadDetails(${leadId})"]`);
    if (item) {
        const badge = item.querySelector('.salesrep-lead-item-badge');
        if (badge) {
            const statusColors = {
                'New': '#118ab2',
                'Contacted': '#2c7da0',
                'Qualified': '#06d6a0',
                'Proposal': '#d97706',
                'Negotiation': '#014f86',
                'Won': '#06d6a0',
                'Lost': '#ef476f'
            };
            const statusColor = statusColors[newStatus] || '#8d99ae';
            badge.style.color = statusColor;
            badge.style.background = 'none';
            badge.textContent = newStatus;
        }
    }
    
    // Refresh all views
    updateSalesRepDashboard();
    loadLeads();
    updatePipeline();
    updateAllNavPreviews();
    
    showToast('Status updated', 'success');
}

function updateSalesRepPipelineChart() {
    const container = document.getElementById('salesrep-pipeline-chart');
    if (!container) return;
    
    const filteredLeads = getFilteredLeads();
    const stages = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'];
    const stageCounts = stages.map(stage => filteredLeads.filter(l => l.status === stage).length);
    const maxCount = Math.max(...stageCounts, 1);
    const chartHeight = 150;
    
    container.innerHTML = '';
    container.style.display = 'flex';
    container.style.alignItems = 'flex-end';
    container.style.justifyContent = 'space-around';
    container.style.gap = '8px';
    container.style.height = chartHeight + 50 + 'px';
    container.style.padding = '16px 0';
    
    stages.forEach((stage, index) => {
        const count = stageCounts[index];
        const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
        const barHeight = (percentage / 100) * chartHeight;
        
        const column = document.createElement('div');
        column.style.display = 'flex';
        column.style.flexDirection = 'column';
        column.style.alignItems = 'center';
        column.style.flex = '1';
        column.style.maxWidth = '70px';
        column.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; width: 100%;">
                <div style="font-size: 14px; font-weight: 700; color: #2c7da0; margin-bottom: 6px; text-align: center; min-height: 24px; display: flex; align-items: center; justify-content: center;">${count}</div>
                <div style="width: 100%; height: ${chartHeight}px; background: #edf2f4; border-radius: 4px 4px 0 0; position: relative; display: flex; align-items: flex-end;">
                    <div style="width: 100%; height: ${barHeight}px; background: linear-gradient(180deg, #2c7da0 0%, #014f86 100%); border-radius: 4px 4px 0 0; transition: height 0.3s; min-height: ${count > 0 ? '4px' : '0'};"></div>
                </div>
                <div style="font-size: 10px; color: #8d99ae; margin-top: 6px; text-align: center; font-weight: 500;">${stage}</div>
            </div>
        `;
        container.appendChild(column);
    });
}

function updateSalesRepTasksList() {
    const container = document.getElementById('salesrep-tasks-list');
    if (!container) return;
    
    const filteredTasks = getFilteredTasks();
    
    // Get tomorrow's date
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Priority order: High > Medium > Low
    const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
    
    // Get tomorrow's tasks: filter for tasks due tomorrow, sort by priority first, then by due date
    const upcomingTasks = filteredTasks
        .filter(t => {
            // Only show pending tasks
            if (t.status !== 'Pending') return false;
            
            // Check if task has a valid due date
            if (!t.dueDate) return false;
            
            // Parse and normalize the due date
            const dueDate = new Date(t.dueDate);
            if (isNaN(dueDate.getTime())) return false; // Invalid date
            
            dueDate.setHours(0, 0, 0, 0);
            
            // Compare dates by year, month, and day only
            const dueDateStr = dueDate.toDateString();
            const tomorrowStr = tomorrow.toDateString();
            
            return dueDateStr === tomorrowStr;
        })
        .sort((a, b) => {
            // First sort by priority (High priority first)
            const priorityDiff = (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
            if (priorityDiff !== 0) return priorityDiff;
            // Then sort by due date (earliest first)
            return new Date(a.dueDate) - new Date(b.dueDate);
        });
    
    container.innerHTML = '';
    
    if (upcomingTasks.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #8d99ae; padding: 24px;">No upcoming tasks</p>';
        return;
    }
    
    upcomingTasks.forEach(task => {
        const lead = leads.find(l => l.id === task.leadId);
        const dueDate = new Date(task.dueDate);
        const isOverdue = task.status === 'Pending' && dueDate < new Date();
        
        const priorityColors = {
            'High': '#dc2626', // rich red
            'Medium': '#eab308', // rich yellow
            'Low': '#1e40af' // dark blue
        };
        
        const item = document.createElement('div');
        item.className = `task-item ${task.status === 'Completed' ? 'completed' : ''}`;
        
        const priorityBadge = `<span class="priority-badge priority-${task.priority.toLowerCase()}" style="color: ${priorityColors[task.priority] || '#8d99ae'};"><span>${task.priority}</span></span>`;
        
        item.innerHTML = `
            <input type="checkbox" ${task.status === 'Completed' ? 'checked' : ''} 
                   onchange="toggleTaskStatus(${task.id})" 
                   style="width: 18px; height: 18px; cursor: pointer; flex-shrink: 0;">
            <div style="flex: 1;">
                <div class="task-title" style="font-size: 14px; font-weight: 500; margin-bottom: 4px; ${task.status === 'Completed' ? 'text-decoration: line-through; color: #8d99ae;' : ''}">
                    ${task.title}
                    ${isOverdue ? ' <span style="color: #ef476f; font-size: 12px;">• Overdue</span>' : ''}
                </div>
                <div style="font-size: 12px; color: var(--slate-gray);">
                    ${lead ? lead.name : 'N/A'} • ${formatDate(task.dueDate)}
                </div>
            </div>
            ${priorityBadge}
        `;
        container.appendChild(item);
    });
}

function showSalesRepTasksViewAll() {
    // Show tasks section
    showSection('tasks');
    
    // After a short delay, filter to show only this week and later tasks
    setTimeout(() => {
        const filteredTasks = getFilteredTasks();
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const today = new Date(now);
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // Filter to show only this week and later (exclude today and tomorrow)
        const thisWeekAndLater = filteredTasks.filter(task => {
            const dueDate = new Date(task.dueDate);
            dueDate.setHours(0, 0, 0, 0);
            return dueDate.getTime() > tomorrow.getTime();
        });
        
        // Display filtered tasks
        displayTasks(thisWeekAndLater);
    }, 100);
}

function updateSalesRepRecentLeads() {
    const container = document.getElementById('salesrep-recent-leads-list');
    if (!container) return;
    
    const filteredLeads = getFilteredLeads();
    const recentLeads = filteredLeads
        .sort((a, b) => new Date(b.createdAt || b.updatedAt) - new Date(a.createdAt || a.updatedAt))
        .slice(0, 5);
    
    container.innerHTML = '';
    
    if (recentLeads.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #8d99ae; padding: 24px;">No leads yet</p>';
        return;
    }
    
    recentLeads.forEach(lead => {
        const statusColors = {
            'New': '#118ab2',
            'Contacted': '#2c7da0',
            'Qualified': '#06d6a0',
            'Proposal': '#ffd166',
            'Negotiation': '#014f86',
            'Won': '#06d6a0',
            'Lost': '#ef476f'
        };
        
        const statusColor = statusColors[lead.status] || '#8d99ae';
        
        const item = document.createElement('div');
        item.className = 'salesrep-lead-item';
        item.onclick = () => viewLeadDetails(lead.id);
        
        item.innerHTML = `
            <div class="salesrep-lead-item-content">
                <div class="salesrep-lead-item-name">${lead.name}</div>
                <div class="salesrep-lead-item-meta">
                    ${lead.email} • ${formatSource(lead.source)}
                    ${lead.value ? ` • ${formatCurrency(lead.value)}` : ''}
                    ${lead.phone ? `
                        <div style="margin-top: 4px; display: flex; align-items: center; gap: 8px;">
                            <a href="tel:${lead.phone.replace(/\s+/g, '')}" onclick="event.stopPropagation();" style="color: #2c7da0; text-decoration: none; display: flex; align-items: center; gap: 4px;">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                                </svg>
                                ${lead.phone}
                            </a>
                            <a href="sms:${lead.phone.replace(/\s+/g, '')}" onclick="event.stopPropagation();" style="color: #2c7da0; text-decoration: none; padding: 4px; display: flex; align-items: center;" title="Send SMS">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                </svg>
                            </a>
                        </div>
                    ` : ''}
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
                <select class="status-dropdown-inline" onchange="updateLeadStatusQuick(${lead.id}, this.value)" onclick="event.stopPropagation();" style="padding: 4px 8px; border: 1px solid #8d99ae; border-radius: 4px; font-size: 12px; background: white; cursor: pointer;">
                    <option value="New" ${lead.status === 'New' ? 'selected' : ''}>New</option>
                    <option value="Contacted" ${lead.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
                    <option value="Qualified" ${lead.status === 'Qualified' ? 'selected' : ''}>Qualified</option>
                    <option value="Proposal" ${lead.status === 'Proposal' ? 'selected' : ''}>Proposal</option>
                    <option value="Negotiation" ${lead.status === 'Negotiation' ? 'selected' : ''}>Negotiation</option>
                    <option value="Won" ${lead.status === 'Won' ? 'selected' : ''}>Won</option>
                    <option value="Lost" ${lead.status === 'Lost' ? 'selected' : ''}>Lost</option>
                </select>
                <span class="salesrep-lead-item-badge status-badge" style="color: ${statusColor};">${lead.status}</span>
            </div>
        `;
        container.appendChild(item);
    });
}

function updatePipelineChart() {
    const container = document.getElementById('pipeline-chart');
    if (!container) return;
    
    // Admin Dashboard charts use ALL leads (not filtered)
    const allLeads = leads;
    const stages = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'];
    const stageCounts = stages.map(stage => allLeads.filter(l => l.status === stage).length);
    const maxCount = Math.max(...stageCounts, 1);
    const chartHeight = 200;
    
    container.innerHTML = '';
    container.style.display = 'flex';
    container.style.alignItems = 'flex-end';
    container.style.justifyContent = 'space-around';
    container.style.gap = '12px';
    container.style.height = chartHeight + 60 + 'px';
    container.style.padding = '20px 0';
    
    stages.forEach((stage, index) => {
        const count = stageCounts[index];
        const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
        const barHeight = (percentage / 100) * chartHeight;
        
        const column = document.createElement('div');
        column.style.display = 'flex';
        column.style.flexDirection = 'column';
        column.style.alignItems = 'center';
        column.style.flex = '1';
        column.style.maxWidth = '80px';
        column.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; width: 100%;">
                <div style="font-size: 12px; font-weight: 600; color: #012a4a; margin-bottom: 8px; text-align: center; min-height: 32px; display: flex; align-items: center; justify-content: center;">${count}</div>
                <div style="width: 100%; height: ${chartHeight}px; background: #edf2f4; border-radius: 4px 4px 0 0; position: relative; display: flex; align-items: flex-end;">
                    <div style="width: 100%; height: ${barHeight}px; background: #014f86; border-radius: 4px 4px 0 0; transition: height 0.3s; min-height: ${count > 0 ? '4px' : '0'};"></div>
                </div>
                <div style="font-size: 11px; color: #8d99ae; margin-top: 8px; text-align: center; font-weight: 500;">${stage}</div>
            </div>
        `;
        container.appendChild(column);
    });
}

function updateSourcesChart() {
    const container = document.getElementById('sources-chart');
    if (!container) return;
    
    // Admin Dashboard charts use ALL leads (not filtered)
    const allLeads = leads;
    const sourceCounts = {};
    allLeads.forEach(lead => {
        sourceCounts[lead.source] = (sourceCounts[lead.source] || 0) + 1;
    });
    
    const total = allLeads.length;
    const colors = ['#012a4a', '#014f86', '#2c7da0', '#118ab2', '#06d6a0'];
    let colorIndex = 0;
    
    if (Object.keys(sourceCounts).length === 0) {
        container.innerHTML = '<p class="empty-state">No data available</p>';
        return;
    }
    
    container.innerHTML = '';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '12px';
    container.style.padding = '8px 0';
    
    Object.entries(sourceCounts).forEach(([source, count]) => {
        const sourcePercentage = total > 0 ? Math.round((count / total) * 100) : 0;
        
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.alignItems = 'center';
        row.style.justifyContent = 'space-between';
        row.style.padding = '12px 0';
        row.style.borderBottom = '1px solid #edf2f4';
        row.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
                <div style="width: 12px; height: 12px; background: ${colors[colorIndex % colors.length]}; border-radius: 2px; flex-shrink: 0;"></div>
                <span style="font-size: 14px; font-weight: 500; color: #2b2d42;">${formatSource(source)}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 16px;">
                <span style="font-size: 14px; font-weight: 600; color: #012a4a;">${count}</span>
                <span style="font-size: 14px; color: #8d99ae; min-width: 45px; text-align: right;">${sourcePercentage}%</span>
            </div>
        `;
        container.appendChild(row);
        colorIndex++;
    });
}

function updateRecentActivity() {
    const container = document.getElementById('recent-activity-list');
    if (!container) return;
    
    // Admin Dashboard uses ALL data (not filtered)
    const allLeads = leads;
    const allTasks = tasks;
    const allCommunications = communications;
    
    // Combine leads, tasks, and communications for activity feed
    const activities = [];
    
    // Lead activities - show who created/updated leads (sales rep activities)
    allLeads.slice(-20).reverse().forEach(lead => {
        const assignedUser = users.find(u => u.id === lead.assignedTo);
        const userName = assignedUser ? assignedUser.name : 'Unassigned';
        const userInitials = assignedUser ? assignedUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
        
        activities.push({
            type: 'lead',
            action: 'created',
            name: lead.name,
            user: userName,
            userInitials: userInitials,
            date: lead.createdAt
        });
        
        // Also add status changes (deals won)
        if (lead.status === 'Won') {
            activities.push({
                type: 'deal',
                action: 'won',
                name: lead.name,
                user: userName,
                userInitials: userInitials,
                date: lead.updatedAt || lead.createdAt
            });
        }
    });
    
    // Task activities - show who created tasks (sales rep activities)
    allTasks.slice(-15).reverse().forEach(task => {
        const assignedUser = users.find(u => u.id === task.assignedTo);
        const userName = assignedUser ? assignedUser.name : 'Unassigned';
        const userInitials = assignedUser ? assignedUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
        
        activities.push({
            type: 'task',
            action: 'created',
            name: task.title,
            user: userName,
            userInitials: userInitials,
            date: task.createdAt
        });
    });
    
    // Communication activities - show who logged communications (sales rep activities)
    allCommunications.slice(-15).reverse().forEach(comm => {
        const lead = allLeads.find(l => l.id === comm.leadId);
        if (lead) {
            const assignedUser = users.find(u => u.id === lead.assignedTo);
            const userName = assignedUser ? assignedUser.name : 'Unassigned';
            const userInitials = assignedUser ? assignedUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
            
            activities.push({
                type: 'communication',
                action: 'logged',
                name: `${comm.type} with ${lead.name}`,
                user: userName,
                userInitials: userInitials,
                date: comm.createdAt
            });
        }
    });
    
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));
    const recentActivities = activities.slice(0, 3);
    
    container.innerHTML = '';
    recentActivities.forEach(activity => {
        const item = document.createElement('div');
        item.className = 'activity-item';
        
        // Format the action description
        let actionText = '';
        if (activity.type === 'deal') {
            actionText = `won deal: ${activity.name}`;
        } else if (activity.type === 'lead') {
            actionText = `created lead: ${activity.name}`;
        } else if (activity.type === 'task') {
            actionText = `created task: ${activity.name}`;
        } else if (activity.type === 'communication') {
            actionText = activity.name;
        } else {
            actionText = `${activity.action} ${activity.type}: ${activity.name}`;
        }
        
        item.innerHTML = `
            <div class="user-avatar" style="width: 32px; height: 32px; font-size: 12px;">${activity.userInitials}</div>
            <div style="flex: 1;">
                <div style="font-size: 14px;">
                    <strong>${activity.user}</strong> ${actionText}
                </div>
                <div style="font-size: 12px; color: #8d99ae; margin-top: 4px;">${formatDate(activity.date)}</div>
            </div>
        `;
        container.appendChild(item);
    });
    
    if (activities.length === 0) {
        container.innerHTML = '<p class="empty-state">No recent activity</p>';
    }
}

// CSV Import
function openImportModal() {
    document.getElementById('import-modal').classList.add('active');
}

function handleCSVImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        
        let imported = 0;
        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            
            const values = lines[i].split(',').map(v => v.trim());
            if (values.length < headers.length) continue;
            
            const leadData = {};
            headers.forEach((header, index) => {
                leadData[header] = values[index] || '';
            });
            
            // Map CSV columns to lead structure
            const newLead = {
                id: leads.length > 0 ? Math.max(...leads.map(l => l.id)) + 1 : 1,
                name: leadData.name || leadData['name'] || '',
                email: leadData.email || leadData['email'] || '',
                phone: leadData.phone || leadData['phone'] || '',
                source: (leadData.source || leadData['source'] || 'website').toLowerCase().replace(' ', '-'),
                status: leadData.status || leadData['status'] || 'New',
                value: leadData.value || leadData['value'] ? parseFloat(leadData.value || leadData['value']) : null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            if (newLead.name && newLead.email) {
                leads.push(newLead);
                imported++;
            }
        }
        
        saveLeads();
        loadLeads();
        updateDashboard();
        updatePipeline();
        showToast(`Successfully imported ${imported} leads`, 'success');
        closeModal('import-modal');
    };
    
    reader.readAsText(file);
}

// Modal Functions
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Close modals when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.classList.remove('active');
        }
    });
};

// Toast Notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = 'toast ' + (type === 'error' ? 'error' : '');
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function clearFilters() {
    document.getElementById('status-filter').value = '';
    document.getElementById('source-filter').value = '';
    document.getElementById('assigned-filter').value = '';
    document.getElementById('lead-search').value = '';
    filterLeads();
}

// Utility Functions
function formatCurrency(amount) {
    if (!amount && amount !== 0) return '-';
    return Math.round(parseFloat(amount)).toLocaleString('en-KE');
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function formatDateTimeLocal(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// LocalStorage Functions
function saveLeads() {
    localStorage.setItem('crm_leads', JSON.stringify(leads));
}

function saveTasks() {
    localStorage.setItem('crm_tasks', JSON.stringify(tasks));
}

function saveUsers() {
    localStorage.setItem('crm_users', JSON.stringify(users));
}

function saveCommunications() {
    localStorage.setItem('crm_communications', JSON.stringify(communications));
}

function saveTestDrives() {
    localStorage.setItem('crm_testdrives', JSON.stringify(testDrives));
}

function saveVehicles() {
    localStorage.setItem('crm_vehicles', JSON.stringify(vehicles));
}

// ============================================
// TEST DRIVE MANAGEMENT
// ============================================

function openTestDriveModal(testDriveId = null, leadId = null) {
    const modal = document.getElementById('test-drive-modal');
    const form = document.getElementById('test-drive-form');
    const title = document.getElementById('test-drive-modal-title');
    
    form.reset();
    document.getElementById('test-drive-id').value = '';
    
    // Populate leads dropdown
    const leadSelect = document.getElementById('test-drive-lead');
    leadSelect.innerHTML = '<option value="">Select Lead</option>';
    leads.forEach(lead => {
        const option = document.createElement('option');
        option.value = lead.id;
        option.textContent = lead.name;
        if (leadId && lead.id === leadId) {
            option.selected = true;
            // Auto-fill vehicle from lead
            if (lead.vehicleId) {
                const vehicle = vehicles.find(v => v.id === lead.vehicleId);
                if (vehicle) {
                    document.getElementById('test-drive-vehicle').value = `${vehicle.make} ${vehicle.model} ${vehicle.year}`;
                }
            } else if (lead.vehicleInterest) {
                document.getElementById('test-drive-vehicle').value = lead.vehicleInterest;
            }
        }
        leadSelect.appendChild(option);
    });
    
    // Populate sales rep dropdown
    const salesRepSelect = document.getElementById('test-drive-salesrep');
    salesRepSelect.innerHTML = '<option value="">Select Sales Rep</option>';
    users.filter(u => u.role === 'Sales Rep' || u.role === 'Admin' || u.role === 'Sales Manager').forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.name;
        if (!testDriveId && user.id === currentUserId) {
            option.selected = true;
        }
        salesRepSelect.appendChild(option);
    });
    
    // Handle lead change to auto-fill vehicle
    leadSelect.addEventListener('change', function() {
        const selectedLead = leads.find(l => l.id === parseInt(this.value));
        if (selectedLead) {
            if (selectedLead.vehicleId) {
                const vehicle = vehicles.find(v => v.id === selectedLead.vehicleId);
                if (vehicle) {
                    document.getElementById('test-drive-vehicle').value = `${vehicle.make} ${vehicle.model} ${vehicle.year}`;
                }
            } else if (selectedLead.vehicleInterest) {
                document.getElementById('test-drive-vehicle').value = selectedLead.vehicleInterest;
            }
        }
    });
    
    if (testDriveId) {
        const testDrive = testDrives.find(td => td.id === testDriveId);
        if (testDrive) {
            title.textContent = 'Edit Test Drive';
            document.getElementById('test-drive-id').value = testDrive.id;
            document.getElementById('test-drive-lead').value = testDrive.leadId;
            document.getElementById('test-drive-vehicle').value = testDrive.vehicle || '';
            document.getElementById('test-drive-datetime').value = testDrive.datetime ? new Date(testDrive.datetime).toISOString().slice(0, 16) : '';
            document.getElementById('test-drive-salesrep').value = testDrive.salesRepId || '';
            document.getElementById('test-drive-status').value = testDrive.status || 'Scheduled';
            document.getElementById('test-drive-notes').value = testDrive.notes || '';
        }
    } else {
        title.textContent = 'Schedule Test Drive';
    }
    
    modal.classList.add('active');
}

function saveTestDrive() {
    const form = document.getElementById('test-drive-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const testDriveId = document.getElementById('test-drive-id').value;
    const testDriveData = {
        leadId: parseInt(document.getElementById('test-drive-lead').value),
        vehicle: document.getElementById('test-drive-vehicle').value,
        datetime: document.getElementById('test-drive-datetime').value,
        salesRepId: parseInt(document.getElementById('test-drive-salesrep').value) || currentUserId,
        status: document.getElementById('test-drive-status').value,
        notes: document.getElementById('test-drive-notes').value,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    if (testDriveId) {
        const index = testDrives.findIndex(td => td.id === parseInt(testDriveId));
        if (index !== -1) {
            testDrives[index] = { ...testDrives[index], ...testDriveData, id: parseInt(testDriveId) };
        }
    } else {
        const newId = testDrives.length > 0 ? Math.max(...testDrives.map(td => td.id)) + 1 : 1;
        testDrives.push({ ...testDriveData, id: newId });
    }
    
    saveTestDrives();
    loadTestDrives();
    closeModal('test-drive-modal');
    showToast('Test drive saved successfully', 'success');
}

function loadTestDrives() {
    const tbody = document.getElementById('testdrives-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    testDrives.forEach(testDrive => {
        const lead = leads.find(l => l.id === testDrive.leadId);
        const salesRep = users.find(u => u.id === testDrive.salesRepId);
        const row = document.createElement('tr');
        
        const datetime = new Date(testDrive.datetime);
        const statusColors = {
            'Scheduled': '#2c7da0',
            'Completed': '#06d6a0',
            'Cancelled': '#ef476f'
        };
        
        row.innerHTML = `
            <td>${lead ? lead.name : 'N/A'}</td>
            <td>${testDrive.vehicle || '-'}</td>
            <td>${formatDate(testDrive.datetime)} ${datetime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</td>
            <td><span class="status-badge" style="color: ${statusColors[testDrive.status] || '#8d99ae'};"><span>${testDrive.status}</span></td>
            <td>${salesRep ? salesRep.name : 'N/A'}</td>
            <td style="text-align: center; width: 140px; min-width: 140px;">
                <div class="action-buttons" style="display: flex; gap: 8px; flex-wrap: nowrap; white-space: nowrap; justify-content: center;">
                    <button class="btn btn-sm btn-primary" onclick="openTestDriveModal(${testDrive.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteTestDrive(${testDrive.id})">Delete</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function filterTestDrives() {
    const statusFilter = document.getElementById('testdrive-status-filter').value;
    const dateFrom = document.getElementById('testdrive-date-from').value;
    const dateTo = document.getElementById('testdrive-date-to').value;
    
    const tbody = document.getElementById('testdrives-table-body');
    if (!tbody) return;
    
    const rows = tbody.querySelectorAll('tr');
    rows.forEach(row => {
        let show = true;
        
        if (statusFilter) {
            const statusCell = row.cells[3];
            if (statusCell && !statusCell.textContent.includes(statusFilter)) {
                show = false;
            }
        }
        
        if (dateFrom || dateTo) {
            const dateCell = row.cells[2];
            if (dateCell) {
                const cellDate = new Date(dateCell.textContent);
                if (dateFrom && cellDate < new Date(dateFrom)) show = false;
                if (dateTo && cellDate > new Date(dateTo)) show = false;
            }
        }
        
        row.style.display = show ? '' : 'none';
    });
}

function clearTestDriveFilters() {
    document.getElementById('testdrive-status-filter').value = '';
    document.getElementById('testdrive-date-from').value = '';
    document.getElementById('testdrive-date-to').value = '';
    loadTestDrives();
}

function deleteTestDrive(id) {
    if (confirm('Are you sure you want to delete this test drive?')) {
        testDrives = testDrives.filter(td => td.id !== id);
        saveTestDrives();
        loadTestDrives();
        showToast('Test drive deleted', 'success');
    }
}

// ============================================
// VEHICLE INVENTORY MANAGEMENT
// ============================================

function openVehicleModal(vehicleId = null) {
    const modal = document.getElementById('vehicle-modal');
    const form = document.getElementById('vehicle-form');
    const title = document.getElementById('vehicle-modal-title');
    
    form.reset();
    document.getElementById('vehicle-id').value = '';
    
    if (vehicleId) {
        const vehicle = vehicles.find(v => v.id === vehicleId);
        if (vehicle) {
            title.textContent = 'Edit Vehicle';
            document.getElementById('vehicle-id').value = vehicle.id;
            document.getElementById('vehicle-make').value = vehicle.make || '';
            document.getElementById('vehicle-model').value = vehicle.model || '';
            document.getElementById('vehicle-year').value = vehicle.year || '';
            document.getElementById('vehicle-color').value = vehicle.color || '';
            document.getElementById('vehicle-vin').value = vehicle.vin || '';
            document.getElementById('vehicle-stock').value = vehicle.stock || '';
            document.getElementById('vehicle-price').value = vehicle.price || '';
            document.getElementById('vehicle-cost').value = vehicle.cost || '';
            document.getElementById('vehicle-status').value = vehicle.status || 'Available';
            document.getElementById('vehicle-features').value = vehicle.features || '';
        }
    } else {
        title.textContent = 'Add Vehicle';
    }
    
    modal.classList.add('active');
}

function saveVehicle() {
    const form = document.getElementById('vehicle-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const vehicleId = document.getElementById('vehicle-id').value;
    const vehicleData = {
        make: document.getElementById('vehicle-make').value,
        model: document.getElementById('vehicle-model').value,
        year: parseInt(document.getElementById('vehicle-year').value),
        color: document.getElementById('vehicle-color').value,
        vin: document.getElementById('vehicle-vin').value,
        stock: document.getElementById('vehicle-stock').value,
        price: parseFloat(document.getElementById('vehicle-price').value),
        cost: parseFloat(document.getElementById('vehicle-cost').value) || null,
        status: document.getElementById('vehicle-status').value,
        features: document.getElementById('vehicle-features').value,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    if (vehicleId) {
        const index = vehicles.findIndex(v => v.id === parseInt(vehicleId));
        if (index !== -1) {
            vehicles[index] = { ...vehicles[index], ...vehicleData, id: parseInt(vehicleId) };
        }
    } else {
        const newId = vehicles.length > 0 ? Math.max(...vehicles.map(v => v.id)) + 1 : 1;
        vehicles.push({ ...vehicleData, id: newId });
    }
    
    saveVehicles();
    loadVehicles();
    updateVehicleDropdowns();
    closeModal('vehicle-modal');
    showToast('Vehicle saved successfully', 'success');
}

function loadVehicles() {
    const tbody = document.getElementById('inventory-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    vehicles.forEach(vehicle => {
        const row = document.createElement('tr');
        const statusColors = {
            'Available': '#06d6a0',
            'Sold': '#8d99ae',
            'Reserved': '#d97706'
        };
        
        row.innerHTML = `
            <td>${vehicle.make} ${vehicle.model}</td>
            <td>${vehicle.year}</td>
            <td>${formatCurrency(vehicle.price)}</td>
            <td><span class="status-badge" style="color: ${statusColors[vehicle.status] || '#8d99ae'};"><span>${vehicle.status}</span></td>
            <td>${vehicle.stock || '-'}</td>
            <td style="text-align: center; width: 140px; min-width: 140px;">
                <div class="action-buttons" style="display: flex; gap: 8px; flex-wrap: nowrap; white-space: nowrap; justify-content: center;">
                    <button class="btn btn-sm btn-primary" onclick="openVehicleModal(${vehicle.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteVehicle(${vehicle.id})">Delete</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function updateVehicleDropdowns() {
    // Update lead form dropdown
    const leadFormSelect = document.getElementById('lead-vehicle-interest');
    if (leadFormSelect) {
        leadFormSelect.innerHTML = '<option value="">Select Vehicle</option>';
        vehicles.filter(v => v.status === 'Available').forEach(vehicle => {
            const option = document.createElement('option');
            option.value = vehicle.id;
            option.textContent = `${vehicle.make} ${vehicle.model} ${vehicle.year} - ${formatCurrency(vehicle.price)}`;
            leadFormSelect.appendChild(option);
        });
    }
}

function deleteVehicle(id) {
    if (confirm('Are you sure you want to delete this vehicle?')) {
        vehicles = vehicles.filter(v => v.id !== id);
        saveVehicles();
        loadVehicles();
        updateVehicleDropdowns();
        showToast('Vehicle deleted', 'success');
    }
}

// ============================================
// FINANCING CALCULATOR
// ============================================

function calculateFinancing() {
    const priceEl = document.getElementById('calc-price');
    const downPaymentEl = document.getElementById('calc-downpayment');
    const interestEl = document.getElementById('calc-interest');
    const termEl = document.getElementById('calc-term');
    const monthlyPaymentEl = document.getElementById('calc-monthly-payment');
    const totalInterestEl = document.getElementById('calc-total-interest');
    const totalAmountEl = document.getElementById('calc-total-amount');
    
    // Check if elements exist (calculator might not be visible)
    if (!priceEl || !downPaymentEl || !interestEl || !termEl || !monthlyPaymentEl || !totalInterestEl || !totalAmountEl) {
        return;
    }
    
    const price = parseFloat(priceEl.value) || 0;
    const downPayment = parseFloat(downPaymentEl.value) || 0;
    const interestRate = parseFloat(interestEl.value) || 12;
    const term = parseInt(termEl.value) || 60;
    
    const principal = price - downPayment;
    const monthlyRate = (interestRate / 12) / 100;
    const numPayments = term;
    
    let monthlyPayment = 0;
    let totalInterest = 0;
    let totalAmount = 0;
    
    if (principal > 0 && monthlyRate > 0 && numPayments > 0) {
        monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                        (Math.pow(1 + monthlyRate, numPayments) - 1);
        totalAmount = monthlyPayment * numPayments;
        totalInterest = totalAmount - principal;
    } else if (principal > 0 && numPayments > 0) {
        monthlyPayment = principal / numPayments;
        totalAmount = principal;
        totalInterest = 0;
    }
    
    monthlyPaymentEl.textContent = formatCurrency(Math.round(monthlyPayment));
    totalInterestEl.textContent = formatCurrency(Math.round(totalInterest));
    totalAmountEl.textContent = formatCurrency(Math.round(totalAmount));
}

// ============================================
// DOCUMENT CHECKLIST
// ============================================

function toggleDocument(leadId, docKey) {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;
    
    if (!lead.documents) {
        lead.documents = {};
    }
    
    const checkbox = document.getElementById(`doc-${docKey}-${leadId}`);
    const isChecked = checkbox.checked;
    
    lead.documents[docKey] = {
        uploaded: isChecked,
        completedAt: isChecked ? new Date().toISOString() : null,
        completedBy: isChecked ? currentUserId : null
    };
    
    lead.updatedAt = new Date().toISOString();
    saveLeads();
    
    // Update the display
    const docItem = checkbox.closest('.document-item');
    if (isChecked) {
        const completedBy = users.find(u => u.id === currentUserId);
        docItem.querySelector('.doc-completed-info').innerHTML = `
            <small style="color: #06d6a0;">
                ✓ Completed ${formatDate(new Date().toISOString())} by ${completedBy ? completedBy.name : 'User'}
            </small>
        `;
    } else {
        docItem.querySelector('.doc-completed-info').innerHTML = '';
    }
    
    updateDocumentProgress(leadId);
    showToast(`Document ${isChecked ? 'marked as complete' : 'unchecked'}`, 'success');
}

function updateDocumentProgress(leadId) {
    const lead = leads.find(l => l.id === leadId);
    if (!lead || !lead.documents) return;
    
    const docKeys = ['id', 'kra', 'residence', 'bankStatements', 'employment', 'logbook', 'insurance'];
    const completed = docKeys.filter(key => lead.documents[key] && lead.documents[key].uploaded).length;
    
    const progressEl = document.getElementById(`doc-progress-${leadId}`);
    if (progressEl) {
        progressEl.textContent = `${completed}/7 documents collected`;
    }
}

// Phase 5: Admin Enhancements

// 5A: Team Performance Comparison
function updateTeamPerformance() {
    const container = document.getElementById('team-performance-table');
    if (!container) return;
    
    // Get all sales reps - ensure Walter White is included
    const salesReps = users.filter(u => u.role === 'Sales Rep');
    if (salesReps.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--slate-gray); padding: var(--spacing-lg);">No sales reps found</p>';
        return;
    }
    
    // Calculate performance for each rep
    const performanceData = salesReps.map(rep => {
        const repLeads = leads.filter(l => l.assignedTo === rep.id);
        const leadsAssigned = repLeads.length;
        const contactedLeads = repLeads.filter(l => 
            ['Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'].includes(l.status)
        ).length;
        const leadsContactedPercent = leadsAssigned > 0 ? Math.round((contactedLeads / leadsAssigned) * 100) : 0;
        const dealsWon = repLeads.filter(l => l.status === 'Won').length;
        const conversionRate = leadsAssigned > 0 ? Math.round((dealsWon / leadsAssigned) * 100) : 0;
        const totalRevenue = repLeads
            .filter(l => l.status === 'Won')
            .reduce((sum, lead) => sum + (lead.value || 0), 0);
        
        return {
            repId: rep.id,
            repName: rep.name,
            leadsAssigned,
            leadsContactedPercent,
            dealsWon,
            conversionRate,
            totalRevenue
        };
    });
    
    // Ensure all sales reps are included (even with zero revenue)
    salesReps.forEach(rep => {
        const exists = performanceData.find(d => d.repId === rep.id);
        if (!exists) {
            performanceData.push({
                repId: rep.id,
                repName: rep.name,
                leadsAssigned: 0,
                leadsContactedPercent: 0,
                dealsWon: 0,
                conversionRate: 0,
                totalRevenue: 0
            });
        }
    });
    
    // Sort by revenue descending (highest revenue = #1 leader)
    performanceData.sort((a, b) => {
        // Primary sort: by total revenue (descending)
        if (b.totalRevenue !== a.totalRevenue) {
            return b.totalRevenue - a.totalRevenue;
        }
        // Secondary sort: by deals won (descending)
        if (b.dealsWon !== a.dealsWon) {
            return b.dealsWon - a.dealsWon;
        }
        // Tertiary sort: by conversion rate (descending)
        return b.conversionRate - a.conversionRate;
    });
    
    // Assign ranks based on sorted order (highest revenue = #1)
    performanceData.forEach((data, index) => {
        data.rank = index + 1;
    });
    
    // Build table
    let html = '<table class="team-performance-table">';
    html += '<thead><tr>';
    html += '<th>Sales Rep Name</th>';
    html += '<th>Leads Assigned</th>';
    html += '<th>Leads Contacted (%)</th>';
    html += '<th>Deals Won</th>';
    html += '<th>Conversion Rate (%)</th>';
    html += '<th>Total Revenue</th>';
    html += '<th>Rank</th>';
    html += '</tr></thead><tbody>';
    
    performanceData.forEach(data => {
        const isTopPerformer = data.rank === 1;
        const rowClass = isTopPerformer ? 'top-performer' : '';
        html += `<tr class="${rowClass}">`;
        html += `<td>${isTopPerformer ? '<span class="trophy-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/></svg></span> ' : ''}${data.repName} <span style="color: #8d99ae; font-size: 12px; font-weight: 500;">(#${data.rank})</span></td>`;
        html += `<td>${data.leadsAssigned}</td>`;
        html += `<td>${data.leadsContactedPercent}%</td>`;
        html += `<td>${data.dealsWon}</td>`;
        html += `<td>${data.conversionRate}%</td>`;
        html += `<td>${formatCurrency(data.totalRevenue)}</td>`;
        html += `<td>#${data.rank}</td>`;
        html += '</tr>';
    });
    
    html += '</tbody></table>';
    container.innerHTML = html;
}

// 5B: Lead Reassignment Feature
function handleLeadCheckboxChange() {
    // Reassign Selected button removed - function kept for compatibility
    // Checkbox functionality is no longer used in leads table
}

function openReassignModal() {
    const checkboxes = document.querySelectorAll('.lead-checkbox:checked');
    if (checkboxes.length === 0) {
        showToast('Please select at least one lead', 'error');
        return;
    }
    
    const selectedLeadIds = Array.from(checkboxes).map(cb => parseInt(cb.dataset.leadId));
    const selectedLeads = leads.filter(l => selectedLeadIds.includes(l.id));
    
    // Populate selected leads list
    const leadsListEl = document.getElementById('selected-leads-list');
    if (leadsListEl) {
        leadsListEl.innerHTML = selectedLeads.map(lead => 
            `<div style="padding: var(--spacing-xs) 0; border-bottom: 1px solid var(--light-gray);">${lead.name}</div>`
        ).join('');
    }
    
    // Populate reassign dropdown
    const reassignSelect = document.getElementById('reassign-to');
    if (reassignSelect) {
        reassignSelect.innerHTML = '<option value="">Select User</option>';
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = user.name;
            reassignSelect.appendChild(option);
        });
    }
    
    // Clear reason
    const reasonEl = document.getElementById('reassign-reason');
    if (reasonEl) {
        reasonEl.value = '';
    }
    
    // Store selected lead IDs in modal for later use
    const modal = document.getElementById('reassign-modal');
    if (modal) {
        modal.dataset.selectedLeadIds = JSON.stringify(selectedLeadIds);
    }
    
    openModal('reassign-modal');
}

function confirmReassignment() {
    const modal = document.getElementById('reassign-modal');
    if (!modal) return;
    
    const selectedLeadIds = JSON.parse(modal.dataset.selectedLeadIds || '[]');
    const reassignTo = document.getElementById('reassign-to');
    const reason = document.getElementById('reassign-reason');
    
    if (!reassignTo || !reassignTo.value) {
        showToast('Please select a user to reassign to', 'error');
        return;
    }
    
    const newUserId = parseInt(reassignTo.value);
    const reasonText = reason ? reason.value : '';
    const currentUser = users.find(u => u.id === currentUserId);
    
    // Update leads
    selectedLeadIds.forEach(leadId => {
        const lead = leads.find(l => l.id === leadId);
        if (lead) {
            const oldUserId = lead.assignedTo;
            lead.assignedTo = newUserId;
            lead.updatedAt = new Date().toISOString();
            
            // Initialize reassignmentHistory if it doesn't exist
            if (!lead.reassignmentHistory) {
                lead.reassignmentHistory = [];
            }
            
            // Log reassignment
            lead.reassignmentHistory.push({
                fromUserId: oldUserId,
                toUserId: newUserId,
                reassignedBy: currentUser ? currentUser.id : null,
                reason: reasonText,
                timestamp: new Date().toISOString()
            });
        }
    });
    
    // Save to localStorage
    localStorage.setItem('crm_leads', JSON.stringify(leads));
    
    // Uncheck all checkboxes
    document.querySelectorAll('.lead-checkbox').forEach(cb => cb.checked = false);
    handleLeadCheckboxChange();
    
    // Refresh leads display
    loadLeads();
    
    closeModal('reassign-modal');
    showToast(`Successfully reassigned ${selectedLeadIds.length} lead(s)`, 'success');
}

// 5C: Sales Targets Module
function initializeTargetsPeriodSelector() {
    const periodType = document.getElementById('target-period-type');
    const periodSelector = document.getElementById('target-period-selector');
    
    if (!periodType || !periodSelector) return;
    
    const updatePeriods = () => {
        const type = periodType.value;
        periodSelector.innerHTML = '';
        
        if (type === 'monthly') {
            const now = new Date();
            for (let i = 11; i >= 0; i--) {
                const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                const option = document.createElement('option');
                option.value = value;
                option.textContent = monthYear;
                if (i === 0) option.selected = true;
                periodSelector.appendChild(option);
            }
        } else {
            const now = new Date();
            const currentQuarter = Math.floor(now.getMonth() / 3) + 1;
            for (let i = 3; i >= 0; i--) {
                const quarter = currentQuarter - i;
                const year = now.getFullYear();
                let q, y = year;
                if (quarter <= 0) {
                    q = quarter + 4;
                    y = year - 1;
                } else if (quarter > 4) {
                    q = quarter - 4;
                    y = year + 1;
                } else {
                    q = quarter;
                }
                const value = `${y}-Q${q}`;
                const option = document.createElement('option');
                option.value = value;
                option.textContent = `${y} Q${q}`;
                if (i === 0) option.selected = true;
                periodSelector.appendChild(option);
            }
        }
        
        loadTargets();
    };
    
    periodType.addEventListener('change', updatePeriods);
    updatePeriods();
}

function loadTargets() {
    const periodType = document.getElementById('target-period-type');
    const periodSelector = document.getElementById('target-period-selector');
    const tbody = document.getElementById('targets-table-body');
    
    if (!periodType || !periodSelector || !tbody) return;
    
    const type = periodType.value;
    const period = periodSelector.value;
    
    // Get current user
    const currentUser = users.find(u => u.id === currentUserId);
    const isSalesRep = currentUser && currentUser.role === 'Sales Rep';
    
    // Get sales reps - if sales rep, only show themselves; if admin/manager, show all
    const salesReps = isSalesRep ? users.filter(u => u.id === currentUserId) : users.filter(u => u.role === 'Sales Rep');
    
    // Get targets for this period
    const periodTargets = targets.filter(t => 
        t.periodType === type && 
        t.period === period
    );
    
    tbody.innerHTML = '';
    
    if (salesReps.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No sales reps found</td></tr>';
        return;
    }
    
    salesReps.forEach(rep => {
        const target = periodTargets.find(t => t.salesRepId === rep.id);
        const startDate = target ? new Date(target.startDate) : null;
        const endDate = target ? getPeriodEndDate(startDate, type) : null;
        
        // Calculate actual revenue for this period
        const actualRevenue = calculateActualRevenue(rep.id, startDate, endDate);
        const targetAmount = target ? target.amount : 0;
        const progress = targetAmount > 0 ? Math.round((actualRevenue / targetAmount) * 100) : 0;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${rep.name}</td>
            <td>${formatCurrency(targetAmount)}</td>
            <td>${formatCurrency(actualRevenue)}</td>
            <td>
                <div class="progress-bar-container">
                    <div class="progress-bar ${progress >= 100 ? 'over-target' : 'under-target'}" style="width: ${Math.min(progress, 100)}%">
                        ${progress}%
                    </div>
                </div>
            </td>
            <td>
                <div class="action-buttons">
                    ${target ? `<button class="btn btn-sm btn-secondary" onclick="editTarget(${target.id})">Edit</button>` : ''}
                    <button class="btn btn-sm btn-primary" onclick="openTargetModal(${rep.id})">${target ? 'Update' : 'Set'} Target</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function getPeriodEndDate(startDate, periodType) {
    if (!startDate) return null;
    const date = new Date(startDate);
    if (periodType === 'monthly') {
        date.setMonth(date.getMonth() + 1);
        date.setDate(0); // Last day of month
    } else {
        date.setMonth(date.getMonth() + 3);
        date.setDate(0);
    }
    return date;
}

function calculateActualRevenue(salesRepId, startDate, endDate) {
    if (!startDate || !endDate) return 0;
    
    return leads
        .filter(l => 
            l.assignedTo === salesRepId &&
            l.status === 'Won' &&
            l.closeDate &&
            new Date(l.closeDate) >= startDate &&
            new Date(l.closeDate) <= endDate
        )
        .reduce((sum, lead) => sum + (lead.value || 0), 0);
}

function openTargetModal(salesRepId = null, targetId = null) {
    const modal = document.getElementById('target-modal');
    const titleEl = document.getElementById('target-modal-title');
    const form = document.getElementById('target-form');
    const salesRepSelect = document.getElementById('target-salesrep');
    
    if (!modal || !form) return;
    
    // Get current user
    const currentUser = users.find(u => u.id === currentUserId);
    const isSalesRep = currentUser && currentUser.role === 'Sales Rep';
    
    // Reset form
    form.reset();
    document.getElementById('target-id').value = '';
    
    if (targetId) {
        // Edit mode
        const target = targets.find(t => t.id === targetId);
        if (target) {
            document.getElementById('target-id').value = target.id;
            document.getElementById('target-salesrep').value = target.salesRepId;
            document.getElementById('target-period-type-input').value = target.periodType;
            document.getElementById('target-amount').value = target.amount;
            document.getElementById('target-start-date').value = target.startDate.split('T')[0];
            if (titleEl) titleEl.textContent = 'Edit Sales Target';
        }
    } else {
        // Add mode
        if (titleEl) titleEl.textContent = isSalesRep ? 'Set My Target' : 'Add Sales Target';
        if (salesRepId) {
            document.getElementById('target-salesrep').value = salesRepId;
        } else if (isSalesRep) {
            // If sales rep, pre-select themselves
            document.getElementById('target-salesrep').value = currentUserId;
        }
    }
    
    // Populate sales rep dropdown
    const salesrepSelect = document.getElementById('target-salesrep');
    if (salesrepSelect) {
        salesrepSelect.innerHTML = '<option value="">Select Sales Rep</option>';
        // If sales rep, only show themselves; if admin/manager, show all sales reps
        const repsToShow = isSalesRep ? users.filter(u => u.id === currentUserId) : users.filter(u => u.role === 'Sales Rep');
        repsToShow.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = user.name;
            salesrepSelect.appendChild(option);
        });
        
        // If sales rep, disable the dropdown (they can only set their own target)
        if (isSalesRep) {
            salesrepSelect.disabled = true;
        } else {
            salesrepSelect.disabled = false;
        }
    }
    
    openModal('target-modal');
}

function saveTarget() {
    const id = document.getElementById('target-id').value;
    const salesRepId = parseInt(document.getElementById('target-salesrep').value);
    const periodType = document.getElementById('target-period-type-input').value;
    const amount = parseFloat(document.getElementById('target-amount').value);
    const startDate = document.getElementById('target-start-date').value;
    
    if (!salesRepId || !periodType || !amount || !startDate) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    // Calculate period string
    const date = new Date(startDate);
    let period = '';
    if (periodType === 'monthly') {
        period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    } else {
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        period = `${date.getFullYear()}-Q${quarter}`;
    }
    
    if (id) {
        // Update existing target
        const target = targets.find(t => t.id === parseInt(id));
        if (target) {
            target.salesRepId = salesRepId;
            target.periodType = periodType;
            target.period = period;
            target.amount = amount;
            target.startDate = new Date(startDate).toISOString();
        }
    } else {
        // Create new target
        const newTarget = {
            id: targets.length > 0 ? Math.max(...targets.map(t => t.id)) + 1 : 1,
            salesRepId,
            periodType,
            period,
            amount,
            startDate: new Date(startDate).toISOString(),
            createdAt: new Date().toISOString()
        };
        targets.push(newTarget);
    }
    
    // Save to localStorage
    localStorage.setItem('crm_targets', JSON.stringify(targets));
    targets = JSON.parse(localStorage.getItem('crm_targets')) || [];
    
    // Refresh targets table
    loadTargets();
    
    // If sales rep, also refresh their targets display
    const currentUser = users.find(u => u.id === currentUserId);
    if (currentUser && currentUser.role === 'Sales Rep') {
        loadSalesRepTargets();
    }
    
    closeModal('target-modal');
    showToast(id ? 'Target updated successfully' : 'Target created successfully', 'success');
}

function editTarget(targetId) {
    openTargetModal(null, targetId);
}

