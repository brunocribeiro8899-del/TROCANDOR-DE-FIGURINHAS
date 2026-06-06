<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nome'   => 'required|string|max:255',
            'email'  => 'required|email|unique:users,email',
            'senha'  => 'required|string|min:6|confirmed',
            'perfil' => 'required|in:comprador,vendedor,ambos',
        ];
    }

    public function messages(): array
    {
        return [
            'nome.required'     => 'O nome é obrigatório.',
            'email.required'    => 'O e-mail é obrigatório.',
            'email.email'       => 'Informe um e-mail válido.',
            'email.unique'      => 'Este e-mail já está cadastrado.',
            'senha.required'    => 'A senha é obrigatória.',
            'senha.min'         => 'A senha deve ter no mínimo 6 caracteres.',
            'senha.confirmed'   => 'As senhas não conferem.',
            'perfil.required'   => 'Selecione um perfil.',
            'perfil.in'         => 'Perfil inválido.',
        ];
    }
}
