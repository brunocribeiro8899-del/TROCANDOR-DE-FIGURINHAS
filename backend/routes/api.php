<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AnuncioController;
use App\Http\Controllers\Api\PedidoController;
use Illuminate\Support\Facades\Route;

// Rotas públicas
Route::post('/login', [AuthController::class, 'login']);
Route::post('/cadastro', [AuthController::class, 'cadastro']);

// Rotas autenticadas
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Anúncios
    Route::get('/anuncios', [AnuncioController::class, 'index']);
    Route::get('/anuncios/{anuncio}', [AnuncioController::class, 'show']);
    Route::post('/anuncios', [AnuncioController::class, 'store']);
    Route::put('/anuncios/{anuncio}', [AnuncioController::class, 'update']);
    Route::delete('/anuncios/{anuncio}', [AnuncioController::class, 'destroy']);
    Route::patch('/anuncios/{anuncio}/vender', [AnuncioController::class, 'marcarVendido']);
    Route::get('/meus-anuncios', [AnuncioController::class, 'meusAnuncios']);

    // Pedidos / Manifestações de interesse
    Route::get('/pedidos', [PedidoController::class, 'index']);
    Route::post('/pedidos', [PedidoController::class, 'store']);
    Route::patch('/pedidos/{pedido}/responder', [PedidoController::class, 'responder']);

    // Rotas de Administrador
    Route::middleware('can:admin')->prefix('admin')->group(function () {
        Route::get('/usuarios', [UserController::class, 'index']);
        Route::patch('/usuarios/{user}/status', [UserController::class, 'alterarStatus']);
        Route::get('/metricas', [UserController::class, 'metricas']);
        Route::get('/anuncios', [AnuncioController::class, 'indexAdmin']);
        Route::delete('/anuncios/{anuncio}', [AnuncioController::class, 'destroyAdmin']);
    });
});
