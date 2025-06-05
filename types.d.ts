// export interface UserFields {
//   username: string;
//   password: string;
//   token: string;
//
// }

import { Document } from 'mongoose';

export interface PassportData {
  series: string;
  number: string;
  issuedBy: string;
  issueDate: Date;
}

export interface WorkInfo {
  companyName: string;
  workPhone?: string;
  address: string;
}

export interface UserFields extends Document {
  username: string;
  password: string;
  token: string;
  lastName: string;
  firstName: string;
  middleName?: string;
  birthDate: Date;
  phone: string;
  passport: PassportData;
  workInfo: WorkInfo;
  authKey: string;

  checkPassword(password: string): Promise<boolean>;
  generateToken(): void;
}
