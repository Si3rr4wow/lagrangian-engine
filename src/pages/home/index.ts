import * as THREE from 'three'
import './index.css'
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls'
import { makeWaves } from '../../math/makeWaves'

const waves = makeWaves(200)

export const renderHome = (): void => {
  const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.01,
    100
  )
  camera.position.set(10, 0, 10)
  camera.rotateY(45)

  const scene = new THREE.Scene()

  const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2)
  const material = new THREE.MeshNormalMaterial()

  waves.forEach((wave, i) => {
    wave.forEach(([x, y]) => {
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(x, y, i)
      scene.add(mesh)
    })
  })

  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)

  animation

  function animation(/*time: number*/): void {
    // mesh.rotation.x = time / 2000
    // mesh.rotation.y = time / 1000

    renderer.render(scene, camera)
  }
  renderer.setAnimationLoop(animation)

  const clock = new THREE.Clock(true)
  const controls = new FirstPersonControls(camera, renderer.domElement)

  const render = (): void => {
    requestAnimationFrame(render)

    controls.update(clock.getDelta())
  }

  render()
}
