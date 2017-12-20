var fs = require('fs')

module.exports = function () {
  var files = fs.readdirSync('./assets/js')
  var token1 = '090bbff2743e2df29457'
  var token2 = 'd475ecec43be93c5fd57'
  var token = token1 + token2

  for (var i = files.length - 1; i >= 0; i--) {
    var appFileName = './assets/js/' + files[i]
    var buf = fs.readFileSync(appFileName, { encoding: 'utf8' })

    if (buf.indexOf(token) > -1) {
      buf = buf.toString().replace(token, token1 + '"+"' + token2)
      fs.writeFileSync(appFileName, buf)
      console.log('Success: modify token success!')
    }
  }
}
