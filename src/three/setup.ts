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

  const renderer = new WebGLRenderer({antialias: true})
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = 1.0

  container.appendChild(renderer.domElement)

  function onResize () {
    const width = container.clientWidth
    const height = container.clientHeight
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
  }

  window.addEventListener('resize', onResize)
  return { scene, camera, renderer, onResize }
}