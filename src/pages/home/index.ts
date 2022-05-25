import * as THREE from 'three'
import './index.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { WaveCoordArray, WaveField } from '../../math/WaveField'
import { WaveControls } from './WaveControls'

const waveField = new WaveField({
  x: {
    sinParameters: { period: 10, amplitude: 1 },
    cosParameters: { period: 10, amplitude: 1 },
  },
  y: {
    sinParameters: { period: 10, amplitude: 1 },
    cosParameters: { period: 10, amplitude: 1 },
  },
  xLength: 50,
  yLength: 50,
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

type WaveMeshes = Array<[THREE.Mesh, [number, number]]>

const setupCubes = (
  scene: THREE.Scene,
  { waveCoordArray }: { waveCoordArray: WaveCoordArray }
): { meshes: WaveMeshes } => {
  const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1)
  const material = new THREE.MeshBasicMaterial({
    color: 0x0000ff,
  })

  const meshes: WaveMeshes = waveCoordArray.map(([x, y, z]) => {
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(x, y, z)
    scene.add(mesh)
    return [mesh, [x, y]]
  })

  return { meshes }
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
  setupCubes(scene, { waveCoordArray: waveField.coords })
  setupAxes(scene)

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
