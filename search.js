#!/usr/bin/env node

import https from 'https'



const search = q => {
  const endpoint = new URL('/search/repositories', 'https://api.github.com')
  endpoint.searchParams.set('q', q)
  for (const i in {
    page: '1',
    per_page: '100',
    sort: 'stars',
    order: 'desc',
    accept: 'application/vnd.github.v3+json',
  }) {
    endpoint.searchParams.set(i, i.value)
  }

  const req = https.request(endpoint.href, {
    headers: {
      'User-Agent': ''
    }
  })

  return new Promise((resolve, reject) => {
    req.on('response', res => {
      let acc = ''
      res.on('data', chunk => (acc += chunk.toString('utf8')))
      res.on('end', () => {
        resolve(
          JSON.parse(acc).items
          .map(({ full_name, description, default_branch }) => ({
            full_name,
            description,
            default_branch
          }))
        )
      })
    })
    req.on('error', e => reject(e))
    req.end()
  })

}

if (process.argv[2]) console.log(await search(process.argv[2]))
else console.log('please enter a search term')