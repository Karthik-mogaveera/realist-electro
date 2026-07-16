-- ============================================================
--  Run in your MySQL database: realist_electro
--  mysql -u root -p realist_electro < backend/who_we_are_table.sql
-- ============================================================

USE realist_electro;

CREATE TABLE IF NOT EXISTS who_we_are (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  content    LONGTEXT      NOT NULL,          -- the full "Who We Are" write-up
  created_at DATETIME      DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Only one row is ever used; a unique constraint on a constant prevents duplicates
-- (enforced in the API layer too for clarity)

SELECT 'who_we_are table ready.' AS STATUS;