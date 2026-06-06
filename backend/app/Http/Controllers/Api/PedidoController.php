<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PedidoResource;
use App\Services\PedidoService;
use Illuminate\Http\Request;

class PedidoController extends Controller
{
    public function __construct(private readonly PedidoService $pedidoService) {}

    public function index(Request $request)
    {
        $pedidos = $this->pedidoService->listar($request->user());

        return $this->sucesso(PedidoResource::collection($pedidos));
    }

    public function store(Request $request)
    {
        $request->validate([
            'anuncio_id' => 'required|exists:anuncios,id',
            'mensagem'   => 'nullable|string|max:500',
        ]);

        $pedido = $this->pedidoService->criar($request->only('anuncio_id', 'mensagem'), $request->user());

        return $this->sucesso(new PedidoResource($pedido), 'Interesse manifestado com sucesso.', 201);
    }

    public function responder(Request $request, int $pedido)
    {
        $request->validate([
            'status'   => 'required|in:aceito,recusado',
            'resposta' => 'nullable|string|max:500',
        ]);

        $pedido = $this->pedidoService->responder(
            $pedido,
            $request->only('status', 'resposta'),
            $request->user()
        );

        return $this->sucesso(new PedidoResource($pedido), 'Pedido respondido com sucesso.');
    }
}
