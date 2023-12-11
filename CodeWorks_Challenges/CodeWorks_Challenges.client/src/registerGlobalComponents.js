export function registerGlobalComponents(root) {
  // https://webpack.js.org/guides/dependency-management/#require-context
  // @ts-ignore
  const components = import.meta.glob('./components/**/*.vue')
  Object.entries(components).forEach(async([fileName, importable]) => {
    const component = await importable().default
    const componentName = (component?.name || fileName)
      .substring(fileName.lastIndexOf('/') + 1)
      .replace(/\.\w+$/, '')
    // Register component on this Vue instance
    root.component(componentName, component)
  })
}