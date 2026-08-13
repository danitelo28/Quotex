<?php
declare(strict_types=1);

require_once __DIR__ . '/config.php';
require_login();

$pdo = db();

if (empty($_SESSION['csrf'])) {
    $_SESSION['csrf'] = bin2hex(random_bytes(32));
}
$csrf = $_SESSION['csrf'];

function valid_csrf(): bool
{
    return isset($_POST['csrf']) && hash_equals($_SESSION['csrf'], (string) $_POST['csrf']);
}

/** Validate submitted product data. Returns [error, clean] or [null, clean]. */
function validate_product(array $in): array
{
    $code = strtoupper(trim((string) ($in['code'] ?? '')));
    $name = trim((string) ($in['name'] ?? ''));
    $basePrice = (string) ($in['base_price'] ?? '');
    $decimals = (int) ($in['decimals'] ?? 2);
    $volatility = (string) ($in['volatility'] ?? '0.02');
    $seed = (int) ($in['seed'] ?? 1);
    $enabled = isset($in['enabled']) ? 1 : 0;

    if ($code === '' || !preg_match('/^[A-Z0-9]{1,12}$/', $code)) {
        return ['Code must be 1-12 uppercase letters/digits (e.g. EURUSD).', null];
    }
    if ($name === '') {
        return ['Name is required.', null];
    }
    if (!is_numeric($basePrice) || (float) $basePrice <= 0) {
        return ['Base price must be a positive number.', null];
    }
    $decimals = max(0, min(8, $decimals));
    if (!is_numeric($volatility) || (float) $volatility < 0) {
        return ['Volatility must be a non-negative number (%).', null];
    }
    $seed = max(0, min(4294967295, $seed));

    return [null, [
        'code'       => $code,
        'name'       => $name,
        'base_price' => number_format((float) $basePrice, 6, '.', ''),
        'decimals'   => $decimals,
        'volatility' => number_format((float) $volatility, 4, '.', ''),
        'seed'       => $seed,
        'enabled'    => $enabled,
    ]];
}

$search = trim((string) ($_GET['q'] ?? ''));

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!valid_csrf()) {
        flash('Invalid form token, please try again.', 'error');
        header('Location: index.php');
        exit;
    }

    $action = (string) ($_POST['action'] ?? '');

    try {
        if ($action === 'create') {
            [$err, $data] = validate_product($_POST);
            if ($err) {
                flash($err, 'error');
            } else {
                $stmt = $pdo->prepare(
                    'INSERT INTO products (code, name, base_price, decimals, volatility, seed, enabled)
                     VALUES (:code, :name, :base_price, :decimals, :volatility, :seed, :enabled)'
                );
                $stmt->execute($data);
                flash('Product "' . $data['code'] . '" added. It now appears on the website.');
            }

        } elseif ($action === 'update') {
            $id = (int) ($_POST['id'] ?? 0);
            [$err, $data] = validate_product($_POST);
            if ($err) {
                flash($err, 'error');
            } else {
                $stmt = $pdo->prepare(
                    'UPDATE products
                     SET code = :code, name = :name, base_price = :base_price, decimals = :decimals,
                         volatility = :volatility, seed = :seed, enabled = :enabled
                     WHERE id = :id'
                );
                $stmt->execute($data + ['id' => $id]);
                flash('Product "' . $data['code'] . '" updated.');
            }

        } elseif ($action === 'toggle') {
            $id = (int) ($_POST['id'] ?? 0);
            $pdo->prepare('UPDATE products SET enabled = 1 - enabled WHERE id = :id')->execute(['id' => $id]);
            flash('Product visibility toggled.');

        } elseif ($action === 'delete') {
            $id = (int) ($_POST['id'] ?? 0);
            $pdo->prepare('DELETE FROM products WHERE id = :id')->execute(['id' => $id]);
            flash('Product deleted.');
        }
    } catch (PDOException $e) {
        if ($e->getCode() === '23000') {
            flash('That code already exists. Choose a unique code.', 'error');
        } else {
            error_log('admin product: ' . $e->getMessage());
            flash('Database error, please try again.', 'error');
        }
    }

    header('Location: index.php' . ($search !== '' ? '?q=' . urlencode($search) : ''));
    exit;
}

$editing = null;
$isNew = false;
if (isset($_GET['new'])) {
    $isNew = true;
} elseif (isset($_GET['edit'])) {
    $stmt = $pdo->prepare('SELECT * FROM products WHERE id = :id LIMIT 1');
    $stmt->execute(['id' => (int) $_GET['edit']]);
    $editing = $stmt->fetch() ?: null;
}

if ($search !== '') {
    $stmt = $pdo->prepare(
        'SELECT * FROM products
         WHERE code LIKE :q OR name LIKE :q
         ORDER BY id ASC'
    );
    $stmt->execute(['q' => '%' . $search . '%']);
} else {
    $stmt = $pdo->query('SELECT * FROM products ORDER BY id ASC');
}
$products = $stmt->fetchAll();

$activeCount = count(array_filter($products, fn($p) => (int) $p['enabled'] === 1));
$formProduct = $editing;
$formAction = $editing ? 'update' : 'create';
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Admin Dashboard | Quotex</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Roboto', Arial, sans-serif;
      background: #0b0e14; color: #e6edf5; min-height: 100vh;
    }
    a { color: #4da3ff; text-decoration: none; }
    a:hover { text-decoration: underline; }

    .topbar {
      display: flex; align-items: center; justify-content: space-between;
      background: #10161f; border-bottom: 1px solid #1e2a3a; padding: 0 26px; height: 62px;
      position: sticky; top: 0; z-index: 20;
    }
    .brand { display: flex; align-items: center; gap: 12px; }
    .brand-mark {
      width: 36px; height: 36px; border-radius: 10px; background: #0073e6;
      display: flex; align-items: center; justify-content: center; font-weight: 900; color: #fff;
    }
    .brand b { font-size: 16px; }
    .brand small { display: block; color: #7b8b9a; font-size: 11px; font-weight: 400; }
    .top-actions { display: flex; align-items: center; gap: 14px; }
    .user { font-size: 12px; color: #9fb2c8; }
    .btn-logout {
      background: transparent; border: 1px solid #2a3648; color: #9fb2c8;
      padding: 7px 14px; border-radius: 8px; font-size: 12px; cursor: pointer;
    }
    .btn-logout:hover { color: #fff; border-color: #3a4a63; }

    .wrap { max-width: 1080px; margin: 0 auto; padding: 30px 26px 60px; }
    h1 { font-size: 22px; font-weight: 800; }
    .stats { display: flex; gap: 14px; margin: 18px 0 26px; }
    .stat {
      background: #10161f; border: 1px solid #1e2a3a; border-radius: 12px;
      padding: 14px 20px; flex: 1; max-width: 200px;
    }
    .stat .n { font-size: 24px; font-weight: 900; }
    .stat .l { font-size: 11px; color: #7b8b9a; margin-top: 2px; letter-spacing: .05em; }
    .stat.green .n { color: #00c974; }
    .stat.gray .n { color: #c9d6e5; }

    .toolbar { display: flex; align-items: center; justify-content: space-between; gap: 14px; margin-bottom: 16px; flex-wrap: wrap; }
    .toolbar form.search { display: flex; gap: 8px; flex: 1; min-width: 240px; max-width: 420px; }
    input[type="text"], input[type="number"], input[type="search"], select {
      background: #0b0e14; border: 1px solid #1e2a3a; color: #fff;
      padding: 9px 12px; border-radius: 8px; font-size: 13px; outline: none; width: 100%;
    }
    input:focus, select:focus { border-color: #0073e6; }
    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 6px;
      padding: 9px 16px; border: 0; border-radius: 8px; font-size: 13px; font-weight: 700;
      cursor: pointer; white-space: nowrap; transition: filter .15s; text-decoration: none;
    }
    .btn:hover { filter: brightness(1.1); text-decoration: none; }
    .btn-primary { background: #0073e6; color: #fff; }
    .btn-success { background: #00c974; color: #06281a; }
    .btn-ghost { background: #141b28; color: #c9d6e5; border: 1px solid #1e2a3a; }
    .btn-danger { background: #f24949; color: #fff; }
    .btn-sm { padding: 6px 11px; font-size: 12px; }

    .card { background: #10161f; border: 1px solid #1e2a3a; border-radius: 14px; overflow: hidden; }
    .flash { padding: 12px 18px; border-radius: 10px; margin-bottom: 18px; font-size: 13px; }
    .flash.success { background: rgba(0,201,116,.1); border: 1px solid rgba(0,201,116,.35); color: #6fe6b0; }
    .flash.error { background: rgba(242,73,73,.1); border: 1px solid rgba(242,73,73,.35); color: #ff9a9a; }

    table { width: 100%; border-collapse: collapse; }
    th {
      text-align: left; font-size: 11px; color: #7b8b9a; letter-spacing: .08em;
      padding: 12px 16px; border-bottom: 1px solid #1e2a3a; background: #0d1320;
    }
    td { padding: 12px 16px; border-bottom: 1px solid #161d2b; font-size: 13px; vertical-align: middle; }
    tr:last-child td { border-bottom: 0; }
    tr:hover td { background: rgba(0,115,230,.04); }
    .code { font-weight: 800; color: #fff; }
    .sub { font-size: 11px; color: #7b8b9a; margin-top: 2px; }
    .pill { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 999px; }
    .pill.on { background: rgba(0,201,116,.12); color: #00c974; border: 1px solid rgba(0,201,116,.3); }
    .pill.off { background: rgba(127,143,161,.1); color: #7f8fa1; border: 1px solid rgba(127,143,161,.25); }
    .row-actions { display: flex; gap: 6px; justify-content: flex-end; }
    .empty { text-align: center; padding: 48px 20px; color: #7b8b9a; font-size: 13px; }

    .panel-title { font-size: 15px; font-weight: 800; padding: 18px 20px 0; margin-bottom: 14px; }
    .form { padding: 0 20px 22px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; align-items: end; }
    .form .full { grid-column: 1 / -1; }
    .form label { display: block; font-size: 11px; font-weight: 700; color: #7b8b9a; margin-bottom: 6px; letter-spacing: .05em; }
    .form .chk { display: flex; align-items: center; gap: 8px; padding-bottom: 11px; }
    .form .chk input { width: auto; }
    .form .chk label { margin: 0; }
    .form-buttons { display: flex; gap: 8px; }
    .inline-form { display: inline; }
    @media (max-width: 800px) { .form { grid-template-columns: 1fr 1fr; } }
  </style>
</head>
<body>
  <header class="topbar">
    <div class="brand">
      <div class="brand-mark">Q</div>
      <div>
        <b>Quotex Admin</b>
        <small>Product management panel</small>
      </div>
    </div>
    <div class="top-actions">
      <span class="user">Signed in as <b><?= h($_SESSION['admin_username']) ?></b></span>
      <a class="btn-logout" href="logout.php">Logout</a>
    </div>
  </header>

  <div class="wrap">
    <h1>Products</h1>

    <div class="stats">
      <div class="stat gray"><div class="n"><?= count($products) ?></div><div class="l">TOTAL PRODUCTS</div></div>
      <div class="stat green"><div class="n"><?= $activeCount ?></div><div class="l">LIVE ON WEBSITE</div></div>
      <div class="stat gray"><div class="n"><?= count($products) - $activeCount ?></div><div class="l">HIDDEN</div></div>
    </div>

    <?php if ($flash = flash()): ?>
      <div class="flash <?= h($flash['type']) ?>"><?= h($flash['message']) ?></div>
    <?php endif; ?>

    <?php if ($isNew || $editing): ?>
      <div class="card" style="margin-bottom: 22px;">
        <div class="panel-title"><?= $editing ? 'Edit product' : 'Add new product' ?></div>
        <form class="form" method="post" action="index.php">
          <input type="hidden" name="csrf" value="<?= h($csrf) ?>" />
          <input type="hidden" name="action" value="<?= $formAction ?>" />
          <?php if ($editing): ?>
            <input type="hidden" name="id" value="<?= (int) $editing['id'] ?>" />
          <?php endif; ?>

          <div>
            <label for="code">CODE</label>
            <input id="code" name="code" maxlength="12" value="<?= h($formProduct['code'] ?? '') ?>" placeholder="EURUSD" required />
          </div>
          <div>
            <label for="name">NAME</label>
            <input id="name" name="name" value="<?= h($formProduct['name'] ?? '') ?>" placeholder="EUR/USD (OTC)" required />
          </div>
          <div>
            <label for="base_price">BASE PRICE</label>
            <input id="base_price" name="base_price" type="number" step="any" min="0.000001" value="<?= h($formProduct['base_price'] ?? '') ?>" required />
          </div>
          <div>
            <label for="decimals">DECIMALS</label>
            <input id="decimals" name="decimals" type="number" min="0" max="8" value="<?= h($formProduct['decimals'] ?? '2') ?>" required />
          </div>
          <div>
            <label for="volatility">VOLATILITY (%)</label>
            <input id="volatility" name="volatility" type="number" step="any" min="0" value="<?= h($formProduct['volatility'] ?? '0.02') ?>" required />
          </div>
          <div>
            <label for="seed">SEED</label>
            <input id="seed" name="seed" type="number" min="0" value="<?= h($formProduct['seed'] ?? '1') ?>" required />
          </div>
          <div class="chk">
            <input id="enabled" name="enabled" type="checkbox" value="1" <?= (!isset($formProduct['enabled']) || (int) $formProduct['enabled'] === 1) ? 'checked' : '' ?> />
            <label for="enabled">Visible on website</label>
          </div>
          <div class="form-buttons">
            <button class="btn btn-success" type="submit"><?= $editing ? 'Save changes' : 'Add product' ?></button>
            <a class="btn btn-ghost" href="index.php<?= $search !== '' ? '?q=' . urlencode($search) : '' ?>">Cancel</a>
          </div>
        </form>
      </div>
    <?php endif; ?>

    <div class="toolbar">
      <form class="search" method="get" action="index.php">
        <input type="search" name="q" placeholder="Search by code or name…" value="<?= h($search) ?>" />
        <button class="btn btn-ghost" type="submit">Search</button>
      </form>
      <a class="btn btn-primary" href="index.php?new=1">+ Add product</a>
    </div>

    <div class="card">
      <table>
        <thead>
          <tr>
            <th>PRODUCT</th>
            <th>BASE PRICE</th>
            <th>DEC.</th>
            <th>VOLATILITY</th>
            <th>STATUS</th>
            <th style="text-align:right">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          <?php if (!$products): ?>
            <tr><td colspan="6" class="empty">No products found.</td></tr>
          <?php else: foreach ($products as $p): ?>
            <tr>
              <td>
                <div class="code"><?= h($p['code']) ?></div>
                <div class="sub"><?= h($p['name']) ?></div>
              </td>
              <td class="tabular-nums"><?= number_format((float) $p['base_price'], 4) ?></td>
              <td><?= (int) $p['decimals'] ?></td>
              <td><?= number_format((float) $p['volatility'], 3) ?>%</td>
              <td>
                <span class="pill <?= (int) $p['enabled'] === 1 ? 'on' : 'off' ?>">
                  <span style="width:6px;height:6px;border-radius:50%;background:currentColor"></span>
                  <?= (int) $p['enabled'] === 1 ? 'LIVE' : 'HIDDEN' ?>
                </span>
              </td>
              <td>
                <div class="row-actions">
                  <form class="inline-form" method="post" action="index.php">
                    <input type="hidden" name="csrf" value="<?= h($csrf) ?>" />
                    <input type="hidden" name="action" value="toggle" />
                    <input type="hidden" name="id" value="<?= (int) $p['id'] ?>" />
                    <button class="btn btn-ghost btn-sm" type="submit" title="Show/hide on website">
                      <?= (int) $p['enabled'] === 1 ? 'Hide' : 'Show' ?>
                    </button>
                  </form>
                  <a class="btn btn-ghost btn-sm" href="index.php?edit=<?= (int) $p['id'] ?>">Edit</a>
                  <form class="inline-form" method="post" action="index.php"
                        onsubmit="return confirm('Delete <?= h($p['code']) ?>? This cannot be undone.');">
                    <input type="hidden" name="csrf" value="<?= h($csrf) ?>" />
                    <input type="hidden" name="action" value="delete" />
                    <input type="hidden" name="id" value="<?= (int) $p['id'] ?>" />
                    <button class="btn btn-danger btn-sm" type="submit">Delete</button>
                  </form>
                </div>
              </td>
            </tr>
          <?php endforeach; endif; ?>
        </tbody>
      </table>
    </div>

    <p style="margin-top:22px;font-size:12px;color:#55637a">
      Changes are saved to the MySQL database and appear on the website after a page refresh.
    </p>
  </div>
</body>
</html>
