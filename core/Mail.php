<?php
    // PHPMailer のクラスをグローバル名前空間（global namespace）にインポート
    // スクリプトの先頭で宣言する必要があります
    use PHPMailer\PHPMailer\Exception;
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\SMTP;

  class Mail
  {
      /**
       * PHPMailerでメールを送信
       *
       * @param string $body メール本文
       * @param string $subject メール件名
       *
       * @return bool メール送信成功true、失敗false
       */
      public function sendMail(string $subject, string $body): bool
      {
          // Composer のオートローダーの読み込み（ファイルの位置によりパスを適宜変更）
          require __DIR__ . '/../vendor/autoload.php';
          //エラーメッセージ用日本語言語ファイルを読み込む場合（25行目の指定も必要）
          require __DIR__ . '/../vendor/phpmailer/phpmailer/language/phpmailer.lang-ja.php';

          $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
          $dotenv->load();

          //言語、内部エンコーディングを指定
          mb_language('japanese');
          mb_internal_encoding('UTF-8');

          // インスタンスを生成（引数に true を指定して例外 Exception を有効に）
          $mail = new PHPMailer(true);

          //日本語用設定
          $mail->CharSet = 'iso-2022-jp';
          $mail->Encoding = '7bit';

          //エラーメッセージ用言語ファイルを使用する場合に指定
          $mail->setLanguage('ja', 'vendor/phpmailer/phpmailer/language/');

          try {
              //サーバの設定
              $mail->SMTPDebug = $_ENV['SMTP_DEBUG'];  // デバグの出力を有効に（テスト環境での検証用）
              $mail->isSMTP();   // SMTP を使用
              $mail->Host = $_ENV['SMTP_HOST'];  // SMTP サーバーを指定
              $mail->SMTPAuth = $_ENV['SMTP_AUTH'];   // SMTP authentication を有効に
              $mail->Username = $_ENV['MAIL_USER'];  // SMTP ユーザ名
              $mail->Password = $_ENV['MAIL_PASS'];  // SMTP パスワード
              $mail->SMTPSecure = $_ENV['SMTP_SECURE'];  // 暗号化を有効に
              $mail->Port = $_ENV['MAIL_PORT'];  // TCP ポートを指定

              //受信者設定
              //※名前などに日本語を使う場合は文字エンコーディングを変換
              //差出人アドレス, 差出人名
              $mail->setFrom($_ENV['FROM_ADDRESS']);
              //受信者アドレス, 受信者名（受信者名はオプション）
              $mail->addAddress($_ENV['SEND_ADDRESS']);

              //コンテンツ
              $mail->Subject = mb_encode_mimeheader($subject);
              $mail->Body = mb_convert_encoding($body, 'JIS', 'UTF-8');

              $mail->send();  //送信
              return true;
          } catch (Exception $e) {
              //エラー（例外：Exception）が発生した場合
              // echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
              return false;
          }
      }
  }
