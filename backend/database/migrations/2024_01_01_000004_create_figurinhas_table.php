<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('figurinhas', function (Blueprint $table) {
            $table->id();
            $table->string('numero', 10);
            $table->string('nome');
            $table->string('categoria');
            $table->string('pais')->nullable();
            $table->enum('raridade', ['comum', 'rara', 'especial', 'lendaria'])->default('comum');
            $table->string('imagem_url')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('figurinhas');
    }
};
