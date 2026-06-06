<?php

namespace App\Services;

use App\Models\Anuncio;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\Collection;

class AnuncioService
{
    public function listar(array $filtros): Collection
    {
        return Anuncio::with(['figurinha', 'vendedor'])
            ->disponiveis()
            ->when($filtros['busca'] ?? null, function ($q, $busca) {
                $q->whereHas('figurinha', fn($f) =>
                    $f->where('nome', 'like', "%{$busca}%")
                      ->orWhere('numero', 'like', "%{$busca}%")
                );
            })
            ->when($filtros['categoria'] ?? null, function ($q, $categoria) {
                $q->whereHas('figurinha', fn($f) => $f->where('categoria', $categoria));
            })
            ->when($filtros['tipo'] ?? null, fn($q, $tipo) => $q->where('tipo', $tipo))
            ->latest()
            ->get();
    }

    public function listarTodos(array $filtros): Collection
    {
        return Anuncio::with(['figurinha', 'vendedor'])
            ->when($filtros['busca'] ?? null, function ($q, $busca) {
                $q->whereHas('figurinha', fn($f) =>
                    $f->where('nome', 'like', "%{$busca}%")
                );
            })
            ->when($filtros['status'] ?? null, fn($q, $status) => $q->where('status', $status))
            ->latest()
            ->get();
    }

    public function buscarPorId(int $id): Anuncio
    {
        return Anuncio::with(['figurinha', 'vendedor'])->findOrFail($id);
    }

    public function criar(array $dados, User $vendedor): Anuncio
    {
        return Anuncio::create([
            ...$dados,
            'vendedor_id' => $vendedor->id,
            'status'      => 'disponivel',
        ]);
    }

    public function atualizar(int $id, array $dados, User $user): Anuncio
    {
        $anuncio = Anuncio::findOrFail($id);

        if ($anuncio->vendedor_id !== $user->id) {
            throw new AuthorizationException('Você não tem permissão para editar este anúncio.');
        }

        $anuncio->update($dados);

        return $anuncio->fresh(['figurinha', 'vendedor']);
    }

    public function deletar(int $id, User $user): void
    {
        $anuncio = Anuncio::findOrFail($id);

        if ($anuncio->vendedor_id !== $user->id) {
            throw new AuthorizationException('Você não tem permissão para remover este anúncio.');
        }

        $anuncio->delete();
    }

    public function deletarAdmin(int $id): void
    {
        Anuncio::findOrFail($id)->delete();
    }

    public function marcarVendido(int $id, User $user): Anuncio
    {
        $anuncio = Anuncio::findOrFail($id);

        if ($anuncio->vendedor_id !== $user->id) {
            throw new AuthorizationException('Você não tem permissão para alterar este anúncio.');
        }

        $anuncio->update(['status' => 'vendido']);

        return $anuncio;
    }

    public function meusAnuncios(User $user): Collection
    {
        return Anuncio::with(['figurinha'])
            ->porVendedor($user->id)
            ->latest()
            ->get();
    }
}
