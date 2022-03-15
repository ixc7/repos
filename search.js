#!/usr/bin/env node

import https from 'https'

const toURL = q => {
  const API = new URL('/search/repositories', 'https://api.github.com')
  const params = {
      q,
      page: 1,
      per_page: 25,
      sort: 'stars',
      order: 'desc',
      accept: 'application/vnd.github.v3+json',
    }
  for (const i of Object.keys(params)) {
    API.searchParams.set(i, params[i])
  }
  return API.href
}

export const search = q => new Promise((resolve, reject) => {
  const req = https.request(toURL(q), {
    headers: {
      'User-Agent': ''
    }
  })

  req.on('response', res => {
    let acc = ''
    res.on('data', chunk => (acc += chunk.toString('utf8')))
    res.on('end', () => {
      let retItems = JSON.parse(acc).items
      resolve(retItems
        .map(({
          html_url,
          description,
          default_branch
        }) => {
          const max = process.stdout.columns - 15
          const str = description.slice(0, max).trim()
          const arr = str.split(' ')
          const trunc = arr.slice(0, arr.length - 1).join(' ')

          return {
            REPO: html_url,
            MAIN: default_branch,
            INFO: str.length === max ? `${trunc}...` : str
          }
        })
      )
    })
  })
  req.on('error', e => reject(e))
  req.end()
})

export default search