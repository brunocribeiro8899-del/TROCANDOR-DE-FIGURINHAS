<?php

namespace Database\Seeders;

use App\Models\Figurinha;
use Illuminate\Database\Seeder;

class FigurinhaSeeder extends Seeder
{
    public function run(): void
    {
        $figurinhas = [
            ['numero' => 'BRA-1',  'nome' => 'Vinicius Júnior',   'categoria' => 'Jogadores',   'pais' => 'Brasil',    'raridade' => 'especial'],
            ['numero' => 'BRA-2',  'nome' => 'Rodrygo',            'categoria' => 'Jogadores',   'pais' => 'Brasil',    'raridade' => 'rara'],
            ['numero' => 'BRA-3',  'nome' => 'Alisson',            'categoria' => 'Jogadores',   'pais' => 'Brasil',    'raridade' => 'comum'],
            ['numero' => 'BRA-4',  'nome' => 'Marquinhos',         'categoria' => 'Jogadores',   'pais' => 'Brasil',    'raridade' => 'comum'],
            ['numero' => 'BRA-5',  'nome' => 'Raphinha',           'categoria' => 'Jogadores',   'pais' => 'Brasil',    'raridade' => 'rara'],
            ['numero' => 'ARG-1',  'nome' => 'Lionel Messi',       'categoria' => 'Jogadores',   'pais' => 'Argentina', 'raridade' => 'lendaria'],
            ['numero' => 'ARG-2',  'nome' => 'Julián Álvarez',     'categoria' => 'Jogadores',   'pais' => 'Argentina', 'raridade' => 'especial'],
            ['numero' => 'ARG-3',  'nome' => 'Enzo Fernández',     'categoria' => 'Jogadores',   'pais' => 'Argentina', 'raridade' => 'rara'],
            ['numero' => 'FRA-1',  'nome' => 'Kylian Mbappé',      'categoria' => 'Jogadores',   'pais' => 'França',    'raridade' => 'lendaria'],
            ['numero' => 'FRA-2',  'nome' => 'Antoine Griezmann',  'categoria' => 'Jogadores',   'pais' => 'França',    'raridade' => 'especial'],
            ['numero' => 'ENG-1',  'nome' => 'Jude Bellingham',    'categoria' => 'Jogadores',   'pais' => 'Inglaterra','raridade' => 'lendaria'],
            ['numero' => 'ENG-2',  'nome' => 'Harry Kane',         'categoria' => 'Jogadores',   'pais' => 'Inglaterra','raridade' => 'especial'],
            ['numero' => 'ESP-1',  'nome' => 'Pedri',              'categoria' => 'Jogadores',   'pais' => 'Espanha',   'raridade' => 'rara'],
            ['numero' => 'ESP-2',  'nome' => 'Yamal',              'categoria' => 'Jogadores',   'pais' => 'Espanha',   'raridade' => 'especial'],
            ['numero' => 'POR-1',  'nome' => 'Cristiano Ronaldo',  'categoria' => 'Jogadores',   'pais' => 'Portugal',  'raridade' => 'lendaria'],
            ['numero' => 'GRP-A',  'nome' => 'Grupo A',            'categoria' => 'Grupos',      'pais' => null,        'raridade' => 'comum'],
            ['numero' => 'GRP-B',  'nome' => 'Grupo B',            'categoria' => 'Grupos',      'pais' => null,        'raridade' => 'comum'],
            ['numero' => 'EST-1',  'nome' => 'Estádio Maracanã',   'categoria' => 'Estádios',    'pais' => 'Brasil',    'raridade' => 'especial'],
            ['numero' => 'EST-2',  'nome' => 'Estádio Nacional',   'categoria' => 'Estádios',    'pais' => null,        'raridade' => 'comum'],
            ['numero' => 'BOLA-1', 'nome' => 'Bola Oficial',       'categoria' => 'Especiais',   'pais' => null,        'raridade' => 'especial'],
        ];

        foreach ($figurinhas as $dados) {
            Figurinha::updateOrCreate(
                ['numero' => $dados['numero']],
                $dados
            );
        }
    }
}
