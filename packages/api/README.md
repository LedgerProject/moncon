<table align="center"><tr><td align="center" width="9999">
<img src="https://imgur.com/5O5TvDu.png" align="center" width="150" alt="Project icon">

# moncon API

</td></tr></table>
<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/kylelobo/The-Documentation-Compendium.svg)](https://github.com/kylelobo/The-Documentation-Compendium/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/kylelobo/The-Documentation-Compendium.svg)](https://github.com/kylelobo/The-Documentation-Compendium/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

## 📝 Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Built Using](#built_using)

## 🧐 About <a name = "about"></a>

This repository contains the moncon API.

## 🏁 Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See [deployment](#deployment) for notes on how to deploy the project on a live system.

### Prerequisites

You need NodeJS installed, at least version 14.

### Installing

Install dependencies.

```
npm install
```

### Configuration

- You need to have an instance of a MongoDB database, for example running a docker container with
```
docker run --name moncon-database -p 27017:27017 -d mongo
```
- Make a copy of the .env.example file with the name .env, and update it with your config
- You need to add the file firebaseServiceAccountKey.json containing the Firebase configuration

### Development

To start the local development server execute the following command.

```
npm run dev
```

## ⛏️ Built Using <a name = "built_using"></a>

- [NodeJs](https://nodejs.org/en/) - Server Environment
- [Express](https://expressjs.com/) - Server Framework
