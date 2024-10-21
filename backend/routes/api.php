<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CityController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\BarangayController;
use App\Http\Controllers\ViolenceAgainstWomenController;
use App\Http\Controllers\ViolenceAgainstChildrenController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\AuditsController;
use App\Http\Controllers\ArchiveController;
use App\Http\Controllers\ForgotPasswordController;
use App\Http\Controllers\TwoFactorAuthenticationController;
use App\Http\Controllers\AnalysisController;
use App\Http\Controllers\VAWAnalysisController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('login', [AuthController::class, 'login']);
Route::post('forgot-password', [ForgotPasswordController::class, 'forgot_password']);
Route::post('reset-password', [ForgotPasswordController::class, 'reset']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/2fa/verify', [TwoFactorAuthenticationController::class, 'verify']);
    Route::get('/2fa/generate', [UserController::class, 'email_generated_session_otp']);
});

//Analysis Controller
Route::get('/vaw-predictive-analysis', [VawAnalysisController::class, 'getPredictiveAnalysis']);
Route::get('/prescriptive-analysis', [AnalysisController::class, 'getPrescriptiveAnalysis']);
Route::middleware(['auth:sanctum', '2fa'])->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/cities', [CityController::class, 'cities']);

    Route::get('/barangays', [BarangayController::class, 'barangays']);
    Route::get('/barangays/{cityId}', [BarangayController::class, 'barangays_by_city']);
    Route::get('/barangay/{id}', [BarangayController::class, 'get_barangay']);

    Route::get('/users', [UserController::class, 'users']);
    Route::post('/users', [UserController::class, 'store']);
    Route::patch('/users', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    Route::get('/users/{id}', [UserController::class, 'get_user']);
    Route::get('/user/notifications', [UserController::class, 'notifications']);

    Route::get('/vaws', [ViolenceAgainstWomenController::class, 'vaws']);
    Route::get('/vaw/{id}', [ViolenceAgainstWomenController::class, 'vaw']);
    Route::get('/vaws/all/{year}/{month}', [ViolenceAgainstWomenController::class, 'get_all_vaws']);
    Route::post('/vaws', [ViolenceAgainstWomenController::class, 'store']);
    Route::patch('/vaws', [ViolenceAgainstWomenController::class, 'update']);
    Route::patch('/vaw/admin_update', [ViolenceAgainstWomenController::class, 'admin_update']);
    Route::delete('/vaws/{id}', [ViolenceAgainstWomenController::class, 'destroy']);
    Route::get('/vaws/all/by-param', [ViolenceAgainstWomenController::class, 'get_all_vaws_by_param']);
    Route::post('/vaws/all/by-percentage', [ViolenceAgainstWomenController::class, 'get_vaws_percentage']);
    Route::get('/vaws/forecast', [ViolenceAgainstWomenController::class, 'forecast']);

    Route::get('/vacs', [ViolenceAgainstChildrenController::class, 'vacs']);
    Route::get('/vac/{id}', [ViolenceAgainstChildrenController::class, 'vac']);
    Route::get('/vacs/all/{year}/{month}', [ViolenceAgainstChildrenController::class, 'get_all_vacs']);
    Route::post('/vacs', [ViolenceAgainstChildrenController::class, 'store']);
    Route::patch('/vacs', [ViolenceAgainstChildrenController::class, 'update']);
    Route::patch('/vac/admin_update', [ViolenceAgainstChildrenController::class, 'admin_update']);
    Route::delete('/vacs/{id}', [ViolenceAgainstChildrenController::class, 'destroy']);
    Route::get('/vacs/all/by-param', [ViolenceAgainstChildrenController::class, 'get_all_vacs_by_param']);
    Route::post('/vacs/all/by-percentage', [ViolenceAgainstChildrenController::class, 'get_vacs_percentage']);
    Route::get('/vacs/forecast', [ViolenceAgainstChildrenController::class, 'forecast']);

    Route::get('/settings', [SettingsController::class, 'settings']);
    Route::post('/settings', [SettingsController::class, 'store']);
    Route::patch('/settings', [SettingsController::class, 'update']);
    Route::delete('/settings/{id}', [SettingsController::class, 'destroy']);

    Route::get('/audits', [AuditsController::class, 'audits']);

    Route::get('/archives', [ArchiveController::class, 'archives']);
    Route::post('/restore', [ArchiveController::class, 'restore']);
});
