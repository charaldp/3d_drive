<?php
namespace App\Models;

use App\User;

trait ModelUtilities {

    public function user() {
        return $this->belongsTo(User::class);
    }
}
