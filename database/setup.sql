-- ============================================================
--  RECPL Admin Panel — Database Setup
--  Run once: mysql -u root -p realist_electro < setup.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS realist_electro CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE realist_electro;

-- ── Admin Users ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_users (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  name           VARCHAR(120)        NOT NULL,
  email          VARCHAR(255) UNIQUE NOT NULL,
  password_hash  VARCHAR(255)        NOT NULL,
  role           ENUM('superadmin','admin','editor') DEFAULT 'admin',
  is_active      TINYINT(1)          DEFAULT 1,
  failed_attempts INT                DEFAULT 0,
  last_login     DATETIME            NULL,
  last_logout    DATETIME            NULL,
  created_at     DATETIME            DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME            DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- ── Seed: Default Super Admin ─────────────────────────────────
-- Password: Admin@1234  (bcrypt hash — CHANGE IMMEDIATELY AFTER FIRST LOGIN)
INSERT IGNORE INTO admin_users (name, email, password_hash, role)
VALUES (
  'RECPL Admin',
  'admin@recpl.com',
  '$2b$12$te9JyhZj0ZzEyYhdatVkuOf5FYxvY43zpTvoqjYIZCDrHWcaBTrjq',
  'superadmin'
);

SELECT 'Setup complete. Login: admin@recpl.com / Admin@1234' AS STATUS;
