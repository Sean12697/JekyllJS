module.exports = (title, about, email, social, toRoot) => `<footer class="site-footer h-card">
    <div class="wrapper">

        <h2 class="footer-heading">${title}</h2>

        <div class="footer-col-wrapper">
            <div class="footer-col footer-col-1">
                <ul class="contact-list">
                    <li class="p-name">${title}</li>
                    <li><a class="u-email" href="mailto:${email}">${email}</a></li>
                </ul>
            </div>

            <div class="footer-col footer-col-2">
                <ul class="social-media-list">
                    ${ social.map(site => {
                        return '<li><a href="' + site.link + '" target="_blank" rel="noopener"><svg class="svg-icon"><use xlink:href="' + toRoot + 'minima-social-icons.svg#' + site.name.toLowerCase() + '"></use></svg><span class="username">' + site.user + '</span></a></li>'
                    }).join("\n") }
                </ul>
            </div>

            <div class="footer-col footer-col-3">
                <p>${about}</p>
            </div>
        </div>

    </div>

</footer>`