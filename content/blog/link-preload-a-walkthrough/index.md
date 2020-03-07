---
title: A walkthrough on prioritizing resource load using link preload
date: "2020-03-07T15:08:00+0200"
description: Using a "preload" link can be the Holy Grail for boosting performance on some applications, but enabling it is not so straightforward.
---

Last week I worked on an front-end performance optimization task for a project.
The front-end of this application (my domain) is a React application, but this is not important.

What I addressed is moving from a situation like this...

![Page situation before optimization](./pre-preload-link-nocache.png)

...to something like this...

![Page situation after optimization](./post-preload-link-nocache-1.png)

Before focusing on the top overview timeline where it seems it goes from 4.5 sec to 2.5 sec, let me say this is not strictly true:
this is a development server, response time change a lot, browser cache is disabled (because we need to inspect new users).

_But_, in any case, every test I did never gone under 1 second gain, which is _a lot_.

Did I refactored my JavaScript code from scratch? Did I found a huge infinite loop? Did I changed my machine or network to a 10x more powerful one?<br>
No!

I "simply" performed a couple of [resource preload](https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content) using `link rel="preload"`.

What this meant for my application? Two very important calls are not serialized anymore but **performed in parallel with no side effects**.

I'm writing this post because _this has not been exactly easy_ and I didn't find a single tutorial that contained all of the issues I faced.

Now, please sorry, but to fully understand further you need some context on the application.

# Few information about the service

Let me introduce some general information on the application itself.

- The JavaScript application on its own can't do nothing interesting
- The application need to download a **configuration.json** file

  ![Network request for configuration.json](./configuration-detail.png)

- This configuration file contains a lot of data but what it's important for us is:

  - an URL to a remote API service
  - default parameters to run this **remote process execution**.

  This remote call must per performed as soon as possible.

  ![Network request for process execution](./workflow-detail.png)

- Based on the configuration, the application can load additional chunks of code (some of them are pretty big and not frequently used, so it's OK to not waste user's bandwidth downloading them for every user)
- The API response depends on the configuration itself and commonly contains URI to additional resources (most of the times: images or JSON files).

  Downloading this final data is essential for displaying something useful to the user.
  In our simple example the final output is a JSON compatible with the [plotly.js library](https://plot.ly/javascript/).

  ![Network request for plotly.js JSON](./result-detail.png)

This was the general workflow of the application, but let me highlight more:

- Until the main JavaScript code has not been loaded we display a spinner (I know, I know... no SSR yet).
- Until the `configuration.json` has not been loaded we can't say anything about what to show on the screen, so we just display a loading indicator.
- When both the main JavaScript source and the configuration file are loaded we can both:

  - start the execution (by calling the API)
  - load additional chunks (if needed).

- All these resources are cached in the browser (but as I said we were working for improving the first-visit journey) and in a **caching HTTP reverse proxy**.

  Almost all resources in the list, apart the main page which is cached for a short time, never change.
  _Please note_: effects of this caching layer is not visible in this example.

One final note: you probably already noted that API call if performed with an HTTP GET method (with parameters as query string arguments).
The application can (and most of the times will) use a more common HTTP POST.

When applicable (not doable for every kind on application) using GET make the request call easier to be cached in the reverse proxy.
Caching a POST is doable, but not so easy to be inspected.

# The journey to the performance land

## What we can do better?

Let recap our weak points.
We have three main entities:

- The JavaScript main file
- The configuration file
- The request API call

The former version of the application was downloading and parsing bundle _then_ fetching the `configuration.json` _then_ calling the API.

But our server (a Python based API) is already aware of the JSON file itself

Now let's detail every attempt.

## Enabling preload

I was already aware of some of the issues I encountered, but I was still hoping that all could work by simply doing following change.

My first step was to add
