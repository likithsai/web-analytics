<?php

namespace App\Http\Controllers;

use App\TrackerModel;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
class Tracker extends Controller
{
    // function to get data from database
    public function showTrackerData($id)
    {
        return DB::table('tracker_models')->where('tracker_uid','=', $id)->first()->tracker_data;
    }

    public function createTracker(Request $request)
    {
        $res = file_get_contents('php://input');
        $t_data = array();

        try {
            $t_uuid = json_encode(json_decode($res, true)[0]['id']);
            if (sizeof(json_decode($res)) > 1) {
                for ($arCount = 0; $arCount <= sizeof(json_decode($res)) - 1; $arCount++) {
                    array_push($t_data, json_decode($res, true)[$arCount]['data']);
                }
            } else {
                // $t_data = json_decode($res, true)[0]['data'];
                array_push($t_data, json_decode($res, true)[0]['data']);
            }
            $t_data['client_ip'] = $request->getClientIp();

            $tracker = new TrackerModel;
            $user = $tracker::firstOrNew(array('tracker_uid' => $t_uuid));
            $user->tracker_data = json_encode($t_data);
            $user->save();

            // return $t_data;
            return json_decode(Tracker::showTrackerData($t_uuid), true);
        } catch (\Exception $e) {
            return $e->getMessage();
        }
    }
}
