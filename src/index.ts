import './index.css'
import * as THREE from 'three'
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls'
import { makeWave } from './math/makeWaves'

const wave1 = makeWave()

console.log(wave1({ range: [0, 4], segments: 20 }))
console.log(wave1({ range: [0, 2], segments: 10 }))
console.log(wave1({ range: [2, 4], segments: 10 }))
console.log(wave1({ range: [-2, 2], segments: 20 }))

const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.01,
  10
)
camera.position.z = 1

const scene = new THREE.Scene()

const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2)
const material = new THREE.MeshNormalMaterial()

const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setAnimationLoop(animation)
document.body.appendChild(renderer.domElement)

// animation

function animation(time: number): void {
  mesh.rotation.x = time / 2000
  mesh.rotation.y = time / 1000

  renderer.render(scene, camera)
}

const clock = new THREE.Clock(true)
const controls = new FirstPersonControls(camera, renderer.domElement)

const render = (): void => {
  requestAnimationFrame(render)

  controls.update(clock.getDelta())
}

render()
