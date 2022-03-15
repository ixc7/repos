#!/usr/bin/env node

import { search } from './search.js'

if (!process.argv[2]) {
  console.log('please enter a search term')
  process.exit(0)
}

console.log(await search(process.argv.slice(2)))