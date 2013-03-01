# fonzie: The package manager for Sass

fonzie is a package manager built on top of Bower-server and inspired by Component(1). After trying 
to use both Bower and Component to manage Sass dependencies, I realised that nothing really fit
into a Sass workflow.

With fonzie you can install Sass packages, search for them and build your Sass projects similar to Component.

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