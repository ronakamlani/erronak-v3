import { useEffect, useRef } from 'react';
import {
  AmbientLight,
  Color,
  DirectionalLight,
  IcosahedronGeometry,
  LineSegments,
  Mesh,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  WebGLRenderer,
  WireframeGeometry,
  sRGBEncoding,
} from 'three';
import { useInViewport, useWindowSize } from 'hooks';
import { useReducedMotion } from 'framer-motion';
import { Transition } from 'components/Transition';
import { cleanScene, cleanRenderer } from 'utils/three';
import styles from './NeuralNetworkOrb.module.css';

export const NeuralNetworkOrb = props => {
  const canvasRef = useRef();
  const renderer = useRef();
  const camera = useRef();
  const scene = useRef();
  const lights = useRef();
  const orb = useRef();
  const glow = useRef();
  const isInViewport = useInViewport(canvasRef);
  const windowSize = useWindowSize();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const { innerWidth, innerHeight } = window;

    renderer.current = new WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.current.setSize(innerWidth, innerHeight);
    renderer.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.current.outputEncoding = sRGBEncoding;

    camera.current = new PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 1000);
    camera.current.position.z = 40;

    scene.current = new Scene();
    scene.current.background = null;

    // Core glowing orb
    const coreGeometry = new SphereGeometry(10, 64, 64);
    const coreMaterial = new Color('#00e0ff');
    glow.current = new Mesh(coreGeometry);
    glow.current.material.color = coreMaterial;
    glow.current.material.transparent = true;
    glow.current.material.opacity = 0.15;

    // Wireframe neural structure
    const wireGeometry = new IcosahedronGeometry(12, 3);
    const wireframe = new WireframeGeometry(wireGeometry);
    orb.current = new LineSegments(wireframe);
    orb.current.material.color = new Color('#00ffff');
    orb.current.material.transparent = true;
    orb.current.material.opacity = 0.7;

    scene.current.add(glow.current);
    scene.current.add(orb.current);

    // Lights
    const dirLight = new DirectionalLight('#00ffff', 1);
    const ambient = new AmbientLight('#0099ff', 0.4);
    dirLight.position.set(30, 50, 100);
    lights.current = [dirLight, ambient];
    lights.current.forEach(l => scene.current.add(l));

    return () => {
      cleanScene(scene.current);
      cleanRenderer(renderer.current);
    };
  }, []);

  useEffect(() => {
    const { width, height } = windowSize;
    renderer.current.setSize(width, height);
    camera.current.aspect = width / height;
    camera.current.updateProjectionMatrix();

    // Position orb near top-right (like hero corner)
    if (orb.current) {
      const offsetX = width * 0.32; // horizontal offset
      const offsetY = height * 0.22; // vertical offset
      orb.current.position.set(offsetX / 30, offsetY / 30, 0);
      glow.current.position.copy(orb.current.position);
    }
  }, [windowSize]);

  useEffect(() => {
    let animation;
    const animate = time => {
      animation = requestAnimationFrame(animate);

      if (orb.current) {
        orb.current.rotation.x += 0.002;
        orb.current.rotation.y += 0.003;
      }

      if (glow.current) {
        glow.current.scale.setScalar(1 + Math.sin(time * 0.002) * 0.05);
      }

      renderer.current.render(scene.current, camera.current);
    };

    if (!reduceMotion && isInViewport) {
      animate();
    } else {
      renderer.current.render(scene.current, camera.current);
    }

    return () => cancelAnimationFrame(animation);
  }, [isInViewport, reduceMotion]);

  return (
    <Transition in timeout={2000}>
      {visible => (
        <canvas
          aria-hidden
          className={styles.canvas}
          data-visible={visible}
          ref={canvasRef}
          {...props}
        />
      )}
    </Transition>
  );
};
