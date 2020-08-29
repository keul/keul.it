---
title: "Chrome for Web development: permissive CORS access and SameSite cookies"
date: "2020-08-29T12:14:00+0200"
description: "A big changes has been pushed recently to every recent Chrome out there: an important change to SameSite cookies policy. How this messed up my development environment and how I fixed it"
---

```toc
# This code block gets replaced with the TOC
exclude: Table of Contents
```

# A resume

I've a development environment for working with Chrome in a Web development project.

In this project I have to work with **remote REST API** even when developing locally (there's no way I can run a "local API server" of this service due to complexity of the infrastructure).

What's the issue with that? **CORS obviously**...

The API I'm using is not supporting CORS because it is designed to be a same-site API.
Adding CORS support "just for development" can be tricky (many stack layers involved, not all of them under our control).

So the simplest answer I found to solve this issue was **disabling CORS for development**.

There's a tons of resources on how to do this way of doing that:

- Browsers extensions
- Middleware
- CORS-anywhere services

In _that specific project_ none of them easily solved my issues.
The most tricky ones: I need to pass through authentication cookies.
The API is not even supporting HTTP OPTIONS responses, while some of these browser plugins hack the OPTIONS response.

My final solution, _very_ simple that didn't require any 3rd party stuff and that worked smoothly for a very long time, was **enabling some Chrome's feature flags through command line**.

Unluckily Chrome/Chromium is the only browser supporting this solution.

Then, recently, this method stopped working due to SameSite cookies policy changes pushed on every recent Chrome versions.

😤

Luckily I found how to solve this.

# The magical command for an unstable Chrome

This is the command line script I used (for MacOS):

open -a Google\ Chrome --args --disable-web-security --allow-running-insecure-content --user-data-dir="/Users/keul/tmp"

_Note_: be sure to not have other Chrome instances active or this will not work.

When opening Chrome with these flags you will find a warning message at the top:

![Chrome warning](./chrome-warn.png)

Translated from my italian localization, the message says:

> You are using an unsupported command-line flag: --disable-web-security. Stability and security will suffer.

Chrome claims that `--disable-web-security` and `--allow-running-insecure-content` are "unsupported", but they works... for now.
Just note that now **your browser is now a dangerous place**.

This is why I don't just hack with chrome://flags/ directly for example: although I'm not a Chrome user and I use Firefox for everything else, sometimes I need to access Chrome (for example: running Google Meet which [continues to sucks on Firefox](https://twitter.com/keul/status/1245636015143833601)) and when I do it I want to use a _real_ Chrome with every security settings enabled.

Finally the `--user-data-dir="/a/directory"` will use a separate profile, which enhance my security (you will find Web pages that simply uses `--user-data-dir=""` but [this stopped working some times ago](https://twitter.com/keul/status/1232217697443831809)).

Why this configuration is dangerous?
Well... CORS is here for security reasons, not (only) to make developers life a nightmare.

So: I have this bash script (mine is called `unstable-chrome`) that runs Chrome with development settings on demand.

# SameSite cookie policy, CSRF, and the global pandemic

Let me say that the new features introduced by Chrome, the [SameSite cookies policy](https://web.dev/samesite-cookies-explained/), is _great_ for security.
If this behavior has been part of the Web platform from the beginning, security issues like [CSRF](https://en.wikipedia.org/wiki/Cross-site_request_forgery) would never happen.

Roughly speaking: the policy introduce a new cookie attribute `SameSite`.
The historical browsers behavior is equivalent to set a cookie as `SameSite=None`, so the cookie is sens to the proper server with any kind of request.

Using a value like `Strict` means that the cookie will only be sent if the site for the cookie matches the current site from the URL bar.

The change pushed by Chrome ([SameSite cookie support on browsers](https://caniuse.com/#feat=same-site-cookie-attribute) is high, but the attribute has been ignored by developers) modify the default behavior from `None` to `Lax`.

Obviously introducing such big breaking change at some point is a different matter: Google knew this would break stuff.
The big change was expected for Chrome 80 but with the Coronavirus outbreak Google went for a delay.

After my summer holiday few days ago, I opened Chrome after a while, updated it to version 86, then I found that my unrescricted access to API was broken.

`SameSite` is here to stay.

# Fix of the issue

I'm one of the (many) developer that ignored the existence of `SameSite`, but when I started reading about this because of the Chrome plan to change the default, one of my first question has been:

> There's a way to disable it? Maybe my `--disable-web-security` will just do the trick?
