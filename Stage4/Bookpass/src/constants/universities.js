/**
 * University Enum Mapping
 * Keys match backend Enum
 */
export const UNIVERSITIES = {
    KSU: { nameAr: "جامعة الملك سعود", nameEn: "King Saud University", domain: "ksu.edu.sa" },
    KFUPM: { nameAr: "جامعة الملك فهد للبترول والمعادن", nameEn: "King Fahd University of Petroleum and Minerals", domain: "kfupm.edu.sa" },
    KAU: { nameAr: "جامعة الملك عبدالعزيز", nameEn: "King Abdulaziz University", domain: "kau.edu.sa" },
    PNU: { nameAr: "جامعة الأميرة نورة", nameEn: "Princess Nourah bint Abdulrahman University", domain: "pnu.edu.sa" },
    QU: { nameAr: "جامعة القصيم", nameEn: "Qassim University", domain: "qu.edu.sa" },
    KKU: { nameAr: "جامعة الملك خالد", nameEn: "King Khalid University", domain: "kku.edu.sa" },
    UJ: { nameAr: "جامعة جدة", nameEn: "University of Jeddah", domain: "uj.edu.sa" },
    KFU: { nameAr: "جامعة الملك فيصل", nameEn: "King Faisal University", domain: "kfu.edu.sa" },
    IMAMU: { nameAr: "جامعة الإمام محمد بن سعود الإسلامية", nameEn: "Imam Mohammad Ibn Saud Islamic University", domain: "imamu.edu.sa" },
    UQU: { nameAr: "جامعة أم القرى", nameEn: "Umm Al-Qura University", domain: "uqu.edu.sa" },
    TU: { nameAr: "جامعة الطائف", nameEn: "Taif University", domain: "tu.edu.sa" },
    HGU: { nameAr: "جامعة حائل", nameEn: "Hail University", domain: "uoh.edu.sa" },
    JU: { nameAr: "جامعة جازان", nameEn: "Jazan University", domain: "jazanu.edu.sa" },
    NU: { nameAr: "جامعة نجران", nameEn: "Najran University", domain: "nu.edu.sa" },
    BU: { nameAr: "جامعة الباحة", nameEn: "Al-Baha University", domain: "bu.edu.sa" },
    TU_TABUK: { nameAr: "جامعة تبوك", nameEn: "Tabuk University", domain: "ut.edu.sa" },
    JOUF: { nameAr: "جامعة الجوف", nameEn: "Jouf University", domain: "ju.edu.sa" },
    NB: { nameAr: "جامعة الحدود الشمالية", nameEn: "Northern Border University", domain: "nbu.edu.sa" },
    SEU: { nameAr: "الجامعة السعودية الإلكترونية", nameEn: "Saudi Electronic University", domain: "seu.edu.sa" }
};

/**
 * Helper to get Arabic name by Key
 */
export const getUniversityName = (key) => {
    return UNIVERSITIES[key]?.nameAr || key;
};

/**
 * Helper to get Enum Key by Arabic Name (Reverse lookup for legacy support if needed)
 */
export const getUniversityKeyByName = (arabicName) => {
    const entry = Object.entries(UNIVERSITIES).find(([_, val]) => val.nameAr === arabicName);
    return entry ? entry[0] : null;
};
