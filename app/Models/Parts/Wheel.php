<?php

namespace App\Models\Parts;

use Illuminate\Database\Eloquent\Model;
use App\Models\Parts\Rim;
use App\Models\Parts\Tire;

class Wheel extends Model
{
    protected $table = 'wheels';

    protected $attributes = [
        'name' => 'Flat 55',
    ];

    public function tire() {
        return $this->hasOne(Tire::class, 'tire_id');
    }

    public function rim() {
        return $this->hasOne(Rim::class, 'rim_id');
    }
}
