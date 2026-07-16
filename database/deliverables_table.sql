  -- ============================================================
  --  Run in your MySQL database: realist_electro
  --  mysql -u root -p realist_electro < backend/deliverables_table.sql
  -- ============================================================

  USE realist_electro;

  CREATE TABLE IF NOT EXISTS deliverables (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    content    LONGTEXT      NOT NULL,   -- bullet-point lines stored as plain text
    created_at DATETIME      DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );

  SELECT 'deliverables table ready.' AS STATUS;