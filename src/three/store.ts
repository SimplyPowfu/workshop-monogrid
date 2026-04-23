import type { Group, PerspectiveCamera } from 'three'

import { Object3D, Vector3 } from 'three'

import { store } from '@/store/store'

export interface Marker3D {
  id: string
  object: Object3D
  offsetY: number
}

export function createMarkers (model: Group): Marker3D[] {
  const markers: Marker3D[] = []

  for (const [id, config] of Object.entries(store)) {
    const object = model.getObjectByName(config.objectName)
    if (!object) {
      console.warn(`Hotspot "${id}": oggetto "${config.objectName}" non trovato nel GLB`)
	  throw new Error(`Hotspot "${id}": oggetto "${config.objectName}" non trovato nel GLB`)
    }
    markers.push({
      id,
      object: object ?? new Object3D(),
      offsetY: config.offsetY,
    })
  }

  return markers
}

const _worldPos = new Vector3()

export function updateMarkerScreenPositions (
  markers: Marker3D[],
  camera: PerspectiveCamera,
  container: HTMLElement
) {
  const width = container.clientWidth
  const height = container.clientHeight
  // Dopo OrbitControls.update(), la camera ha position/quaternion nuovi ma matrixWorld può essere "stale":
  // `project()` usa quella matrice quindi senza questo update
  // i marker sarebbero un frame in ritardo.
  camera.updateMatrixWorld()

  for (const marker of markers) {
    const entry = store[marker.id as keyof typeof store]
    if (!entry) continue

    marker.object.getWorldPosition(_worldPos)
    _worldPos.y += marker.offsetY
    // Clip space: x,y in [-1,1], z profondità; z ≥ 1 -> dietro il far plane -> nascondi.
    _worldPos.project(camera)

    if (_worldPos.z >= 1) {
      entry.visible = false
      continue
    }

    entry.visible = true
    // NDC -> pixel: asse Y dello schermo web cresce verso il basso, quindi il segno su y.
    entry.x = (_worldPos.x * 0.5 + 0.5) * width
    entry.y = (-_worldPos.y * 0.5 + 0.5) * height
  }
}
