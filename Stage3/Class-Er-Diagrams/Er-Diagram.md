```mermaid
erDiagram
    users {
        UUID user_id PK
        String email UK
        String password
        String first_name
        String last_name
        String phone_number
        String profile_picture
        Float average_rating
        Boolean is_admin
        DateTime created_at
        DateTime updated_at
    }

    books {
        UUID book_id PK
        String title
        String author
        String isbn
        String course_code
        String description
        Enum condition
        Float price
        UUID seller_id FK
        UUID bookstore_id FK
        Boolean is_sold
        Boolean is_available
        DateTime created_at
        DateTime updated_at
    }

    book_photos {
        UUID photo_id PK
        UUID book_id FK
        String photo_url
        DateTime created_at
    }

    orders {
        UUID order_id PK
        UUID book_id FK
        UUID buyer_id FK
        UUID seller_id FK
        UUID bookstore_id FK
        Float price
        Float platform_fee
        Float seller_earnings
        Enum payment_status
        Enum order_status
        DateTime created_at
        DateTime updated_at
    }

    bookstores {
        UUID bookstore_id PK
        String name
        String location
        String university
        String contact_number
        String operating_hours
        Float fee
        Boolean is_active
        DateTime created_at
        DateTime updated_at
    }

    wishlists {
        UUID wishlist_id PK
        UUID user_id FK
        UUID book_id FK
        DateTime created_at
    }

    users ||--o{ books : "lists"
    users ||--o{ orders : "buys"
    users ||--o{ orders : "sells"
    users ||--o{ wishlists : "has"
    books ||--o{ wishlists : "in"
    books ||--o| orders : "sold via"
    books ||--o{ book_photos : "has"
    books }o--|| bookstores : "held at"
    orders }o--|| bookstores : "handled by"
    ```
