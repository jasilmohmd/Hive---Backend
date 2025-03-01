import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import ICommunityUsecase from "../interfaces/usecase/ICommunity.usecase.interface";
import StatusCodes from "../constants/auth/statusCodes";
import IAuthRequest from "../interfaces/common/IAuthRequest.interface";


class CommunityController {
  private communityUsecase: ICommunityUsecase;

  constructor(communityUsecase: ICommunityUsecase) {
    this.communityUsecase = communityUsecase;
  }

  // POST /communities
  public async createCommunity(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {

      const userId = req.userId!;

      if (!userId) {
        res.status(StatusCodes.Unauthorized).json({ error: "Unauthorized" })
        return;
      }

      const { name, description, type, tags } = req.body;
      const community = await this.communityUsecase.createCommunity({
        name,
        description,
        type,
        ownerId: userId,
        tags,
      });
      res.status(StatusCodes.Created).json(community);
    } catch (error) {
      next(error);
    }
  }

  // GET /communities/:id
  public async getCommunityById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = new Types.ObjectId(req.params.id);
      const community = await this.communityUsecase.getCommunityById(new Types.ObjectId(id));
      res.status(StatusCodes.Success).json(community);
    } catch (error) {
      next(error);
    }
  }

  // GET /communities/search?searchTerm=...
  public async searchCommunities(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { searchTerm } = req.query;
      if (typeof searchTerm !== "string") {
        res.status(StatusCodes.BadRequest).json({ error: "Invalid search term" });
        return;
      }
      const communities = await this.communityUsecase.searchCommunitiesByName(searchTerm);
      res.status(StatusCodes.Success).json(communities);
    } catch (error) {
      next(error);
    }
  }

  // PUT /communities/:id
  public async updateCommunity(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {

      const { data } = req.body
      const userId = req.userId!;
      const communityId = new Types.ObjectId(req.params.communityId)

      if (!userId) {
        res.status(StatusCodes.Unauthorized).json({ error: "Unauthorized" })
        return;
      }
      if (!communityId) {
        res.status(StatusCodes.BadRequest).json({ error: "Community ID is required" })
        return;
      }

      const updatedCommunity = await this.communityUsecase.updateCommunity(
        communityId,
        userId,
        data
      );

      res.status(StatusCodes.Success).json(updatedCommunity);

    } catch (error) {
      next(error);
    }
  }

  // DELETE /communities/:id
  public async deleteCommunity(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId!;
      const communityId = new Types.ObjectId(req.params.communityId)

      if (!userId) {
        res.status(StatusCodes.Unauthorized).json({ error: "Unauthorized" })
        return;
      }
      if (!communityId) {
        res.status(StatusCodes.BadRequest).json({ error: "Community ID is required" })
        return;
      }

      const result = await this.communityUsecase.deleteCommunity(communityId, userId);
      res.status(StatusCodes.Success).json({ success: result });
    } catch (error) {
      next(error);
    }
  }

  // GET /communities
  public async listCommunities(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const communities = await this.communityUsecase.listCommunities();
      res.status(StatusCodes.Success).json(communities);
    } catch (error) {
      next(error);
    }
  }

  // GET /users/:userId/communities OR use req.user
  public async getCommunitiesByUser(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {

      const userId = req.userId!;

      if (!userId) {
        res.status(StatusCodes.Unauthorized).json({ error: "Unauthorized" })
        return;
      }

      const communities = await this.communityUsecase.getCommunitiesByUser(userId);
      res.status(StatusCodes.Success).json(communities);
    } catch (error) {
      next(error);
    }
  }

  // POST /communities/:communityId/request
  public async requestToJoinCommunity(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId!;
      const communityId = new Types.ObjectId(req.params.communityId)

      if (!userId) {
        res.status(StatusCodes.Unauthorized).json({ error: "Unauthorized" })
        return;
      }
      if (!communityId) {
        res.status(StatusCodes.BadRequest).json({ error: "Community ID is required" })
        return;
      }


      const result = await this.communityUsecase.requestToJoinCommunity(
        communityId,
        userId
      );

      res.status(StatusCodes.Success).json({ success: result });
    } catch (error) {
      next(error);
    }
  }

  // POST /communities/join/approve
  public async approveJoinRequest(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {

      const memberId = new Types.ObjectId(String(req.body.memberId));
      const roleId = new Types.ObjectId(String(req.body.roleId));
      const userId = req.userId!;
      const communityId = new Types.ObjectId(req.params.communityId)

      if (!userId) {
        res.status(StatusCodes.Unauthorized).json({ error: "Unauthorized" })
        return;
      }
      if (!communityId) {
        res.status(StatusCodes.BadRequest).json({ error: "Community ID is required" })
        return;
      }

      if (!memberId) {
        res.status(StatusCodes.BadRequest).json({ error: "Member ID is required" })
        return;
      }
      if (!roleId) {
        res.status(StatusCodes.BadRequest).json({ error: "Role ID is required" })
        return;
      }

      const result = await this.communityUsecase.approveJoinRequest(
        communityId, userId, memberId, roleId
      );
      res.status(StatusCodes.Success).json({ success: result });
    } catch (error) {
      next(error);
    }
  }

  // POST /communities/join/reject
  public async rejectJoinRequest(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const memberId = new Types.ObjectId(String(req.body.memberId));
      const userId = req.userId!;
      const communityId = new Types.ObjectId(req.params.communityId)

      if (!userId) {
        res.status(StatusCodes.Unauthorized).json({ error: "Unauthorized" })
        return;
      }
      if (!communityId) {
        res.status(StatusCodes.BadRequest).json({ error: "Community ID is required" })
        return;
      }

      const result = await this.communityUsecase.rejectJoinRequest(
        communityId, userId, memberId
      );
      res.status(StatusCodes.Success).json({ success: result });
    } catch (error) {
      next(error);
    }
  }

  // POST /communities/:communityId/leave
  public async leaveCommunity(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId!;
      const communityId = new Types.ObjectId(req.params.communityId)

      if (!userId) {
        res.status(StatusCodes.Unauthorized).json({ error: "Unauthorized" })
        return;
      }
      if (!communityId) {
        res.status(StatusCodes.BadRequest).json({ error: "Community ID is required" })
        return;
      }

      const result = await this.communityUsecase.leaveCommunity(
        communityId, userId
      );
      res.status(StatusCodes.Success).json({ success: result });
    } catch (error) {
      next(error);
    }
  }

  // POST /communities/member/add
  public async addMember(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const memberId = new Types.ObjectId(String(req.body.memberId));
      const roleId = new Types.ObjectId(String(req.body.roleId));
      const userId = req.userId!;
      const communityId = new Types.ObjectId(req.params.communityId)

      if (!userId) {
        res.status(StatusCodes.Unauthorized).json({ error: "Unauthorized" })
        return;
      }
      if (!communityId) {
        res.status(StatusCodes.BadRequest).json({ error: "Community ID is required" })
        return;
      }

      const result = await this.communityUsecase.addMember(
        communityId, userId, memberId, roleId
      );
      res.status(StatusCodes.Success).json({ success: result });
    } catch (error) {
      next(error);
    }
  }

  // POST /communities/member/remove
  public async removeMember(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const memberId = new Types.ObjectId(String(req.body.memberId));
      const userId = req.userId!;
      const communityId = new Types.ObjectId(req.params.communityId)

      if (!userId) {
        res.status(StatusCodes.Unauthorized).json({ error: "Unauthorized" })
        return;
      }
      if (!communityId) {
        res.status(StatusCodes.BadRequest).json({ error: "Community ID is required" })
        return;
      }

      const result = await this.communityUsecase.removeMember(
        communityId, userId, memberId
      );
      res.status(StatusCodes.Success).json({ success: result });
    } catch (error) {
      next(error);
    }
  }

  // POST /communities/:communityId/tag/:tagId
  public async addTag(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId!;
      const communityId = new Types.ObjectId(req.params.communityId)

      if (!communityId) {
        res.status(StatusCodes.BadRequest).json({ error: "Community ID is required" })
        return;
      }

      const tagId = new Types.ObjectId(req.params.tagId);

      const result = await this.communityUsecase.addTag(
        userId,
        communityId,
        tagId
      );
      res.status(StatusCodes.Success).json({ success: result });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /communities/:communityId/tag/:tagId
  public async removeTag(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {

      const userId = req.userId!;
      const communityId = new Types.ObjectId(req.params.communityId)

      if (!communityId) {
        res.status(StatusCodes.BadRequest).json({ error: "Community ID is required" })
        return;
      }

      const tagId = new Types.ObjectId(req.params.tagId);

      const result = await this.communityUsecase.removeTag(
        userId,
        communityId,
        tagId
      );
      res.status(StatusCodes.Success).json({ success: result });
    } catch (error) {
      next(error);
    }
  }

  // GET /communities/tag/:tagId
  public async filterCommunitiesByTag(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tagId = new Types.ObjectId(req.params.tagId);
      const communities = await this.communityUsecase.filterCommunitiesByTag(tagId);
      res.status(StatusCodes.Success).json(communities);
    } catch (error) {
      next(error);
    }
  }

  // GET /communities/category/:categoryId
  public async filterCommunitiesByCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categoryId = new Types.ObjectId(req.params.categoryId);
      const communities = await this.communityUsecase.filterCommunitiesByCategory(categoryId);
      res.status(StatusCodes.Success).json(communities);
    } catch (error) {
      next(error);
    }
  }
}

export default CommunityController;
