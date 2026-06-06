<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AnuncioResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'tipo'       => $this->tipo,
            'preco'      => $this->preco,
            'descricao'  => $this->descricao,
            'status'     => $this->status,
            'criado_em'  => $this->created_at?->format('d/m/Y H:i'),
            'figurinha'  => [
                'id'        => $this->figurinha?->id,
                'numero'    => $this->figurinha?->numero,
                'nome'      => $this->figurinha?->nome,
                'categoria' => $this->figurinha?->categoria,
                'pais'      => $this->figurinha?->pais,
                'raridade'  => $this->figurinha?->raridade,
                'imagem'    => $this->figurinha?->imagem_url,
            ],
            'vendedor'   => [
                'id'     => $this->vendedor?->id,
                'nome'   => $this->vendedor?->name,
            ],
        ];
    }
}
