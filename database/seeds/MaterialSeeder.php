<?php

use Illuminate\Database\Seeder;
use App\User;

class MaterialSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $user_id = User::first()->id;
        DB::table('materials')->insert([
            'user_id' => $user_id,
            'name' => 'tire',
            'three_material_type' => 'MeshPhongMaterial',
            'three_material_options' => json_encode(['shininess' =>  50, 'color' => '0x1b1b1b' ]),
        ]);

        DB::table('materials')->insert([
            'user_id' => $user_id,
            'name' => 'rim',
            'three_material_type' => 'MeshPhysicalMaterial',
            'three_material_options' => json_encode(['color' =>  '0xd7d7d7', 'roughness' => 0.17, 'metalness' => 0.47, 'reflectivity' => 1, 'clearcoat' => 0.64, 'clearcoatRoughness' => 0.22 ]),
        ]);

        DB::table('materials')->insert([
            'user_id' => $user_id,
            'name' => 'building',
            'three_material_type' => 'MeshLambertMaterial',
            'three_material_options' => json_encode(['color' =>  '0xcccccc', 'opacity' => 0.95, 'transparent' => true ]),
        ]);

        DB::table('materials')->insert([
            'user_id' => $user_id,
            'name' => 'ground',
            'three_material_type' => 'MeshBasicMaterial',
            'three_material_options' => json_encode(['color' =>  '0x77aa22', 'side' => 'FrontSide', 'opacity' => 0.65, 'transparent' => true ]),
        ]);
    }
}
