// src/services/fileService.ts
import api from './api';
import { UploadResponse, FileListResponse, FileMetadata, StatsResponse } from '../types';

/** Uploads a file (encrypts + anchors hash on Aptos server-side). */
export async function uploadFileApi(
  file: File,
  onProgress?: (percent: number) => void
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post<UploadResponse>('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        onProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
      }
    },
  });

  return response.data;
}

/** Lists uploaded files with pagination. */
export async function getMyFilesApi(page = 1, perPage = 10): Promise<FileListResponse> {
  const response = await api.get<FileListResponse>(`/my-files?page=${page}&per_page=${perPage}`);
  return response.data;
}

/** Fetches metadata for a single file by hash. */
export async function getFileDetailsApi(fileHash: string): Promise<{ file: FileMetadata }> {
  const response = await api.get<{ file: FileMetadata }>(`/file/${fileHash}`);
  return response.data;
}

/** Downloads and decrypts a file, triggering a browser save dialog. */
export async function downloadFileApi(
  fileHash: string,
  decryptionKey: string,
  fileName: string
): Promise<void> {
  const response = await api.post(
    `/download/${fileHash}`,
    { decryption_key: decryptionKey },
    { responseType: 'blob' }
  );

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

/** Deletes a file by its hash. */
export async function deleteFileApi(fileHash: string): Promise<{ message: string; file_hash: string }> {
  const response = await api.delete<{ message: string; file_hash: string }>(`/delete/${fileHash}`);
  return response.data;
}

/** Gets aggregate file statistics. */
export async function getStatsApi(): Promise<StatsResponse> {
  const response = await api.get<StatsResponse>('/stats');
  return response.data;
}

/** Verifies a transaction on the Aptos blockchain. */
export async function verifyTransactionApi(txHash: string): Promise<any> {
  const response = await api.get(`/verify/${txHash}`);
  return response.data;
}