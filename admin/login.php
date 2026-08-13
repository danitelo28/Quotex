<?php
declare(strict_types=1);

require_once __DIR__ . '/config.php';

if (is_logged_in()) {
    header('Location: index.php');
    exit;
}

$error = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = (string) ($_POST['password'] ?? '');

    if ($username === '' || $password === '') {
        $error = 'Please enter both username and password.';
    } else {
        try {
            $stmt = db()->prepare('SELECT id, username, password FROM admin_users WHERE username = :username LIMIT 1');
            $stmt->execute(['username' => $username]);
            $user = $stmt->fetch();

            if ($user && password_verify($password, $user['password'])) {
                session_regenerate_id(true);
                $_SESSION['admin_id'] = (int) $user['id'];
                $_SESSION['admin_username'] = $user['username'];
                header('Location: index.php');
                exit;
            }
            $error = 'Invalid username or password.';
        } catch (Throwable $e) {
            error_log('admin login: ' . $e->getMessage());
            $error = 'Database error, please try again.';
        }
    }
}
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Admin Login | Quotex</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      min-height: 100vh;
      display: flex; align-items: center; justify-content: center;
      font-family: 'Roboto', Arial, sans-serif;
      background: radial-gradient(1200px 600px at 50% -10%, #132033 0%, #0b0e14 55%);
      color: #fff;
      padding: 20px;
    }
    .card {
      width: 100%; max-width: 380px;
      background: #10161f; border: 1px solid #1e2a3a; border-radius: 14px;
      padding: 34px 30px 30px;
      box-shadow: 0 20px 60px rgba(0,0,0,.5);
    }
    .logo { display: flex; align-items: center; gap: 10px; margin-bottom: 22px; }
    .logo-mark {
      width: 38px; height: 38px; border-radius: 10px;
      background: #0073e6; display: flex; align-items: center; justify-content: center;
      font-weight: 900; font-size: 18px; color: #fff;
    }
    .logo h1 { font-size: 17px; font-weight: 700; }
    .logo p { font-size: 11px; color: #7b8b9a; margin-top: 2px; }
    h2 { font-size: 15px; margin-bottom: 18px; color: #dfe7f0; }
    label { display: block; font-size: 11px; font-weight: 700; color: #7b8b9a; letter-spacing: .08em; margin: 14px 0 6px; }
    input {
      width: 100%; padding: 11px 13px; border-radius: 9px;
      background: #0b0e14; border: 1px solid #1e2a3a; color: #fff;
      font-size: 14px; outline: none; transition: border-color .15s;
    }
    input:focus { border-color: #0073e6; }
    button {
      width: 100%; margin-top: 22px; padding: 12px;
      border: 0; border-radius: 9px; background: #0073e6; color: #fff;
      font-size: 14px; font-weight: 800; cursor: pointer; transition: filter .15s;
    }
    button:hover { filter: brightness(1.1); }
    .error {
      margin-top: 16px; padding: 10px 12px; border-radius: 8px;
      background: rgba(242,73,73,.12); border: 1px solid rgba(242,73,73,.4);
      color: #ff7a7a; font-size: 12px;
    }
    .hint { margin-top: 20px; font-size: 11px; color: #55637a; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">
      <div class="logo-mark">Q</div>
      <div>
        <h1>Quotex Admin</h1>
        <p>Product management panel</p>
      </div>
    </div>
    <h2>Sign in to continue</h2>
    <form method="post" action="login.php" autocomplete="off">
      <label for="username">USERNAME</label>
      <input id="username" name="username" required autofocus />
      <label for="password">PASSWORD</label>
      <input id="password" name="password" type="password" required />
      <button type="submit">Login</button>
    </form>
    <?php if ($error): ?>
      <div class="error"><?= h($error) ?></div>
    <?php endif; ?>
    <div class="hint">Default login: <b>admin</b> / <b>admin123</b></div>
  </div>
</body>
</html>
