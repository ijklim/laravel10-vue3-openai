<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class OpenAIController extends Controller
{
    /**
     * Establish connection to OpenAI server
     *
     * @param string $endPoint e.g. models/davinci
     * @param array $parameters
     */
    public static function request($endPoint, $parameters = [])
    {
        $host = 'https://api.openai.com/v1';
        $url = "$host/$endPoint";

        // Send request to remote api and retrieve json data
        $request = \Illuminate\Support\Facades\Http
            ::withToken(env('OPENAI_API_KEY', ''))
            ->acceptJson();

        return count($parameters) ? $request->post($url, $parameters) : $request->get($url);
    }
}
