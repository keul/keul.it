---
title: "Chrome for Web development: permissive CORS access and SameSite cookies"
date: "2020-08-29T12:14:00+0200"
description: "A big changes has been pushed recently to every recent Chrome out there: an important change to SameSite cookies policy. How this messed up my development environment and how I fixed it"
---

```toc
# This code block gets replaced with the TOC
exclude: Table of Contents
```

## A resume

Subject: a local development environment where working with Chrome for a Web development project.

So, there's this project where I have to work with **remote REST API** even when developing locally (no way I can run a "local API server" of this service due to complexity of the infrastructure).

What's the issue with that? **CORS obviously**...
Some of the APIs I'm using are **not supporting CORS** because designed to be same-site.

Adding CORS support "just for development" can be tricky (many stack layers involved, not all of them under our control).

So the simplest solution I found to solve this issue was **disabling CORS for development**.

There's a tons of resources on how to do this way of doing that:

- Browsers extensions
- Middleware
- CORS-anywhere services

In _that specific project_ none of them easily solved my issues, more specifically, mostly because I need to pass through authentication cookies.
Another important detail: the API is not even supporting HTTP OPTIONS requests, while some of these browser plugins just try to hack response to OPTIONS.

My final _very_ simple solution that didn't require any 3rd party stuff and that worked smoothly for a very long time, was **enabling some Chrome's feature flags through command line**.

Unluckily Chrome/Chromium is the only browser supporting this solution.

Then, recently, this method stopped working due to SameSite cookies policy changes pushed on every recent Chrome versions.

😤

Luckily I found how to solve this.

## The magical command for an unstable Chrome

This is the command line script I used (works for MacOS but you can change it for Linux accordingly):

```bash
open -a Google\ Chrome \
    --args --disable-web-security --allow-running-insecure-content \
    --user-data-dir="/Users/keul/tmp"
```

_Note_: be sure to not have other Chrome instances active or this will not work.

When opening Chrome with these flags you will find a warning message at the top:

![Chrome warning](./chrome-warn.png)

Translated from my italian localization, the message says:

> You are using an unsupported command-line flag: --disable-web-security. Stability and security will suffer.

Chrome claims that `--disable-web-security` and `--allow-running-insecure-content` are "unsupported", but they works... for now.
Just note that now **your browser is now a dangerous place**.

This is why I don't just hack with chrome://flags/ directly for example: although I'm not a Chrome user and I use Firefox for everything else, sometimes I need to access Chrome.
For example: running Google Meet which [continues to sucks on Firefox](https://twitter.com/keul/status/1245636015143833601)) and when I do, I want to use a _real_ Chrome with every security settings enabled.

Finally the `--user-data-dir="/a/directory"` will use a separate profile, which enhance my security (you will find Web pages that simply uses `--user-data-dir=""` but [this stopped working some times ago](https://twitter.com/keul/status/1232217697443831809)).

Why this configuration is dangerous?
Well... CORS is here for security reasons, not (only) to make developers life a nightmare.

So: I have this bash script (mine is called `unstable-chrome`) that runs Chrome with development settings on demand.

## SameSite cookie policy, CSRF, and the global pandemic

Let me say that the new features introduced by Chrome, the [SameSite cookies policy](https://web.dev/samesite-cookies-explained/), is _great_ for security.
If this behavior has been part of the Web platform from the beginning, security issues like [CSRF](https://en.wikipedia.org/wiki/Cross-site_request_forgery) would never happen.

Roughly speaking: the policy introduce a new cookie attribute `SameSite`.
The historical browsers behavior is equivalent to set a cookie as `SameSite=None`, so a cookie is sent to proper site with any kind of request.

Using a value like `Lax` means that the cookie will only be sent if the site for the cookie matches the current site from the URL bar.
There's also `Strict` which is even more restricted.

Note that this is now a new technology or API: [`SameSite` cookie support on browsers](https://caniuse.com/#feat=same-site-cookie-attribute) is already very high, but the attribute has been ignored by developers... 🖐 <br>
The change pushed by Chrome is about modify the **default behavior from `None` to `Lax`**.

Obviously this can be a huge breaking change and Google knew this would break stuff.
The big change was expected for Chrome 80 but with the Coronavirus outbreak Google went for a delay.

After my summer holiday, few days ago, I opened Chrome after a while, updated it to version 86, then I found that my unrescricted access to API was broken.

Welcome `SameSite`.

## Fix of the issue

I'm one of the (many) developer that ignored the existence of `SameSite`, but when I started reading about this because of the Chrome plan to change the default, one of my first question has been:

> There's a way to disable it? Maybe my `--disable-web-security` will just do the trick?

No. 😭

So, I spent some time trying to solve this (this is never easy when talking about Chrome changes) and, by combining some different articles I finally found how to solve.

This is my new `unsafe-chrome` script:

```bash{4}
open -a Google\ Chrome \
    --args --disable-web-security --allow-running-insecure-content \
    --user-data-dir="/Users/keul/tmp" \
    --disable-features=SameSiteByDefaultCookies,SameSiteDefaultChecksMethodRigorously
```

Now my development Chrome configuration is still unstable but perfectly working as before, sending my cookies all around.

Again: do not use this for anything else than just development.
