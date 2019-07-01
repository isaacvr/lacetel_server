var strCategories = [ "root", "superadmin", "admin", "moderador", "user" ];
var enumCategories = {};

for (var i = 0, maxi = strCategories.length; i < maxi; i += 1) {
  enumCategories[enumCategories[strCategories[i]] = i] = strCategories[i];
}

module.exports = {
  strCategories,
  enumCategories
};