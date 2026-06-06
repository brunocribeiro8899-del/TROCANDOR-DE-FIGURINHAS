<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('anuncios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vendedor_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('figurinha_id')->constrained('figurinhas')->onDelete('cascade');
            $table->enum('tipo', ['venda', 'troca', 'ambos'])->default('venda');
            $table->decimal('preco', 8, 2)->nullable();
            $table->text('descricao')->nullable();
            $table->enum('status', ['disponivel', 'vendido', 'pausado'])->default('disponivel');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('anuncios');
    }
};
