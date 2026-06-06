<?php

namespace Database\Seeders;

use App\Models\Anuncio;
use App\Models\Figurinha;
use App\Models\User;
use Illuminate\Database\Seeder;

class AnuncioSeeder extends Seeder
{
    public function run(): void
    {
        $vendedor = User::where('email', 'vendedor@teste.com')->first();

        if (!$vendedor) {
            return;
        }

        $figurinhas = Figurinha::take(10)->get();

        $anuncios = [
            ['tipo' => 'venda',  'preco' => 5.00,  'status' => 'disponivel', 'descricao' => 'Em ótimo estado, nunca colada.'],
            ['tipo' => 'troca',  'preco' => null,   'status' => 'disponivel', 'descricao' => 'Aceito troca por figurinhas do Brasil.'],
            ['tipo' => 'ambos',  'preco' => 8.50,   'status' => 'disponivel', 'descricao' => 'Vendo ou troco por lendárias.'],
            ['tipo' => 'venda',  'preco' => 15.00,  'status' => 'disponivel', 'descricao' => 'Figurinha especial, colecionável.'],
            ['tipo' => 'troca',  'preco' => null,   'status' => 'disponivel', 'descricao' => 'Troco por jogadores da Argentina.'],
            ['tipo' => 'venda',  'preco' => 3.00,   'status' => 'vendido',    'descricao' => 'Já vendida.'],
        ];

        foreach ($anuncios as $index => $anuncio) {
            $figurinha = $figurinhas->get($index);
            if (!$figurinha) {
                continue;
            }

            Anuncio::updateOrCreate(
                [
                    'vendedor_id'  => $vendedor->id,
                    'figurinha_id' => $figurinha->id,
                ],
                [
                    ...$anuncio,
                    'vendedor_id'  => $vendedor->id,
                    'figurinha_id' => $figurinha->id,
                ]
            );
        }
    }
}
