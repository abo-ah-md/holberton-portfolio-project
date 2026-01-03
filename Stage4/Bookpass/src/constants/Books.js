// NOTE: This is a placeholder array for your Java Spring Boot backend.
// When you're ready, swap this with a 'useEffect' fetch or 'React Query' 
// that hits your http://localhost:8080/api/books endpoint.
export const MOCK_BOOKS = [
  {
    id: 1,
    title: "Academic Skills - مهارات أكاديمية",
    university: "جامعة الملك سعود",
    price: 45,
    image: "https://via.placeholder.com/150x200", // Placeholder for your JPGs
    status: "ممتاز",
  },
  {
    id: 2,
    title: "Introduction to Calculus",
    university: "جامعة الإمام",
    price: 60,
    image: "https://via.placeholder.com/150x200",
    status: "جيد جداً",
  },
  // ... duplicate these for the 12-card grid shown in your design
].concat(Array(10).fill(null).map((_, i) => ({
    id: i + 3,
    title: `Book Title ${i + 3}`,
    university: "جامعة تبوك",
    price: 30 + i,
    image: "https://via.placeholder.com/150x200",
    status: "مقبول",
})));