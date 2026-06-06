<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'password',
        'perfil',
        'ativo',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
            'ativo'             => 'boolean',
        ];
    }

    public function anuncios()
    {
        return $this->hasMany(Anuncio::class, 'vendedor_id');
    }

    public function pedidosComoComprador()
    {
        return $this->hasMany(Pedido::class, 'comprador_id');
    }

    public function isAdmin(): bool
    {
        return $this->perfil === 'admin';
    }

    public function isVendedor(): bool
    {
        return in_array($this->perfil, ['vendedor', 'ambos']);
    }

    public function isComprador(): bool
    {
        return in_array($this->perfil, ['comprador', 'ambos']);
    }
}
