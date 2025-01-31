import mongoose, { Schema } from "mongoose";
import IUser from "../../entity/IUser.entity";


const userSchema: Schema = new Schema<IUser>({
  userName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

const Users = mongoose.model<IUser>('Users', userSchema);

export default Users;