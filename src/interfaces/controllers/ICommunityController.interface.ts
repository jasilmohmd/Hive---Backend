import { NextFunction, Request, Response } from "express";
import ICommunityRequest from "../common/ICommunityRequest.interface";

export default interface ICommunityController {
  createCommunity(req: ICommunityRequest, res: Response, next: NextFunction): Promise<void>;
  getCommunityById(req: Request, res: Response, next: NextFunction): Promise<void>;
  searchCommunities(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateCommunity(req: ICommunityRequest, res: Response, next: NextFunction): Promise<void>;
  deleteCommunity(req: ICommunityRequest, res: Response, next: NextFunction): Promise<void>;
  listCommunities(req: Request, res: Response, next: NextFunction): Promise<void>;
  getCommunitiesByUser(req: ICommunityRequest, res: Response, next: NextFunction): Promise<void>;
  requestToJoinCommunity(req: ICommunityRequest, res: Response, next: NextFunction): Promise<void>;
  approveJoinRequest(req: ICommunityRequest, res: Response, next: NextFunction): Promise<void>;
  rejectJoinRequest(req: ICommunityRequest, res: Response, next: NextFunction): Promise<void>;
  leaveCommunity(req: ICommunityRequest, res: Response, next: NextFunction): Promise<void>;
  addMember(req: ICommunityRequest, res: Response, next: NextFunction): Promise<void>;
  removeMember(req: ICommunityRequest, res: Response, next: NextFunction): Promise<void>;
  addTag(req: ICommunityRequest, res: Response, next: NextFunction): Promise<void>;
  removeTag(req: ICommunityRequest, res: Response, next: NextFunction): Promise<void>;
  filterCommunitiesByTag(req: Request, res: Response, next: NextFunction): Promise<void>;
  filterCommunitiesByCategory(req: Request, res: Response, next: NextFunction): Promise<void>;
}