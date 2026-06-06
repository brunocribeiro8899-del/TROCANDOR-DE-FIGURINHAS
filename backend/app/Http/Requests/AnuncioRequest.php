<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AnuncioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'figurinha_id' => 'required|exists:figurinhas,id',
            'tipo'         => 'required|in:venda,troca,ambos',
            'preco'        => 'nullable|numeric|min:0',
            'descricao'    => 'nullable|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'figurinha_id.required' => 'Selecione uma figurinha.',
            'figurinha_id.exists'   => 'Figurinha não encontrada.',
            'tipo.required'         => 'Selecione o tipo de negociação.',
            'tipo.in'               => 'Tipo de negociação inválido.',
            'preco.numeric'         => 'O preço deve ser um valor numérico.',
            'preco.min'             => 'O preço não pode ser negativo.',
        ];
    }
}
