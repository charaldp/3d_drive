<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Models\Wheel;
use App\Models\Rim;
use App\Models\Car;
use App\Models\Tire;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function wheels() {
        return $this->hasMany(Wheel::class, 'user_id');
    }

    public function rims() {
        return $this->hasMany(Rim::class, 'user_id');
    }
    public function cars() {
        return $this->hasMany(Car::class, 'user_id');
    }
    public function tires() {
        return $this->hasMany(Tire::class, 'user_id');
    }
}
