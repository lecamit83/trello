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
function isOwner(ownerId, myId) {
  return ownerId.toString() === myId.toString();
}
function isValidDate(s) {
  let bits = s.split('/');
  let d = new Date(bits[2] + '/' + bits[0] + '/' + bits[1]);
  return (d && ((d.getMonth() + 1) == Number(bits[0]) && d.getDate() == Number(bits[1])));
}
function isEmpty(s) {
  return s.trim().length === 0;
}
module.exports = {
  formatTitle,
  isMember,
  isAdmin,
  isOwner,
  isValidDate,
  isEmpty
}
