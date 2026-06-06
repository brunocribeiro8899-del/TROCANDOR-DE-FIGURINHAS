<?php

namespace App\Services;

use App\Models\Anuncio;
use App\Models\Pedido;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class UserService
{
    public function listar(array $filtros): Collection
    {
        return User::when($filtros['busca'] ?? null, function ($q, $busca) {
                $q->where('name', 'like', "%{$busca}%")
                  ->orWhere('email', 'like', "%{$busca}%");
            })
            ->when(isset($filtros['perfil']), fn($q) => $q->where('perfil', $filtros['perfil']))
            ->when(isset($filtros['ativo']), fn($q) => $q->where('ativo', $filtros['ativo']))
            ->latest()
            ->get();
    }

    public function alterarStatus(int $id): User
    {
        $user = User::findOrFail($id);
        $user->update(['ativo' => !$user->ativo]);

        return $user;
    }

    public function metricas(): array
    {
        return [
            'total_usuarios'   => User::count(),
            'usuarios_ativos'  => User::where('ativo', true)->count(),
            'total_anuncios'   => Anuncio::count(),
            'anuncios_ativos'  => Anuncio::where('status', 'disponivel')->count(),
            'total_pedidos'    => Pedido::count(),
            'pedidos_aceitos'  => Pedido::where('status', 'aceito')->count(),
        ];
    }
}
