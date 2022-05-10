import { renderHome } from './home'

const render404 = (): void => {
  const heading = document.createElement('h1')
  heading.innerText = 'Not here, friend'
  document.querySelector('#root')?.append(heading)
}

switch (window.location.pathname) {
  case '/':
    renderHome()
    break
  default:
    render404()
}
