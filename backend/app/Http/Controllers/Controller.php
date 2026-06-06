<?php

namespace App\Http\Controllers;

abstract class Controller
{
    protected function sucesso(mixed $data = null, string $mensagem = 'Operação realizada com sucesso.', int $status = 200)
    {
        $response = ['message' => $mensagem];

        if ($data !== null) {
            $response['data'] = $data;
        }

        return response()->json($response, $status);
    }

    protected function erro(string $mensagem, int $status = 400, array $erros = [])
    {
        $response = ['message' => $mensagem];

        if (!empty($erros)) {
            $response['errors'] = $erros;
        }

        return response()->json($response, $status);
    }
}
