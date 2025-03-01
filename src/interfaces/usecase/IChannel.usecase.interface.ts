import { Types } from "mongoose";
import { IChannel } from "../../entity/Channel.entity";

export default interface IChannelUsecase {
  createChannel(data: IChannel, userRoleIds: Types.ObjectId[]): Promise<IChannel>;
  getChannelById(id: Types.ObjectId): Promise<IChannel>;
  getAccessibleChannels(communityId: Types.ObjectId, userRoleIds: Types.ObjectId[]): Promise<IChannel[]>;
  searchAccessibleChannels(communityId: Types.ObjectId, userRoleIds: Types.ObjectId[], searchTerm: string): Promise<IChannel[]>;
  updateChannel(userRoleIds: Types.ObjectId[], channelId: Types.ObjectId, data: Partial<IChannel>): Promise<IChannel>;
  deleteChannel(userRoleIds: Types.ObjectId[], channelId: Types.ObjectId): Promise<boolean>;
}