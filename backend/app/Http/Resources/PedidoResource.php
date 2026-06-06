<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PedidoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'mensagem'   => $this->mensagem,
            'status'     => $this->status,
            'resposta'   => $this->resposta,
            'criado_em'  => $this->created_at?->format('d/m/Y H:i'),
            'anuncio'    => new AnuncioResource($this->whenLoaded('anuncio')),
            'comprador'  => new UserResource($this->whenLoaded('comprador')),
        ];
    }
}
