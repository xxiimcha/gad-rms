<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use App\Models\City;

class CitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        /*$cities=[
            array('name' => "Caloocan City"),
            array('name' => "Las Piñas City"),
            array('name' => "Makati City"),
            array('name' => "Malabon City"),
            array('name' => "Mandaluyong City"),
            array('name' => "Manila City"),
            array('name' => "Marikina City"),
            array('name' => "Muntinlupa City"),
            array('name' => "Navotas City"),
            array('name' => "Parañaque City"),
            array('name' => "Pasay City"),
            array('name' => "Pasig City"),
            array('name' => "Pateros"),
            array('name' => "Quezon City"),
            array('name' => "San Juan City"),
            array('name' => "Taguig City"),
            array('name' => "Valenzuela City")
        ];

        foreach($cities as $city){
            City::create([
                'name' => $city['name']
            ]);
        } */
        City::create([ 'name' => 'Pasig City']);
    }
}
