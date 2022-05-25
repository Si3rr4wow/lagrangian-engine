import * as THREE from 'three'
import { MutableWave, MutableWaveArgs } from './MutableWave'

export type WaveCoordArray = Array<[number, number, number]>
type Triangles = Array<THREE.Vector3>

const generateWaveCoordArray = (waveField: WaveField): WaveCoordArray => {
  const wave: WaveCoordArray = []

  for (let x = 0; x < waveField.xLength; x++) {
    for (let y = 0; y < waveField.yLength; y++) {
      const z = waveField.calculate(x, y)
      wave.push([x, y, z])
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
const waveCoordsToTris = (waveField: WaveField): Triangles => {
  return waveField.coords.reduce<Array<THREE.Vector3>>((acc, cur, i) => {
    if (isRightmostEdgeCoord(i, waveField)) {
      return acc
    }

    if (hasCoordAbove(i, waveField)) {
      const here = new THREE.Vector3(cur[0], cur[1], cur[2])
      const up = new THREE.Vector3(
        waveField.coords[i + 1]?.[0],
        waveField.coords[i + 1]?.[1],
        waveField.coords[i + 1]?.[2]
      )
      const right = new THREE.Vector3(
        waveField.coords[i + waveField.yLength]?.[0],
        waveField.coords[i + waveField.yLength]?.[1],
        waveField.coords[i + waveField.yLength]?.[2]
      )
      acc = [...acc, here, up, right]
    }

    if (hasCoordBelow(i, waveField)) {
      const here = new THREE.Vector3(cur[0], cur[1], cur[2])
      const right = new THREE.Vector3(
        waveField.coords[i + waveField.yLength]?.[0],
        waveField.coords[i + waveField.yLength]?.[1],
        waveField.coords[i + waveField.yLength]?.[2]
      )
      const downAndRight = new THREE.Vector3(
        waveField.coords[i - 1 + waveField.yLength]?.[0],
        waveField.coords[i - 1 + waveField.yLength]?.[1],
        waveField.coords[i - 1 + waveField.yLength]?.[2]
      )
      acc = [...acc, downAndRight, right, here]
    }

    return acc
  }, [] as Array<THREE.Vector3>)
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
    this._triangles = waveCoordsToTris(this)
    this._geometry = generateGeometry(this)
    this._mesh = generateMesh(this)
  }
  private _coords: WaveCoordArray
  private _triangles: Triangles
  private _geometry: THREE.BufferGeometry
  private _material: THREE.Material
  private _mesh: THREE.Mesh

  public xLength
  public yLength

  public get coords(): WaveCoordArray {
    return this._coords
  }

  public set coords(nextCoords: WaveCoordArray) {
    this._coords = nextCoords
  }

  public get triangles(): Triangles {
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
    console.log('Refreshing')
    this._coords = generateWaveCoordArray(this)
    this._triangles = waveCoordsToTris(this)
    this.geometry.setFromPoints(this.triangles)
    this.geometry.computeVertexNormals()
  }
}
