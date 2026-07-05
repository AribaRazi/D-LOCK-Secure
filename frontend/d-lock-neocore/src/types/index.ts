export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  total_files: number;
}

export interface FileMetadata {
  id: number;
  file_hash: string;
  file_name: string;
  file_size: number;
  content_type: string;
  tx_hash: string;
  upload_date: string;
  owner: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  access_token: string;
  refresh_token: string;
}

export interface UploadResponse {
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

export interface FileListResponse {
  total_files: number;
  page: number;
  per_page: number;
  total_pages: number;
  files: FileMetadata[];
}

export interface StatsResponse {
  total_files: number;
  total_size_bytes: number;
  total_size_mb: number;
  content_types: Record<string, number>;
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