# Fonzie: Modular Sass Development

Fonzie is a Sass package builder built on top of Bower. It allows you to easily install Sass packages into your project and then build it easily. It takes care of all the technical bits so you can focus on writing truly modular Sass.

* Install Sass packages from Bower
* Automatically copy or symlink assets from packages
* Automatic creation of load paths for all install components
* Create local packages with your project
* Automatically require Ruby libraries
* Allows for complex dependency trees of Sass packages
* Uses the existing `bower.json` file

## Installation

```
npm install -g fonzie
```

You'll also need to have the Sass gem installed. We could use libsass but it isn't fully-featured just yet, so we wrap the CLI tool.

Type `fonzie` to see a list of available commands.

## Goals

* Allow people to write and share small Sass components
* Solve issues surrounding how to write reusable Sass modules
* Make discovering and building packages easy
* Allow for packages that don't require Fonzie to be usable
* Handle assets in an elegant and transparent way
* Apply the goals of Component(1) to the Sass eco-system
* Leverage an existing package manager
* Every piece of Sass should be a package

## Overview

**Fonzie builds your Sass projects.** This means you don't use tools like Compass or use the Sass gem directly. Instead, you create a `bower.json` describing your project and use Fonzie to do everything.

Installing packages is easy, just use Bower:

```
bower install fonzie-breakpoints
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

So, what does this do?

* It will use the `main` field from your `bower.json` file as the input
* It will trace the dependency tree and add all components as load paths
* It finds any local or bundled dependencies and includes them too
* It will automatically require any Ruby files these dependencies specify
* It will automatically copy any assets from packages into the build directory

## What is a Sass package?

At a minimum, a Sass package is a folder with a `bower.json` file and a Sass file. This is given a name, a version and an entry point (the main file) inside of the `bower.json` file.

All a package needs to be compatible with Fonzie is a `bower.json` file. It uses this to determine the name of the main entry point for the package.

From there, you can add assets, like images and fonts; extend Sass by including ruby files; and create nested dependencies.

## Fonzie Bower Fields

Fonzie can determine more about the Sass packages by using the `fonzie` field in `bower.json`.

```
{
  "name": "my-project",
  "main": "index.scss",
  "dependencies": {
    "fonzie-breakpoints": "*"
  },
  "fonzie": {
    "require": ["./lib/my-script.rb"]
  }
}
```

Available fields:

* `require`: Specify and array of file paths to Ruby scripts (relative to the current package) to require
* `bundledDependencies`: Include dependencies that are packages themselves, but not installed via Bower
* `paths`: Specify some extra load paths to add
* `assets`: Tell Fonzie which directories to copy over into the build directory

## Load Paths

One of the main benefits of Fonzie is the automatic adding of load paths. This lets you require packages and files from packages in a clean way, like this:

```scss
@import "clear-floats";
```

Which could actually map to a file located in `/components/fonzie-clear-floats/clear-floats.scss`. Much nicer, isn't it?

This also allows for packages to require their dependencies without worrying about where it might be installed. This is actually a huge bonus which will become more apparent when you start diving into dependencies.

If there are conflicts with names, you can use the longer version:

```scss
@import "fonzie-clear-floats/clear-floats";
```

If for some reason you need to add extra load paths, you can do so using the `paths` field. This is an array off field paths relative to the current package.

```
{
  "fonzie": {
    "paths": ["./lib", "./styleguide"]
  }
}
```

## Ruby Scripts

You can also require custom Ruby scripts just like you can with the Sass command line tool. This works the same way
as

```
sass -r /path/to/file.rb
```

And allows you to write custom Sass functionality. Just
add a `ruby` section to your `bower.json` and add an array of files you want required:

```
{
  "fonzie": {
    require: ["lib/something.rb"]
  }
}
```

## Bundled Dependencies

Like Component, you can also have local packages. These work as if they were installed from the registry, meaning that the load paths and ruby files will all be loaded. They are essentially mini-packages that you can make public or just use to break up your application.

If you're building everything modular, everything you write, even if it isn't shared via Bower, should be written as a package. For example, in a project I am working on there are roughly 25 packages installed as dependencies and another 20 or so stored locally within the project. Everything we write is a package, which makes things modular and super easy to maintain.

You'll need to add another load path to your `bower.json`

```js
{
  "name": "foo",
  "fonzie": {
    "bundledDependencies": [ "local/grid" ]
  }
}
```

## Assets

Asset handling in front-end packages is tricky. Due to the fact that the paths we write in our Sass
are relative to whereever the build directory is, it makes it hard to share assets between people.

Fonzie handles assets by **copying or symlinking them from the packages and into the build directory.** The mapping for this is in the `bower.json`.

```js
{
  "name": "my-sweet-package",
  "fonzie": {
    "assets": "./images"
  }
}
```

This will copy the `/images` directory from that package to the `/build` directory and name the folder `my-sweet-package`. It names it after the package name to help avoid conflicts. However, you can also be a bit more explicit:

```js
{
  "name": "my-sweet-package",
  "fonzie": {
    "assets": {
      "my-sweet-images": "./assets/images",
      "my-sweet-fonts": "./assets/fonts"
    }
  }
}
```

This will create the following structure in the build directory:

```
build/
  my-sweet-images/
  my-sweet-fonts/
  build.css
```

This allows the packages to be written in such a way that they don't depend on Fonzie to be usable. Now in my Sass I can use paths like:

```scss
.blah {
  background: url('my-sweet-images/chuck.jpg');
}
```