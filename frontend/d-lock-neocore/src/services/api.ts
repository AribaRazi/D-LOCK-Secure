import axios from "axios";

const API_BASE_URL = "ariba2525.pythonanywhere.com";

const client = axios.create({
  baseURL: API_BASE_URL,
});
export default client;
export interface UploadFileResponse {
  message: string;
  file_hash: string;
  file_name: string;
  file_size: number;
  content_type: string;
  saved_file: string;
  tx_hash: string;
  decryption_key: string;
  warning: string;
}

export interface FileMetadata {
  id: number;
  file_hash: string;
  file_name: string;
  file_size: number;
  content_type: string;
  tx_hash: string;
  upload_date: string;
}

export interface FileListResponse {
  total_files: number;
  page: number;
  per_page: number;
  total_pages: number;
  files: FileMetadata[];
}

export interface VerifyTransactionResponse {
  success: boolean;
  vm_status: string;
  hash: string;
  gas_used?: string;
  sender?: string;
  timestamp?: string;
  payload?: {
    function?: string;
    arguments?: string[];
  };
}

/**
 * Uploads a file to the backend (encrypts + anchors hash on Aptos server-side).
 * Uses XHR internally so we can report upload progress.
 */
export function uploadFileApi(
  file: File,
  onProgress?: (percent: number) => void
): Promise<UploadFileResponse> {
  const formData = new FormData();
  formData.append("file", file);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_BASE_URL}/upload`);

    xhr.upload.onprogress = (event) => {
      if (onProgress && event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      let data: any;
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        reject(new Error("Upload failed: invalid server response"));
        return;
      }
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(data as UploadFileResponse);
      } else {
        reject(new Error(data?.error || `Upload failed (${xhr.status})`));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(formData);
  });
}

/** Downloads and decrypts a file, triggering a browser save dialog. */
export async function downloadFileApi(
  fileHash: string,
  decryptionKey: string,
  fileName: string
): Promise<void> {
  const response = await client.post(
    `/download/${fileHash}`,
    { decryption_key: decryptionKey },
    { responseType: "blob" }
  );

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

/** Deletes a file by its hash. */
export async function deleteFileApi(fileHash: string): Promise<{ message: string; file_hash: string }> {
  const response = await client.delete(`/delete/${fileHash}`);
  return response.data;
}

/** Lists uploaded files with pagination. */
export async function getMyFilesApi(page = 1, perPage = 20): Promise<FileListResponse> {
  const response = await client.get(`/my-files`, { params: { page, per_page: perPage } });
  return response.data;
}

/** Fetches metadata for a single file by hash. */
export async function getFileDetailsApi(fileHash: string): Promise<{ file: FileMetadata }> {
  const response = await client.get(`/file/${fileHash}`);
  return response.data;
}

/** Verifies a transaction on the Aptos blockchain. */
export async function verifyTransactionApi(txHash: string): Promise<VerifyTransactionResponse> {
  const response = await client.get(`/verify/${txHash}`);
  return response.data;
}
