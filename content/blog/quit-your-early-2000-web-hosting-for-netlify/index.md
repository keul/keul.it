---
title: How to quit your early 2000 web hosting for Netlify and Gatsby
date: "2019-06-01T10:19:52+0200"
description: A story about how I moved away from a legacy (and expensive) mess of hosting service keeping some historical contents. And save €€€.
---

This is not a story about how cool is the [Netlify service](https://www.netlify.com/) or how much [GatsbyJS](https://www.gatsbyjs.org/) is awesome and blablabla...
There's tons of stuff like this available on the Web.

# Straight to the point

* I'm a JavaScript developer, mostly working with React recently
* I have some general knowledge of GatsbyJS (played with an old version)
* I have some knowledge of GraphQL, although I'm not using it on daily basis
* On Twitter, I'm following lot of people in love with Netlify

So, apart JavaScript/React (technology behind Gatsby) I'm a total rookie in this infrastructure.
I just read few articles like [this](https://www.gatsbyjs.org/docs/hosting-on-netlify/) and [this](https://www.gatsbyjs.org/starters/gatsbyjs/gatsby-starter-blog/).

This has been enough to me for creating a new github repository.
A new website (just a blog for now).

But the most important information I found, the one that made me think "I want to try this stuff" is the fact that [Netlify can manage redirects](https://www.netlify.com/docs/redirects/).

So I have a `_redirects` files with stuff like this inside:

```
/2011/04/plone-portlets-are-not-enemies-just.html				https://lucafbb.blogspot.com/2011/04/plone-portlets-are-not-enemies-just.html
/2011/06/z3cjbot-magical-with-your-skins.html					https://lucafbb.blogspot.com/2011/06/z3cjbot-magical-with-your-skins.html
...
```

That's all you need to know. With this few information I was able to **move away from my legacy blog engine** and, more important, **I'm free to dismiss an expensive hosting infrastructure**.

But now, let's start from the beginning.

# My blog on blogspot.com

I used to have an blog.
I started writing it on 2011 and I actively put material on it until end 2013 (a couple of articles also on 2014).

What's happened?
It's a very common story:

* shortage of free time (my first daughter born on end 2013... is this a coincidence? No... is not)
* at the same time I was loosing interest on the main Python technology I was mostly blogging about.

So I simply stopped writing articles at all.

Years passed and sometimes I still fiddled with the idea to have a blog again, because I started doing new stuff.
But there's a problem: my old blog was published under a premium domain as "blog.keul.it".

So, can be possible to:

* keep this domain (well... not exactly... see below)
* change the blog engine
* do not loose old articles

Blogger was probably a good choice in 2011 but not that much today.
The blog layout has been customized in ways I really don't remember, I added spaghetti-code based on jQuery for adding simple features like lightbox and color highlight.
Looking into this mess (not under version control at all, all has been done TTW) will not be funny.

Alternatives?

For a while I started looking at Medium, but as you probably know there's a trend to leave it due to paywall issues.

Recently I see smart people started using [dev.to](https://dev.to/) which seems pretty cool.

I also evaluated to just use LinkedIn posts.
My personal, opinionated, though on that: LinkedIn is sitting on a platform which could be a central blogging system, but it's too limited.
And buggy.

Whatever... there's always an issue that haunt me:

> how can I keep my old articles online without messing up the SEO?

Most of them are garbage but few of them incredibly still gets lot of visitors every month.

I can probably live without this... this blog is not giving me any value today, but I really don't like the idea to see those articles lost in entropy.

Still, nobody gives you a cheap nginx/apache to keep up old posts URL (or properly manage redirects).

Wait... but I already have an Apache! And I'm paying for it!

# Original Sin

There's another, older, story that started in year 2005.
Berlusconi was heading Italian Government, some good movies were released ("V for Vendetta", "Batman Begins", ...).

At that time a Young and Charming Developer had a terrible idea: **buy a personal domain**.
"Why?" you asked? Because he believed it was "cool" and "professional" (keep in mind I graduated in mid 2003).

In the price of the domain I got also domain email address (*worst* idea ever) and some web space.

Let's recap how much this was expensive:

* Domain 35,00€/year
* Linux "developer" hosting 85,00€/year

This was _without_ VAT (that was 20% at the time... 20%... not 21 or 22, 25 or 26,5).

So, the total _was_ 42€ (domain) + 102€ (hosting).

And this was in the 2005, now the domain is _even more_ expensive.

The hosting included FTP access (still FTP today... not secure), some raw Apache configuration (no full access to an `http.d` conf), MYSQL (you call it "MariaDB" today?) unlimited filesystem space and... PHP.

Ok... at that time I don't remember if I was still a Java developer or already moved to Python... in any case PHP was not exactly something I liked, but it was a opportunity for "adding some backend".
PHP was (is still probably) cheap... nobody will give you easily ssh access to a server to do some Python.

So why I bought it?
The same Old Error, the "One day I will" syndrome:

> "One day I will create my personal site, then... who knows? Maybe I will develop my personal blog engine?".

Jesus... what an incredible amount of free time.

Having a personal web site at the time was cool? Don't know, maybe not that much like in the mid-90nties, but not uncommon as it's today.
Keep in mind I'm not a freelance, I'm pretty sure that this can be important for a guy who need to sell itself as a company.

But for me this has been a waste of money.
I never used the PHP support apart some basic stuff, I don't have anymore any FTP access configured (the service deleted my last ones years ago automatically after security issues that hit other users)... and I don't want it anymore.

But every year, in the renewal period, I ended saying "Ok, maybe next year".

Laziness and procrastination.

# SSL

During one of my evaluation of new blogging service I also looked back to blogger itself, going into "settings" to see new features.

At that point I found the SSL support.

"Well... in facts my blog is still on plain HTTP.
We live in the ages of [Letsencrypt](https://letsencrypt.org/) so I'm sure my provider will give me an SSL cert without carrying additional €".

So I asked for it.
This is the reply from the service (translated from italian):

> Linux development hosting solution currently active do not include free SSL.
>
> If you like to proceed you should buy an SSL cert, you can find additional information here:
>  
> http://www.register.it/ssl-certificates/

So... I need to may 70€ (+ VAT) at year for having SSL? Really?

This made me really angry.
I need to stop giving money to those people.

# The Personal Email Problem

What in the beginning I considered _really cool_ was having the personal email address using _my_ domain!
Everybody on The Internet™ already knew me as "_keul_" so why not having something that ended with "@keul.it"?

Great idea!

...until you start using it as login name for important services and you are bound to it forever.

**This is my main problem**: I'm literally throwing money out of the window, but I fear to leave this email address.

So... let say that the domain (and mail service included) is a necessary evil for now.

# I want it all

Today keul.it hosts an empty, embarrassing website I didn't updated for ages, and a DNS configuration for publishing the blogger's blog under "blog.keul.it" (well, until now).

Yes.
I'm paying 200€/years for a domain alias.
Very professional for a Web developer, isn't it?

Let's recap stuff in my _I want_ list:

* I want SSL (let say I hate to not have it)
* I want to keep my old articles, keeping back-links active
* I want to stop burning money and dismiss at least the hosting service

Now my _wish_ list:

* I like the idea to keep control on my blogging architecture.
  I fear any service, I want to change "easily".
* I like the idea to continue using my old blog.keul.it domain (although I don't like to pay that much, but world is not a perfect place)

# Here we are

If you are reading this, my dream comes true.
I'm hosting this new blog using my domain and some very basic Netlify features, simply `npm install` ing Gatsby with the blog add-on.

My old blog is still alive, I just re-enabled the native address under [lucafbb.blogspot.com](https://lucafbb.blogspot.com/) but, thanks to Netlify redirects support, I have proper HTTP 301 redirects.

Do you like this layout?
No? I don't care too much.

Is possible that I will never change the default theme (maybe the default Gatsby favicon?), but it's OK.
And the random image below?
It came from the default quick-start tutorial.

![Chinese Salty Egg](./salty_egg.jpg)

I don't have the time to hack it, to learn how this [typography-theme-wordpress-2016](http://npmjs.com/package/typography-theme-wordpress-2016) I'm using works (although the "wordpress" word scare me a lot).
But it's OK.

I mean: I really like the idea to start learning this stuff, I'm tempted, but is an attitude I need to limit because stress me a lot, you'll end rapidly in the impostor syndrome zone because you don't have the time other guys have.

If you don't understand what I'm talking about take a look at this talk I attended last year: [Navigating the hype-driven world of frontend development without going crazy](https://vimeo.com/298558954).

What I have is enough, and is an order of magnitude better then before: my contents are inside a git repository, I can easily move, I can easily change, I will not waste soo much money again.

See you.

