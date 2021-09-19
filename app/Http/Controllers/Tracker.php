<?php

namespace App\Http\Controllers;

use App\TrackerModel;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class Tracker extends Controller
{
    public function createTracker(Request $request)
    {
        $res = file_get_contents('php://input');

        try {
            $t_uuid= json_encode(json_decode($res, true)[0]['id']);
            $t_data = json_decode($res, true)[0]['data'];
            $t_data['client_ip'] = $request->getClientIp();

            $tracker = new TrackerModel;
            $user = $tracker::firstOrNew(array('tracker_uid' => $t_uuid));
            $user->tracker_data = json_encode($t_data);
            $user->save();

            return $res;
        } catch (\Exception $e) {
            return $e->getMessage();
        }
    }
}
