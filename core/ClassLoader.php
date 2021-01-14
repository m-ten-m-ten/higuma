<?php

  class ClassLoader
  {
      protected $dirs;

      /**
       * PHPにオートローダクラスを登録する
       */
      public function register()
      {
          spl_autoload_register([$this, 'loadClass']);
      }


      /**
       * クラスファイルを探すディレクトリを登録する。
       * 
       * @param string $dir クラスファイルのあるディレクトリ
       */
      public function registerDir(string $dir): void
      {
          $this->dirs[] = $dir;
      }

      /**
       * オートロードが実行された際にクラスファイルを読み込む。
       * 
       * @param string $class 
       */
      public function loadClass(string $class): void
      {
          foreach ($this->dirs as $dir) {
              $file = $dir . '/' . $class . '.php';

              if (is_readable($file)) {
                  require $file;

                  return;
              }
          }
      }
  }
