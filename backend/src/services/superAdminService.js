import User from '../models/User.js';
import config from '../config/config.js';

export const ensureSuperAdmin = async () => {
  const { email, password } = config.superAdmin;

  if (!email || !password) {
    console.warn('Super admin credentials are not configured.');
    return;
  }

  const normalizedEmail = email.toLowerCase();
  const existingAdmin = await User.findOne({ email: normalizedEmail });

  if (existingAdmin) {
    if (existingAdmin.role !== 'super_admin' || !existingAdmin.isActive) {
      existingAdmin.role = 'super_admin';
      existingAdmin.isActive = true;
      await existingAdmin.save();
    }
    return;
  }

  await User.create({
    name: 'KRISHIQ Super Admin',
    email: normalizedEmail,
    password,
    role: 'super_admin',
    isActive: true,
    isFirstLogin: true,
  });

  console.log(`Super admin created: ${normalizedEmail}`);
};
