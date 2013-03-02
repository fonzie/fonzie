# Fonzie: The package manager for Sass

Fonzie is a package manager built on top of Bower-server and inspired by Component(1). In fact, you can
use Component(1) packages with Fonzie. 

After trying to use both Bower and Component to manage Sass dependencies, I realised that nothing really fit
into a Sass workflow.

With fonzie you can **install Sass packages, search for them in a registry and build your project** and all of
the load paths and file requires are done for you.

Installing packages is easy:

```
fonzie install breakpoints normalize button
```

Fonzie doesn't handle any of the Sass imports. So you can import just what you need:

```scss
@import "normalize"
@import "button"
@import "breakpoints"

@include mobile {
  color: red;
}
```

Then build your Sass:

```
fonzie build
```

`fonzie-build` is a wrapper around Sass so it will take care of all the load paths.

## Installation

```
npm install fonzie
```

## Usage

Create a `component.json` file in your Sass directory.

```
{
  "name": "my-project",
  "version": "0.1.0",
  "main": "index.scss",
  "dependencies": {

  }
}

```
fonzie install clearfix
```

This will install the `clearfix` package into your `components` directory. Now import that into your file, `index.scss`:

```scss
@import "clearfix";
```

And build your project:

```
fonzie build
```

This will build the file `index.scss` and, by default, output it into `build/build.css`. You can change this using the `-o` option:

```
fonzie build -o public/screen.css
```

You can search for new packages too:

```
fonzie search grid
```

And be shown a list of packages available.

## Packages

## Adding Custom Sass Functions

