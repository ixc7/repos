#!/usr/bin/env node

import { request } from 'https'

const fetchResult = (q = '', url = ['/search/repositories', 'https://api.github.com']) => {
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

export const search = q =>
  new Promise((resolve, reject) => {
    const req = fetchResult(q)
    req.on('response', res => {
      let acc = ''
      res.on('data', chunk => (acc += chunk.toString('utf8')))
      res.on('end', () =>
        resolve(
          JSON.parse(acc).items.map(({ full_name, description, default_branch }) => ({
            full_name,
            description,
            default_branch
          }))
        )
      )
    })
    req.on('error', e => reject(e))
    req.end()
  })
