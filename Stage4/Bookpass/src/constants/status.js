/**
 * Book Condition/Status Constants
 */

// Map API values (English) to Display values (Arabic)
export const STATUS_TRANSLATIONS = {
    'excellent': 'ممتاز',
    'very good': 'جيد جداً',
    'good': 'جيد',
    'poor': 'مقبول',
    'new': 'جديد',
    // Fallbacks or legacy
    'AVAILABLE': 'متاح',
    'SOLD': 'تم البيع',
    'PENDING': 'قيد المراجعة'
};

// Map Display values (Arabic) to API values (English)
export const API_STATUS_VALUES = {
    'جديد': 'excellent', // Mapping 'new' UI to 'excellent' API if 'new' isn't supported, or distinct if it is. Postman says: excellent, very good, good, poor.
    'ممتاز': 'excellent',
    'جيد جداً': 'very good',
    'جيد': 'good',
    'مقبول': 'poor'
};

export const getStatusLabel = (status) => {
    if (!status) return '';
    const lowerStatus = status.toLowerCase();
    return STATUS_TRANSLATIONS[lowerStatus] || status;
};
