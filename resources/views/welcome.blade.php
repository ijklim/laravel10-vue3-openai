<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>AI Toolbox</title>

        <!-- === Fonts === -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,600&display=swap" rel="stylesheet" />

        <!-- === Icon Font used by Vuetify === -->
        <link href="https://cdn.jsdelivr.net/npm/@mdi/font@7.2.96/css/materialdesignicons.min.css" rel="stylesheet">

        <!-- === Google AdSense ===  -->
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3117776653960390" crossorigin="anonymous"></script>

        @vite(['resources/js/app.js'])
    </head>
    <body>
        <div id="app"></div>
    </body>
</html>
