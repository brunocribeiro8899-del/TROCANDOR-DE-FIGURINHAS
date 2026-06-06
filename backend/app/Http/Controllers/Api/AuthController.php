<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(private readonly AuthService $authService) {}

    public function login(LoginRequest $request)
    {
        $resultado = $this->authService->login($request->validated());

        if (!$resultado) {
            return $this->erro('E-mail ou senha incorretos.', 401);
        }

        return $this->sucesso([
            'token' => $resultado['token'],
            'user'  => new UserResource($resultado['user']),
        ], 'Login realizado com sucesso.');
    }

    public function cadastro(RegisterRequest $request)
    {
        $resultado = $this->authService->cadastro($request->validated());

        return $this->sucesso([
            'token' => $resultado['token'],
            'user'  => new UserResource($resultado['user']),
        ], 'Cadastro realizado com sucesso.', 201);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return $this->sucesso(mensagem: 'Sessão encerrada com sucesso.');
    }

    public function me(Request $request)
    {
        return $this->sucesso(new UserResource($request->user()));
    }
}
