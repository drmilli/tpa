import crypto from 'crypto';
import { AppError } from '../middleware/errorHandler';

type CloudinaryResourceType = 'image' | 'video';

interface UploadResult {
  publicId: string;
  resourceType: CloudinaryResourceType;
  secureUrl: string;
  bytes: number;
  format?: string;
}

interface CloudinaryUploadResponse {
  public_id?: string;
  resource_type?: CloudinaryResourceType;
  secure_url?: string;
  bytes?: number;
  format?: string;
  error?: {
    message?: string;
  };
}

class CloudinaryService {
  private getConfig() {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      throw new AppError(
        'Cloudinary is not configured on the backend. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.',
        500
      );
    }

    return { cloudName, apiKey, apiSecret };
  }

  async uploadBuffer(
    fileBuffer: Buffer,
    options: {
      folder: string;
      filename: string;
      mimeType: string;
    }
  ): Promise<UploadResult> {
    const { cloudName, apiKey, apiSecret } = this.getConfig();
    const resourceType: CloudinaryResourceType = options.mimeType.startsWith('video/') ? 'video' : 'image';
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const publicId = `${this.sanitizeFilename(options.filename)}-${Date.now()}`;
    const paramsToSign = {
      folder: options.folder,
      public_id: publicId,
      timestamp,
    };

    const signature = this.signParams(paramsToSign, apiSecret);
    const formData = new FormData();
    const blob = new Blob([new Uint8Array(fileBuffer)], { type: options.mimeType });

    formData.append('file', blob, options.filename);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
    formData.append('folder', options.folder);
    formData.append('public_id', publicId);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const result = (await response.json()) as CloudinaryUploadResponse;

    if (!response.ok || !result.secure_url) {
      throw new AppError(result?.error?.message || 'Cloudinary upload failed', 502);
    }

    return {
      publicId: result.public_id || publicId,
      resourceType,
      secureUrl: result.secure_url,
      bytes: result.bytes || 0,
      format: result.format,
    };
  }

  private signParams(params: Record<string, string>, apiSecret: string): string {
    const sorted = Object.entries(params)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    return crypto
      .createHash('sha1')
      .update(`${sorted}${apiSecret}`)
      .digest('hex');
  }

  private sanitizeFilename(filename: string): string {
    const baseName = filename.replace(/\.[^/.]+$/, '');

    return baseName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 60) || 'upload';
  }
}

export const cloudinaryService = new CloudinaryService();
