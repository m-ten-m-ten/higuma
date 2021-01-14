<?php
class View
{
    protected $base_dir;
    protected $defaults;
    protected $layout_variables = [];

    public function __construct(string $base_dir, array $defaults = [])
    {
        $this->base_dir = $base_dir;
        $this->defaults = $defaults;
    }

    public function setLayoutVar($name, $value)
    {
        $this->layout_variables[$name] = $value;
    }

    public function render(string $_path, array $_variables = [], string $_layout = null): string
    {
        $_file = $this->base_dir . '/' . $_path . '.php';

        extract(array_merge($this->defaults, $_variables));

        ob_start();
        ob_implicit_flush(0);

        include $_file;

        $content = ob_get_clean();

        if ($_layout) {
            $content = $this->render($_layout, array_merge($this->layout_variables, ['_content' => $content]));
        }

        return $content;
    }

    public function escape($string)
    {
        return htmlspecialchars($string, ENT_QUOTES, 'UTF-8');
    }
}
