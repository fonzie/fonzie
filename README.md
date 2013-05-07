# Fonzie: Modular Sass Development

Fonzie is a Sass package builder built on top of Bower. It allows you to easily install Sass packages into your project and then build it easily. It takes care of all the technical bits so you can focus on writing truly modular Sass.

* Install Sass packages from Bower
* Automatically copy or symlink assets from packages
* Automatic creation of load paths for all install components
* Create local packages with your project
* Automatically require Ruby libraries
* Allows for complex dependency trees of Sass packages

## Installation

```
npm install -g fonzie
```

You'll also need to have the Sass gem installed. We could use libsass but it isn't fully-featured just yet, so we wrap the CLI tool.

Type `fonzie` to see a list of available commands.

## Overview

**Fonzie builds your Sass projects.** This means you don't use tools like Compass or use the Sass gem directly. Instead, you create a `bower.json` describing your
project and use Fonzie to do everything.

Every Fonzie-compatible package requires a `bower.json`.

Installing packages is easy, just use Bower:

```
bower install fonzie-breakpoints
```

Or add it to your `bower.json`:

```
{
  "name": "my-project",
  "main": "index.scss",
  "dependencies": {
    "fonzie-breakpoints": "*"
  }
}
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

## Fonzie Package Fields

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

There are a few settings available:

* `require`: Specify and array of file paths to Ruby scripts (relative to the current package) to require
* `bundledDependencies`: Include dependencies that are packages themselves, but not installed via Bower
* `paths`: Specify some extra load paths to add
* `assets`: Tell Fonzie which directories to copy over into the build directory

## Load Paths

`fonzie-build` is a wrapper around Sass so it will take care of all the load paths. This allows you to require the name of the package without needing to worry about where it's located. For example, if you install the `fonzie-clear-floats` package you just need to do:

```scss
@import "clear-floats";
```

And it will work no matter where you are. Due to the fact Sass doesn't provide any sort of 'index' type of functionality, it is dependent on the package on how you can import it.

If there are conflicts with names, you can use the longer version:

```scss
@import "fonzie-clear-floats/clear-floats";
```

### Adding more load paths

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

If you're building everything modular, everything you write, even if it isn't shared via Bower, should be written as a package.

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