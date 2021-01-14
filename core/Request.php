<?php
  class Request
  {
      /**
       * HTTPメソッド=POSTをチェック。
       *
       * @return bool
       */
      public function isPost(): bool
      {
          if ($_SERVER['REQUEST_METHOD'] === 'POST') {
              return true;
          }
          return false;
      }

      public function getGet(string $name, $default = null)
      {
          if (isset($_GET[$name])) {
              return $_GET[$name];
          }

          return $default;
      }

      /**
       * フォームから送信された値を取得する。
       *
       * @param string $name フォームのname属性
       * @param null $default $nameの入力値が無かった場合に返す値
       *
       * @return mixed 入力値があればその値を、無ければ$default値を返す
       */
      public function getPost(string $name, $default = null)
      {
          if (isset($_POST[$name])) {
              return $_POST[$name];
          }
          return $default;
      }

      public function getHost()
      {
          if (!empty($_SERVER['HTTP_HOST'])) {
              return $_SERVER['HTTP_HOST'];
          }
          return $_SERVER['SERVER_NAME'];
      }

      public function isSsl()
      {
          if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') {
              return true;
          }
          return false;
      }

      public function getRequestUri()
      {
          return $_SERVER['REQUEST_URI'];
      }

      /**
       * ベースurl(ホスト部分から後ろ 〜 フロントコントローラーまで)を取得する。
       *
       * 例：リクエストurl="https://example.com/index.php/account/signup"（フロントコントローラー指定あり）
       * ベースurl:"/index.php"
       * 例：リクエストurl="https://example.com/account/signup"（フロントコントローラー指定なしだが、フロントコントローラはhost直後にindex.phpとして.htaccessにて指定している）
       * ベースurl:""
       *
       * @return string ベースurl
       */
      public function getBaseUrl(): string
      {
          $sctipt_name = $_SERVER['SCRIPT_NAME'];
          $request_uri = $this->getRequestUri();

          if (strpos($request_uri, $sctipt_name) === 0) { //フロントコントローラーの指定ありの場合
              return $sctipt_name;
          } elseif (strpos($request_uri, dirname($sctipt_name)) === 0) { //指定なしの場合
              return rtrim(dirname($sctipt_name), '/');
          }

          return '';
      }

      /**
       * PATS_INFO(ベースurlよりも後ろの値。GETパラメータを除く)を取得する。
       *
       * 例：リクエストurl="https://example.com/index.php/account/signup"（フロントコントローラー指定あり）
       * ベースurl:"/index.php"
       * PATH_INFO："/account/signup"
       * 例：リクエストurl="https://example.com/account/signup"（フロントコントローラー指定なしだが、フロントコントローラはhost直後にindex.phpとして.htaccessにて指定している）
       * ベースurl:""
       * PATH_INFO："/account/signup"
       *
       * @return string PATH_INFO
       */
      public function getPathInfo(): string
      {
          $base_url = $this->getBaseUrl();
          $request_uri = $this->getRequestUri();

          if (false !== ($pos = strpos($request_uri, '?'))) {
              $request_uri = substr($request_uri, 0, $pos);
          }

          $path_info = (string) substr($request_uri, strlen($base_url));
          return $path_info;
      }
  }
