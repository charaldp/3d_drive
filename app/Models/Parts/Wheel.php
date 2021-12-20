<?php

namespace App\Models\Parts;

use Illuminate\Database\Eloquent\Model;

class Wheel extends Model
{
    protected $table = 'wheels';

    protected $attributes = [
        'name' => 'Flat 55',
    ];
}
