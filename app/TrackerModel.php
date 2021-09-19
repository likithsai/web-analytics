<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TrackerModel extends Model
{
    protected $table = 'tracker_models';
    protected $primaryKey = 'tracker_id';
    protected $fillable = [
        'tracker_uid',
        'tracker_clientip',
        'tracker_data'
    ];
}
