-- Quotex trading platform database
-- Import this file in phpMyAdmin or run:
--   mysql -u root < sql/quotex.sql

CREATE DATABASE IF NOT EXISTS quotex CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE quotex;

-- ------------------------------------------------------------
-- Products (trading assets) managed from the admin panel
-- ------------------------------------------------------------
DROP TABLE IF EXISTS products;

CREATE TABLE products (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  code       VARCHAR(16)  NOT NULL,
  name       VARCHAR(64)  NOT NULL,
  base_price DECIMAL(18, 6) NOT NULL,
  decimals   TINYINT UNSIGNED NOT NULL DEFAULT 2,
  volatility DECIMAL(10, 4)  NOT NULL DEFAULT 0.02,
  seed       INT UNSIGNED NOT NULL DEFAULT 1,
  enabled    TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO products (code, name, base_price, decimals, volatility, seed, enabled) VALUES
('EURCHF',  'EUR/CHF (OTC)',  0.9735,   5, 0.012, 11, 1),
('GBPUSD',  'GBP/USD (OTC)',  1.2712,   5, 0.020, 12, 1),
('USDJPY',  'USD/JPY (OTC)',  147.82,   3, 0.020, 13, 1),
('EURUSD',  'EUR/USD (OTC)',  1.0843,   5, 0.018, 14, 1),
('AUDUSD',  'AUD/USD (OTC)',  0.6581,   5, 0.020, 15, 1),
('USDCAD',  'USD/CAD (OTC)',  1.3549,   5, 0.016, 16, 1),
('USDCHF',  'USD/CHF (OTC)',  0.8812,   5, 0.016, 17, 1),
('USDINR',  'USD/INR (OTC)',  83.12,    3, 0.012, 18, 1),
('XAUUSD',  'Gold',           2324.6,   2, 0.025, 19, 1),
('XAGUSD',  'Silver',         27.42,    3, 0.035, 20, 1),
('BTCUSD',  'Bitcoin',        64820,    2, 0.150, 21, 1),
('ETHUSD',  'Ethereum',       3420.5,   2, 0.160, 22, 1);

-- ------------------------------------------------------------
-- Admin users (login for the admin panel)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS admin_users;

CREATE TABLE admin_users (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  username   VARCHAR(64)  NOT NULL,
  password   VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Default login: admin / admin123  (change it after first login!)
INSERT INTO admin_users (username, password) VALUES
('admin', '$2y$10$Cz.NtsThV8Tac1l3doRmVuF1MT6hb..95Huq84j0RV7O5YgenLN3C');
