import book1 from '../assets/book-example1.jpg';
import book2 from '../assets/book-example2.jpg';
import book3 from '../assets/book-example3.jpg';
import book4 from '../assets/book-example4.jpg';
import book5 from '../assets/book-example5.jpg';
import book6 from '../assets/book-example6.jpg';
import book7 from '../assets/book-example7.jpg';
import book8 from '../assets/book-example8.jpg';

export const MOCK_BOOKS = [
  {
    id: 1,
    title: "Headway Academic Skills",
    university: "جامعة الملك سعود",
    author: "Staffs of Oxford",
    isbn: "9780194742160",
    price: 25,
    image: book1,
    status: "ممتازة",
  },
  {
    id: 2,
    title: "Book Example 2 (Update Title)",
    university: "جامعة الملك فهد",
    author: "Unknown Author",
    isbn: "9781285741550",
    price: 120,
    image: book2,
    status: "جيد جداً",
  },
  {
    id: 3,
    title: "Book Example 3 (Update Title)",
    university: "جامعة الأميرة نورة",
    author: "Unknown Author",
    isbn: "9780134414232",
    price: 85,
    image: book3,
    status: "ممتازة",
  },
  {
    id: 4,
    title: "Book Example 4 (Update Title)",
    university: "جامعة الملك سعود",
    author: "Unknown Author",
    isbn: "9781133947271",
    price: 95,
    image: book4,
    status: "جيد",
  },
  {
    id: 5,
    title: "Book Example 5 (Update Title)",
    university: "جامعة القصيم",
    author: "Unknown Author",
    isbn: "9780134093413",
    price: 110,
    image: book5,
    status: "مقبول",
  },
  {
    id: 6,
    title: "Book Example 6 (Update Title)",
    university: "جامعة الملك خالد",
    author: "Unknown Author",
    isbn: "9780134743356",
    price: 70,
    image: book6,
    status: "ممتازة",
  },
  {
    id: 7,
    title: "Book Example 7 (Update Title)",
    university: "جامعة جدة",
    author: "Unknown Author",
    isbn: "9781305585126",
    price: 55,
    image: book7,
    status: "جيد جداً",
  },
  {
    id: 8,
    title: "Book Example 8 (Update Title)",
    university: "جامعة الملك فيصل",
    author: "Unknown Author",
    isbn: "9780133918922",
    price: 90,
    image: book8,
    status: "ممتازة",
  }
];

// Duplicate the existing list to reach 30 items for demonstration
export const MOCK_BOOKS_EXTENDED = Array(80).fill(null).map((_, index) => {
  const originalBook = MOCK_BOOKS[index % MOCK_BOOKS.length];
  // Mark specific indices as sold out for demo
  const isSold = [2, 5, 12, 18].includes(index);

  return {
    ...originalBook,
    id: index + 100, // Ensure unique IDs
    title: `${originalBook.title} ${Math.floor(index / MOCK_BOOKS.length) + 1}`, // Slightly vary title
    isSold: isSold, // Add sold status
    status: isSold ? "تم البيع" : originalBook.status, // Update text status if desired, though we'll use boolean for logic
  };
});