<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// To test: http://lvo.localhost/api/openai/get/models/davinci
Route::get('openai/get/{slug}', 'App\Http\Controllers\OpenAIController@get')->where('slug', '.*');
Route::post('openai/post', 'App\Http\Controllers\OpenAIController@post');
