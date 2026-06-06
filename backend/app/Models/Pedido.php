<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pedido extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'anuncio_id',
        'comprador_id',
        'mensagem',
        'status',
        'resposta',
    ];

    public function anuncio()
    {
        return $this->belongsTo(Anuncio::class);
    }

    public function comprador()
    {
        return $this->belongsTo(User::class, 'comprador_id');
    }
}
