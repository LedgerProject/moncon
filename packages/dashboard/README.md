<table align="center"><tr><td align="center" width="9999">
<img src="https://imgur.com/5O5TvDu.png" align="center" width="150" alt="Project icon">

# moncon Dashboard

**monco Dashboard** is encoded in **React** is designed to provide a content log to block and monetize, as well as metrics for your blocked content.


</td></tr></table>


<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/kylelobo/The-Documentation-Compendium.svg)](https://github.com/kylelobo/The-Documentation-Compendium/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

## 📝 Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Built Using](#built_using)
- [Terms and License](#terms-and-license)
- [About Us](#about-us)
- [Stay in the loop](#stay-in-the-loop)


## 🧐 About <a name = "about"></a>

This repository contains the moncon dashboard.

## 🏁 Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See [deployment](#deployment) for notes on how to deploy the project on a live system.

### Prerequisites

- [git](https://git-scm.com/) v2.13 or greater
- [NodeJS](https://nodejs.org/en/) `14 || 15 || 16`
- [npm](https://www.npmjs.com/) v6 or greater

All of these must be available in your `PATH`. To verify things are set up
properly, you can run this:

```shell
git --version
node --version
npm --version
```

If you have trouble with any of these, learn more about the PATH environment
variable and how to fix it here for [windows](https://www.howtogeek.com/118594/how-to-edit-your-system-path-for-easy-command-line-access/) or
[mac/linux](https://stackoverflow.com/questions/24306398/how-to-add-mongo-commands-to-path-on-mac-osx/24322978#24322978).

### Installing

> If you want to commit and push your work as you go, you'll want to
>[fork](https://docs.github.com/en/free-pro-team@latest/github/getting-started-with-github/fork-a-repo)
> first and then clone your fork rather than this repo directly.

After you've made sure to have the correct things (and versions) installed, you
should be able to just run a few commands to get set up:

```
git clone https://github.com/LedgerProject/moncon.git
cd moncon
cd packages
cd dashboard
npm install
```
If you get any errors, please read through them and see if you can find out what
the problem is. If you can't work it out on your own then please file an
[issue](https://github.com/LedgerProject/moncon/issues) and provide _all_ the output from the commands you ran (even if it's a lot).


### Configuration

- You need to have an instance of the moncon API
- Make a copy of the .env.example file with the name .env.{environment}, and update it with your config

### Development

To start the local development server execute the following command. Make sure you have the .env.development file.

```
npm start
```

This should start up your browser. If you're familiar, this is a standard
[react-scripts](https://create-react-app.dev/) application.

### Build

Builds the app for production to the build folder.
It correctly bundles React in production mode and optimizes the build for the best performance.
Make sure you have the .env.staging or .env.production file.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

```
npm run build:{environment}

```
This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify

## Notes
for most functionalities is necessary to have a server that serves as static content the [publisherjs project](../publisherjs) build and embeding it in a web as described here

<pre>
  &lt;link rel="stylesheet" href="cdn_url/moncon.css"&gt;
</pre>
<pre>
  &lt;script src="cdn_url/moncon.js?id={userId}" async&gt;&lt;/script&gt;
</pre>

where the userid is the uid created by firebase.

also, the only way to create a issuer account is doing it in the admin dashboard, to create an admin account you will need to change the env ADMIN_USERS variable in [api project](../api) and set it to a list of comma separated emails, then you can register a new account as a publisher using one of the admins email and the account will be not a publisher but an admin, once in the admin dashboard in the bottom of the page you can create as many issuer account as you need

## ⛏️ Built Using <a name = "built_using"></a>

- [React](https://reactjs.org/) - Frontend Javascript library

## Terms and License <a name = "terms-and-license"></a>

- Released under the [MIT](../../LICENSE).
- Copyright 2021 [Infinite Labs](https://infinitelabs.co/).
- Use it for personal and commercial projects, but please don’t republish, redistribute, or resell the application.


## About Us <a name = "about-us"></a>

We focus on building a more secure, private and social internet using Open-Source and decentralized technologies.

As a team, we have developing digital products since 2012. In the last 5 years, we have focused on decentralized technologies. We aim to create products that can make a social impact. Because of that, we only use Open Source technologies, and create secure solutions taking good care of the user data and privacy.

## Stay in the loop <a name = "stay-in-the-loop"></a>

If you would like to know when we release new resources, you can follow us on [Twitter](https://twitter.com/LabsInfinite)
