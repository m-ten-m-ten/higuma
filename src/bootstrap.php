<?php
include 'core/ClassLoader.php';

$loader = new ClassLoader;
$loader->registerDir('core');
$loader->register();
