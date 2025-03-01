import { Types } from 'mongoose';
import { IChannelRepository } from '../interfaces/repository/IChannel.repository.interface';
import { IChannel } from '../entity/Channel.entity';
import { UnauthorizedError, NotFoundError, ValidationError, CustomError } from '../errors/customError.error';
import { RBACService } from '../framework/utils/RBACService';
import { channelValidator } from '../framework/utils/validators/channel.validator';
import { IRoleRepository } from '../interfaces/repository/IRole.repository.interface';

export class ChannelUseCase {
  constructor(
    private channelRepository: IChannelRepository,
    private roleRepository: IRoleRepository,
    private rbacService: RBACService
  ) { }

  /**
   * Create a new channel.
   * Optionally, you could require RBAC checks here as well.
   */
  async createChannel(data: IChannel, userId: Types.ObjectId, communityId: Types.ObjectId): Promise<IChannel> {
    try {

      if (!Types.ObjectId.isValid(communityId)) {
        throw new ValidationError("Invalid Community ID", "community");
      }

      if (!Types.ObjectId.isValid(userId)) {
        throw new ValidationError("Invalid Admin ID", "admin");
      }

      // Check if the user has permission to create a channel.
      const allowed = await this.rbacService.hasPermission(userId, communityId, "MANAGE_CHANNELS");
      if (!allowed) throw new UnauthorizedError("Permission denied", "channel");

      // ✅ Validate input data using Zod
      const validatedData = channelValidator.parse(data);

      const createdChannel = await this.channelRepository.createChannel(validatedData);
      if (!createdChannel) {
        throw new CustomError({ statusCode: 500, message: "Failed to create channel", errorField: "channel" });
      }
      return createdChannel;
    } catch (error: any) {
      throw new Error(`Error creating channel: ${error.message}`);
    }
  }

  /**
   * Get a channel by its ID.
   */
  async getChannelById(id: Types.ObjectId): Promise<IChannel> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new ValidationError("Invalid channel ID", "channel");
      }
      const channel = await this.channelRepository.getChannelById(id);
      if (!channel) {
        throw new NotFoundError("Channel not found", "channel");
      }
      return channel;
    } catch (error: any) {
      throw new Error(`Error fetching channel: ${error.message}`);
    }
  }

  /**
   * Get accessible channels for a given community based on the user's role IDs.
   */
  async getAccessibleChannels(communityId: Types.ObjectId, userId: Types.ObjectId): Promise<IChannel[]> {
    try {

      if (!Types.ObjectId.isValid(communityId)) {
        throw new ValidationError("Invalid Community ID", "community");
      }

      if (!Types.ObjectId.isValid(userId)) {
        throw new ValidationError("Invalid Admin ID", "admin");
      }

      const userRoles = await this.roleRepository.getUserRoles(userId, communityId);
      if (!userRoles || userRoles.length === 0) {
        throw new NotFoundError("User has no roles in this community", "role");
      }

      const userRoleIds = userRoles
        .map(role => role._id)
        .filter((id): id is Types.ObjectId => Boolean(id));


      const channels = await this.channelRepository.getAccessibleChannels(communityId, userRoleIds);
      if (!channels || channels.length === 0) {
        throw new NotFoundError("No accessible channels found", "channel");
      }
      return channels;
    } catch (error: any) {
      throw new Error(`Error fetching accessible channels: ${error.message}`);
    }
  }


  /**
   * Search accessible channels by name (case-insensitive) for a specific community and user.
   */
  async searchAccessibleChannels(communityId: Types.ObjectId, userId: Types.ObjectId, searchTerm: string): Promise<IChannel[]> {
    try {

      if (!Types.ObjectId.isValid(communityId)) {
        throw new ValidationError("Invalid Community ID", "community");
      }

      if (!Types.ObjectId.isValid(userId)) {
        throw new ValidationError("Invalid Admin ID", "admin");
      }

      const userRoles = await this.roleRepository.getUserRoles(userId, communityId);
      if (!userRoles || userRoles.length === 0) {
        throw new NotFoundError("User has no roles in this community", "role");
      }

      const userRoleIds = userRoles
        .map(role => role._id)
        .filter((id): id is Types.ObjectId => Boolean(id));

      const channels = await this.channelRepository.searchAccessibleChannels(communityId, userRoleIds, searchTerm);
      if (!channels || channels.length === 0) {
        throw new NotFoundError("No channels found", "channel");
      }
      return channels;
    } catch (error: any) {
      throw new Error(`Error searching channels: ${error.message}`);
    }
  }


  /**
   * Update a channel.
   * Only allowed for users with the "MANAGE_CHANNELS" permission.
   */
  async updateChannel(userId: Types.ObjectId, communityId: Types.ObjectId, channelId: Types.ObjectId, data: Partial<IChannel>): Promise<IChannel> {
    try {

      if (!Types.ObjectId.isValid(communityId)) {
        throw new ValidationError("Invalid Community ID", "community");
      }

      if (!Types.ObjectId.isValid(userId)) {
        throw new ValidationError("Invalid Admin ID", "admin");
      }

      if (!Types.ObjectId.isValid(channelId)) {
        throw new ValidationError("Invalid channel ID", "channel");
      }
      const allowed = await this.rbacService.hasPermission(userId, communityId, "MANAGE_CHANNELS");
      if (!allowed) throw new UnauthorizedError("Permission denied", "channel");

      // ✅ Validate input data using Zod
      const validatedData = channelValidator.parse(data);

      const updatedChannel = await this.channelRepository.updateChannel(channelId, validatedData);
      if (!updatedChannel) {
        throw new NotFoundError("Channel not found or update failed", "channel");
      }
      return updatedChannel;
    } catch (error: any) {
      throw new Error(`Error updating channel: ${error.message}`);
    }
  }

  /**
   * Delete a channel.
   * Only allowed for users with the "MANAGE_CHANNELS" permission.
   */
  async deleteChannel(userId: Types.ObjectId, communityId: Types.ObjectId, channelId: Types.ObjectId): Promise<boolean> {
    try {

      if (!Types.ObjectId.isValid(communityId)) {
        throw new ValidationError("Invalid Community ID", "community");
      }

      if (!Types.ObjectId.isValid(userId)) {
        throw new ValidationError("Invalid Admin ID", "admin");
      }

      if (!Types.ObjectId.isValid(channelId)) {
        throw new ValidationError("Invalid channel ID", "channel");
      }
      const allowed = await this.rbacService.hasPermission(userId, communityId, "MANAGE_CHANNELS");
      if (!allowed) throw new UnauthorizedError("Permission denied", "channel");

      const result = await this.channelRepository.deleteChannel(channelId);
      if (!result) {
        throw new NotFoundError("Channel not found or deletion failed", "channel");
      }
      return result;
    } catch (error: any) {
      throw new Error(`Error deleting channel: ${error.message}`);
    }
  }


}
