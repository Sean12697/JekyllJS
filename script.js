const fs = require('fs'),
    kramed = require('kramed'),
    copydir = require('copy-dir');

let globals = require('./_config.js');
globals.posts = []; // Setting up array to store post data

// Getting modules to reuse
const headModule = require("./_modules/head.js"),
    headerModule = require("./_modules/header.js"),
    footerModule = require("./_modules/footer.js"),
    homeTheme = require("./_layouts/home.js"),
    postTheme = require("./_layouts/post.js");

// Generating reusable elements
const header = headerModule(globals.title, "index.html"),
    blogHeader = headerModule(globals.title, "../index.html"),
    footer = footerModule(globals.title, globals.description, globals.email, globals.github_username, globals.twitter_username);

// Moving static files to site
fs.mkdirSync('./_site', { recursive: true });
copydir.sync('./_static', './_site');

// Create Blog posts
fs.mkdirSync('./_site/posts/', { recursive: true });
let files = fs.readdirSync('./_posts');
files.forEach(file => {
    if (file.endsWith(".md") || file.endsWith(".markdown")) {
        let data = fs.readFileSync(`./_posts/${file}`);
        // Generating all of the HTML needed for this particular post
        let converted = mdToMetaAndText(data),
            head = headModule(converted[0].title, globals.description, "../main.css");
        let html = postTheme(head, blogHeader, converted[0].title, converted[0].date, converted[0].date, kramed(converted[1]), footer);
        // Storing this post
        fs.writeFileSync(`./_site/posts/${file.split('.')[0]}.html`, html, (e) => {});
        // Pushing needed variables to the global object to be used in the home page indexing
        globals.posts.push({
            date: converted[0].date,
            link: `./posts/${file.split('.')[0]}.html`,
            title: converted[0].title
        });
    }
});

// Create Home page
fs.writeFileSync('./_site/index.html', homeTheme(headModule(globals.title, globals.description, 'main.css'), header, globals.posts, footer), (e) => {});


// ----------------------------------------- Functions --------------------------------------------------
function mdToMetaAndText(data) {
    let arr = data.toString().replace(/\r/gm, '').split('\n'),
        obj = {},
        line = "",
        dashedLines = 0;

    // Pushing new line and check if it is only dashes
    line = arr.shift();
    if (lineDashed(line)) dashedLines++;

    while (dashedLines < 2) { // whiles we haven't reached he second line
        if (!lineDashed(line)) obj[line.split(':')[0]] = line.split(':')[1]; // push the key/val pair
        // Pushing next line and check if it is only dashes
        line = arr.shift();
        if (lineDashed(line)) dashedLines++;
    }

    return [obj, arr.join('\n')];
}

function lineDashed(line) {
    return (line.replace(/\s/g, '').replace(/-/g, '').length == 0);
}