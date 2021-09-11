<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TrackerModel extends Model
{
    protected $table = 'tracker_models';
    protected $primaryKey = 'tracker_id';
    protected $fillable = [
        'tracker_ip',
        'tracker_tid',
        'tracker_url',
        'tracker_title',
        'tracker_domain',
        'tracker_charset',
        'tracker_device',
        'tracker_useragent',
        'tracker_os',
        'tracker_loadtime',
        'tracker_internalLinks',
        'tracker_lastModified',
        'tracker_time'
    ];
}
