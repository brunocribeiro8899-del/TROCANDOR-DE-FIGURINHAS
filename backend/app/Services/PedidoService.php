<?php

namespace App\Services;

use App\Models\Pedido;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Validation\ValidationException;

class PedidoService
{
    public function listar(User $user): Collection
    {
        return Pedido::with(['anuncio.figurinha', 'anuncio.vendedor', 'comprador'])
            ->when($user->isComprador(), fn($q) => $q->where('comprador_id', $user->id))
            ->when($user->isVendedor(), fn($q) => $q->whereHas('anuncio', fn($a) =>
                $a->where('vendedor_id', $user->id)
            ))
            ->latest()
            ->get();
    }

    public function criar(array $dados, User $comprador): Pedido
    {
        $jaExiste = Pedido::where('anuncio_id', $dados['anuncio_id'])
            ->where('comprador_id', $comprador->id)
            ->where('status', 'pendente')
            ->exists();

        if ($jaExiste) {
            throw ValidationException::withMessages([
                'anuncio_id' => ['Você já manifestou interesse neste anúncio.'],
            ]);
        }

        return Pedido::create([
            ...$dados,
            'comprador_id' => $comprador->id,
            'status'       => 'pendente',
        ]);
    }

    public function responder(int $id, array $dados, User $user): Pedido
    {
        $pedido = Pedido::with('anuncio')->findOrFail($id);

        if ($pedido->anuncio->vendedor_id !== $user->id) {
            throw new AuthorizationException('Você não tem permissão para responder este pedido.');
        }

        $pedido->update($dados);

        return $pedido->fresh(['anuncio.figurinha', 'comprador']);
    }
}
