---
title: Managing multiple independent ReactJS apps on a single page
date: "2019-06-15T17:10:35+0200"
description: Having multiple ReactJS applications bundled by Webpack on a single page is not so straightforward. In this article I'd like to inspect some issues I faced and how I solved them.
---

A complex React application I worked on, a set of widgets presented together, is composed by a single React app (**widgets App**).
That means: a single `ReactDOM.render` call, like 95% of React applications out there probably.

Meanwhile the project evolved and we started working on a new application, similar to **an Editor**, that's only make sense if used with the widgets App.

To be more clear:

* Widgets App can be used independently from the IDE and should work on its own
* The Editor needs the widgets App _inside it_
* Editor and widgets App need to communicate
* Due to some technical decision we are not using any iframe

When the widgets App is used standalone there's no special cases to handle during the bundle (we use Webpack and Rollup for a reason, isn't it?).

Things gets more complex when we have both.

## Webpack and duplicated code

During the alpha phase of the project, when we only need to present a working spike of the Editor app, we did not deal with the **duplicate code issue**.

This is the classic problem you need to address when using two different React app on a single page: if you handle them totally independently you are duplicating code.
`react`, `react-dom` and probably other stuff will be **bundled twice**.