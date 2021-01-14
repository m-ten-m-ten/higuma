<?php
/**
 * DBへのアクセスを行うクラス。テーブルごとにDbRepositoryクラスの子クラスを作成する。
 */
abstract class DbRepository
{
    protected $con;

    /**
     * DbManagerからPDOクラスのインスタンスを受け取って、内部に保持する（setConnection($con)と合わせて）。
     *
     * @param PDO $con PDOクラスのインスタンス
     */
    public function __construct(PDO $con)
    {
        $this->setConnection($con);
    }

    public function setConnection($con)
    {
        $this->con = $con;
    }

    /**
     * プリペアドステートメントを実行し、PDOStatementクラスのインスタンスを返す。
     *
     * @param string $sql プレースホルダ込みsql文
     * @param array $params プリペアドステートメントのプレースホルダに入る値
     *
     * @return PDOStatement
     */
    public function execute(string $sql, $params = []): PDOStatement
    {
        $stmt = $this->con->prepare($sql);
        $stmt->execute($params);

        return $stmt;
    }

    /**
     * SELECT文にて、1行を取得。
     *
     * @param string $sql プレースホルダ込みsql文
     * @param array $params プリペアドステートメントのプレースホルダに入る値
     *
     * @return array|false 該当データがあれば連想配列、無ければfalse
     */
    public function fetch(string $sql, $params = [])
    {
        return $this->execute($sql, $params)->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * SELECT文にて、全ての行を取得。
     *
     * @param string $sql プレースホルダ込みsql文
     * @param array $params プリペアドステートメントのプレースホルダに入る値
     *
     * @return array|false 該当データがあれば連想配列、無ければfalse
     */
    public function fetchAll(string $sql, $params = [])
    {
        return $this->execute($sql, $params)->fetchAll(PDO::FETCH_ASSOC);
    }
}
