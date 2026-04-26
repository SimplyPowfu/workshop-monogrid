import { MeshStandardMaterial, Object3D } from 'three'
import gsap from 'gsap'
import { reactive } from 'vue'

export type Hotspot = {
  objectName: string
  objectScene: Object3D | null
  offsetY: number
  x: number
  y: number
  visible: boolean
  label: string
  description: string
}

export const store = reactive<Record<string, Hotspot>>({
  bottle: {
    objectName: 'Bottle',
    objectScene: null,
    offsetY: 0.5,
    x: 0,
    y: 0,
    visible: false,
    label: 'Jack Daniel\'s',
    description: `cuore della bottiglia. Quella resina interna ha una rifrazione della luce pazzesca.
	Sembra davvero che il distillato sia ancora lì, sospeso nel tempo, ma con una brillantezza che il liquido reale non avrebbe mai.
	Cattura i riflessi della stanza e li rimanda fuori con una tonalità calda, quasi ambrata.
	E il paralume... è la chiusura perfetta. Non è un accessorio comprato all'ingrosso.
	Si vede che c’è una ricerca tessile dietro. Proietta un fascio — un Beam, appunto — che taglia l'oscurità in modo direzionale,
	creando quell'atmosfera da club esclusivo o da ufficio di un produttore discografico.`,
  },
  leftBottle: {
    objectName: 'BottleLeft',
    objectScene: null,
    offsetY: 0.5,
    label: 'BottleLeft',
    x: 0,
    y: 0,
    visible: false,
    description: `(STESSA COSA MA PER UN'ALTRO TIPO DI BOTTIGLIA) cuore della bottiglia. Quella resina interna ha una rifrazione della luce pazzesca.
	Sembra davvero che il distillato sia ancora lì, sospeso nel tempo, ma con una brillantezza che il liquido reale non avrebbe mai.
	Cattura i riflessi della stanza e li rimanda fuori con una tonalità calda, quasi ambrata.
	E il paralume... è la chiusura perfetta. Non è un accessorio comprato all'ingrosso.
	Si vede che c’è una ricerca tessile dietro. Proietta un fascio — un Beam, appunto — che taglia l'oscurità in modo direzionale,
	creando quell'atmosfera da club esclusivo o da ufficio di un produttore discografico.`,
  },
  rightBottle: {
    objectName: 'BottleRight',
    objectScene: null,
    offsetY: 0.5,
    label: 'BottleRight',
    x: 0,
    y: 0,
    visible: false,
    description: `(STESSA COSA MA PER UN'ALTRO TIPO DI BOTTIGLIA (MAGARI CON UN LIQUIDO VERO RENDERIZZATO O ANIMATO)) cuore della bottiglia. Quella resina interna ha una rifrazione della luce pazzesca.
	Sembra davvero che il distillato sia ancora lì, sospeso nel tempo, ma con una brillantezza che il liquido reale non avrebbe mai.
	Cattura i riflessi della stanza e li rimanda fuori con una tonalità calda, quasi ambrata.
	E il paralume... è la chiusura perfetta. Non è un accessorio comprato all'ingrosso.
	Si vede che c’è una ricerca tessile dietro. Proietta un fascio — un Beam, appunto — che taglia l'oscurità in modo direzionale,
	creando quell'atmosfera da club esclusivo o da ufficio di un produttore discografico.`,
  },
})

export function animateMaterials(
  materials: MeshStandardMaterial[], 
  intensity: number, 
  duration: number = 0.5
) {
  if (materials.length === 0) return

  materials.forEach(mat => {
    if (intensity > 0) {
      mat.emissive.set(0xFFB856)
    }

    gsap.to(mat, {
      emissiveIntensity: intensity,
      duration: duration,
      ease: 'power2.out',
      overwrite: true
    })
  })
}