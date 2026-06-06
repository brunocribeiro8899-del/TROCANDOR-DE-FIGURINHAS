<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pedidos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('anuncio_id')->constrained('anuncios')->onDelete('cascade');
            $table->foreignId('comprador_id')->constrained('users')->onDelete('cascade');
            $table->text('mensagem')->nullable();
            $table->enum('status', ['pendente', 'aceito', 'recusado'])->default('pendente');
            $table->text('resposta')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pedidos');
    }
};
