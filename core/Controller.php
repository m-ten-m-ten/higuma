<?php
/**
 * アプリケーションごとに子クラスを作成し、その中にアクションを定義する。
 */
abstract class Controller
{
    protected $controller_name;
    protected $action_name;
    protected $auth_actions = [];
    protected $application;
    protected $request;
    protected $response;
    protected $session;
    protected $db_manager;

    /**
     * RequestやResponseクラスなどはApplicationクラスが持っているので、これらを取得。
     *
     * @param Application $application
     */
    public function __construct(Application $application)
    {
        $this->controller_name = strtolower(substr(get_class($this), 0, -10));

        $this->application = $application;
        $this->request = $application->getRequest();
        $this->response = $application->getResponse();
        $this->session = $application->getSession();
        $this->db_manager = $application->getDbManager();
    }

    /**
     * Applicationクラスから呼び出され、実際にアクションの実行を行う。
     *
     * @param string $action アクション名
     * @param array $params アクションに渡すルーティングパラメータ
     *
     * @return [type]
     */
    public function run(string $action, array $params = [])
    {
        $this->action_name = $action;

        $action_method = $action . 'Action';

        if (!method_exists($this, $action_method)) {
            $this->forward404();
        }

        if ($this->needsAuthentication($action) && !$this->session->isAuthenticated()) {
            throw new UnauthorizedActionException();
        }

        $content = $this->{$action_method}($params);
        return $content;
    }

    /**
     * アクションのログイン必要有無をチェックする。
     *
     * @param string $action
     *
     * @return bool ログインが必要ならtrue、不要ならfalseを返す
     */
    protected function needsAuthentication(string $action): bool
    {
        if ($this->auth_actions === true || (is_array($this->auth_actions) && in_array($action, $this->auth_actions))) {
            return true;
        }

        return false;
    }

    /**
     * View::render()のラッピング関数
     *
     * @param array $variables ビューファイルに渡す変数
     * @param null $template ビューファイルを指定([controller名]/[action名←ここの部分])。nullなら[action名].phpが設定される。
     * @param string $layout レイアウトファイルを指定。デフォルトはビューファイルフォルダ内のlayout.php。
     *
     * @return string View::render()の戻り値$content。レンダリングするコンテンツ。
     */
    protected function render(array $variables = [], $template = null, $layout = 'layout'): string
    {
        $defaults = [
            'request' => $this->request,
            'base_url' => $this->request->getBaseUrl(),
            'session' => $this->session,
        ];

        $view = new View($this->application->getViewDir(), $defaults);

        if (is_null($template)) {
            $template = $this->action_name;
        }

        $path = $this->controller_name . '/' . $template;

        return $view->render($path, $variables, $layout);
    }

    protected function forward404()
    {
        throw new HttpNotFoundException('Forwarded 404 page from ' . $this->controller_name . '/' . $this->action_name);
    }

    /**
     * 引数のurlにリダイレクトするようResponseオブジェクトに設定する。
     *
     * @param string $url 同じアプリケーション内であればPATH_INFOのみ指定でOK
     */
    protected function redirect(string $url): void
    {
        if (!preg_match('#https?://#', $url)) {
            $protocol = $this->request->isSsl() ? 'https://' : 'http://';
            $host = $this->request->getHost();
            $base_url = $this->request->getBaseUrl();

            $url = $protocol . $host . $base_url . $url;
        }
        $this->response->setStatusCode(302, 'Found');
        $this->response->setHttpHeader('Location', $url);
    }

    /**
     * CSRF対策：１つのトークンを生成→セッションに格納→そのトークンを返す。
     *
     * @param string $form_name フォーム名（通常'コントローラ名/アクション名'）
     *
     * @return string 生成したトークン
     */
    protected function generateCsrfToken(string $form_name): string
    {
        $key = 'csrf_tokens/' . $form_name;
        $tokens = $this->session->get($key, []);

        if (count($tokens) >= 10) {
            array_shift($tokens);
        }

        $token = sha1($form_name . session_id() . microtime());
        $tokens[] = $token;

        $this->session->set($key, $tokens);

        return $token;
    }

    /**
     * sessionのトークン中に、postされてきたトークンの有無を調べる。
     *
     * @param string $form_name フォーム名
     * @param string $token POSTされたトークン
     *
     * @return bool トークンが正しければtrue、不正であればfalse
     */
    protected function checkCsrfToken(string $form_name, string $token = null): bool
    {
        $key = 'csrf_tokens/' . $form_name;
        $tokens = $this->session->get($key, []);

        if (false !== ($pos = array_search($token, $tokens, true))) {
            unset($tokens[$pos]);
            $this->session->set($key, $tokens);

            return true;
        }

        return false;
    }
}
