<?php 
/**
 * 
 */
class Util
{
  /**
     * CSRF対策：１つのトークンを生成→セッションに格納→そのトークンを返す。
     *
     * @param string $form_name フォーム名（通常'コントローラ名/アクション名'）
     * @param Session $session Sessionクラスのインスタンス
     *
     * @return string 生成したトークン
     */
    public function generateCsrfToken(string $form_name, Session $session): string
    {
        $key = 'csrf_tokens/' . $form_name;
        $tokens = $session->get($key, []);

        if (count($tokens) >= 10) {
            array_shift($tokens);
        }

        $token = sha1($form_name . session_id() . microtime());
        $tokens[] = $token;

        $session->set($key, $tokens);

        return $token;
    }

    /**
     * sessionのトークン中に、postされてきたトークンの有無を調べる。
     *
     * @param string $form_name フォーム名
     * @param string $token POSTされたトークン
     * @param Session $session Sessionクラスのインスタンス
     *
     * @return bool トークンが正しければtrue、不正であればfalse
     */
    public function checkCsrfToken(string $form_name, string $token = null, Session $session): bool
    {
        $key = 'csrf_tokens/' . $form_name;
        $tokens = $session->get($key, []);

        if (false !== ($pos = array_search($token, $tokens, true))) {
            unset($tokens[$pos]);
            $session->set($key, $tokens);

            return true;
        }

        return false;
    }

    public function escape($string)
    {
        return htmlspecialchars($string, ENT_QUOTES, 'UTF-8');
    }

    public function displayError(String $error)
    {
        return "<p class='error'>{$error}</p>";
    }

}


?>