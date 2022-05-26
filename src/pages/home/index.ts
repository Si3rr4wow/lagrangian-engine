import * as THREE from 'three'
import './index.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { WaveField } from '../../math/WaveField'
import { WaveControls } from './WaveControls'

const waveField = new WaveField({
  x: {
    sin: { period: 1, amplitude: 1 },
    cos: { period: 1, amplitude: 1 },
  },
  y: {
    sin: { period: 1, amplitude: 1 },
    cos: { period: 1, amplitude: 1 },
  },
  xLength: 256,
  yLength: 256,
})

WaveControls(waveField)

const setupCamera = (): { camera: THREE.Camera } => {
  const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight
  )
  camera.position.set(-10, -10, 10)

  return { camera }
}

const setupPlanes = (
  scene: THREE.Scene
): { tris: Array<THREE.Vector3>; geometry: THREE.BufferGeometry } => {
  const { geometry, triangles: tris, mesh } = waveField
  scene.add(mesh)

  return { tris, geometry }
}

const setupAxes = (scene: THREE.Scene): { axes: THREE.AxesHelper } => {
  const axes = new THREE.AxesHelper(5)
  axes.setColors(
    new THREE.Color(0xff0000),
    new THREE.Color(0x00ff00),
    new THREE.Color(0x0000ff)
  )
  scene.add(axes)

  return { axes }
}

export const renderHome = (): void => {
  THREE.Object3D.DefaultUp.set(0, 0, 1)

  const { camera } = setupCamera()
  const scene = new THREE.Scene()
  setupPlanes(scene)
  setupAxes(scene)
  scene.background = new THREE.Color('#d6a9c6')

  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)
  const controls = new OrbitControls(camera, renderer.domElement)

  const animation: THREE.XRAnimationLoopCallback = () => {
    controls.update()

    renderer.render(scene, camera)
  }
  renderer.setAnimationLoop(animation)

  const render = (): void => {
    requestAnimationFrame(render)
  }

  render()
}
