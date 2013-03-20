# Fonzie: The Package Manager for Sass 

![Fonzie](http://www.mediabistro.com/fishbowldc/files/2010/12/fonzie_henry_winkler_happy_days.jpg)

---

**Everything is currently in testing** while I work out any bugs and make sure everything works the best
way possible. When Fonzie reaches a stable version the registry will be locked down, until then, **I might
need to clear the registry** if I need to make any large changes. Please give me feedback and add issues.

---

Fonzie is a package manager built on top of Bower-server and Component(1). It allows you to easily install
Sass packages into your project and then build it. Unlike Component, Fonzie uses a registry but these still
map to Github projects.

With Fonzie you can **install Sass packages, search for them in a registry and build your project** and all of
the load paths and file requires are done for you.

## Installation

```
npm install -g fonzie
```

You'll also need to have the Sass gem installed. Optionally Compass if you want to use it.

## Demo

You can grab the [example project](http://github.com/fonzie/example-project) that has Fonzie setup and ready to go. You
just need to run `fonzie install` and `fonzie build` to see it in action.

## Overview

**Fonzie controls your Sass projects.** You build your Sass with it and you install packages. This means you don't
use tools like Compass or use the Sass gem directly. Instead, you create a `component.json` describing your
project and using Fonzie to do everything.

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

Then build your `main` Sass file:

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

### Commands

Type `fonzie` to see a list of available commands:

```
Usage: fonzie <command> [options]

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

  Commands:

    install [name ...]      install one or more packages
    init                    create a package skeleton
    search [query]          search for packages. No query to see all packages
    build                   build the package
    publish                 Add package to the public registry

```

Be sure to also try `fonzie <command> --help` for more help about a specific command.

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
  "remotes": ["http://fonzie.herokuapp.com/packages"],
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

You can also build a specific Sass file just pass it as the first argument of the build command like this

```
fonzie build main.scss
```

And combine source and destination

```
fonzie build main.scss -o public/main.css
```

Now you can search for new packages too:

```
fonzie search prefix
```

And be shown a list of packages available.

## Publishing Packages

Publishing new packages to the registry is easy. It uses your `component.json` file to publish kind of like npm. Just
run this in your package directory:

```
fonzie publish
```

If you've created your `component.json` using `fonzie init` you shouldn't have any problems. Like Bower, packages can't
be removed from the registry and can't be edited. I'm looking at various ways to manage this using Github.


## Adding Custom Sass Functions

You can also require custom Ruby scripts just like you can with the Sass command line tool. This works the same way
as 

```
sass -r /path/to/file.rb
```

And allows you to [http://sass-lang.com/docs/yardoc/Sass/Script/Functions.html](write custom Sass functionality). Just
add a `ruby` section to your `component.json` and add an array of files you want required:

```
{
  "name": "component-name",
  "ruby": ["lib/something.rb"]
}
```

## Using Compass

If you don't know it yet, Sass have a `--compass` option.

You can path it to `fonzie build`

```
fonzie build --compass
```

## Local Packages

Like Component, you can also have local packages. These work as if they were installed from the registry, meaning
that the load paths and ruby files will all be loaded. They are essentially mini-packages that you can make public
or just use to break up your application.

You'll need to add another load path to your `component.json`

```js
{ 
  "name": "foo",
  "paths": [ "local" ]
}
```

This will allow Fonzie to look in local for any packages as well. Each package will need its own `component.json` file.

