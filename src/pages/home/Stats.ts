import Stats from 'stats.js'

export const stats = new Stats()
export const StatsDisplay = (): void => {
  stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
  stats.dom.style.top = '100px'
  document.body.appendChild(stats.dom)
}
