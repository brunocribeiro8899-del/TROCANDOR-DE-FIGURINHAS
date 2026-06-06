<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    public function login(array $dados): ?array
    {
        $user = User::where('email', $dados['email'])->where('ativo', true)->first();

        if (!$user || !Hash::check($dados['senha'], $user->password)) {
            return null;
        }

        $user->tokens()->where('name', 'api-token')->delete();
        $token = $user->createToken('api-token')->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }

    public function cadastro(array $dados): array
    {
        $user = User::create([
            'name'     => $dados['nome'],
            'email'    => $dados['email'],
            'password' => $dados['senha'],
            'perfil'   => $dados['perfil'],
            'ativo'    => true,
        ]);

        $token = $user->createToken('api-token')->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }
}
