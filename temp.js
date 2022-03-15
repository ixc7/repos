#!/usr/bin/env node

import { request } from 'https'

const newSearch = (q = '', url = ['/search/repositories', 'https://api.github.com']) => {
  const endpoint = new URL(...url)

  for (const i in {
    page: '1',
    per_page: '100',
    sort: 'stars',
    order: 'desc',
    accept: 'application/vnd.github.v3+json',
    q
  }) {
    endpoint.searchParams.set(i, i.value)
  }

  return request(endpoint.href, {
    headers: {
      'User-Agent': ''
    }
  })
}

const search = input =>
  new Promise((resolve, reject) => {
    const req = newSearch(input)
    req.on('response', res => {
      let final = ''
      res.on('data', chunk => (final += chunk.toString('utf8')))
      res.on('end', () => {
        resolve(JSON.stringify(JSON.parse(final), 0, 2))
      })
    })
    req.on('error', e => reject(e))
    req.end()
  })

if (!process.argv[2]) {
  console.log('please enter a search term')
  process.exit(0)
}

console.log(await search(process.argv.slice(2)))
