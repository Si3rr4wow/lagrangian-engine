import './pages/routes'

window.onpopstate = function (event): void {
  alert(`location: ${document.location}, state: ${JSON.stringify(event.state)}`)
}
