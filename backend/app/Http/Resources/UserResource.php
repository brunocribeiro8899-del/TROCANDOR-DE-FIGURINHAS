<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'nome'       => $this->name,
            'email'      => $this->email,
            'perfil'     => $this->perfil,
            'ativo'      => $this->ativo,
            'criado_em'  => $this->created_at?->format('d/m/Y H:i'),
        ];
    }
}
