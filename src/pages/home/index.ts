import Stats from 'stats.js'
import * as THREE from 'three'
import './index.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { MutableWave } from '../../math/waves'

const stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
stats.dom.style.top = '40px'
document.body.appendChild(stats.dom)

const mutableWave = new MutableWave(
  { period: 12.5, amplitude: 10 },
  { period: 12.5, amplitude: 10 }
)

type Element = HTMLDivElement | HTMLLabelElement | HTMLInputElement

type Tag = <TElement extends Element>(name: string) => () => TElement

const tag: Tag =
  <TElement extends Element>(name: string) =>
  (): TElement =>
    document.createElement(name) as TElement

const Div = tag<HTMLDivElement>('div')
const Label = tag<HTMLLabelElement>('label')
const Input = tag<HTMLInputElement>('input')

const paramKeys = [
  'period',
  'amplitude',
  'verticalDisplacement',
  'horizontalDisplacement',
]

const axes = ['xParameters', 'yParameters']

const initWaveManipulators = (): void => {
  axes.forEach((axis) => {
    const controlsWrapper = Div()
    controlsWrapper.innerText = axis
    controlsWrapper.style.display = 'flex'
    document.body.appendChild(controlsWrapper)
    paramKeys.forEach((param) => {
      const paramInputLabel = Label()
      paramInputLabel.innerText = param
      const paramInput = Input()
      controlsWrapper.appendChild(paramInputLabel)
      paramInputLabel.appendChild(paramInput)
      paramInput.type = 'range'
      paramInput.onchange = (event): void => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        mutableWave[axis] = {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          ...mutableWave[axis],
          [param]: Number((event?.target as HTMLInputElement)?.value) || 1,
        }
      }
    })
  })
}

initWaveManipulators()

export const renderHome = (): void => {
  THREE.Object3D.DefaultUp.set(0, 0, 1)

  const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight
  )
  camera.position.set(50, 50, 50)

  const scene = new THREE.Scene()

  const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1)
  const material = new THREE.MeshBasicMaterial({
    color: 0xffff00,
  })

  const meshes: Array<[THREE.Mesh, [number, number]]> = []

  for (let x = 0; x < 100; x++) {
    for (let y = 0; y < 100; y++) {
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(x, y, mutableWave.calculate(x, y))
      meshes.push([mesh, [x, y]])
      scene.add(mesh)
    }
  }

  const axesHelper = new THREE.AxesHelper(5)
  axesHelper.setColors(
    new THREE.Color(0xff0000),
    new THREE.Color(0x00ff00),
    new THREE.Color(0x0000ff)
  )
  scene.add(axesHelper)

  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)
  const controls = new OrbitControls(camera, renderer.domElement)

  // const clock = new THREE.Clock()
  const animation: THREE.XRAnimationLoopCallback = () => {
    stats.begin()
    controls.update()
    // mutableWave.xParameters = {
    //   ...mutableWave.xParameters,
    //   horizontalDisplacement:
    //     (mutableWave.xParameters.horizontalDisplacement || 0) +
    //     clock.getDelta() * 50,
    // }
    // mutableWave.yParameters = {
    //   ...mutableWave.yParameters,
    //   horizontalDisplacement:
    //     (mutableWave.yParameters.horizontalDisplacement || 0) +
    //     clock.getDelta() * 50,
    // }
    if (mutableWave.paramsChangedSinceLastCalculate) {
      meshes.forEach(([mesh, [x, y]]) => {
        mesh.position.set(x, y, mutableWave.calculate(x, y))
      })
    }
    renderer.render(scene, camera)
    stats.end()
  }
  renderer.setAnimationLoop(animation)

  const render = (): void => {
    requestAnimationFrame(render)
  }

  render()
}
