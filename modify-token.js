var fs = require('fs')

module.exports = function () {
  var files = fs.readdirSync('./dist/js')
  var token1 = '654f89e6030e8356063e'
  var token2 = '98c2782e58ac3ba53c3a'
  var token = token1 + token2

  for (var i = files.length - 1; i >= 0; i--) {
    var appFileName = './dist/js/' + files[i]
    var buf = fs.readFileSync(appFileName, { encoding: 'utf8' })

    if (buf.indexOf(token) > -1) {
      buf = buf.toString().replace(token, token1 + '"+"' + token2)
      fs.writeFileSync(appFileName, buf)
      console.log('Success: modify token success!')
    }
  }
}
