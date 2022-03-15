#!/usr/bin/env node

import search from './search.js'

if (process.argv[2]) console.log(await search(process.argv[2]))
else console.log('please enter a search term')
