/* globals afterAll, beforeAll, expect, describe, it */
const svgtojs = require('../index.js')
// const assert = require('assert')
// const jsdom = require('jsdom')
const path = require('path')
const fs = require('fs')

let result = ''
const blueprint = `/*!Copyright*/
(function(el){el.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" style="display:none"><symbol viewBox="0 0 15 15" id="nrk-bell"><path stroke="currentColor" fill="none" d="M7.5081246 2.5C4.0162492 2.5 4 5.38865948 4 6.2861215V9c0 1-1.5166599 1.7192343-1.5 2 .03450336.5814775.27977082.4920386.9090909.4920386h8.1818182C12.2186267 11.4920386 12.5 11.5 12.5 11c0-.3060964-1.5-1-1.5-2V6.2861215C11 5.35488333 11 2.5 7.5081246 2.5z"/><path d="M8.75 12.5h-2.5s0 1.25 1.25 1.25 1.25-1.25 1.25-1.25z"/><path stroke="currentColor" d="M7.5 1.5V2" stroke-linecap="round"/></symbol><symbol viewBox="0 0 15 15" id="nrk-close"><path stroke="currentColor" stroke-linecap="round" d="M2 2l11 11M2 13L13 2"/></symbol></svg>';document.documentElement.lastElementChild.appendChild(el.firstElementChild)})(document.createElement('div'))`

const config = {
  svgFileName: 'test-icons.js',
  svgFileNameMin: 'test-icons.min.js',
  srcPath: __dirname,
  distPath: __dirname,
  banner: 'Copyright'
}

describe('svgToSymbol', () => {
  // Generate test files
  beforeAll(() => svgtojs(config).then((js) => (result = js)))

  // Delete test files
  afterAll(() => {
    fs.unlink(path.join(__dirname, config.svgFileName), (err) => err && console.error(err))
    fs.unlink(path.join(__dirname, config.svgFileNameMin), (err) => err && console.error(err))
  })

  it('should minify svg', () => {
    expect(result.split('\n').length).toBe(2)
  })

  it('should start with banner', () => {
    expect(result.indexOf(`/*!${config.banner}*/`)).toBe(0)
  })

  it('should contain svg ids', () => {
    expect(result.indexOf(' id="nrk-bell"') > 0).toBe(true)
    expect(result.indexOf(' id="nrk-close"') > 0).toBe(true)
  })

  it('should be wrapped in hidden svg', () => {
    expect(result.indexOf('xmlns="http://www.w3.org/2000/svg"') > 0).toBe(true)
    expect(result.indexOf(' style="display:none"') > 0).toBe(true)
  })

  it('should have only one, valid xmlns definition', () => {
    expect(result.match(/xmlns="http:\/\/www.w3.org\/2000\/svg"/g).length).toBe(1)
  })

  it('should contain all symbols', () => {
    expect(result.match(/<symbol/g).length).toBe(2)
  })

  it('should equal blueprint', () => {
    expect(result).toBe(blueprint)
  })

  it('should append to document', () => {
    document.body.innerHTML = result
    expect(document.querySelectorAll('#nrk-bell').length).toBe(1)
    expect(document.querySelectorAll('symbol').length).toBe(2)
    expect(document.querySelectorAll('svg').length).toBe(1)
  })
})