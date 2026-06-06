<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'ability' => \Laravel\Sanctum\Http\Middleware\CheckAbilities::class,
            'abilities' => \Laravel\Sanctum\Http\Middleware\CheckForAnyAbility::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (\Illuminate\Auth\AuthenticationException $e, Request $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'message' => 'Você precisa estar autenticado para acessar este recurso.',
                ], 401);
            }
        });

        $exceptions->render(function (\Illuminate\Auth\Access\AuthorizationException $e, Request $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'message' => 'Você não tem permissão para realizar esta ação.',
                ], 403);
            }
        });

        $exceptions->render(function (\Illuminate\Database\Eloquent\ModelNotFoundException $e, Request $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'message' => 'Registro não encontrado.',
                ], 404);
            }
        });

        $exceptions->render(function (\Illuminate\Validation\ValidationException $e, Request $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'message' => 'Os dados informados são inválidos.',
                    'errors'  => $e->errors(),
                ], 422);
            }
        });

        $exceptions->render(function (\Throwable $e, Request $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                $statusCode = method_exists($e, 'getStatusCode') ? $e->getStatusCode() : 500;
                return response()->json([
                    'message' => $statusCode === 500
                        ? 'Ocorreu um erro interno. Tente novamente mais tarde.'
                        : $e->getMessage(),
                ], $statusCode);
            }
        });
    })->create();
