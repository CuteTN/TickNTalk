export const navigateAndReset = (navigation, routeName) => {
  navigation.reset({
    index: 0,
    routes: [{ name: routeName }]
  })
}