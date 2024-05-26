#!/usr/bin/env node

import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));


import * as esbuild from 'esbuild'
import {sassPlugin} from 'esbuild-sass-plugin'

import sveltePlugin from "esbuild-svelte";

let examplePlugin = ()=>({
  name: 'example',
  setup(build) {
    build.onEnd(result => {
      console.log(`build ended with ${result.errors.length} errors`)
      console.log('-'.repeat(80), '\n\n')
    })
  },
});


let exampleOnResolvePlugin = ()=>({
  name: 'example',
  setup(build) {
    // Redirect all paths starting with "images/" to "./public/images/"
    build.onResolve({ filter: /^\// }, args => {
      // console.log( args );
      return { path: path.join(__dirname,   args.path) }
    })

    // Mark all paths starting with "http://" or "https://" as external
    build.onResolve({ filter: /^https?:\/\// }, args => {
      return { path: args.path, external: true }
    })
  },
});




let ctx = await esbuild.context({


  mainFields: ["svelte", "browser", "module", "main"],
  conditions: ["svelte", "browser"],
  
  bundle: true,
  entryPoints: ['src/library.js', 'src/index.js'],
  keepNames: true, // this is important for when comparing classes
  outdir: './',
  loader: {
     '.html': 'text',
     '.js': 'jsx',
   },
  plugins: [exampleOnResolvePlugin(), examplePlugin(), sassPlugin(), sveltePlugin()],
})

const xxx = await ctx.watch()

let { host, port } = await ctx.serve({
    host:'0.0.0.0',
    servedir: '.',
})

console.log(`Serving on http://${host}:${port}/ and watching for changes!`);
