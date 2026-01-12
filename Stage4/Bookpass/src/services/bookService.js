/**
 * Book Service
 * Handles all HTTP requests for book management
 */

import { getToken } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.book-pass.com';

/**
 * Upload image file
 * POST /api/files/upload
 */
export const uploadImage = async (file) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/files/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to upload image');
    }

    const data = await response.json();
    return { url: `${API_BASE_URL}${data.url}`, error: null };
  } catch (error) {
    console.error('Error uploading image:', error);
    return { url: null, error: error.message };
  }
};

/**
 * Get all available books
 * GET /api/books/available
 */
export const getAvailableBooks = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/books/available`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }

    const data = await response.json();
    return { data: transformBooks(data), error: null };
  } catch (error) {
    console.error('Error fetching available books:', error);
    return { data: [], error: error.message };
  }
};

/**
 * Get all books for marketplace
 * GET /api/books/all
 */
export const getAllBooks = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/books/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }

    const data = await response.json();
    return { data: transformBooks(data), error: null };
  } catch (error) {
    console.error('Error fetching all books:', error);
    return { data: [], error: error.message };
  }
};

/**
 * Search books
 * GET /api/books/search
 */
export const searchBooks = async (query, type = 'title', university = null) => {
  try {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (type) params.append('type', type);
    if (university) params.append('university', university);

    const response = await fetch(`${API_BASE_URL}/api/books/search?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to search books');
    }

    const data = await response.json();
    return { data: transformBooks(data), error: null };
  } catch (error) {
    console.error('Error searching books:', error);
    return { data: [], error: error.message };
  }
};

/**
 * Add a new book for sale
 * POST /api/books
 */
export const addBook = async (bookData) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/api/books`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: bookData.title,
        description: bookData.description,
        price: bookData.price,
        author: bookData.author,
        isbn: bookData.isbn,
        university: bookData.university,
        condition: bookData.condition,
        bookImages: bookData.bookImages || null,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add book');
    }

    const data = await response.json();
    return { data: transformBook(data), error: null };
  } catch (error) {
    console.error('Error adding book:', error);
    return { data: null, error: error.message };
  }
};

/**
 * Get user's own books
 * GET /api/books/my-books
 */
export const getMyBooks = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/api/books/my-books`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch your books');
    }

    const data = await response.json();
    return { data: transformBooks(data), error: null };
  } catch (error) {
    console.error('Error fetching my books:', error);
    return { data: [], error: error.message };
  }
};

/**
 * Get store pending books (Reviewer)
 * GET /api/books/store/pending
 */
export const getStorePendingBooks = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/api/books/store/pending`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch pending books');
    }

    const data = await response.json();
    return { data: transformBooks(data), error: null };
  } catch (error) {
    console.error('Error fetching pending books:', error);
    return { data: [], error: error.message };
  }
};

/**
 * Get store sold books (Reviewer)
 * GET /api/books/store/sold
 */
export const getStoreSoldBooks = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/api/books/store/sold`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch sold books');
    }

    const data = await response.json();
    return { data: transformBooks(data), error: null };
  } catch (error) {
    console.error('Error fetching sold books:', error);
    return { data: [], error: error.message };
  }
};

/**
 * Review/Approve a book
 * PUT /api/books/review/{bookId}
 */
export const reviewBook = async (bookId, condition, reviewNotes = '') => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    // Default to 'good' if condition is missing, though frontend should provide it
    const finalCondition = condition || 'good';

    const response = await fetch(`${API_BASE_URL}/api/books/${bookId}/review`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'AVAILABLE',
        condition: finalCondition,
        reviewNotes: reviewNotes
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to review book');
    }

    const data = await response.json();
    return { data: transformBook(data), error: null };

  } catch (error) {
    console.error('Error reviewing book:', error);
    return { data: null, error: error.message };
  }
};

/**
 * Mark book as PICKED (Handed over to buyer)
 * PUT /api/books/{id}/picked
 */
export const markBookAsPicked = async (bookId) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/api/books/${bookId}/picked`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to mark book as picked');
    }

    const data = await response.json();
    return { data: transformBook(data), error: null };
  } catch (error) {
    console.error('Error marking book as picked:', error);
    return { data: null, error: error.message };
  }
};

/**
 * Purchase a book (Verify payment on backend)
 * PUT /api/books/{id}/purchase
 */
export const purchaseBook = async (bookId, paymentId) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/api/books/${bookId}/purchase`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentId })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to complete purchase');
    }

    const data = await response.json();
    return { data: transformBook(data), error: null };
  } catch (error) {
    console.error('Error purchasing book:', error);
    return { data: null, error: error.message };
  }
};

/**
 * Transform backend book data to frontend format
 */
const transformBook = (book) => {
  return {
    id: book.bookId,
    title: book.title,
    description: book.description,
    price: parseFloat(book.price),
    author: book.author,
    isbn: book.isbn,
    university: book.university || 'غير محدد',
    status: book.bookCondition || book.status, // Display Status (Excellent/Good)
    listingStatus: book.status, // Workflow Status (AVAILABLE/PENDING/SOLD)
    image: book.bookImages ? parseBookImage(book.bookImages) : null,
    isSold: book.sold || book.status === 'SOLD',
    sellerId: book.sellerId,
    sellerName: book.sellerName,
    sellerPhone: book.sellerPhone,
    buyerId: book.buyerId,
    buyerName: book.buyerName,
    buyerPhone: book.buyerPhone,
    createdAt: book.createdAt,
  };
};

/**
 * Transform array of books
 */
const transformBooks = (books) => {
  return books.map(transformBook);
};

/**
 * Parse book image from JSON string or return first image
 */
const parseBookImage = (bookImages) => {
  if (!bookImages) return null;

  try {
    // Try parsing as JSON array
    const images = JSON.parse(bookImages);
    if (Array.isArray(images) && images.length > 0) {
      return images[0];
    }
  } catch {
    // If not JSON, treat as single URL
    return bookImages;
  }

  return null;
};