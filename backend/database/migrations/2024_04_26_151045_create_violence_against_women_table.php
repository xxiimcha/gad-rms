<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateViolenceAgainstWomenTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('violence_against_women', function (Blueprint $table) {
            $table->id();
            $table->string('month')->nullable();
            $table->integer('number_vaw')->nullable();
            $table->integer('physical_abuse')->nullable();
            $table->integer('sexual_abuse')->nullable();
            $table->integer('psychological_abuse')->nullable();
            $table->integer('economic_abuse')->nullable();
            $table->integer('issued_bpo')->nullable();
            $table->integer('referred_lowdo')->nullable();
            $table->integer('referred_pnp')->nullable();
            $table->integer('referred_nbi')->nullable();
            $table->integer('referred_court')->nullable();
            $table->integer('referred_medical')->nullable();
            $table->integer('trainings')->nullable();
            $table->integer('counseling')->nullable();
            $table->integer('iec')->nullable();
            $table->integer('fund_allocation')->nullable();
            $table->string('remarks')->nullable();
            $table->string('barangay')->nullable();
            $table->string('status')->nullable();
            $table->timestamps();
            $table->softdeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('violence_against_women');
    }
}
