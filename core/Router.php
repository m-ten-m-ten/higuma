<?php
class Router
{
    protected $routes;

    public function __construct($definitions)
    {
        $this->routes = $this->compileRoutes($definitions);
    }

    /**
     * ルーティング定義配列のキー（URL）に含まれる動的パラメータ(:で始まる)を正規表現でキャプチャできる形式に変換する。
     *
     * @param array $definitions ルーティング定義配列
     *
     * @return array 変換済みルーティング定義配列
     */
    public function compileRoutes(array $definitions): array
    {
        $routes = [];

        foreach ($definitions as $url => $params) {
            $tokens = explode('/', ltrim($url, '/'));

            foreach ($tokens as $i => $token) {
                if (strpos($token, ':') === 0) {
                    $name = substr($token, 1);
                    $token = '(?P<' . $name . '>[^/]+)';
                }
                $tokens[$i] = $token;
            }
            $pattern = '/' . implode('/', $tokens);
            $routes[$pattern] = $params;
        }
        return $routes;
    }

    /**
     * PATH_INFOと変換済みルーティング定義配列のマッチングを行う。
     *
     * @param mixed $path_info
     *
     * @return array|false マッチした場合ルーティングパラメータ（controllerとaction）を返す。マッチしない時はfalseを返す。
     */
    public function resolve($path_info)
    {
        if (substr($path_info, 0, 1) !== '/') {
            $path_info = '/' . $path_info;
        }

        foreach ($this->routes as $pattern => $params) {
            if (preg_match('#^' . $pattern . '$#', $path_info, $matches)) {
                $params = array_merge($params, $matches);
                return $params;
            }
        }
        return false;
    }
}
