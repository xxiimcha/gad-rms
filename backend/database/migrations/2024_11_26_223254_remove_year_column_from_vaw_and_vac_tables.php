<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RemoveYearColumnFromVawAndVacTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('violence_against_women', function (Blueprint $table) {
            $table->dropColumn('year');
        });

        Schema::table('violence_against_children', function (Blueprint $table) {
            $table->dropColumn('year');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('vaw', function (Blueprint $table) {
            $table->integer('year')->nullable();
        });

        Schema::table('vac', function (Blueprint $table) {
            $table->integer('year')->nullable();
        });
    }
}
