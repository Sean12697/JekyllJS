module.exports = (title, about, email, github, twitter) => `<footer class="site-footer h-card">
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
                    <li><a href="https://github.com/${github}"><svg class="svg-icon">
                                <use xlink:href="minima-social-icons.svg#github"></use>
                            </svg> <span class="username">${github}</span></a></li>
                    <li><a href="https://www.twitter.com/${twitter}"><svg class="svg-icon">
                                <use xlink:href="minima-social-icons.svg#twitter"></use>
                            </svg> <span class="username">${twitter}</span></a></li>
                </ul>
            </div>

            <div class="footer-col footer-col-3">
                <p>${about}</p>
            </div>
        </div>

    </div>

</footer>`