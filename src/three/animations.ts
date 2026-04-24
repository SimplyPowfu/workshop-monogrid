
import { Object3D } from 'three'


export function createAnimation(model: Object3D) {
	const bottle = model.getObjectByName('Bottle');

  if (!bottle) {
    console.warn('Nodi mancanti nel modello bottle')
    throw new Error("Nodi mancanti nel modello bottle")
  }

  return bottle
}

const BOTTLE_ROTATION = 0.1

export function updateAnimation (bottle: Object3D, delta: number) {
  bottle.rotation.y += BOTTLE_ROTATION * delta
}