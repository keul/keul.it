---
title: CORS issue due to aggressive Chrome cache
date: "2021-06-19T11:15:00+0200"
description: Quick analysis of a CORS issue that only hit Chrome.
---

```toc
# This code block gets replaced with the TOC
exclude: Table of Contents
```

## The env

So… I've this application where the customer asked to add a **snapshot feature** of an output result.
I was worried about this feature request, because the output is not a canvas but just a DOM node with HTML stuff inside, then I found this [dom-to-image lib](https://github.com/tsayen/dom-to-image) which works like a charm.

The [general idea](https://github.com/tsayen/dom-to-image#how-it-works) of the lib is:

- clone the whole node content
- compute styles, add font and images…
- serialize cloned node
- embed everything inside an SVG
- export to PNG

## CORS

After the first iteration we found a small bug due to CORS limitation in one of our deployment.

Although the data (in our case: images from a [WMS](https://en.wikipedia.org/wiki/Web_Map_Service) service) displayed inside the output widget always origin from a main domain like _official.domain.eu_, the application is also hosted on other domains like _external.domain.net_.

Everything was working from official.domain.eu but as soon as snapshot feature landed on external.domain.net we received a bug report: the snapshot was not working there.

Inspecting the network tab we found that a CORS failure: when the snapshot procedure is activated, a series of XHR requests are performed. As requests target official.domain.eu we need CORS to be enabled to make it works.<br>
I'm not sure why the lib is using AJAX requests for downloading these resources but we have the control of the NGINX server so it's quite easy to enabled CORS for external.domain.net.

```
add_header 'Access-Control-Allow-Origin' $origin;
```

## CORS again

After the change above the issue has been fixed in Firefox but not in Chrome. 😣
How can this be possible?

The Chrome console still complains about the missing header:

```
Access to XMLHttpRequest at 'https://official.domain.eu/somewhere/something' from origin 'external.domain.net' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

And it's right: the header is missing, while it's there in Firefox. 🤯

## Aggressive cache

To understand the issue let's recap how the snapshot feature works.

- We display a "widget" on the page, inside the DOM
- The widget structure requires the download of additional resources, like images (first set of requests)
- The snapshot feature (roughly speaking) clones the DOM content, and performs additional XHR requests to the same resources (second set of requests)

What is the difference between the first and second set of requests as they are calling the very same resources?<br>
As the second set is populated by JavaScript cross origin requests, every request will includes the [`Origin header`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin).

This header is used to:

- validate the origin on the server
- fill the proper `Access-Control-Allow-Origin` (see NGINX rule above).

Finally: remember we are inside a browser environment, so every request can be cached.

### The Firefox way

Let's take an example resource like _https://official.domain.eu/somewhere/something_.<br>
The first time Firefox opens the application, it will display the resource on the DOM so it performs a request.
As this is not AJAX, but just an `<img>` tag, our request is missing the `Origin` header and the response will miss the `Access-Control-Allow-Origin`.

When we click on the snapshot button it will download the resource again, ignoring the cache as _this_ new request is a cross-origin ones and will include the `Origin` header (so it's formally a different request).
This new response will contains the `Access-Control-Allow-Origin`.

If we reload the page things continue to work properly even if this time both requests are resolved from the cache (two different cache entries I guess).

### The Chrome way

Let see how Chrome 91 tries be "smart".

The first time Chrome opens the application it behave like Firefox: the image is downloaded from the network.
Again: no `Origin` header in request and no `Access-Control-Allow-Origin` in response.

But when we click on the snapshot button Chrome acts differently: it recognize the resource is inside the cache (filled with the request above) and it tries to use it.<br>
So our AJAX request gets back (from the cache) a response without the `Access-Control-Allow-Origin` and we get the CORS error.

It seems that Chrome is reusing the same request from the cache although the request should be a different ones.

If we disable the Chrome cache completely, everything works properly.

## The fix

Initially I was pretty sure this was a Chrome bug and Firefox "was right", but it seems it's not true [as detailed in this bug report](https://bugs.chromium.org/p/chromium/issues/detail?id=260239) and the way [CORS should act with HTTP cache](https://fetch.spec.whatwg.org/#cors-protocol-and-http-caches).

We can easily solve the issue by providing:

- an `Access-Control-Allow-Origin: *`, or…
- an additional `Vary: Origin` header (see [`Vary`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary))

The last one is preferred in our case.

## Conclusion

It's not the first time in my experience that `Vary` header fixed an issue with cache.<br>
Generally speaking: the **browser cache technology is rock solid** and implemented by every browser down to IE 9 probably (and no "polyfill" needed!).

Sometimes you don't need a new CMS, or migrate to a static site generator: just learn how cache works.
