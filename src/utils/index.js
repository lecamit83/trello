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
    if(partners[i].userId.toString() === myId.toString()) {
      return true;
    }
  }
  return false;
};
function isAdmin( partners, myId) {
  for(let i = 0; i < partners.length; i++) {
    if(partners[i].userId.toString() === myId.toString() && partners[i].isAdmin === true) {
      return true;
    }
  }
  return false;
};
function isOwner(partners, useId) {
  return partners[0].userId.toString() === useId.toString() && partners[0].isAdmin;
}
module.exports = {
  formatTitle,
  isMember,
  isAdmin,
  isOwner,
}
