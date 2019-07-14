function formatTitle(title) {
  let arr = title.trim().split(/\s+/);  
  let result = arr.reduce(function (currentResult, word) {
    first = word.charAt(0).toUpperCase();
    second = word.slice(1).toLowerCase();
    currentResult.push(first.concat(second));
    return currentResult;
  }, []);
  return result.join(' ');
};
function isMember( partners, myId) {
  for(let i = 0; i < partners.length; i++) {
    if(partners[i].personId.toString() === myId.toString()) {
      return true;
    }
  }
  return false;
};
module.exports = {
  formatTitle,
  isMember,
}
