<?php

require_once __DIR__ . '/../app/init.php';

echo LayoutBuilder\view('header');

echo LayoutBuilder\view('builder');

echo LayoutBuilder\view('footer');
