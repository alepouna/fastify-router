import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
// Set current directory
const __dirname = path.resolve();

/* function definitions
*       fastify: fastify instance 
*       options: options {dir: path to routes | log: log to console}
*/ 
export async function loadRoutes(fastify, options, logger) {

    if (!fastify) throw new Error('Fastify not provided');
    //Check options
    if (!options) throw new Error('No options provided');
    if (!options.dir) throw new Error('No home directory provided (example ./src/server/routes/public)');

    if (options.log) console.log('verbose', 'fastify-router', 'Loading routes...');

    const routesPath = path.join(__dirname, `${options.dir}`); //Setting the directory were looding routes from

    async function loadFiles(current_location) { 

        if (!current_location || current_location.length < 1) current_location = routesPath; //if we are at the end of a folder or just starting

        const files = fs.readdirSync(current_location); //Load all files

        for (const file of files) {

            if (fs.statSync(path.join(current_location, file)).isDirectory()) {  //if we are on a directory, loads its content
                await loadFiles(path.join(current_location, file)); 
            } else {
                if (file.endsWith(".js") || file.endsWith(".mjs")) { //if the file is a js or mjs file

                    let routePath = pathToFileURL(path.resolve(current_location, file)); //Define the current path
                    let routeHandler = await import(pathToFileURL(path.resolve(current_location, file))); //Import the route handler/function
                    routeHandler = routeHandler.default; //

                    //Params parser
                    let routeExtension = routesPath.split('\\').pop().split('/').pop(); //Get the last part of the path
                    let routeURL = routePath.pathname.split(`${routeExtension}`)[1]; 
                    routeURL = routeURL.replace(/\[/g, ':');
                    routeURL = routeURL.replace(/\]/g, '');
                    routeURL = routeURL.replace(/\.js/g, '');
                    routeURL = routeURL.replace(/\.mjs/g, '');

                    //REST method parser
                    let routeMethod = path.basename(routeURL);
                    if (routeMethod.split('-')[1]) {
                        routeMethod = routeMethod.split('-')[0];
                        
                        routeURL = routeURL.replace(`${routeMethod}-`, '');
                        routeMethod = routeMethod.toUpperCase();
                    } else {
                        routeMethod = options.method || 'GET';
                    };

                    //Index parser
                    if (path.basename(routeURL) === 'index') routeURL = path.dirname(routeURL);

                    //If we have all the required information
                    if (routeHandler && routeURL) { 
                        if (options.log) console.log('verbose', 'fastify-router', `Setting route from '${routeExtension}' as ${routeMethod}:${routeURL}`, );
                        await fastify.route({ //Set route in fastify
                            method: routeMethod,
                            url: routeURL,
                            handler: routeHandler
                        });
                        if (options.log) console.log('verbose', 'fastify-router', `Registered route from '${routeExtension}' as ${routeMethod}:${routeURL} ✅`);
                    };

                };
            };

        };
    };

    await loadFiles();
    
};

export default {
    loadRoutes
};