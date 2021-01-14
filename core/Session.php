<?php
class Session
{
    /**
     * @var bool 何らかの理由で2回以上Sessionクラスが生成された場合、複数回session_start()が呼ばれないようにチェックするための静的プロパティ
     */
    protected static $sessionStarted = false;

    /**
     * @var bool セッション固定攻撃対策用。複数回呼ばれないようチェックするための静的プロパティ。
     */
    protected static $sessionIdRegenerated = false;

    public function __costruct()
    {
        if (!self::$sessionStarted) {
            session_start();

            self::$sessionStarted = true;
        }
    }

    public function set($name, $value)
    {
        $_SESSION[$name] = $value;
    }

    public function get($name, $default = null)
    {
        if (isset($_SESSION[$name])) {
            return $_SESSION[$name];
        }
        return $default;
    }

    public function remove($name)
    {
        if(isset($_SESSION[$name])){
            unset($_SESSION[$name]);
        }
    }

    public function clear()
    {
        $_SESSION = [];
    }

    /**
     * セッションIDを新規発行する（一度も実行されてい場合）。
     *
     * @param bool $destroy 関連付けられた古いセッションを削除するかどうか。デフォルト値trueに設定。
     */
    public function regenerate(bool $destroy = true): void
    {
        if (!self::$sessionIdRegenerated) {
            session_regenerate_id($destroy);
            self::$sessionIdRegenerated = true;
        }
    }

    /**
     * セッション内に_authenticatedキーでログイン状態を設定する。またログイン時にはセッションIDを新規発行する。
     *
     * @param bool $bool ログインに設定するならtrue、ログアウトするならfalse
     */
    public function setAuthenticated(bool $bool): void
    {
        $this->set('_authenticated', (bool) $bool);

        $this->regenerate();
    }

    /**
     * セッション内に_authenticatedキーでログイン状態を判別する。
     *
     * @return bool ログイン済みならtrue、未ログインならfalseを返す
     */
    public function isAuthenticated(): bool
    {
        return $this->get('_authenticated', false);
    }
}
