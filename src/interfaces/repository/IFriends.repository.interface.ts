import IUser from "../../entity/User.entity";

export default interface IFriendRepository {
  searchUserByUsername(username: string): Promise<IUser[]>;
  checkFriendshipStatus(senderId: string, receiverId: string): Promise<string>;
  addFriendRequest(senderId: string, receiverId: string): Promise<string>;
  acceptFriendRequest(userId: string, senderId: string): Promise<void>;
  rejectFriendRequest(userId: string, senderId: string): Promise<void>;
  removeFriend(userId: string, friendId: string): Promise<void>;
  getPendingFriendRequests(userId: string): Promise<any[]>;
  getOnlineFriends(userId: string): Promise<IUser[]>;
  getAllFriends(userId: string): Promise<IUser[]>;
  blockUser(userId: string, blockedUserId: string): Promise<void>;
  unblockUser(userId: string, blockedUserId: string): Promise<void>;
  getAllBlockedUsers(userId: string): Promise<IUser[]>;
}
