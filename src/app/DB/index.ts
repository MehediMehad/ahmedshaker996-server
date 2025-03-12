import { UserRoleEnum } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import config from '../config';
import prisma from '../config/prisma';


const superAdminData = {
  name: 'Super',
  email: 'admin@gmail.com',
  password: '12345678',
  role: UserRoleEnum.SUPER_ADMIN,
  phone: '1234567890',
  
};

const seedSuperAdmin = async () => {
  try {
    // Check if a super admin already exists
    const isSuperAdminExists = await prisma.superAdmin.findFirst({
      where: {
        role: UserRoleEnum.SUPER_ADMIN,
      },
    });

    // If not, create one
    if (!isSuperAdminExists) {
      superAdminData.password = await bcrypt.hash(
        config.super_admin_password as string,
        Number(config.bcrypt_salt_rounds) || 12
      );
      await prisma.superAdmin.create({
        data: superAdminData,
      });
      console.log('Super Admin created successfully.');
    } else {
      return;
      //   console.log("Super Admin already exists.");
    }
  } catch (error) {
    console.error('Error seeding Super Admin:', error);
  }
};

export default seedSuperAdmin;
