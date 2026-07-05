export const API_URL = import.meta.env.VITE_API_URL;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: options.body instanceof FormData ? {} : { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      message = data.error || message;
    } catch {}
    throw new Error(message);
  }

  return res;
}

export const api = {
  async uploadFile(file, onProgress) {
    const formData = new FormData();
    formData.append("file", file);

    // Using XHR for progress tracking (fetch doesn't support upload progress)
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${API_BASE_URL}/upload`);

      xhr.upload.onprogress = (e) => {
        if (onProgress && e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = () => {
        try {
          const data = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(data);
          } else {
            reject(new Error(data.error || "Upload failed"));
          }
        } catch {
          reject(new Error("Upload failed"));
        }
      };

      xhr.onerror = () => reject(new Error("Network error during upload"));
      xhr.send(formData);
    });
  },

  async getMyFiles(page = 1, perPage = 20) {
    const res = await request(`/my-files?page=${page}&per_page=${perPage}`);
    return res.json();
  },

  async getFileDetails(fileHash) {
    const res = await request(`/file/${fileHash}`);
    return res.json();
  },

  async downloadFile(fileHash, decryptionKey, fileName) {
    const res = await request(`/download/${fileHash}`, {
      method: "POST",
      body: JSON.stringify({ decryption_key: decryptionKey }),
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  async deleteFile(fileHash) {
    const res = await request(`/delete/${fileHash}`, { method: "DELETE" });
    return res.json();
  },

  async getStats() {
    const res = await request(`/stats`);
    return res.json();
  },

  // ⬇️ ON-CHAIN VERIFICATION
  async verifyTransaction(txHash) {
    const res = await request(`/verify/${txHash}`);
    return res.json();
  },
};