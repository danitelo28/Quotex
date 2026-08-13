<?php
/**
 * Shared config for the Quotex API.
 * Adjust credentials here if your XAMPP MySQL setup differs.
 */
declare(strict_types=1);

const DB_HOST = '127.0.0.1';
const DB_NAME = 'quotex';
const DB_USER = 'root';
const DB_PASS = '';
const DB_CHARSET = 'utf8mb4';

function db(): PDO
{
    static $pdo = null;
    if ($pdo === null) {
        $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=' . DB_CHARSET;
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
    }
    return $pdo;
}

function send_json($data, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function send_error(string $message, int $status = 400): void
{
    send_json(['ok' => false, 'error' => $message], $status);
}

/** Map a DB row to the asset shape the React app expects. */
function row_to_asset(array $row): array
{
    return [
        'id'        => (int) $row['id'],
        'code'      => $row['code'],
        'name'      => $row['name'],
        'basePrice' => (float) $row['base_price'],
        'decimals'  => (int) $row['decimals'],
        'volatility'=> (float) $row['volatility'],
        'seed'      => (int) $row['seed'],
        'enabled'   => (int) $row['enabled'],
    ];
}
