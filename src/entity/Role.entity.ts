import { Types } from "mongoose";

export interface IRole {
  _id?: Types.ObjectId; // Automatically assigned by MongoDB
  communityId: Types.ObjectId; // Associates the role with a specific community
  name: string;
  permissions: string[]; // e.g., ['MANAGE_CHANNELS', 'MANAGE_ROLES']
  isDefault?: boolean; // True if the role is one of the predefined roles (Owner, Admin, etc.)
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserRole {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  communityId: Types.ObjectId;
  roleIds: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

