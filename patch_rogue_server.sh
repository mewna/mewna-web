#!/bin/bash

# Sets the bundle path to be absolute (/bundle.js) rather than relative (bundle.js)
# Also wrap the bundle in quotes just to be safe
# ... After writing "bundle" so much, it no longer feels like a real word
sed -i -e 's|"<script src=" + bundleUrl + " defer /></script>"|"<script src=\\\"/" + bundleUrl + "\\\" defer /></script>"|' \
    ./node_modules/\@roguejs/app/dist/web/server*.js

# Inject the ability to use getInitialProps on subcomponents by passing down
# the context on the server, so we can call it from a custom route component.
sed -i -e 's|var ctx = getContext({ req, res });|var ctx = getContext({ req, res }); routerContext = { url: null, injected: ctx };|' \
    ./node_modules/\@roguejs/app/dist/web/server*.js
