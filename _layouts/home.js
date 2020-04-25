module.exports = (head, mainHeader, posts, footer, html, postName) => `<!DOCTYPE html>
<html lang="en">
${head}

<body>
  ${mainHeader}
  <main class="page-content" aria-label="Content">
    ${ html ? '<div class="wrapper">' + html + '</div>' : "" }
    <div class="wrapper">
      <div class="home">
        <h2 class="post-list-heading">${ postName }</h2>
        <ul class="post-list">
            ${ posts.reduce((all, post) => all += '<li><span class="post-meta">' + post.date + '</span><h3><a class="post-link" href="' + post.link + '">' + post.title + '</a></h3></li>', "") }
        </ul>
      </div>

    </div>
  </main>
  ${footer}
</body>

</html>`