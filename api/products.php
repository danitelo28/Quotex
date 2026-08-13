<?php
/**
 * Public products API — consumed by the React website.
 *
 *   GET  /api/products.php         list all products
 *   GET  /api/products.php?code=X  single product by code
 *
 * The React app maps each item to a trading asset. Products with
 * enabled = 0 are kept in the DB (manageable from the admin panel)
 * but the website hides them.
 */
declare(strict_types=1);

require_once __DIR__ . '/config.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
    send_error('Method not allowed', 405);
}

try {
    $pdo = db();

    if (isset($_GET['code']) && $_GET['code'] !== '') {
        $stmt = $pdo->prepare('SELECT * FROM products WHERE code = :code LIMIT 1');
        $stmt->execute(['code' => $_GET['code']]);
        $row = $stmt->fetch();
        if ($row === false) {
            send_error('Product not found', 404);
        }
        send_json(['ok' => true, 'products' => [row_to_asset($row)]]);
    }

    $rows = $pdo->query('SELECT * FROM products ORDER BY id ASC')->fetchAll();
    send_json(['ok' => true, 'products' => array_map('row_to_asset', $rows)]);
} catch (Throwable $e) {
    error_log('products.php: ' . $e->getMessage());
    send_error('Server error', 500);
}
