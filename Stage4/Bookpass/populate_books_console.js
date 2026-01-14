/**
 * ⚠️ INSTRUCTIONS ⚠️
 * 
 * 1. Log in to your application at http://localhost:5173/
 * 2. Open the Browser Developer Console (F12 or Right Click -> Inspect -> Console tab).
 * 3. Copy ALL the code below and paste it into the console, then hit Enter.
 * 
 * This script will push 8 real-world book examples to your backend using your LOCAL asset images.
 * Note: This relies on the development server serving files at /src/assets/...
 */

const API_BASE_URL = 'http://localhost:8080';
const TOKEN = localStorage.getItem('accessToken');

console.clear();
console.log("🚀 Initializing Book Publisher Script (Local Assets)...");

if (!TOKEN) {
    console.error("❌ ERROR: No access token found!");
    console.error("👉 Please Log In to the website first, then run this script again.");
} else {

    // Real-world book data with LOCAL ASSET IMAGES
    const booksToPush = [
        {
            title: "Clinical Medicine",
            university: "KSU",
            author: "Parveen Kumar & Michael Clark",
            isbn: "9780702066016",
            price: 250,
            status: "excellent",
            description: "A comprehensive guide to clinical medicine, widely used in medical schools like KSU. Immaculate condition.",
            // Using absolute path from web root for Vite dev server
            bookImages: "/src/assets/book-example1.jpg"
        },
        {
            title: "Calculus: Early Transcendentals",
            university: "KFUPM",
            author: "James Stewart",
            isbn: "9781285741550",
            price: 180,
            status: "very good",
            description: "Essential calculus textbook for engineering students at KFUPM. Few highlights but clean pages.",
            bookImages: "/src/assets/book-example2.jpg"
        },
        {
            title: "Introduction to Algorithms",
            university: "PNU",
            author: "Thomas H. Cormen",
            isbn: "9780262033848",
            price: 300,
            status: "good",
            description: "The standard algorithm reference for computer science (CLRS). Used for one semester.",
            bookImages: "/src/assets/book-example3.jpg"
        },
        {
            title: "University Physics with Modern Physics",
            university: "KSU",
            author: "Hugh D. Young",
            isbn: "9780321973610",
            price: 220,
            status: "excellent",
            description: "Wide-ranging physics textbook suitable for university courses. Hardcover, looks new.",
            bookImages: "/src/assets/book-example4.jpg"
        },
        {
            title: "Principles of Marketing",
            university: "QU",
            author: "Philip Kotler",
            isbn: "9780134492513",
            price: 150,
            status: "acceptable",
            description: "Fundamental concepts of marketing. Some wear on the cover but content is fully readable.",
            bookImages: "/src/assets/book-example5.jpg"
        },
        {
            title: "Chemistry: The Central Science",
            university: "UJ",
            author: "Theodore L. Brown",
            isbn: "9780134414232",
            price: 190,
            status: "good",
            description: "Comprehensive chemistry textbook. Includes access code (unchecked).",
            bookImages: "/src/assets/book-example6.jpg"
        },
        {
            title: "Software Engineering",
            university: "KKU",
            author: "Ian Sommerville",
            isbn: "9780133943030",
            price: 140,
            status: "excellent",
            description: "Key concepts in software engineering. Perfect for CS students.",
            bookImages: "/src/assets/book-example7.jpg"
        },
        {
            title: "Java: The Complete Reference",
            university: "KFU",
            author: "Herbert Schildt",
            isbn: "9781260440232",
            price: 160,
            status: "very good",
            description: "Complete guide to Java programming. Eleventh Edition.",
            bookImages: "/src/assets/book-example8.jpg"
        }
    ];

    async function pushBooks() {
        console.log(`📦 Preparing to push ${booksToPush.length} books to ${API_BASE_URL}...`);

        let successCount = 0;
        let failCount = 0;

        for (const [index, book] of booksToPush.entries()) {
            console.log(`\n⏳ [${index + 1}/${booksToPush.length}] Pushing: "${book.title}"...`);

            try {
                const response = await fetch(`${API_BASE_URL}/api/books`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: book.title,
                        description: book.description,
                        price: book.price,
                        author: book.author,
                        isbn: book.isbn,
                        university: book.university,
                        condition: book.status,
                        bookImages: book.bookImages
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(`✅ SUCCESS! Created ID: ${data.bookId || data.id}`);
                    successCount++;
                } else {
                    const errText = await response.text();
                    console.error(`❌ FAILED. Status: ${response.status}`);
                    console.error(`   Reason: ${errText}`);
                    failCount++;
                }
            } catch (error) {
                console.error(`❌ NETWORK ERROR for "${book.title}":`, error);
                failCount++;
            }

            // Small delay to be nice to the server
            await new Promise(r => setTimeout(r, 500));
        }

        console.log(`\n🎉 DONE!`);
        console.log(`✅ Successful: ${successCount}`);
        console.log(`❌ Failed: ${failCount}`);

        if (successCount > 0) {
            console.log("👉 Refresh the Marketplace page to see your new books!");
            alert(`Successfully pushed ${successCount} books! Refresh the page.`);
            location.reload();
        }
    }

    pushBooks();
}
