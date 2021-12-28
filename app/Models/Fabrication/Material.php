<?php

namespace App\Models\Farication;

use Illuminate\Database\Eloquent\Model;
use App\Models\ModelUtilities;
class Material extends Model
{
    use ModelUtilities;

    protected $table = 'materials';

    protected $casts = [
        'three_material_options' => 'array',
    ];

    public static function material_types() {
        return [
            'MeshBasicMaterial',
            'MeshDepthMaterial',
            'MeshDistanceMaterial',
            'MeshLambertMaterial',
            'MeshMatcapMaterial',
            'MeshNormalMaterial',
            'MeshPhongMaterial',
            'MeshPhysicalMaterial',
            'MeshStandardMaterial',
        ];
    }

    protected $attributes = [
        'material_type' => 'phong_aterial',
        'three_material_options' => ["shininess" => 50, "colour"  => "0x1b1b1b"],
    ];
}
