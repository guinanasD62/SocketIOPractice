<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExportHistory extends Model
{
    use HasFactory;

    protected $table = 'export_history';

    protected $fillable = [
       'id',
        'userid',
        'managerid',
        'description',
        'status',
        'notes',
        'start_time',
        'end_time',
        'date',
        'created_at',
        'updated_at',
        'duration'
    ];
}
