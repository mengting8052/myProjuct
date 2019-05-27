const getters = {
  user: state => state.user,
  permissions : state => state.permission.permissions,
  menus: state => state.permission.menus,
  isTenant: state => state.user.isTenant,
  appTarget: state => state.permission.appTarget,
  apps: state => state.permission.apps,
}

export default getters
