import IUser from "../../entity/IUser.entity";

export default interface IFriendUsecase {
  searchUserByUsername(username: string): Promise<IUser[]>;
  sendFriendRequest(senderId: string, receiverId: string): Promise<void>;
  acceptFriendRequest(userId: string, senderId: string): Promise<void>;
  rejectFriendRequest(userId: string, senderId: string): Promise<void>;
  removeFriend(userId: string, friendId: string): Promise<void>;
  getPendingFriendRequests(userId: string): Promise<any[]>;
  getOnlineFriends(userId: string): Promise<IUser[]>;
  getAllFriends(userId: string): Promise<IUser[]>;
  blockUser(userId: string, blockedUserId: string): Promise<void>;
  unblockUser(userId: string, blockedUserId: string): Promise<void>;
  getAllBlockedUsers(userId: string): Promise<any[]>;
}