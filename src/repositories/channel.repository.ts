
import { Types } from 'mongoose';
import { IChannelRepository } from '../interfaces/repository/IChannel.repository.interface';
import { IChannel } from '../entity/Channel.entity';
import { ChannelModel } from '../framework/models/channel.model';

export class ChannelRepository implements IChannelRepository {
  async createChannel(data: IChannel): Promise<IChannel> {
    const channel = new ChannelModel(data);
    return await channel.save();
  }

  async getChannelById(id: Types.ObjectId): Promise<IChannel | null> {
    return await ChannelModel.findById(id).populate('communityId');
  }

  async getAccessibleChannels(communityId: Types.ObjectId, userRoleIds: Types.ObjectId[]): Promise<IChannel[]> {
    return await ChannelModel.find({
      communityId: new Types.ObjectId(communityId),
      allowedRoles: { $in: userRoleIds }
    })
    .populate('communityId')
    .populate('createdBy')
    .populate('allowedRoles');
  }

  /**
 * Search accessible channels by name (case-insensitive).
 */
async searchAccessibleChannels(communityId: Types.ObjectId, userRoleIds: Types.ObjectId[], searchTerm: string): Promise<IChannel[]> {
  return await ChannelModel.find({
    communityId: new Types.ObjectId(communityId),
    allowedRoles: { $in: userRoleIds },
    name: { $regex: searchTerm, $options: 'i' }
  })
    .populate('communityId')
    .populate('createdBy')
    .populate('allowedRoles');
}

  async updateChannel(id: Types.ObjectId, data: Partial<IChannel>): Promise<IChannel | null> {
    return await ChannelModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteChannel(id: Types.ObjectId): Promise<boolean> {
    const result = await ChannelModel.findByIdAndDelete(id);
    return result ? true : false;
  }
}
