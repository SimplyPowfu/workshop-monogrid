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
    label: 'Absolut Vodka',
    x: 0,
    y: 0,
    visible: false,
    description: `cuore della bottiglia. Quella resina interna ha una rifrazione della luce pazzesca, che amplifica la purezza algida della bottiglia.
      Sembra davvero che il distillato, nella sua forma più limpida e glaciale, sia ancora lì, sospeso nel tempo, con una brillantezza che il liquido reale non potrebbe mai eguagliare.
      Cattura i riflessi della stanza e li rimanda fuori con una tonalità cristallina e pura, quasi algida.
      E il paralume... è la chiusura perfetta. Non è un accessorio comprato all'ingrosso.
      Si vede che c’è una ricerca tessile dietro. Proietta un fascio — un Beam, appunto — che taglia l'oscurità in modo direzionale,
      creando quell'atmosfera da club esclusivo, algido ma avvolgente.`,
  },
  rightBottle: {
    objectName: 'BottleRight',
    objectScene: null,
    offsetY: 0.5,
    label: 'Jägermeister',
    x: 0,
    y: 0,
    visible: false,
    description: `cuore della bottiglia. Quella resina interna ha una profondità pazzesca.
      Sembra che la complessa miscela del distillato, con la sua ricca tonalità ambrata e bruna, sia ancora lì, sospesa nel tempo, ma con una brillantezza che ne esalta ogni sfumatura.
      Cattura i riflessi della stanza e li rimanda fuori con una tonalità profonda, ambrata e misteriosa, quasi erbacea alla vista.
      E il paralume... è la chiusura perfetta. Non è un accessorio comprato all'ingrosso.
      Si vede che c’è una ricerca tessile dietro. Proietta un fascio — un Beam, appunto — che taglia l'oscurità in modo direzionale,
      creando quell'atmosfera da club esclusivo e misterioso, avvolgente come una melodia complessa.`,
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