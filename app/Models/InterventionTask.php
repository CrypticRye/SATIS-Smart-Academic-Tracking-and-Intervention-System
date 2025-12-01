<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InterventionTask extends Model
{
    protected $fillable = [
        'intervention_id',
        'description',
        'is_completed',
    ];

    protected $casts = [
        'is_completed' => 'boolean',
    ];

    public function intervention()
    {
        return $this->belongsTo(Intervention::class);
    }
}
