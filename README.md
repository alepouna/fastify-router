# fastify-router

A simple router loader for fastify servers. 

Warning, this is junky. But hey, if it works, don't fix it! (actual suggestions are welcome :p)
Please note I use this for my personal projects, its not meant to be fast, efficient or smart and certinaly wasn't designed to be used in production. I created this so I don't have to setup routes with every new webserver I create and I couldn't find anything on fastify that did this. It saves time :D  

Read through this entire document for instructions on how to use this!  

## Use

Here's how to use this tool

### On your webserver setup file

Call the loadRoutes function, inject fastify and options and voila!
```js
import { loadRoutes } from '/path/to/index.mjs'

//Example fastify server 
import Fastify from 'fastify';
const fastify = Fastify();

await loadRoutes(fastify, { dir: './src/routes/', log: true});
```

#### Options: 

- dir: the directory of all the routes you want to load, its using the current module dir so if the module is in `node_modules/blah` and your routes in `src/routes`, you will have to set it as `../src/routes`
- log: log to console some debug/verbose messages [optional]

### On your route file

Export a default (async) function with two properties: request & reply (as fastify does)

```js
export default async function (request, reply) {
    return reply.send({ hello: 'world' });
};
```

### Paths, params, queries, etc (Folder structure)
 
I basically go by the principal that the folder path is also your path. files named `index` will be treated as the end/trail of that path. 
So if you want to render the page `/path/to/page` you will have a folder structure of `/src/routes/path/to/page/index.js` or `/src/routes/path/to/page.js` depends on how you want to organize things :) 

For params, because on windows you can't use `:` for file names instead I do `[]`. So lets say you have param `people` you will define it in a path like this: 
`/path/to/[people]/index.js` -> /path/to/:people/

Queries are handled by fastify already, you don't have to do special definitions. 

#### But what about REST? 
All routes MUST contain the rest method in the file name, followed by a `-` and the path. example: `GET-index.js`, `POST-index.js`, `SET-index.js` etc. 
If the a method does NOT contain one, it will assume GET is to be used.
I can not verify if `ANY`/`ALL` works, as my results are inconclusive. If you can replicate/use, please make an issue request so I can remove this statement :)  

## Contributing: 
- By code: Make a pr! Add comments to your code and have proper variable names!
- By suggestions/bugs: Make an issue request! Have as many details as you can so I can replicate and fix! 
- By donating: [![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/Y8Y1ACFQW) 