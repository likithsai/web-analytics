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
            $tracker = new TrackerModel;
            $tracker->tracker_ip = $request->getClientIp();
            $tracker->tracker_tid = json_decode($res, true)["id"];
            $tracker->tracker_url = json_decode($res, true)["url"];
            $tracker->tracker_title = json_decode($res, true)["title"];
            $tracker->tracker_domain = json_decode($res, true)["domain"];
            $tracker->tracker_charset = json_decode($res, true)["charSet"];
            $tracker->tracker_device = json_encode(json_decode($res, true)["device"]);
            $tracker->tracker_useragent = json_decode($res, true)["userAgent"];
            $tracker->tracker_os = json_decode($res, true)["operatingSystem"];
            $tracker->tracker_loadtime = json_decode($res, true)["timeTakenToLoad"];
            $tracker->tracker_internalLinks = json_encode(json_decode($res, true)["internalLinks"]);
            $tracker->tracker_lastModified = json_decode($res, true)["lastModified"];
            $tracker->tracker_time = json_decode($res, true)["time"];
            $tracker->save();
        } catch (\Exception $e) {
            return $e->getMessage();
        }

        return json_decode($res, true);
    }
}
