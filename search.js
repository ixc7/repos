#!/usr/bin/env node

import { request } from 'https'

const toURL = q => {
  const API = new URL('/search/repositories', 'https://api.github.com')
  const params = {
    q,
    page: 1,
    per_page: 25,
    sort: 'stars',
    order: 'desc',
    accept: 'application/vnd.github.v3+json'
  }
  for (const i of Object.keys(params)) {
    API.searchParams.set(i, params[i])
  }
  return API.href
}

export const search = (q, opts = {}) =>
  new Promise((resolve, reject) => {
    const req = request(toURL(q), {
      headers: {
        'User-Agent': ''
      }
    })

    req.on('response', res => {
      let acc = ''
      res.on('data', chunk => (acc += chunk.toString('utf8')))
      res.on('end', () => {
        const retItems = JSON.parse(acc).items
        if (!retItems.length) {
          console.log('nothing found')
          process.exit(0)
        }

        resolve(
          retItems.map(({ name, html_url, description, default_branch, language }) => {
            const max = process.stdout.columns - 24 // '  description: ' (+ padding)
            const str = description ? description.slice(0, max).trim() : ''
            const arr = str.split(' ')
            const trunc = arr.slice(0, arr.length - 1).join(' ')

            return {
              name,
              description: str.length === max ? `${trunc}...` : str,
              repository: html_url,
              branch: default_branch,
              language: language || ''
            }
          })
        )
      })
    })
    req.on('error', e => reject(e))
    req.end()
  })

export default search
