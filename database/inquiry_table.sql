-- ============================================================
--  Run in your MySQL database: realist_electro
--  mysql -u root -p realist_electro < backend/inquiry_table.sql
-- ============================================================

USE realist_electro;

CREATE TABLE inquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    company_name VARCHAR(255),
    message TEXT NOT NULL,
    ip_address VARCHAR(45),
    is_read TINYINT(1) DEFAULT 0,
    is_starred TINYINT(1) DEFAULT 0,
    deleted_at DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

SELECT 'inquiries table ready.' AS STATUS;