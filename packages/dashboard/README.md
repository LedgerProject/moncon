<p align="center">
  <a href="" rel="noopener">
 <img width=200px height=200px src="https://i.imgur.com/6wj0hh6.jpg" alt="Project logo"></a>
</p>

<h3 align="center">moncon-dashboard</h3>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/kylelobo/The-Documentation-Compendium.svg)](https://github.com/kylelobo/The-Documentation-Compendium/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/kylelobo/The-Documentation-Compendium.svg)](https://github.com/kylelobo/The-Documentation-Compendium/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

<p align="center"> Few lines describing your project.
    <br> 
</p>

## 📝 Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Built Using](#built_using)

## 🧐 About <a name = "about"></a>

This repository contains the moncon dashboard.

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

- You need to have an instance of the moncon API
- Make a copy of the .env.example file with the name .env.{environment}, and update it with your config

### Development

To start the local development server execute the following command. Make sure you have the .env.development file.

```
npm start
```

### Build

Builds the app for production to the build folder.
It correctly bundles React in production mode and optimizes the build for the best performance.
Make sure you have the .env.staging or .env.production file.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

```
npm run build:{environment}
```

## ⛏️ Built Using <a name = "built_using"></a>

- [React](https://reactjs.org/) - Frontend Javascript library