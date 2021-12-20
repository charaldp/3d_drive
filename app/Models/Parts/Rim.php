<?php

namespace App\Models\Parts;

use Illuminate\Database\Eloquent\Model;

class Rim extends Model {
    protected $table = 'rims';

    protected $casts = [
        'type_dimensions' => 'array',
    ];

    protected $fillable = [
        'type_dimensions',
        'ribs',
    ];

    public function dimension_names() {
        return [
            'DO' => 'rim_dimensions.DO',
            'DI' => 'rim_dimensions.DI',
            't' => 'rim_dimensions.t',
            'intrWidth' => 'rim_dimensions.intrWidth',
            'numRibs' => 'rim_dimensions.numRibs',
            'tRib' => 'rim_dimensions.tRib',
            'dRib' => 'rim_dimensions.dRib',
            'ribsPosition' => 'rim_dimensions.ribsPosition',
            'axleIntrWidth' => 'rim_dimensions.axleIntrWidth',
            'axleDI' => 'rim_dimensions.axleDI',
            'axleDO' => 'rim_dimensions.axleDO',
            'tAxle' => 'rim_dimensions.tAxle',
        ];
    }

    public static $creation_attributes = [
        'rim_type' => 'ribs',
        'type_dimensions' => [
            "DO" => 0.43,
            "DI" => 0.4,
            "t" => 0.15,
            "intrWidth" => 0.022,
            "numRibs" => 1,
            "tRib" => 0.015,
            "dRib" => 0.030,
            "ribsPosition" => 0.12,
            "axleIntrWidth" =>-0.01,
            "axleDI" => 0.01,
            "axleDO" => 0.08,
            "tAxle" => 0.02
        ],
    ];
}
