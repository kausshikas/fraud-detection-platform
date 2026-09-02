import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { config } from "./config";
import User from "./models/User";
import Customer from "./models/Customer";
import Transaction from "./models/Transaction";
import Alert from "./models/Alert";
import { scoreTransaction } from "./fraud/scoring";

const names = ["Rahul Sharma","Priya Kumar","Arjun Patel","Sneha R","Vikram Singh","Ananya Rao","Rohan Mehta","Meera Iyer","Aditya Nair","Kavya Menon","Sanjay Verma","Neha Kapoor","Karan Shah","Divya Joshi","Aman Gupta","Ishita Roy","Nikhil Das","Pooja S","Varun Bhat","Aarav Jain","Riya Thomas","Manish Kumar","Aisha Khan","Dev Malhotra","Tanvi Rao","Harish Pillai","Nandini Bose","Yash Kulkarni","Simran Kaur","Akash Reddy"];
const countries = ["India","India","India","India","UAE","Singapore","USA"];
const methods = ["UPI","Card","Net Banking","Wallet"] as const;

async function seed() {
  await mongoose.connect(config.mongoUri);
  await Promise.all([User.deleteMany({}), Customer.deleteMany({}), Transaction.deleteMany({}), Alert.deleteMany({})]);

  const password = await bcrypt.hash("Admin@123", 10);
  await User.create({ name: "FraudGuard Admin", email: "admin@fraudguard.local", password, role: "admin" });

  const customers = [];
  for (let i = 0; i < names.length; i++) {
    customers.push({
      customerId: `CUS-${1001+i}`,
      name: names[i],
      email: names[i].toLowerCase().replace(/[^a-z]+/g, ".").replace(/\.+/g, ".").replace(/\.$/, "") + "@example.com",
      phone: `+91 9${Math.floor(100000000 + Math.random()*899999999)}`,
      country: countries[i % countries.length],
      accountAgeDays: Math.floor(20 + Math.random()*1500),
      transactionCount: 0, totalAmount: 0,
      riskLevel: i % 9 === 0 ? "High" : i % 4 === 0 ? "Medium" : "Low",
      status: i % 11 === 0 ? "Under Review" : "Active"
    });
  }
  await Customer.insertMany(customers);

  const docs: any[] = [];
  const alerts: any[] = [];
  for (let i = 0; i < 120; i++) {
    const c = customers[i % customers.length];
    const amount = [2500,4500,8500,12500,18000,32000,52000,85000,125000][i % 9] + Math.floor(Math.random()*2500);
    const country = countries[(i*3) % countries.length];
    const paymentMethod = methods[i % methods.length];
    const result = scoreTransaction({ amount, country, paymentMethod, accountAgeDays: c.accountAgeDays, rapidTransactions: i % 8 === 0 ? 5 : i % 4, previousCountry: i % 13 === 0 ? "India" : country });
    const timestamp = new Date(Date.now() - (119-i)*24*60*60*1000/4 - Math.random()*12*60*60*1000);
    const transactionId = `TXN-${1001+i}`;
    docs.push({
      transactionId, customerId: c.customerId, customerName: c.name, amount, country, paymentMethod,
      deviceId: `DEV-${1000+(i%40)}`, ipAddress: `10.0.${i%20}.${10+(i%220)}`,
      timestamp, ...result
    });
    c.transactionCount += 1; c.totalAmount += amount;
    if (result.level !== "Low") {
      alerts.push({
        alertId: `ALT-${1001+alerts.length}`, transactionId, customerId: c.customerId, customerName: c.name,
        amount, country, riskLevel: result.level, reason: result.reasons.join(", "),
        status: alerts.length % 5 === 0 ? "Resolved" : alerts.length % 3 === 0 ? "Investigating" : "Open",
        createdAt: timestamp
      });
    }
  }
  await Transaction.insertMany(docs);
  await Alert.insertMany(alerts);
  for (const c of customers) await Customer.updateOne({ customerId: c.customerId }, { transactionCount: c.transactionCount, totalAmount: c.totalAmount });

  console.log(`Seeded ${customers.length} customers, ${docs.length} transactions and ${alerts.length} alerts.`);
  await mongoose.disconnect();
}
seed().catch(err => { console.error(err); process.exit(1); });
