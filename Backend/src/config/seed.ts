import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { AppDataSource } from './data-source';
import { Lead } from '../entity/Lead';
import { User } from '../entity/User';
import { Notification } from '../entity/Notification';
import * as bcrypt from 'bcrypt';
dotenv.config();

const seedDatabase = async () => {
  await AppDataSource.initialize();
  console.log('✅ Database connected for seeding...');

  // ─── USERS ───────────────────────────────────────────
  const userRepo = AppDataSource.getRepository(User);
  const existingUsers = await userRepo.count();

  if (existingUsers === 0) {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await userRepo.save([
      { name: 'Rahul Sharma', email: 'rahul@urbancruise.com', password: hashedPassword, role: 'admin' },
      { name: 'Neha Patel', email: 'neha@urbancruise.com', password: hashedPassword, role: 'admin' },
      { name: 'Arjun Mehta', email: 'arjun@urbancruise.com', password: hashedPassword, role: 'admin' },
      { name: 'Sneha Rao', email: 'sneha@urbancruise.com', password: hashedPassword, role: 'admin' },
    ]);
    console.log('✅ Users seeded');
  } else {
    console.log('⏭️  Users already exist, skipping...');
  }

  // ─── LEADS ───────────────────────────────────────────
  const leadRepo = AppDataSource.getRepository(Lead);
  const existingLeads = await leadRepo.count();

  if (existingLeads === 0) {
    await leadRepo.save([
      // Meta Leads
      { name: 'Amit Kumar', phone: '+91 98765 43210', email: 'amit.kumar@gmail.com', inquiry: 'Interior Design', source: 'Meta', campaign: 'Summer Campaign', status: 'New', assignedTo: 'Rahul Sharma', remarks: '' },
      { name: 'Sanjay Mehta', phone: '+91 65432 10987', email: 'sanjay.mehta@hotmail.com', inquiry: 'Office Interior', source: 'Meta', campaign: 'B2B Campaign', status: 'Converted', assignedTo: 'Neha Patel', remarks: 'Signed contract for office interior.' },
      { name: 'Pooja Iyer', phone: '+91 91234 56789', email: 'pooja.iyer@gmail.com', inquiry: 'Luxury Interior', source: 'Meta', campaign: 'Summer Campaign', status: 'Contacted', assignedTo: 'Arjun Mehta', remarks: 'Interested in premium package.' },
      { name: 'Vikram Nair', phone: '+91 88765 43210', email: 'vikram.nair@gmail.com', inquiry: 'Home Design', source: 'Meta', campaign: 'B2B Campaign', status: 'Follow-up', assignedTo: 'Rahul Sharma', remarks: 'Call back on Friday.' },

      // Google Leads
      { name: 'Priya Singh', phone: '+91 87654 32109', email: 'priya.singh@yahoo.com', inquiry: 'Home Renovation', source: 'Google', campaign: 'Home Renovation KW', status: 'Contacted', assignedTo: 'Neha Patel', remarks: 'Spoke for 10 mins.' },
      { name: 'Kavita Sharma', phone: '+91 54321 09876', email: 'kavita.s@gmail.com', inquiry: 'Kitchen Renovation', source: 'Google', campaign: 'Kitchen Remodel KW', status: 'Rejected', assignedTo: 'Rahul Sharma', remarks: 'Budget too low.' },
      { name: 'Rajan Verma', phone: '+91 77654 32109', email: 'rajan.v@gmail.com', inquiry: 'Bathroom Renovation', source: 'Google', campaign: 'Home Renovation KW', status: 'New', assignedTo: '', remarks: '' },
      { name: 'Meena Joshi', phone: '+91 99876 54321', email: 'meena.j@gmail.com', inquiry: 'Full Home Renovation', source: 'Google', campaign: 'Kitchen Remodel KW', status: 'Follow-up', assignedTo: 'Sneha Rao', remarks: 'Very interested, high budget.' },

      // Website Leads
      { name: 'Rohit Verma', phone: '+91 76543 21098', email: 'rohit.verma@gmail.com', inquiry: 'Cruise Package', source: 'Website', campaign: 'Organic', status: 'Follow-up', assignedTo: 'Rahul Sharma', remarks: 'Wants 7-night cruise deal.' },
      { name: 'Deepak Nair', phone: '+91 43210 98765', email: 'deepak.nair@gmail.com', inquiry: 'Luxury Cruise', source: 'Website', campaign: 'Organic', status: 'New', assignedTo: '', remarks: '' },
      { name: 'Anita Desai', phone: '+91 82345 67890', email: 'anita.desai@gmail.com', inquiry: 'Family Cruise', source: 'Website', campaign: 'Organic', status: 'Contacted', assignedTo: 'Arjun Mehta', remarks: 'Family of 4, budget friendly.' },
      { name: 'Suresh Pillai', phone: '+91 73456 78901', email: 'suresh.p@gmail.com', inquiry: 'Honeymoon Cruise', source: 'Website', campaign: 'Organic', status: 'Converted', assignedTo: 'Neha Patel', remarks: 'Booked 5 night package.' },
    ]);
    console.log('✅ Leads seeded');
  } else {
    console.log('⏭️  Leads already exist, skipping...');
  }

  // ─── NOTIFICATIONS ───────────────────────────────────
  const notifRepo = AppDataSource.getRepository(Notification);
  const existingNotifs = await notifRepo.count();

  if (existingNotifs === 0) {
    await notifRepo.save([
      { type: 'new_lead', title: 'New lead — Meta Ads', body: 'Amit Kumar submitted a form via Facebook Summer Campaign', source: 'Meta', read: false },
      { type: 'new_lead', title: 'New lead — Google Ads', body: 'Priya Singh via Google Ads — Home Renovation keyword', source: 'Google', read: false },
      { type: 'followup', title: 'Follow-up reminder', body: 'Rohit Verma follow-up due — Cruise Package inquiry', source: null, read: false },
      { type: 'summary', title: 'Daily summary', body: '18 new leads yesterday — 3 converted, 2 rejected', source: null, read: true },
      { type: 'converted', title: 'Lead converted', body: 'Sanjay Mehta marked as Converted by Neha Patel', source: null, read: true },
    ]);
    console.log('✅ Notifications seeded');
  } else {
    console.log('⏭️  Notifications already exist, skipping...');
  }

  console.log('🎉 All data seeded successfully!');
  process.exit(0);
};

seedDatabase().catch((error) => {
  console.log('❌ Seeding failed:', error);
  process.exit(1);
});