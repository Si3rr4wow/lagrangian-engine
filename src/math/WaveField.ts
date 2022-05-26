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

// We are on a rightmost (x max) edge of the coordinate array if
// there is no array element that is one more y cycle away
// from our current index
const isRightmostEdgeCoord = (
  coordIndex: number,
  waveField: WaveField
): boolean => {
  return !waveField.coords[coordIndex + waveField.yLength]
}

// There is a coordinate above our current position in the array
// if the next coordinate's index is not evenly divisible by
// the y length of the coordinate array.
const hasCoordAbove = (coordIndex: number, waveField: WaveField): boolean => {
  return !!((coordIndex + 1) % waveField.yLength)
}

//There is a coordinate below our current position if the current
// index is not evenly divisible by the y length
const hasCoordBelow = (coordIndex: number, waveField: WaveField): boolean => {
  return !!(coordIndex % waveField.yLength)
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
  return waveField.coords.reduce<Array<number>>((acc, _cur, i) => {
    if (isRightmostEdgeCoord(i, waveField)) {
      return acc
    }

    if (hasCoordAbove(i, waveField)) {
      const here = i
      const up = i + 1
      const right = i + waveField.yLength
      acc = [...acc, here, up, right]
    }

    if (hasCoordBelow(i, waveField)) {
      const here = i
      const right = i + waveField.yLength
      const downAndRight = i - 1 + waveField.yLength
      acc = [...acc, downAndRight, right, here]
    }

    return acc
  }, [])
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
    // uncomment to prove while backwards is fastest
    // console.time('coords.forEach')
    // this.coords.forEach((coord) => {
    //   coord.setZ(this.calculate(coord.x, coord.y))
    // })
    // console.timeEnd('coords.forEach')

    // console.time('coords.while')
    // let i = 0
    // while (i < coordsLength) {
    //   this.coords[i].setZ(this.calculate(this.coords[i].x, this.coords[i].y))
    //   i++
    // }
    // console.timeEnd('coords.while')

    const coordsLength = this.coords.length
    // console.time('coords.whileBackwards')
    let j = coordsLength
    while (j--) {
      this.coords[j].setZ(this.calculate(this.coords[j].x, this.coords[j].y))
    }
    // console.timeEnd('coords.whileBackwards')
  }

  private calculateTriangles(): Array<THREE.Vector3> {
    return this.coordinatedTriangles.map((coordIndex) => {
      return this.coords[coordIndex]
    })
  }
}
