import { Router } from "express";
import CommunityController from "../../controller/community.controller";


import ICommunityUsecase from "../../interfaces/usecase/ICommunity.usecase.interface";

import IJWTService from "../../interfaces/utils/IJwt.service";
import JWTService from "../utils/jwt.service";
import IAuthMiddleware from "../../interfaces/middleware/IAuth.middleware.interface";
import AuthMiddleware from "../middlewares/auth.middleware";
import { ICommunityRepository } from "../../interfaces/repository/ICommunity.repository.interface";
import ICommunityController from "../../interfaces/controllers/ICommunityController.interface";
import { CommunityUseCase } from "../../usecase/community.usecase";
import { CommunityRepository } from "../../repositories/community.repository";
import { IRoleRepository } from "../../interfaces/repository/IRole.repository.interface";
import { RoleRepository } from "../../repositories/role.repository";
import IRBACService from "../../interfaces/utils/IRBAC.service";
import { RBACService } from "../utils/RBACService";

const communityRouter: Router = Router();



const communityRepository: ICommunityRepository = new CommunityRepository();
const roleRepository: IRoleRepository = new RoleRepository();

const jwtService: IJWTService = new JWTService();
const authMiddleware: IAuthMiddleware = new AuthMiddleware(jwtService);
const rbacService: IRBACService = new RBACService(roleRepository,communityRepository);

const communityUsecase: ICommunityUsecase = new CommunityUseCase(communityRepository,roleRepository,rbacService);
const communityController: ICommunityController = new CommunityController(communityUsecase);

// Apply authentication middleware to all routes
communityRouter.use(authMiddleware.isAuthenticated.bind(authMiddleware));

// Define routes in a specific order to avoid conflicts with parameterized routes
communityRouter.post("/", communityController.createCommunity.bind(communityController));
communityRouter.get("/search", communityController.searchCommunities.bind(communityController));
communityRouter.get("/user", communityController.getCommunitiesByUser.bind(communityController));
communityRouter.get("/tag/:tagId", communityController.filterCommunitiesByTag.bind(communityController));
communityRouter.get("/category/:categoryId", communityController.filterCommunitiesByCategory.bind(communityController));
communityRouter.get("/", communityController.listCommunities.bind(communityController));
communityRouter.get("/:id", communityController.getCommunityById.bind(communityController));
communityRouter.put("/:id", communityController.updateCommunity.bind(communityController));
communityRouter.delete("/:id", communityController.deleteCommunity.bind(communityController));

// Community join and membership routes
communityRouter.post("/:communityId/request", communityController.requestToJoinCommunity.bind(communityController));
communityRouter.post("/approve_request", communityController.approveJoinRequest.bind(communityController));
communityRouter.post("/reject_request", communityController.rejectJoinRequest.bind(communityController));
communityRouter.post("/:communityId/leave", communityController.leaveCommunity.bind(communityController));
communityRouter.post("/member/add", communityController.addMember.bind(communityController));
communityRouter.post("/member/remove", communityController.removeMember.bind(communityController));

// Community tag routes
communityRouter.post("/:communityId/tag/:tagId", communityController.addTag.bind(communityController));
communityRouter.delete("/:communityId/tag/:tagId", communityController.removeTag.bind(communityController));

export default communityRouter;
