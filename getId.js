const crypto = require('crypto');
const { get } = require('express/lib/response');
const getId = function  (url)
{
  
  const hash = crypto.createHash('md5').update(url).digest('hex');
 
      return parseInt(hash);
  
      
}
module.exports = getId