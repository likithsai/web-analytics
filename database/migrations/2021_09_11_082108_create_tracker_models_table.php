<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTrackerModelsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tracker_models', function (Blueprint $table) {
            $table->increments('tracker_id');
            $table->string('tracker_uid');
            // $table->string('tracker_clientip');
            $table->longText('tracker_data');

            // $table->string('tracker_ip');
            // $table->string('tracker_tid');
            // $table->string('tracker_url');
            // $table->string('tracker_title');
            // $table->string('tracker_domain');
            // $table->string('tracker_charset');
            // $table->string('tracker_device');
            // $table->string('tracker_useragent');
            // $table->string('tracker_referrer');
            // $table->string('tracker_os');
            // $table->string('tracker_loadtime');
            // $table->string('tracker_internalLinks');
            // $table->string('tracker_lastModified');
            // $table->string('tracker_time');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tracker_models');
    }
}
