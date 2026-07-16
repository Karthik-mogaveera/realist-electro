-- ============================================================
--  Run in your MySQL database: realist_electro
--  mysql -u root -p realist_electro < backend/supply_vendors_table.sql
-- ============================================================

USE realist_electro;

CREATE TABLE IF NOT EXISTS supply_vendors (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  image_filename   VARCHAR(255)   NOT NULL,
  name             VARCHAR(255)   NOT NULL,
  sort_order       INT            DEFAULT 0,
  is_active        TINYINT(1)     DEFAULT 1,
  created_at       DATETIME       DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

SELECT 'supply_vendors table ready.' AS STATUS;