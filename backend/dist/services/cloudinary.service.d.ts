type CloudinaryResourceType = 'image' | 'video';
interface UploadResult {
    publicId: string;
    resourceType: CloudinaryResourceType;
    secureUrl: string;
    bytes: number;
    format?: string;
}
declare class CloudinaryService {
    private getConfig;
    uploadBuffer(fileBuffer: Buffer, options: {
        folder: string;
        filename: string;
        mimeType: string;
    }): Promise<UploadResult>;
    private signParams;
    private sanitizeFilename;
}
export declare const cloudinaryService: CloudinaryService;
export {};
//# sourceMappingURL=cloudinary.service.d.ts.map