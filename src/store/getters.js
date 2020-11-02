const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  permissions: state => state.user.permissions,
  routes: state => state.permission.routes,
  sidebarmenus: state => state.permission.sideBarMenus
}
export default getters
