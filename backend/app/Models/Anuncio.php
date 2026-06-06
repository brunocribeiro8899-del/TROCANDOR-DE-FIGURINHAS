<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Anuncio extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'vendedor_id',
        'figurinha_id',
        'tipo',
        'preco',
        'descricao',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'preco' => 'decimal:2',
        ];
    }

    public function vendedor()
    {
        return $this->belongsTo(User::class, 'vendedor_id');
    }

    public function figurinha()
    {
        return $this->belongsTo(Figurinha::class);
    }

    public function pedidos()
    {
        return $this->hasMany(Pedido::class);
    }

    public function scopeDisponiveis($query): mixed
    {
        return $query->where('status', 'disponivel');
    }

    public function scopePorVendedor($query, int $vendedorId)
    {
        return $query->where('vendedor_id', $vendedorId);
    }
}
