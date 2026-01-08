# User Stories - Bookpass Marketplace
## Prioritized by MoSCoW Method

---

## MUST HAVE (Core MVP Features)

---

### Landing Page & Navigation

**US-001: View Landing Page**
- As a visitor, I want to see a professional landing page with About Us, Why Us sections, and access to the marketplace, so that I can understand the platform and start browsing.
- Priority: MUST HAVE
- Acceptance Criteria:
  - Hero section with clear value proposition
  - "About Us" section explaining the platform mission
  - "Why Us" section highlighting key benefits (trusted sellers, verified books, secure payments)
  - Call-to-action buttons to browse marketplace
  - Responsive design for mobile and desktop
  - RTL support for Arabic language

**US-002: Access Marketplace**
- As a visitor, I want to access the marketplace page from the landing page, so that I can browse and purchase used textbooks.
- Priority: MUST HAVE
- Acceptance Criteria:
  - Clear navigation link to marketplace
  - Marketplace displays all available books
  - Grid/list view of book cards
  - Search and filter functionality accessible
  - Price and condition visible on each listing

---

### Authentication & User Management

**US-003: User Registration**
- As a new student, I want to create an account using my email and password, so that I can access the marketplace and buy/sell textbooks.
- Priority: MUST HAVE
- Acceptance Criteria:
  - Registration form with email, password, name, and phone number
  - Email validation format check
  - Password strength validation (minimum 8 characters, mixed case, numbers)
  - Success confirmation message displayed
  - Redirect to login page after successful registration
  - Form validation error messages in Arabic

**US-004: User Login**
- As a registered student, I want to log in with my credentials, so that I can access my profile and listings.
- Priority: MUST HAVE
- Acceptance Criteria:
  - Login with email and password
  - Session management (stay logged in)
  - "Remember me" option
  - Error messages for invalid credentials
  - Redirect to previous page or homepage after login
  - Loading indicator during authentication

**US-005: User Logout**
- As a logged-in user, I want to log out of my account, so that I can securely end my session.
- Priority: MUST HAVE
- Acceptance Criteria:
  - Logout button accessible from navbar and profile page
  - Confirmation dialog before logout
  - Clear session and authentication tokens
  - Redirect to logout confirmation page
  - Display success message on logout page
  - Option to log back in from logout page

**US-006: View Logout Page**
- As a user who just logged out, I want to see a logout confirmation page, so that I know my session has ended securely.
- Priority: MUST HAVE
- Acceptance Criteria:
  - Display "You have been logged out" message
  - Show "Login Again" button
  - Show "Return to Home" button
  - Clean, minimal design


---

### User Profile

**US-007: View User Profile**
- As a logged-in user, I want to view my profile page, so that I can see my account information and activity.
- Priority: MUST HAVE
- Acceptance Criteria:
  - Display user info (name, email, phone)
  - Profile picture/avatar display
  - RTL layout support

**US-008: Edit User Profile**
- As a logged-in user, I want to edit my profile information, so that I can keep my details up to date.
- Priority: MUST HAVE
- Acceptance Criteria:
  - Edit name, phone number, and password
  - Upload/change profile picture
  - Form validation for all fields

### Book Listing & Availability

**US-009: Add a Book Listing**
- As a seller, I want to create a new book listing with all relevant details, so that buyers can find my textbook.
- Priority: MUST HAVE
- Acceptance Criteria:
  - Fill in: title, author, ISBN, university code, price, photo
  - Image upload with preview
  - Price input with SAR currency

**US-010: Set Book Availability**
- As a reviewer, I want to set and updatebook's availability status, so that buyers know if it's available for purchase.
- Priority: MUST HAVE
- Acceptance Criteria:
  - Toggle availability on/off from listing management
  - Unavailable books hidden from main marketplace search

**US-011: View Book Details**
- As a buyer, I want to view complete details of a book listing, so that I can decide if I want to purchase it.
- Priority: MUST HAVE
- Acceptance Criteria:
  - Display all book info (title, author, ISBN, condition, price, course)
  - Show availability status clearly
  - "Add to Cart" and "Buy Now" buttons visible


**US-012: Delete Book Listing**
- As an admin, I want to delete a book listing, so that I can remove it permanently.
- Priority: MUST HAVE
- Acceptance Criteria:
  - Delete button visible on admin's listings
  - Listing removed from marketplace immediately

---

### Shopping Cart

**US-013: View Cart Page**
- As a buyer, I want to view my shopping cart, so that I can review items before checkout.
- Priority: MUST HAVE
- Acceptance Criteria:
  - Display all added books with images, titles, and prices
  - Show individual item prices and total
  - Remove item button for each book
  - "Continue Shopping" button
  - "Proceed to Checkout" button
  - Empty cart message when no items
  - Cart item count in navbar

**US-014: Add Book to Cart**
- As a buyer, I want to add books to my cart, so that I can purchase multiple items at once.
- Priority: MUST HAVE
- Acceptance Criteria:
  - "Add to Cart" button on book cards and detail page
  - Visual confirmation when item added
  - Cart icon updates with item count
  - Prevent adding same book twice
  - Authentication required (show login modal if not logged in)

**US-015: Remove Book from Cart**
- As a buyer, I want to remove books from my cart, so that I can adjust my purchase.
- Priority: MUST HAVE
- Acceptance Criteria:
  - Remove button on each cart item
  - Confirmation before removal
  - Cart total updates immediately
  - Success message displayed

---

### Payment Integration (Moyasar)

**US-016: Checkout with Moyasar Payment**
- As a buyer, I want to pay for books using Moyasar payment gateway, so that transactions are secure and convenient.
- Priority: MUST HAVE
- Acceptance Criteria:
  - Secure Moyasar payment form integration
  - Support for credit/debit cards (Visa, MasterCard, MADA)
  - Display order summary before payment
  - Show payment processing indicator
  - Handle payment success and redirect to thank you page
  - Handle payment failure with clear error messages

**US-017: View Payment Summary**
- As a buyer, I want to see a clear summary of my order before payment, so that I can verify the amount.
- Priority: MUST HAVE
- Acceptance Criteria:
  - List all items with prices
  - Show subtotal
  - Show any applicable fees
  - Display final total in SAR
  - Shipping/delivery information if applicable
  - Edit cart option before payment

---

### Thank You Page

**US-018: View Thank You Page After Purchase**
- As a buyer, I want to see a thank you page after successful purchase, so that I know my order was completed.
- Priority: MUST HAVE
- Acceptance Criteria:
  - Display "Thank You for Your Purchase" message
  - Show order confirmation number
  - Display order summary (items, total, payment method)
  - Estimated delivery/pickup information
  - "Continue Shopping" button
  - "View Order History" button
  - Email confirmation sent notification
  - Print receipt option

---

### University Hub Reviewer Page

**US-019: Reviewer Login (University Hub Staff)**
- As a university hub staff member, I want to log in to the reviewer dashboard, so that I can manage book pickups and deliveries.
- Priority: MUST HAVE
- Acceptance Criteria:
  - Separate login for reviewer accounts
  - Role-based access (only reviewers can access reviewer page)
  - Secure authentication
  - Dashboard view after login

**US-020: View Pending Books for Review**
- As a university hub reviewer, I want to see all pending book submissions, so that I can pick and review them.
- Priority: MUST HAVE
- Acceptance Criteria:
  - List all books submitted for review
  - Show seller information and contact details
  - Display book details (title, condition claimed, photos)

**US-021: Pick Up Book for Review**
- As a university hub reviewer, I want to mark a book as "picked up", so that I can begin the review process.
- Priority: MUST HAVE
- Acceptance Criteria:
  - "Pick Up" action button on pending books

**US-022: Review Book Condition**
- As a university hub reviewer, I want to review and verify the book's condition, so that buyers receive accurate information.
- Priority: MUST HAVE
- Acceptance Criteria:
  - Condition assessment form (Like New, Good, Fair, Poor)
  - Approve the listing

**US-023: Approve Book Listing**
- As a university hub reviewer, I want to approve a book listing, so that only quality books are available on the marketplace.
- Priority: MUST HAVE
- Acceptance Criteria:
  - "Approve" button to publish listing
  - Approved books appear in marketplace

**US-024: Mark Book for Delivery**
- As a university hub reviewer, I want to mark reviewed books for delivery, so that buyers can receive their purchases.
- Priority: MUST HAVE
- Acceptance Criteria:
  - List of approved books pending delivery
  - "Mark for Delivery" action
  - Enter delivery details (date, method, tracking)
  - Update order status to "Out for Delivery"
  - Notify buyer of delivery status

**US-025: Complete Delivery**
- As a university hub reviewer, I want to mark a book as delivered, so that the transaction can be completed.
- Priority: MUST HAVE
- Acceptance Criteria:
  - "Mark as Delivered" action
  - Record delivery date and confirmation
  - Update order status to "Completed"
  - Notify buyer and seller of completion
  - Enable buyer to leave rating/review

---

### UX/UI Design Requirements

**US-026: Responsive Design**
- As a user, I want the website to work well on all devices, so that I can use it on mobile, tablet, or desktop.
- Priority: MUST HAVE
- Acceptance Criteria:
  - Mobile-first responsive design
  - Breakpoints for mobile (< 768px), tablet (768-1024px), desktop (> 1024px)
  - Touch-friendly buttons and navigation on mobile
  - Consistent experience across all devices
  - No horizontal scrolling on any screen size

**US-027: RTL Language Support**
- As an Arabic-speaking user, I want the interface in Arabic with RTL layout, so that I can easily navigate and read content.
- Priority: MUST HAVE
- Acceptance Criteria:
  - Full Arabic translation of all UI text
  - Right-to-left text direction
  - Proper alignment of icons and elements
  - Arabic numerals support (optional Western numerals)
  - Correct date formatting for Arabic locale

**US-028: Loading States**
- As a user, I want to see loading indicators when content is being fetched, so that I know the application is working.
- Priority: MUST HAVE
- Acceptance Criteria:
  - Loading spinner/skeleton for page loads
  - Button loading states during form submission
  - Skeleton loaders for book cards and lists
  - Smooth transitions between loading and loaded states
  - Loading overlay for full-page operations

**US-029: View Loading Page**
- As a user, I want to see a branded loading page during initial app load, so that I have a smooth experience.
- Priority: MUST HAVE
- Acceptance Criteria:
  - Display Bookpass logo during load
  - Animated loading indicator
  - Brief loading time (< 3 seconds ideally)
  - Graceful transition to main content
  - Progress indicator (optional)

---

### Error Pages

**US-030: View 404 Not Found Page**
- As a user, I want to see a helpful 404 page when I access a non-existent URL, so that I can navigate back to the main site.
- Priority: MUST HAVE
- Acceptance Criteria:
  - Clear "Page Not Found" message
  - Friendly illustration or graphic
  - "Return to Home" button
  - Search bar to find content
  - Suggested popular pages/links
  - Consistent branding with rest of site

**US-031: View 403 Forbidden Page**
- As a user, I want to see a 403 page when I try to access restricted content, so that I understand I don't have permission.
- Priority: MUST HAVE
- Acceptance Criteria:
  - Clear "Access Denied" or "Permission Required" message
  - Explanation of why access is restricted
  - "Login" button if not authenticated
  - "Return to Home" button
  - Contact support option
  - Consistent branding with rest of site

---

### Testing Requirements

**US-032: Integration Testing**
- As a developer, I want comprehensive integration tests, so that I can ensure all components work together correctly.
- Priority: MUST HAVE
- Acceptance Criteria:
  - Test user registration and login flow
  - Test book listing creation and retrieval
  - Test cart functionality (add, remove, update)
  - Test Moyasar payment integration
  - Test reviewer workflow (pick, review, approve, deliver)
  - Test authentication guards on protected routes
  - Minimum 80% code coverage for critical paths
  - Automated test execution in CI/CD pipeline

**US-033: Smoke Testing**
- As a QA engineer, I want smoke tests for critical functionality, so that I can quickly verify the application is working after deployment.
- Priority: MUST HAVE
- Acceptance Criteria:
  - Test landing page loads successfully
  - Test login functionality works
  - Test marketplace page displays books
  - Test cart operations work
  - Test payment flow initiates correctly
  - Test reviewer dashboard accessible
  - Quick execution time (< 5 minutes)
  - Clear pass/fail results
  - Automated smoke tests in deployment pipeline

---

## SHOULD HAVE (Important Enhancements)

**US-034: Book Search & Filters**
- As a buyer, I want to search and filter books, so that I can find specific textbooks quickly.
- Priority: SHOULD HAVE
- Acceptance Criteria:
  - Search by title, author, or ISBN
  - Filter by condition, price range, course
  - Sort by price, date, or relevance
  - Real-time search suggestions



**US-035: Email Notifications**
- As a user, I want to receive email notifications, so that I stay informed about my orders.
- Priority: SHOULD HAVE
- Acceptance Criteria:
  - Order confirmation email
  - Shipping/delivery updates
  - Review approval/rejection notification
  - Password reset emails

---

## COULD HAVE (Nice-to-have Features)

**US-036: Wishlist**
- As a buyer, I want to save books to a wishlist, so that I can purchase them later.
- Priority: COULD HAVE

**US-037: Book Recommendations**
- As a buyer, I want to see recommended books based on my interests, so that I can discover new textbooks.
- Priority: COULD HAVE

**US-038: Multiple Language Support**
- As a user, I want to switch between Arabic and English, so that I can use my preferred language.
- Priority: COULD HAVE

---

## WON'T HAVE (Out of Scope for MVP)

- Live chat between buyer and seller
- Advanced recommendation engine with machine learning
- Integration with university course registration systems
- Mobile native applications (iOS/Android)
- Cryptocurrency payment options
- International shipping

---

## User Story Summary by Feature Area

| Feature Area | User Stories | Priority |
|--------------|--------------|----------|
| Landing Page | US-001, US-002 | MUST HAVE |
| Authentication | US-003, US-004, US-005, US-006 | MUST HAVE |
| User Profile | US-007, US-008 | MUST HAVE |
| Book Listing & Availability | US-009, US-010, US-011, US-012 | MUST HAVE |
| Shopping Cart | US-013, US-014, US-015 | MUST HAVE |
| Payment (Moyasar) | US-016, US-017 | MUST HAVE |
| Thank You Page | US-018 | MUST HAVE |
| Reviewer Page | US-019, US-020, US-021, US-022, US-023, US-024, US-025 | MUST HAVE |
| UX/UI Design | US-026, US-027, US-028, US-029 | MUST HAVE |
| Error Pages | US-030, US-031 | MUST HAVE |
| Testing | US-032, US-033 | MUST HAVE |
| Enhancements | US-034, US-035 | SHOULD HAVE |
| Nice-to-have | US-036, US-037, US-038 | COULD HAVE |
