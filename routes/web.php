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
Route::get('/scenephysdemo', function () {
    return view('scene_phys_demo');
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

Route::GET('/tire', 'TireController@index')->name('tire.index');
Route::POST('/tire', 'TireController@store')->name('tire.store');
Route::GET('/tire/create', 'TireController@create')->name('tire.create');
Route::GET('/tire/{tire}/edit', 'TireController@edit')->name('tire.edit');
Route::PATCH('/tire/{tire}', 'TireController@update')->name('tire.update');
Route::GET('/tire/{tire}', 'TireController@show')->name('tire.show');
Route::DELETE('/tire/{tire}', 'TireController@destroy')->name('tire.destroy');

Route::GET('/material', 'MaterialController@index')->name('material.index');
Route::POST('/material', 'MaterialController@store')->name('material.store');
Route::GET('/material/create', 'MaterialController@create')->name('material.create');
Route::GET('/material/{material}/edit', 'MaterialController@edit')->name('material.edit');
Route::PATCH('/material/{material}', 'MaterialController@update')->name('material.update');
Route::GET('/material/{material}', 'MaterialController@show')->name('material.show');
Route::DELETE('/material/{material}', 'MaterialController@destroy')->name('material.destroy');
