module.exports = (title, about, keywords, CSS, schema) => `<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title}</title>
    <meta name="generator" content="Jekyll.JS" />
    <meta property="og:title" content="${title}" />
    <meta property="og:locale" content="en_US" />
    <meta name="keywords" content="${keywords.join(", ")}" />
    <meta name="description" content="${about}" />
    <meta property="og:description" content="${about}" />
    <meta property="og:site_name" content="${title}" />
    ${
        schema ? JSON.stringify(schema) : '<script type="application/ld+json">{"@type": "WebSite","headline": "' + title + '","name": "' + title + '","description": "' + about + '","@context": "http://schema.org"}</script>'
    }
    <!-- End Jekyll.JS SEO tag -->
    <link rel="stylesheet" href="${CSS}">
</head>`