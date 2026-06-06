<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@admin.com'],
            [
                'name'     => 'Administrador',
                'password' => Hash::make('123456'),
                'perfil'   => 'admin',
                'ativo'    => true,
            ]
        );

        User::updateOrCreate(
            ['email' => 'comprador@teste.com'],
            [
                'name'     => 'João Comprador',
                'password' => Hash::make('123456'),
                'perfil'   => 'comprador',
                'ativo'    => true,
            ]
        );

        User::updateOrCreate(
            ['email' => 'vendedor@teste.com'],
            [
                'name'     => 'Maria Vendedora',
                'password' => Hash::make('123456'),
                'perfil'   => 'vendedor',
                'ativo'    => true,
            ]
        );
    }
}
