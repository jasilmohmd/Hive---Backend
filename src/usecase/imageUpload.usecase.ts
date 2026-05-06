import S3Service from "../framework/utils/S3Service";
import IImageUsecase from "../interfaces/usecase/IImage.usecase.interface";

export default class ImageUsecase implements IImageUsecase {
  async upload(fileBuffer: Buffer, fileName: string, isPublic: boolean): Promise<string> {
    return await S3Service.uploadFile(fileBuffer, fileName, isPublic);
  }
}