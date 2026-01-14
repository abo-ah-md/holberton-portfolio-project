import { getToken } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.book-pass.com';

/**
 * Upload a file to the server
 * POST /api/files/upload
 * @param {File} file - The file object to upload
 * @returns {Promise<{url: string, error: string}>}
 */
export const uploadFile = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const token = getToken();

        const response = await fetch(`${API_BASE_URL}/api/files/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
                // Content-Type is set automatically by browser with FormData
            },
            body: formData
        });

        let data;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            data = await response.json();
        } else {
            // Fallback for non-JSON response (e.g. 500 HTML or empty 200 OK)
            const text = await response.text();
            try {
                data = JSON.parse(text);
            } catch (e) {
                // If text is empty or not JSON, handle as simple message or error
                data = { message: text || response.statusText };
            }
        }

        if (!response.ok) {
            return { url: null, error: data.message || `Upload failed (${response.status} ${response.statusText})` };
        }

        // Return the full URL if needed, or relative path as returned by backend
        // Assuming backend returns { "url": "/api/files/xyz.jpg" }
        return { url: `${API_BASE_URL}${data.url}`, error: null };

    } catch (error) {
        console.error('File upload error:', error);
        return { url: null, error: error.message || 'Network upload error' };
    }
};
