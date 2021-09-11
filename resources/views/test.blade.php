<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <a href="#main-link" id="main">Local Links</a><br />
    <a href="https://www.google.com">google</a><br />
    <a href="#main">id</a>

    <script src="{{ asset('js/tracker.min.js') }}"></script>
    <script type="text/javascript">
        simpleTrack.onTrack('suacuaysc', { trackLink: true, trackDesc: 'sample Example' }, function() {
            simpleTrack.createEvent('a#main', 'click', { eventName: 'this is sample lisk', eventCategory: 'Videos' });
        });
    </script>
</body>
</html>