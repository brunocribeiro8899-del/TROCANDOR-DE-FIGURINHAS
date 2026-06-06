<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Services\UserService;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function __construct(private readonly UserService $userService) {}

    public function index(Request $request)
    {
        $usuarios = $this->userService->listar($request->only(['busca', 'perfil', 'ativo']));

        return $this->sucesso(UserResource::collection($usuarios));
    }

    public function alterarStatus(Request $request, int $user)
    {
        $usuario = $this->userService->alterarStatus($user);

        return $this->sucesso(
            new UserResource($usuario),
            $usuario->ativo ? 'Conta ativada com sucesso.' : 'Conta desativada com sucesso.'
        );
    }

    public function metricas()
    {
        return $this->sucesso($this->userService->metricas());
    }
}
