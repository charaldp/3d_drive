<?php

namespace App\Models\Parts;

use Illuminate\Database\Eloquent\Model;

class Tire extends Model
{
    //
    protected $table = 'tires';

    protected $fillable = [
        'user_id',
        'material_id',
        'type_dimensions',
        'tire_type',
    ];

    protected $casts = [
        'type_dimensions' => 'array',
    ];

    public function dimension_names() {
        return [
            "DO" => "DO",
            "DI" => "DI",
            "t" => "t",
        ];
    }

    public static $creation_attributes = [
        'id' => 0,
        'material_id' => 0,
        'name' => 'New Tire',
        'tire_type' => 'Flat',
        'type_dimensions' => [
            "DO" => 0.43,
            "DI" => 0.4,
            "t" => 0.15,
        ]
    ];
}
