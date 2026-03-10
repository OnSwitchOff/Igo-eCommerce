export type PresignFileDto = {
    contentType: string;
    sizeBytes: number;
    kind: 'avatar' | 'product-image';
};