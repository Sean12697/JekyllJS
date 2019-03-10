module.exports = (head, mainHeader, title, ISO, publishedText, article, footer) => `<!DOCTYPE html>
<html lang="en">
    ${head}
<body>
    ${mainHeader}
    <main class="page-content" aria-label="Content">
        <div class="wrapper">
            <article class="post h-entry" itemscope itemtype="http://schema.org/BlogPosting">

                <header class="post-header">
                    <h1 class="post-title p-name" itemprop="name headline">${title}</h1>
                    <p class="post-meta">
                    <time class="dt-published" datetime="${ISO}" itemprop="datePublished">${publishedText}
                    </time></p>
                </header>

                <div class="post-content e-content" itemprop="articleBody">
                    ${article}
                </div>

            </article>
        </div>
        ${footer}
    </main>
</body>

</html>`