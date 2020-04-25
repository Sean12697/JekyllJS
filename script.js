const fs = require('fs'),
    kramed = require('kramed'),
    copydir = require('copy-dir'),
    shell = require('shelljs');

let globals = require('./_config.js');
globals.posts = []; // Setting up array to store post data

// Getting modules to reuse
const headModule = require("./_modules/head.js"),
    headerModule = require("./_modules/header.js"),
    footerModule = require("./_modules/footer.js"),
    homeTheme = require("./_layouts/home.js"),
    postTheme = require("./_layouts/post.js");

// Generating reusable elements
const header = headerModule(globals.title, "index.html");

// Moving static files to site
shell.mkdir('-p', './_site');
copydir.sync('./_static', './_site');

// Create Blog posts
shell.mkdir('-p', './_site/posts/');
let files = fs.readdirSync('./_posts');
files.forEach(file => {
    if (file.endsWith(".md") || file.endsWith(".markdown")) {
        let data = fs.readFileSync(`./_posts/${file}`), dirs = fileNameToDir(file);
        // Generating all of the HTML needed for this particular post
        let converted = mdToMetaAndText(data), date = new Date(converted[0].date),
            head = headModule(converted[0].title, globals.description, `${dirs.toRoot}main.css`),     
            blogHeader = headerModule(globals.title, `${dirs.toRoot}index.html`),
            footer = footerModule(globals.title, globals.description, globals.email, globals.github_username, globals.twitter_username, dirs.toRoot);
            
        let html = postTheme(head, blogHeader, converted[0].title, date.toISOString() , date.toDateString(), kramed(converted[1]), footer);
        // Storing this post
        shell.mkdir('-p', `./_site${dirs.dir}`);
        fs.writeFileSync(`./_site${dirs.fullPath}`, html, (e) => {});
        // Pushing needed variables to the global object to be used in the home page indexing
        globals.posts.push({
            date: date.toDateString(),
            link: `.${dirs.fullPath}`,
            title: converted[0].title
        });
    }
});

// Create Home page
globals.posts = globals.posts.sort((a, b) => (new Date(a.date) - new Date(b.date) > 0) ? -1 : 1);
let footer = footerModule(globals.title, globals.description, globals.email, globals.github_username, globals.twitter_username, "");
fs.writeFileSync('./_site/index.html', homeTheme(headModule(globals.title, globals.description, 'main.css'), header, globals.posts, footer), (e) => {});


// ----------------------------------------- Functions --------------------------------------------------

function fileNameToDir(fileName) {
    let _dir = "", _fileName = "", _fullPath = "", _toRoot = "../";
    if (fileName.split("-").length >= 4) { // if the format is kept
        _toRoot = "../../../"; // Has to jump 3 dirs up to root
        let parts = fileName.split("-");
        for (let i = 0; i < 3; i++) _dir += `/${parts.shift()}`;
        _fileName = fileNameToHtmlName(parts.join('-'))
    } else { // if the format is not kept
        _dir = "/posts";
        _fileName = fileNameToHtmlName(fileName); 
    }
    return { dir: _dir, fileName: _fileName, fullPath: `${_dir}/${_fileName}`, toRoot: _toRoot };
}

function fileNameToHtmlName(fileName) {
    return `${fileName.split('.').reduce((t, v, i, arr) => t += (i != arr.length-1) ? v : "", "")}.html`;
}

function mdToMetaAndText(data) {
    let arr = data.toString().replace(/\r/gm, '').split('\n'),
        obj = {},
        line = "",
        dashedLines = 0;

    // Pushing new line and check if it is only dashes
    line = arr.shift();
    if (lineDashed(line)) dashedLines++;

    while (dashedLines < 2) { // whiles we haven't reached he second line
        if (!lineDashed(line)) { // Checking if there are multiple colons in a string
            let split = line.split(':');
            obj[split[0]] = (split.length < 2) ? split[1] : split.slice(1).join(':'); 
        } // push the key/val pair // FIX
        // Pushing next line and check if it is only dashes
        line = arr.shift();
        if (lineDashed(line)) dashedLines++;
    }

    return [obj, arr.join('\n')];
}

function lineDashed(line) {
    return (line.replace(/\s/g, '').replace(/-/g, '').length == 0);
}