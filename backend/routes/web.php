<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Http\Controllers\AuthenticatedSessionController;


Route::get('/{path?}', function () {
    return view('index');
})->where('path', '.*');

