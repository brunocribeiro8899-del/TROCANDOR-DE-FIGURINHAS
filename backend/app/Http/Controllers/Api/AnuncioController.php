<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AnuncioRequest;
use App\Http\Resources\AnuncioResource;
use App\Services\AnuncioService;
use Illuminate\Http\Request;

class AnuncioController extends Controller
{
    public function __construct(private readonly AnuncioService $anuncioService) {}

    public function index(Request $request)
    {
        $anuncios = $this->anuncioService->listar($request->only(['busca', 'categoria', 'tipo']));

        return $this->sucesso(AnuncioResource::collection($anuncios));
    }

    public function indexAdmin(Request $request)
    {
        $anuncios = $this->anuncioService->listarTodos($request->only(['busca', 'status']));

        return $this->sucesso(AnuncioResource::collection($anuncios));
    }

    public function show(int $anuncio)
    {
        $anuncio = $this->anuncioService->buscarPorId($anuncio);

        return $this->sucesso(new AnuncioResource($anuncio));
    }

    public function store(AnuncioRequest $request)
    {
        $anuncio = $this->anuncioService->criar(
            $request->validated(),
            $request->user()
        );

        return $this->sucesso(new AnuncioResource($anuncio), 'Anúncio publicado com sucesso.', 201);
    }

    public function update(AnuncioRequest $request, int $anuncio)
    {
        $anuncio = $this->anuncioService->atualizar(
            $anuncio,
            $request->validated(),
            $request->user()
        );

        return $this->sucesso(new AnuncioResource($anuncio), 'Anúncio atualizado com sucesso.');
    }

    public function destroy(Request $request, int $anuncio)
    {
        $this->anuncioService->deletar($anuncio, $request->user());

        return $this->sucesso(mensagem: 'Anúncio removido com sucesso.');
    }

    public function destroyAdmin(int $anuncio)
    {
        $this->anuncioService->deletarAdmin($anuncio);

        return $this->sucesso(mensagem: 'Anúncio removido pelo administrador.');
    }

    public function marcarVendido(Request $request, int $anuncio)
    {
        $anuncio = $this->anuncioService->marcarVendido($anuncio, $request->user());

        return $this->sucesso(new AnuncioResource($anuncio), 'Figurinha marcada como vendida.');
    }

    public function meusAnuncios(Request $request)
    {
        $anuncios = $this->anuncioService->meusAnuncios($request->user());

        return $this->sucesso(AnuncioResource::collection($anuncios));
    }
}
