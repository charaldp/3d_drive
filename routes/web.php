<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

// Route::GET('/scene', 'scene')->name('scene');

Auth::routes();
Route::get('/scene', function () {
    return view('scene');
});
Route::get('/home', 'HomeController@index')->name('home');
Route::get('/scenevue', function () {
    return view('scene_vue');
});
Route::get('/gameplay', function (Request $request) {
    return view('gameplay/index');
});

Route::GET('/rim', 'RimController@index')->name('rim.index');
Route::POST('/rim', 'RimController@store')->name('rim.store');
Route::GET('/rim/create', 'RimController@create')->name('rim.create');
Route::GET('/rim/{rim}/edit', 'RimController@edit')->name('rim.edit');
Route::PATCH('/rim/{rim}', 'RimController@update')->name('rim.update');
Route::GET('/rim/{rim}', 'RimController@show')->name('rim.show');
Route::DELETE('/rim/{rim}', 'RimController@destroy')->name('rim.destroy');

