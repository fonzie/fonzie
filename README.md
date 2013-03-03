# Fonzie: The Package Manager for Sass

Fonzie is a package manager built on top of Bower-server and Component(1). It allows you to easily install
Sass packages into your project and then build it.

After trying to use both Bower and Component to manage Sass dependencies, I realised that nothing really fit
into a Sass workflow. I love the concept of Component, but building Sass projects with it is painful and most
of the packages cater towards JS. Bower on the other hand has a nice registry for finding packages which leads
to higher quality projects, however, Bower doesn't have a build tool and wasn't made for Sass.

With Fonzie you can **install Sass packages, search for them in a registry and build your project** and all of
the load paths and file requires are done for you.

## Overview

Installing packages is easy:

```
fonzie install breakpoints
```

Then import just what you need in your project:

```scss
@import "breakpoints"

@include mobile {
  color: red;
}
```

Then build your Sass:

```
fonzie build
```

`fonzie-build` is a wrapper around Sass so it will take care of all the load paths. This allows you to require
the name of the package without needing to worry about where it's located. For example, if you install the `clear-floats`
package you just need to do

```scss
@import "clear-floats";
```

And it will work no matter where you are.

## Installation

```
npm install -g fonzie
```

## Getting Started

Fonzie uses the same `component.json` as [component/component](Component) so in theory they are just Component packages. 
If you haven't used a package manager like Bower or Component before, I'll run you through setting up a `component.json`.

The manifest, `component.json`, lives at the root of your Sass project and describes it. It sets a version, a name, description
author and most importantly, the dependencies of your project.

You can get started quickly using `fonzie init`:

```
fonzie init
```

This will ask you a couple of questions and then create a few files for you, one of them is the `component.json` file. It 
will look something like this:

```js
{
  "name": "my-project",
  "version": "0.1.0",
  "main": "index.scss",
  "files": ["index.scss"],
  "dependencies": {

  }
}

```

For a detailed explanation of all of the fields, set the [https://github.com/component/component/wiki/Spec](Component wiki).
The important parts for us are the `files` and `dependencies` sections. Every file that you need for you component
to work needs to be in the `files` array otherwise it won't be pulled down when someone installs your package.

Lets install a package into our project:

```
fonzie install clear-floats
```

This will install the `clear-floats` package into your `components` director and add it as a dependency in your `component.json`.

Now import that into your main file (the main file you would normally build with Sass):

```scss
@import "clear-floats";
```

And build your project:

```
fonzie build
```

This will build the file output it into `build/build.css`. You can change this using the `-o` option:

```
fonzie build -o public/screen.css
```

Now you can search for new packages too:

```
fonzie search prefix
```

And be shown a list of packages available.

## Publishing Packages



## Packages

## Adding Custom Sass Functions

