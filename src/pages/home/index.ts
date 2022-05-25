import * as THREE from 'three'
import './index.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { MutableWave } from '../../math/MutableWave'
import { WaveControls } from './WaveControls'
import { StatsDisplay, stats } from './Stats'

const mutableWave = new MutableWave(
  { period: 10, amplitude: 1 },
  { period: 10, amplitude: 1 },
  { period: 10, amplitude: 1 },
  { period: 10, amplitude: 1 }
)

const sqrtCubeCount = 128

WaveControls(mutableWave)
StatsDisplay()

const setupCamera = (): { camera: THREE.Camera } => {
  const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight
  )
  camera.position.set(0, 0, sqrtCubeCount)

  return { camera }
}

type WaveMeshes = Array<[THREE.Mesh, [number, number]]>
type WaveCoordArray = Array<[number, number, number]>

const generateWaveCoordArray = (mutableWave: MutableWave): WaveCoordArray => {
  const wave: WaveCoordArray = []

  for (let x = 0; x < sqrtCubeCount; x++) {
    for (let y = 0; y < sqrtCubeCount; y++) {
      const z = mutableWave.calculate(x, y)
      wave.push([x, y, z])
    }
  }

  return wave
}

const waveCoordsToTris = (wave: WaveCoordArray): Array<THREE.Vector3> => {
  return wave.reduce<Array<THREE.Vector3>>((acc, cur, i) => {
    if (!wave[i + sqrtCubeCount]) {
      return acc
    }

    if ((i + 1) % sqrtCubeCount) {
      const here = new THREE.Vector3(cur[0], cur[1], cur[2])
      const up = new THREE.Vector3(
        wave[i + 1]?.[0],
        wave[i + 1]?.[1],
        wave[i + 1]?.[2]
      )
      const right = new THREE.Vector3(
        wave[i + sqrtCubeCount]?.[0],
        wave[i + sqrtCubeCount]?.[1],
        wave[i + sqrtCubeCount]?.[2]
      )
      acc = [...acc, here, up, right]
    }

    if (i % sqrtCubeCount) {
      const here = new THREE.Vector3(cur[0], cur[1], cur[2])
      const right = new THREE.Vector3(
        wave[i + sqrtCubeCount]?.[0],
        wave[i + sqrtCubeCount]?.[1],
        wave[i + sqrtCubeCount]?.[2]
      )
      const downAndRight = new THREE.Vector3(
        wave[i - 1 + sqrtCubeCount]?.[0],
        wave[i - 1 + sqrtCubeCount]?.[1],
        wave[i - 1 + sqrtCubeCount]?.[2]
      )
      acc = [...acc, downAndRight, right, here]
    }

    return acc
  }, [] as Array<THREE.Vector3>)
}

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
  scene: THREE.Scene,
  { waveCoordArray }: { waveCoordArray: WaveCoordArray }
): { tris: Array<THREE.Vector3>; geometry: THREE.BufferGeometry } => {
  const material = new THREE.MeshNormalMaterial({
    side: THREE.DoubleSide,
  })

  const tris = waveCoordsToTris(waveCoordArray)

  const geometry = new THREE.BufferGeometry().setFromPoints(tris)
  geometry.computeVertexNormals()

  const mesh = new THREE.Mesh(geometry, material)
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

const animateWaves = (
  clock: THREE.Clock,
  {
    meshes,
    tris,
    geometry,
  }: {
    meshes: WaveMeshes
    tris: Array<THREE.Vector3>
    geometry: THREE.BufferGeometry
  }
): void => {
  mutableWave.xSinParameters = {
    ...mutableWave.xSinParameters,
    horizontalDisplacement:
      (mutableWave.xSinParameters.horizontalDisplacement || 0) +
      clock.getDelta() * 10,
  }
  mutableWave.ySinParameters = {
    ...mutableWave.ySinParameters,
    horizontalDisplacement:
      (mutableWave.ySinParameters.horizontalDisplacement || 0) +
      clock.getDelta() * 10,
  }
  if (mutableWave.paramsChangedSinceLastCalculate) {
    meshes.forEach(([mesh, [x, y]]) => {
      mesh.position.set(x, y, mutableWave.calculate(x, y))
    })
    const nextTris = tris.map(
      (vector) =>
        new THREE.Vector3(
          vector.x,
          vector.y,
          mutableWave.calculate(vector.x, vector.y)
        )
    )
    geometry.setFromPoints(nextTris)
    geometry.computeVertexNormals()
  }
}

export const renderHome = (): void => {
  THREE.Object3D.DefaultUp.set(0, 0, 1)

  const { camera } = setupCamera()
  const scene = new THREE.Scene()
  const waveCoordArray = generateWaveCoordArray(mutableWave)
  const { meshes: cubeMeshes } = setupCubes(scene, { waveCoordArray })
  const { tris, geometry } = setupPlanes(scene, { waveCoordArray })
  setupAxes(scene)

  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)
  const controls = new OrbitControls(camera, renderer.domElement)

  const clock = new THREE.Clock()
  const animation: THREE.XRAnimationLoopCallback = () => {
    controls.update()
    stats.begin()
    animateWaves(clock, { meshes: cubeMeshes, tris, geometry })
    stats.end()
    renderer.render(scene, camera)
  }
  renderer.setAnimationLoop(animation)

  const render = (): void => {
    requestAnimationFrame(render)
  }

  render()
}
