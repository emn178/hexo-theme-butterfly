/**
 * Butterfly
 * lazyload
 * replace src to data-src
 */

'use strict'

const urlFor = require('hexo-util').url_for.bind(hexo)

function processImage(image, bg) {
  const noscript = `<noscript>${image}</noscript>`;
  return image.replace('src=', `src="${bg}" data-src=`) + noscript;
}

function lazyload (htmlContent) {
  const bg = hexo.theme.config.lazyload.placeholder ? urlFor(hexo.theme.config.lazyload.placeholder) : 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
  return lazyloadIframe(htmlContent.replace(/<img.*?>/ig, (image) => processImage(image, bg)))
}

// function lazyload (htmlContent) {
//   const bg = hexo.theme.config.lazyload.placeholder ? urlFor(hexo.theme.config.lazyload.placeholder) : 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
//   return lazyloadIframe(htmlContent.replace(/(<img.*? src=)/ig, `$1 "${bg}" data-src=`))
// }

function lazyloadIframe (htmlContent) {
  const bg = hexo.theme.config.lazyload.placeholder ? urlFor(hexo.theme.config.lazyload.placeholder) : 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
  return htmlContent.replace(/(<iframe.*? src=)/ig, `$1 "${bg}" data-src=`)
}

hexo.extend.filter.register('after_render:html', function (data) {
  const config = hexo.theme.config.lazyload
  if (!config.enable) return
  if (config.field !== 'site') return
  return lazyload.call(this, data)
})

hexo.extend.filter.register('after_post_render', data => {
  const config = hexo.theme.config.lazyload
  if (!config.enable) return
  if (config.field !== 'post') return
  data.content = lazyload.call(this, data.content)
  return data
})
