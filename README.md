# Jekyll.JS (Blog-aware Static Site Generator in NodeJS)

This is a satiric repository which has been made to mimic Jekyll (even using assets from Jekyll's [Minima](https://github.com/jekyll/minima) theme) but instead of being written in Ruby, it has been written in NodeJS. 

Currently you can only alter the `_config.js` file and add files to the `_posts` folder to be generated, but there may be more features to come (or feel free to submit PR's).

## Deploy

If you want to deploy this yourself to a live/free server so it is online, I would recomend using (Netlify)[https://www.netlify.com/], from there (once you have made your changes) there are only two settings you need to set (after selecting the repo and your branch):

* Build Command: `node script.js` or `npm serve`
* Publish Directory: `_site`
