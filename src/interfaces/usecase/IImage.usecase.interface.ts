export default interface IImageUsecase {
  upload(fileBuffer: Buffer, fileName: string, isPublic: boolean): Promise<string>
}