<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateViolenceAgainstChildrenTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('violence_against_children', function (Blueprint $table) {
            $table->id();
            $table->string('month')->nullable();
            $table->integer('number_vac')->nullable();
            $table->integer('male')->nullable();
            $table->integer('female')->nullable();
            $table->integer('range_one')->nullable();
            $table->integer('range_two')->nullable();
            $table->integer('range_three')->nullable();
            $table->integer('range_four')->nullable();
            $table->integer('range_five')->nullable();

            $table->integer('physical_abuse')->nullable();
            $table->integer('sexual_abuse')->nullable();
            $table->integer('psychological_abuse')->nullable();
            $table->integer('neglect')->nullable();
            $table->integer('others')->nullable();

            $table->integer('immediate_family')->nullable();
            $table->integer('other_close_relative')->nullable();
            $table->integer('acquaintance')->nullable();
            $table->integer('stranger')->nullable();
            $table->integer('local_official')->nullable();
            $table->integer('law_enforcer')->nullable();
            $table->integer('other_guardians')->nullable();

            $table->integer('referred_pnp')->nullable();
            $table->integer('referred_nbi')->nullable();
            $table->integer('referred_medical')->nullable();
            $table->integer('referred_legal_assist')->nullable();
            $table->integer('referred_others')->nullable();

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
        Schema::dropIfExists('violence_against_children');
    }
}
