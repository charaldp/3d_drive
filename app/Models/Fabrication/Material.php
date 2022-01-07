<?php

namespace App\Models\Fabrication;

use Illuminate\Database\Eloquent\Model;
use App\Models\ModelUtilities;
class Material extends Model
{
    use ModelUtilities;

    protected $table = 'materials';

    protected $fillable = [
        'user_id',
        'three_material_type',
        'three_material_options',
    ];

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

    public static $creation_attributes = [
        'id' => 0,
        'three_material_type' => 'MeshBasicMaterial',
        'three_material_options' => ["shininess" => 50, "colour"  => "0x1b1b1b"],
    ];
}
