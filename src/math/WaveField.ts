import * as THREE from 'three'
import { MutableWave, MutableWaveArgs } from './MutableWave'

const generateWaveCoordArray = (waveField: WaveField): Array<THREE.Vector3> => {
  const wave: Array<THREE.Vector3> = []

  for (let x = 0; x < waveField.xLength; x++) {
    for (let y = 0; y < waveField.yLength; y++) {
      const z = waveField.calculate(x, y)
      wave.push(new THREE.Vector3(x, y, z))
    }
  }

  return wave
}

/*
b
|  \
|    \
a - - c
  \   |
    \ |
      d

we triangulate the coordinate array thusly. Take each point as a in the diagram above.

If from a we can find no c then we are at a right hand edge, therefore, since both
constructable triangles are dependent on the edge ac then we need not do anything.

If from a we can find b then we construct the triangle abc

If from a we can find c then we construct the triangle acd
*/
export const generateTriangleStencil = (
  waveField: WaveField
): Array<number> => {
  const triangles = []
  for (let x = 0; x < waveField.xLength; x++) {
    for (let y = 0; y < waveField.yLength; y++) {
      if (x === waveField.xLength - 1) {
        continue
      }

      const here = y + x * waveField.xLength

      if (y < waveField.yLength - 1) {
        const up = here + 1
        const right = here + waveField.yLength
        triangles.push(here)
        triangles.push(up)
        triangles.push(right)
      }

      if (y >= 1) {
        const right = here + waveField.yLength
        const downAndRight = right - 1
        triangles.push(here)
        triangles.push(right)
        triangles.push(downAndRight)
      }
    }
  }
  return triangles
}

const generateGeometry = (waveField: WaveField): THREE.BufferGeometry => {
  const geometry = new THREE.BufferGeometry()
  geometry.setFromPoints(waveField.triangles)
  geometry.computeVertexNormals()
  return geometry
}

const generateMesh = (waveField: WaveField): THREE.Mesh => {
  return new THREE.Mesh(waveField.geometry, waveField.material)
}

type WaveFieldArgs = {
  xLength: number
  yLength: number
} & MutableWaveArgs

export class WaveField extends MutableWave {
  constructor({ xLength, yLength, ...mutableWaveArgs }: WaveFieldArgs) {
    super(mutableWaveArgs)
    this.xLength = xLength
    this.yLength = yLength
    this._material = new THREE.MeshNormalMaterial({
      side: THREE.DoubleSide,
    })
    this._coords = generateWaveCoordArray(this)
    this._coordinatedTriangles = generateTriangleStencil(this)
    this._triangles = this.calculateTriangles()
    this._geometry = generateGeometry(this)
    this._mesh = generateMesh(this)
  }
  private _coords: Array<THREE.Vector3>
  private _coordinatedTriangles: Array<number>
  private _triangles: Array<THREE.Vector3>
  private _geometry: THREE.BufferGeometry
  private _material: THREE.Material
  private _mesh: THREE.Mesh

  public xLength
  public yLength

  public get coords(): Array<THREE.Vector3> {
    return this._coords
  }

  public get coordinatedTriangles(): Array<number> {
    return this._coordinatedTriangles
  }

  public get triangles(): Array<THREE.Vector3> {
    return this._triangles
  }

  public get geometry(): THREE.BufferGeometry {
    return this._geometry
  }

  public get material(): THREE.Material {
    return this._material
  }

  public set material(nextMaterial: THREE.Material) {
    this._material = nextMaterial
    this._mesh.material = this._material
  }

  public get mesh(): THREE.Mesh {
    return this._mesh
  }

  public refresh(): void {
    this.recalculateCoords()

    this.calculateTriangles()

    this.geometry.setFromPoints(this.triangles)

    this.geometry.computeVertexNormals()
  }

  public setParameters(
    func: (parameters: MutableWaveArgs) => MutableWaveArgs
  ): void {
    super.setParameters(func)
    this.refresh()
  }

  private recalculateCoords(): void {
    const coordsLength = this.coords.length
    let j = coordsLength
    while (j--) {
      this.coords[j].setZ(this.calculate(this.coords[j].x, this.coords[j].y))
    }
  }

  private calculateTriangles(): Array<THREE.Vector3> {
    return this.coordinatedTriangles.map((coordIndex) => {
      return this.coords[coordIndex]
    })
  }
}
