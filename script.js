const fs = require('fs-extra'),
    kramed = require('kramed'),
    prettifyHTML = require("pretty");

let globals = require('./_config.js'), sitemap = [];
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
fs.ensureDirSync('_site');
fs.emptyDirSync('_site');
fs.copySync('_static', '_site');

// Create Blog posts
fs.ensureDirSync('_site/posts/');
let files = fs.readdirSync('_posts');
files.forEach(file => {
    if (file.endsWith(".md") || file.endsWith(".markdown")) {
        let data = fs.readFileSync(`_posts/${file}`), dirs = fileNameToDir(file);
        // Generating all of the HTML needed for this particular post
        let converted = mdToMetaAndText(data), date = new Date(converted[0].date),
            keywords = ((converted[0].keywords || "").split(",") || []).map(keyword => keyword.trim()),
            shortenedDesc = shortenDesc(converted[1]),
            head = headModule(`${converted[0].title} - ${globals.title}`, shortenedDesc, keywords, `${dirs.toRoot}main.css`),     
            blogHeader = headerModule(globals.title, `${dirs.toRoot}index.html`),
            footer = footerModule(globals.title, globals.description, globals.email, globals.social || [], dirs.toRoot);

        let html = postTheme(head, blogHeader, converted[0].title, date.toISOString() , date.toDateString(), kramed(converted[1]), footer);
        // Storing this post
        fs.ensureDirSync(`_site${dirs.dir}`);
        fs.writeFileSync(`_site${dirs.fullPath}`, prettifyHTML(html), () => {});
        // Pushing needed variables to the global object to be used in the home page indexing
        globals.posts.push({
            date: date.toDateString(),
            link: `.${dirs.fullPath}`,
            title: converted[0].title,
            preview: globals.preview ? shortenedDesc : undefined
        });
        // Pushing to sitemap
        sitemap.push({ 
            loc: `${ globals.site }${ dirs.fullPath }`, 
            priority: converted[0].priority || 0.5,
            lastmod: date.toISOString()
        });
    }
});

// Create Home page
globals.posts = globals.posts.sort((a, b) => (new Date(a.date) - new Date(b.date) > 0) ? -1 : 1);
let footer = footerModule(globals.title, globals.description, globals.email, globals.social || [], "");
let html = fs.existsSync("index.md") ? kramed(fs.readFileSync("index.md", "utf8")) : "";
fs.writeFileSync('_site/index.html', prettifyHTML(homeTheme(headModule(`${globals.title}${globals.homePageTitle || ""}`, globals.description, globals.keywords || [], 'main.css', globals.schema || undefined), header, globals.posts, footer, html, globals.postName || "Posts")), () => {});
sitemap.push({  loc: `${ globals.site }/index.html`, priority: 1 });
fs.writeFileSync("_site/sitemap.xml", prettifyHTML(sitemapBuilder(sitemap)), () => {});
fs.writeFileSync("_site/robots.txt", `User-agent: * \nSITEMAP: ${ globals.site }/sitemap.xml`, () => {});

// ----------------------------------------- Functions --------------------------------------------------

function sitemapBuilder(sitemapJSON) {
    return `
        <?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${ sitemapJSON
                .map(page => "<url>\n" + 
                    Object.keys(page)
                        .map(key => "<" + key + ">" + page[key] + "</" + key + ">")
                        .join("\n")
                + "\n</url>")
                .join("\n") }
        </urlset>
    `
}

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

function shortenDesc(desc) {
    return desc.length > 157 ? `${desc.substr(0, 157)}...` : desc;
}