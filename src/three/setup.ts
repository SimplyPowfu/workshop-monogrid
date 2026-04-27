import {
  NeutralToneMapping,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three'

export interface EngineContext {
	scene: Scene
	camera: PerspectiveCamera
	renderer: WebGLRenderer
	onResize: () => void
}

export async function createEngine(container: HTMLElement): Promise<EngineContext> {
  const scene = new Scene()
  const aspect = container.clientWidth / container.clientHeight
  const camera = new PerspectiveCamera(55, aspect, 0.1, 1000)

  const renderer = new WebGLRenderer({antialias: true, canvas: container})
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = 1.0

  function onResize () {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
  return { scene, camera, renderer, onResize }
}