# User Stories - Bookpass Marketplace
## Prioritized by MoSCoW Method

---

## MUST HAVE (Core MVP Features)

### Authentication & User Management

**US-001: User Registration**
- As a new student, I want to create an account using my email and password, so that I can access the marketplace and buy/sell textbooks.
- Priority: MUST HAVE
- Acceptance Criteria:
  - User can register with email, password, and name
  - Email verification is required
  - Password strength validation
  - Success confirmation message displayed

**US-002: User Login**
- As a registered student, I want to log in with my credentials, so that I can access my profile and listings.
- Priority: MUST HAVE
- Acceptance Criteria:
  - Login with email and password
  - Session management (stay logged in)
  - "Remember me" option
  - Error messages for invalid credentials

**US-003: View/Edit User Profile**
- As a logged-in user, I want to view and edit my profile information, so that other users can see my credentials and I can manage my account.
- Priority: MUST HAVE
- Acceptance Criteria:
  - Display user info (name, email, rating, member since)
  - Edit profile details (name, password)
  - View purchase/sale history
  - Display average rating and review count

---

### Book Listing Management

**US-004: Create a Book Listing**
- As a seller, I want to create a new book listing with all relevant details, so that buyers can find my textbook.
- Priority: MUST HAVE
- Acceptance Criteria:
  - Fill in: title, author, ISBN, course code, condition (dropdown), price, photos (multiple)
  - Add description/notes about the book
  - Confirm successful listing creation
  - Listing appears in marketplace immediately

**US-005: View Book Details**
- As a buyer, I want to view complete details of a book listing, so that I can decide if I want to purchase it.
- Priority: MUST HAVE
- Acceptance Criteria:
  - Display all book info (title, author, ISBN, condition, price, course)
  - Show seller profile with rating
  - Display multiple photos in gallery
  - Show availability status

**US-006: Edit Book Listing**
- As a seller, I want to edit my book listing details, so that I can update information or fix mistakes.
- Priority: MUST HAVE
- Acceptance Criteria:
  - Edit any field (except ISBN)
  - Add/remove photos
  - Update price, condition, description
  - Changes saved and updated in marketplace

**US-007: Delete Book Listing**
- As a seller, I want to delete my book listing, so that I can remove it when the book is sold.
- Priority: MUST HAVE
- Acceptance Criteria:
  - Delete button visible on seller's listings
  - Confirmation dialog before deletion
  - Listing removed from marketplace immediately

---

### Search & Browse

**US-008: Search Books by Title/Author**
- As a buyer, I want to search for books by title or author, so that I can quickly find what I need.
- Priority: MUST HAVE
- Acceptance Criteria:
  - Search bar on homepage and all pages
  - Real-time search suggestions
  - Display matching results with pagination
  - Sort by relevance (default)

**US-009: Search Books by ISBN**
- As a buyer, I want to search for books by ISBN, so that I can find the exact edition I need.
- Priority: MUST HAVE
- Acceptance Criteria:
  - ISBN search field available
  - Exact ISBN matching
  - Display matching books instantly
  - Show if no results found

**US-010: Filter Books by Course/Subject**
- As a buyer, I want to filter books by course code or subject, so that I can find textbooks for my classes.
- Priority: MUST HAVE
- Acceptance Criteria:
  - Course filter dropdown (populated from listings)
  - Filter results by selected course
  - Show number of books per course
  - Clear filter option

**US-011: Filter Books by Condition**
- As a buyer, I want to filter books by condition (like new, good, fair), so that I can choose based on my preferences.
- Priority: MUST HAVE
- Acceptance Criteria:
  - Condition filter with checkboxes (Like New, Good, Fair)
  - Filter results accordingly
  - Multiple conditions can be selected
  - Show book count per condition

**US-012: Filter Books by Price Range**
- As a buyer, I want to filter books by price range, so that I can find books within my budget.
- Priority: MUST HAVE
- Acceptance Criteria:
  - Price range slider (min-max)
  - Display results within selected range
  - Show price statistics (min, max, average)
  - Update results in real-time

**US-013: Browse All Books**
- As a buyer, I want to browse all available books in the marketplace, so that I can discover books without searching.
- Priority: MUST HAVE
- Acceptance Criteria:
  - Homepage displays all books in grid/list format
  - Pagination (20 books per page)
  - Default sorted by newest first
  - Each book shows title, author, price, condition, seller rating

---

### Messaging & Communication

**US-014: Send Message to Seller**
- As a buyer, I want to send a message to a seller, so that I can inquire about a book or negotiate the price.
- Priority: MUST HAVE
- Acceptance Criteria:
  - Message button on book detail page
  - Message form with text input
  - Send message confirmation
  - Message delivered to seller's inbox

**US-015: View Messages**
- As a user, I want to view all my messages in an inbox, so that I can communicate with buyers/sellers.
- Priority: MUST HAVE
- Acceptance Criteria:
  - Inbox page showing all conversations
  - Display sender/recipient name and latest message preview
  - Show timestamp of latest message
  - Mark messages as read/unread
  - Conversation count badge on navigation

**US-016: Reply to Message**
- As a user, I want to reply to messages, so that I can continue conversations with other users.
- Priority: MUST HAVE
- Acceptance Criteria:
  - Open conversation thread view
  - Message history displayed in chronological order
  - Reply input field
  - Send button and confirmation

**US-017: Message Notifications**
- As a user, I want to receive notifications when I get a new message, so that I can respond promptly.
- Priority: MUST HAVE
- Acceptance Criteria:
  - Notification badge on inbox icon
  - Browser notification (if enabled)
  - Real-time message updates in chat
  - Notification disappears after message is read

---

### Ratings & Reviews

**US-018: Rate a Seller**
- As a buyer, I want to rate a seller after completing a transaction, so that other students can trust reliable sellers.
- Priority: MUST HAVE
- Acceptance Criteria:
  - 5-star rating system
  - Optional written review/comment
  - Rate button on purchase history
  - Confirmation message
  - Rating reflected on seller's profile

**US-019: View Seller Ratings**
- As a buyer, I want to see a seller's average rating and reviews, so that I can assess their reliability.
- Priority: MUST HAVE
- Acceptance Criteria:
  - Display average star rating on seller profile
  - Show number of reviews
  - Display recent reviews with ratings and comments
  - Show review date and reviewer name

---

### Book Availability Status

**US-020: Mark Book as Sold**
- As a seller, I want to mark a book as sold, so that buyers know it's no longer available.
- Priority: MUST HAVE
- Acceptance Criteria:
  - Mark as sold option on listing
  - "Sold" badge displayed on listing
  - Automatically remove from search results
  - Can be restored to available if needed

---

## SHOULD HAVE (Important but not critical for MVP launch)

**US-021: Advanced Sort Options**
- As a buyer, I want to sort books by price (low-high, high-low), newest listings, or seller rating, so that I can find books more efficiently.
- Priority: SHOULD HAVE
- Acceptance Criteria:
  - Sort dropdown with multiple options
  - Results update when sort selection changes
  - Default sort is "newest first"

**US-022: Wishlist/Favorites**
- As a buyer, I want to save books to a wishlist, so that I can keep track of books I'm interested in.
- Priority: SHOULD HAVE
- Acceptance Criteria:
  - Heart/star icon on book cards
  - Add to wishlist button on book detail page
  - View wishlist page
  - Remove from wishlist option
  - Wishlist count displayed in profile

**US-023: User Verification Badge**
- As a verified user, I want a badge on my profile, so that other users can easily identify trustworthy sellers.
- Priority: SHOULD HAVE
- Acceptance Criteria:
  - Verification badge after email confirmation
  - Badge displayed on profile and listings
  - Explains verification criteria

**US-024: Report Inappropriate Listing**
- As a user, I want to report a listing that violates guidelines, so that moderators can remove inappropriate content.
- Priority: SHOULD HAVE
- Acceptance Criteria:
  - Report button on book detail page
  - Report form with reason/description
  - Submission confirmation
  - Admin review and action taken

---

## COULD HAVE (Nice-to-have features for future iterations)

**US-025: "Demand a Book" Feature**
- As a buyer, I want to request a specific book that's not currently available, so that sellers can notify me when they have it.
- Priority: COULD HAVE

**US-026: Bulk Upload Listings**
- As a seller, I want to upload multiple book listings at once (via CSV), so that I can list many books quickly.
- Priority: COULD HAVE

**US-027: Book Recommendation**
- As a buyer, I want to see recommended books based on my purchase history, so that I can discover new textbooks.
- Priority: COULD HAVE

**US-028: Payment Integration (Stripe/Apple Pay)**
- As a buyer, I want to pay for books directly through the platform, so that transactions are secure and convenient.
- Priority: COULD HAVE

**US-029: Advanced Analytics for Sellers**
- As a seller, I want to see analytics about my listings (views, clicks, conversions), so that I can optimize my sales strategy.
- Priority: COULD HAVE

---

## WON'T HAVE (Out of scope for MVP)

- University notes/study guides marketplace
- Advanced recommendation engine with machine learning
- Live video chat between buyers and sellers
- Integration with university course registration systems
- Automatic book pricing based on market analysis
