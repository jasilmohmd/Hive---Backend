import mongoose, { Schema, Types } from "mongoose";
import IUser from "../../entity/IUser.entity";

const userSchema: Schema = new Schema<IUser>({
  userName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  friends: [{
    type: Types.ObjectId,
    ref: "Users"
  }],
  friendRequests: [{
    sender: { type: Types.ObjectId, ref: "Users" },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" }
  }],
  status: {
    type: String,
    required: true
  }
  
});

const Users = mongoose.model<IUser>('Users', userSchema);

export default Users;
