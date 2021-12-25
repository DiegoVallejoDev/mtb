/* 
 * Copyright (c) 2021 Diego Valejo.
 * mtb.js (all terrain js) is a tool that faciitates creating and managing complex static html pages by defining components,
 * it was developed to be used in pair of alpine.js in mind but can be used in other projects.
 */


const fs = require('fs');

let COMPONENT_DIR = "src/components/";
let OUTPUT_DIR = "public/";
let PAGES_DIR = "src/pages/";


let componentColecction = {};
let pagesCollection = {};

export function registerComponent(path, name = undefined) {
    // read the component html file
    let component = fs.readFileSync(path, 'utf8');
    // get the name of the component
    if (name == undefined) {
        name = path.split("/").pop().split(".")[0];
    }
    if (componentColecction[name] != undefined) {
        console.warn("Component " + name + " already exists, overriding");
    }
    componentColecction[name] = component;
}


export function getComponent(name) {
    if (componentColecction[name] == undefined) {
        console.error("Component " + name + " not found");
        return undefined;
    }
    return componentColecction[name];
}


export function getPage(name) {
    return fs.readFileSync(PAGES_DIR + name, 'utf8');
}

export function preparePages() {
    let pages = fs.readdirSync(PAGES_DIR);
    pages.forEach(page => {
        let pageName = page.split(".")[0];
        pagesCollection[pageName] = getPage(page);
    });
}

export function compileComponents(page) {
    if (page == undefined || pagesCollection[page] == undefined) {
        console.error("Page " + page + " not found");
        return undefined;
    }
    let pageContent = pagesCollection[page];

    //components are imported as {{componentName}} into html pages
    let components = pageContent.match(/{{[a-zA-Z0-9_]+}}/g);
    if (components != undefined) {
        components.forEach(component => {
            let componentName = component.split("{{")[1].split("}}")[0];
            let componentContent = getComponent(componentName);
            if (componentContent == undefined) {
                console.error("Component " + componentName + " not found");
                return undefined;
            }
            pageContent = pageContent.replace(component, componentContent);
        });
    }
    return pageContent;
}


export function createPages() {
    for (let page in pagesCollection) {
        let pageContent = compileComponents(page);
        let pagePath = OUTPUT_DIR + page + ".html";
        fs.writeFileSync(pagePath, pageContent);
    }
}


export function run() {

    console.log("┏ mtb.js v0.1");

    if (!fs.existsSync(COMPONENT_DIR)) {
        fs.mkdirSync(COMPONENT_DIR);
        fs.mkdirSync(PAGES_DIR);
        console.log("┠ No components directories found, creating new ones");
    }

    // register the components
    fs.readdirSync(COMPONENT_DIR).forEach(component => {
        registerComponent(COMPONENT_DIR + component);
    });
    console.log("┠ Found : ", Object.keys(componentColecction).length, " components in ", COMPONENT_DIR);


    console.log("┠ preparing pages...");
    preparePages();
    console.log("┠ Found : ", Object.keys(pagesCollection).length, " pages in ", PAGES_DIR);


    console.log("┠ Compiling pages...");
    createPages();
    console.log("┗ Done");

}