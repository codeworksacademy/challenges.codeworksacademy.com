export async function registerGlobalComponents(root) {
  const components = import.meta.glob('./components/**/*.vue', { eager: true })
  for (const fileName in components) {
    const component = components[fileName]
    const componentName = fileName
      .substring(fileName.lastIndexOf('/') + 1)
      .replace(/\.\w+$/, '')

    root.component(componentName, component.default)
  }
}