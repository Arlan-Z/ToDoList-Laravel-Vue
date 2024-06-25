<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::group(['namespace'=>'App\Http\Controllers', 'middleware' => 'auth:sanctum'], function(){
    Route::apiResource('tasks',TaskController::class);
    Route::apiResource('users',UserController::class);
});

Route::post('/login', [AuthController::class, 'login']);
Route::get('/register', [AuthController::class, 'register']);
