<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Figurinha extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'numero',
        'nome',
        'categoria',
        'pais',
        'raridade',
        'imagem_url',
    ];

    public function anuncios()
    {
        return $this->hasMany(Anuncio::class);
    }
}
