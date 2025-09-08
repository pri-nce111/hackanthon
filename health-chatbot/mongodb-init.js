// MongoDB initialization script
db = db.getSiblingDB('health-chatbot');

// Create collections
db.createCollection('users');
db.createCollection('conversations');
db.createCollection('healthalerts');

// Create indexes for better performance
db.users.createIndex({ "phoneNumber": 1 }, { unique: true });
db.users.createIndex({ "location.state": 1, "location.district": 1 });
db.users.createIndex({ "lastActive": 1 });

db.conversations.createIndex({ "userId": 1, "createdAt": -1 });
db.conversations.createIndex({ "phoneNumber": 1 });
db.conversations.createIndex({ "status": 1 });
db.conversations.createIndex({ "updatedAt": -1 });

db.healthalerts.createIndex({ "isActive": 1, "validFrom": 1, "validUntil": 1 });
db.healthalerts.createIndex({ "location.state": 1, "location.district": 1 });
db.healthalerts.createIndex({ "type": 1, "severity": 1 });

// Insert sample health alerts
db.healthalerts.insertMany([
  {
    title: "COVID-19 Vaccination Drive",
    message: "Free COVID-19 vaccination available at all government health centers. Please bring ID proof and previous vaccination certificate if any.",
    severity: "medium",
    type: "vaccination",
    location: {
      nationwide: true
    },
    language: "both",
    isActive: true,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    sentCount: 0,
    source: "Ministry of Health & Family Welfare",
    createdBy: "system",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Dengue Prevention",
    message: "Monsoon season increases dengue risk. Remove stagnant water, use mosquito repellents, and seek medical attention for high fever with body ache.",
    severity: "high",
    type: "prevention",
    location: {
      nationwide: true
    },
    language: "both",
    isActive: true,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
    sentCount: 0,
    source: "National Vector Borne Disease Control Programme",
    createdBy: "system",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print("Database initialized successfully with sample data");