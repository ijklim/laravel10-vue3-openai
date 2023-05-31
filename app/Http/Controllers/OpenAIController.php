<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class OpenAIController extends Controller
{
    public static $host = 'https://api.openai.com/v1';

    /**
     * Create Http object with connection to OpenAI server
     */
    public static function connect()
    {
        return \Illuminate\Support\Facades\Http
            ::withToken(env('OPENAI_API_KEY', ''))
            ->acceptJson();
    }

    /**
     * Make a get request to OpenAI server
     *
     * @param  \Illuminate\Http\Request $request
     * @param  string  $slug
     */
    public static function get(Request $request, $slug)
    {
        $url = static::$host . "/$slug";

        return self::connect()->get($url);
    }

    /**
     * Make a post request to OpenAI server
     *
     * @param  \Illuminate\Http\Request $request
     */
    public static function post(Request $request)
    {
        $url = static::$host . '/' . $request['endPoint'];

        return self::connect()->post($url, $request['parameters']);
    }
}
