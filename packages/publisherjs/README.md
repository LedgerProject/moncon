# moncon-publisherjs

## Table of Contents

- [About](#about)
- [Getting Started](#getting_started)

## About <a name = "about"></a>

This is the javascript code to add moncon functionality to publisher's webs.

## 🏁 Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See [deployment](#deployment) for notes on how to deploy the project on a live system.

### Prerequisites

You need NodeJS installed, at least version 14.

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
git clone https://gitlab.com/infinite-labs/moncon-framework.git
cd moncon-framework
cd packages
cd publisherjs
npm install
```
If you get any errors, please read through them and see if you can find out what
the problem is. If you can't work it out on your own then please file an
[issue](https://gitlab.com/infinite-labs/moncon-framework/-/issues/new) and provide _all_ the output from the commands you ran (even if it's a lot).

```

### Configuration

- You need to have an instance of the moncon API
- Make a copy of the .env.example file with the name .env, and update it with your config

### Development

To start the local development server execute the following command.

```
npm start
```

### Build

Builds the app for production to the build folder.

- Create a file name .env.staging
The build is minified.
Your app is ready to be deployed!

```
npm run build:staging
```

## ⛏️ Built Using <a name = "built_using"></a>

- [Javascript](https://developer.mozilla.org/es/docs/Web/JavaScript)
