<?php
/**
 * DBとの接続情報（PDOクラスのインスタンス）を管理するクラス。
 *
 * 本クラス内に各テーブルのRepositoryクラスのインスタンスを保持する。
 */
class DbManager
{
    /**
     * @var array 接続情報（PDOインスタンス）
     */
    protected $connections = [];

    /**
     * @var array 各Repositoryと各DB接続情報のマッピング['Repository名' => 'DB接続情報の名称']
     */
    protected $repository_connection_map = [];

    /**
     * @var array 各テーブルのRepositoryクラスのインスタンスを保持
     */
    protected $repositories = [];

    /**
     * DBとの接続を閉じる。
     */
    public function __destruct()
    {
        foreach ($this->repositories as $repository) {
            unset($repository);
        }

        foreach ($this->connections as $con) {
            unset($con);
        }
    }

    /**
     * DBに接続を行う。
     *
     * @param string $name 接続を特定する名称
     * @param array $params 接続に必要な情報（PDOクラスのコンストラクタに渡す引数）
     *
     * @return [type]
     */
    public function connect(string $name, array $params)
    {
        $params = array_merge([
            'dsn' => null,
            'user' => '',
            'password' => '',
            'options' => [],
        ], $params);

        $con = new PDO($params['dsn'], $params['user'], $params['password'], $params['options']);
        $con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $this->connections[$name] = $con;
    }

    /**
     * 接続情報(PDOクラスのインスタンス)を取得する。
     *
     * @param string $name 接続を特定する名称
     *
     * @return PDO 指定がなければ最初に作成したPDOクラスのインスタンスを返す
     */
    public function getConnection(string $name = null): PDO
    {
        if (is_null($name)) {
            return current($this->connections);
        }
        return $this->connections[$name];
    }

    /**
     * 各Repositoryと各DB接続情報のマッピングする。['Repository名' => 'DB接続情報の名称']
     *
     * @param string $repository_name Repository名
     * @param string $name 接続を特定する名称
     */
    public function setRepositoryConnectionMap(string $repository_name, string $name): void
    {
        $this->repository_connection_map[$repository_name] = $name;
    }

    /**
     * $repository_connection_mapに指定のあるものは該当の接続情報を返す。そうでなければ最初に作成した接続情報を返す。
     *
     * @param string $repository_name Repository名
     *
     * @return PDO 指定されたRepositoryに対応する接続情報(PDOクラスのインスタンス)を取得する
     */
    public function getConnectionForRepository(string $repository_name): PDO
    {
        if (isset($this->repository_connection_map[$repository_name])) {
            $name = $this->repository_connection_map[$repository_name];
            $con = $this->getConnection($name);
        } else {
            $con = $this->getConnection();
        }
        return $con;
    }

    /**
     * 指定されたテーブルのRepositoryインスタンスを生成。（生成済みの場合にはそのインスタンスを返す）
     *
     * @param string $repository_name テーブル名（Repository名）
     *
     * @return DbRepository 該当Repositoryクラスのインスタンス
     */
    public function get(string $repository_name): DbRepository
    {
        if (!isset($this->repositories[$repository_name])) {
            $repository_class = $repository_name . 'Repository';
            $con = $this->getConnectionForRepository($repository_name);

            $repository = new $repository_class($con);

            $this->repositories[$repository_name] = $repository;
        }

        return $this->repositories[$repository_name];
    }
}
