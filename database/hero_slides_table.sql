-- ============================================================
--  Run this in your MySQL database: realist_electro
--  mysql -u root -p realist_electro < hero_slides_table.sql
-- ============================================================

USE realist_electro;

CREATE TABLE IF NOT EXISTS hero_slides (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  image_filename   VARCHAR(255)   NOT NULL,           -- stored filename on disk
  title            VARCHAR(255)   NOT NULL,           -- slide heading
  subject          VARCHAR(500)   NULL,               -- slide sub-text
  sort_order       INT            DEFAULT 0,          -- display order
  is_active        TINYINT(1)     DEFAULT 1,
  created_at       DATETIME       DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

SELECT 'hero_slides table ready.' AS STATUS;
