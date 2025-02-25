// Adjust the path to your Mongoose model
import { ErrorCode } from "../constants/auth/errorCode";
import { ErrorField } from "../constants/auth/errorField";
import StatusCodes from "../constants/auth/statusCodes";
import IUser from "../entity/User.entity";
import ValidationError from "../errors/validationError.error";
import Users from "../framework/models/user.model";
import IFriendRepository from "../interfaces/repository/IFriends.repository.interface";

export default class FriendRepository implements IFriendRepository {

  async searchUserByUsername(username: string): Promise<IUser[]> {
    return await Users.find({
      userName: { $regex: username, $options: "i" } // 'i' for case-insensitive search
    });
  }

  async checkFriendshipStatus(senderId: string, receiverId: string): Promise<string> {
    const receiver = await Users.findOne(
      { _id: receiverId },
      { friends: 1, friendRequests: 1 }
    );

    if (!receiver) {
      throw new ValidationError({
        statusCode: StatusCodes.NotFound,
        errorField: ErrorField.USER,
        message: "Receiver not found.",
        errorCode: ErrorCode.USER_NOT_FOUND
      });
    }

    if (receiver.friends.includes(senderId)) {
      return "already_friends";
    }

    const requestExists = receiver.friendRequests.some(req => req.sender.toString() === senderId);

    if (requestExists) {
      return "request_pending";
    }

    return "not_friends";
  }



  /**
 * Adds a friend request only if the sender is not already a friend or hasn't sent a request.
 */
  async addFriendRequest(senderId: string, receiverId: string): Promise<string> {
    // Fetch receiver's document to check existing friends & requests
    const receiver = await Users.findOne(
      { _id: receiverId },
      { friends: 1, friendRequests: 1 }
    );

    if (!receiver) {
      return "Receiver not found.";
    }

    // Check if already friends
    if (receiver.friends.includes(senderId)) {
      return "You are already friends.";
    }

    // Check if a friend request has already been sent
    const requestExists = receiver.friendRequests.some(
      (req) => req.sender.toString() === senderId
    );

    if (requestExists) {
      return "Friend request already sent.";
    }

    // If all checks pass, add the friend request
    await Users.updateOne(
      { _id: receiverId },
      { $push: { friendRequests: { sender: senderId, status: "pending" } } }
    );

    return "Friend request sent successfully.";
  }

  /**
 * Accepts a friend request by updating the friendRequests status, 
 * adding each user to the other's friends list, and removing the request.
 */
  async acceptFriendRequest(userId: string, senderId: string): Promise<void> {
    // Accept the friend request: update status and add sender to user's friends list
    await Users.updateOne(
      { _id: userId, "friendRequests.sender": senderId },
      {
        $push: { friends: senderId },
        $pull: { friendRequests: { sender: senderId } } // Remove the request after acceptance
      }
    );

    // Add the user to the sender's friends list
    await Users.updateOne(
      { _id: senderId },
      { $push: { friends: userId } }
    );
  }


  /**
   * Rejects a friend request by removing it from the friendRequests array.
   */
  async rejectFriendRequest(userId: string, senderId: string): Promise<void> {
    await Users.updateOne(
      { _id: userId },
      { $pull: { friendRequests: { sender: senderId } } }
    );
  }

  /**
   * Removes a friend from both users' friends list.
   */
  async removeFriend(userId: string, friendId: string): Promise<void> {
    await Users.updateOne(
      { _id: userId },
      { $pull: { friends: friendId } }
    );
    await Users.updateOne(
      { _id: friendId },
      { $pull: { friends: userId } }
    );
  }

  /**
  * Retrieves the pending friend requests for the given user.
  * The result includes populated sender details.
  */
  async getPendingFriendRequests(userId: string): Promise<any[]> {
    // Find the user and populate the sender details from friendRequests.
    const user = await Users.findById(userId)
      .populate('friendRequests.sender', 'userName email status'); // adjust fields as needed
    if (!user) {
      throw new Error("User not found");
    }
    // Filter requests with status "pending"
    return user.friendRequests.filter((req: any) => req.status === "pending");
  }


  /**
  * Retrieves only online friends of a user.
  * @param userId - The ID of the user whose online friends we want to fetch.
  */
  async getOnlineFriends(userId: string): Promise<IUser[]> {
    // Find the user's friends (assuming `friends` is an array of user IDs)
    const user = await Users.findById(userId).select("friends");

    if (!user) throw new Error("User not found");

    // Retrieve only the friends who are online
    return await Users.find({ _id: { $in: user.friends }, status: "online" });
  }


  /**
   * Retrieves all friends for the given user.
   */
  async getAllFriends(userId: string): Promise<IUser[]> {
    // Find the user and get the friends array.
    const user = await Users.findById(userId).select('friends');
    if (!user) {
      throw new Error("User not found");
    }
    // Return all users whose _id is in the friends array.
    return await Users.find({ _id: { $in: user.friends } });
  }

  /**
  * Blocks a user by adding the blocked user's ID to the user's blocked array.
  * This method first checks if the user is already blocked.
  */
  async blockUser(userId: string, blockedUserId: string): Promise<void> {
    // Fetch the user document
    const user = await Users.findById(userId).select("blocked");
    if (user && user.blocked.includes(blockedUserId)) {
      // Optional: throw an error if already blocked, or simply return
      return;
    }
    await Users.updateOne(
      { _id: userId },
      { $push: { blocked: blockedUserId } }
    );
  }

  /**
   * Unblocks a user by removing the blocked user's ID from the user's blocked array.
   */
  async unblockUser(userId: string, blockedUserId: string): Promise<void> {
    await Users.updateOne(
      { _id: userId },
      { $pull: { blocked: blockedUserId } }
    );
  }

  /**
 * Retrieves all blocked users for the given user.
 * It finds the user by userId, selects the 'blocked' field, and fetches the full user details.
 */
async getAllBlockedUsers(userId: string): Promise<IUser[]> {
  // Find the user and retrieve only the blocked user IDs
  const user = await Users.findById(userId).select("blocked");

  if (!user) {
    throw new ValidationError({
      statusCode: StatusCodes.NotFound,
      errorField: ErrorField.USER,
      message: "User not found.",
      errorCode: ErrorCode.USER_NOT_FOUND
    });
  }

  // Retrieve the full details of blocked users
  return await Users.find({ _id: { $in: user.blocked } });
}

}


