import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

/**
 * The Attention-to-Revenue field:
 * cold attention (steel-grey particles) spirals down through the system's
 * angular engine rings, gains intent (turns signal red) and exits as an
 * ordered stream of appointments.
 */

const COLD = new THREE.Color('#B9BDC7');
const WARM = new THREE.Color('#FF1F1F');
const FUNNEL_TOP_Y = 2.6;
const FUNNEL_BOTTOM_Y = -1.1;
const STREAM_END_Y = -2.9;
const TOP_R = 2.5;
const BOTTOM_R = 0.16;

function funnelRadius(t: number) {
  // ease-in narrowing, like audience qualification
  return TOP_R + (BOTTOM_R - TOP_R) * Math.pow(t, 0.72);
}

function Particles({ count }: { count: number }) {
  const geomRef = useRef<THREE.BufferGeometry>(null);

  const state = useMemo(() => {
    // per-particle: t (progress 0..1.35), theta, angular speed, radial jitter
    const t = new Float32Array(count);
    const theta = new Float32Array(count);
    const speed = new Float32Array(count);
    const jitter = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      t[i] = Math.random() * 1.35;
      theta[i] = Math.random() * Math.PI * 2;
      speed[i] = 0.5 + Math.random() * 0.9;
      jitter[i] = (Math.random() - 0.5) * 0.22;
    }
    return {
      t,
      theta,
      speed,
      jitter,
      positions: new Float32Array(count * 3),
      colors: new Float32Array(count * 3),
    };
  }, [count]);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const { t, theta, speed, jitter, positions, colors } = state;
    const c = new THREE.Color();

    for (let i = 0; i < count; i++) {
      t[i] += delta * 0.16 * speed[i];
      if (t[i] >= 1.35) {
        t[i] = 0;
        theta[i] = Math.random() * Math.PI * 2;
      }

      const p = t[i];
      let x: number;
      let y: number;
      let z: number;

      if (p < 1) {
        // vortex phase — swirl accelerates as the radius tightens
        const r = funnelRadius(p) + jitter[i] * (1 - p);
        theta[i] += delta * speed[i] * (0.55 + (1 - r / TOP_R) * 2.6);
        x = Math.cos(theta[i]) * r;
        z = Math.sin(theta[i]) * r;
        y = FUNNEL_TOP_Y + (FUNNEL_BOTTOM_Y - FUNNEL_TOP_Y) * p;
        c.copy(COLD).lerp(WARM, Math.pow(p, 1.6));
      } else {
        // ordered appointment stream below the neck
        const s = (p - 1) / 0.35;
        x = jitter[i] * 0.3;
        z = jitter[i] * 0.3;
        y = FUNNEL_BOTTOM_Y + (STREAM_END_Y - FUNNEL_BOTTOM_Y) * s;
        c.copy(WARM);
      }

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const geom = geomRef.current;
    if (geom) {
      geom.attributes.position.needsUpdate = true;
      geom.attributes.color.needsUpdate = true;
    }
  });

  return (
    <points>
      <bufferGeometry ref={geomRef}>
        <bufferAttribute attach="attributes-position" args={[state.positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[state.colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.042} vertexColors sizeAttenuation transparent opacity={0.9} depthWrite={false} />
    </points>
  );
}

/** Angular octagonal engine ring, echoing the logo's sharp geometry */
function EngineRing({
  y,
  radius,
  tilt,
  speed,
  red = false,
}: {
  y: number;
  radius: number;
  tilt: number;
  speed: number;
  red?: boolean;
}) {
  const ref = useRef<THREE.LineLoop>(null);

  const geometry = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const sides = 8;
    for (let i = 0; i < sides; i++) {
      const a = (i / sides) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [radius]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * speed;
  });

  return (
    <lineLoop ref={ref} geometry={geometry} position={[0, y, 0]} rotation={[tilt, 0, 0]}>
      <lineBasicMaterial color={red ? '#FF1F1F' : '#0B0B0D'} transparent opacity={red ? 0.9 : 0.55} />
    </lineLoop>
  );
}

function CameraRig() {
  const { camera, pointer } = useThree();
  useFrame(() => {
    camera.position.x += (pointer.x * 0.7 - camera.position.x) * 0.04;
    camera.position.y += (0.4 + pointer.y * 0.4 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function SignalField() {
  const reduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const count = isMobile ? 1400 : 2600;

  const webglOk = useMemo(() => {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
    } catch {
      return false;
    }
  }, []);

  if (!webglOk || reduced) {
    // graceful static fallback
    return (
      <div className="flex h-full items-center justify-center">
        <img src="/brand/avs-symbol-black.svg" alt="" className="w-40 opacity-20" />
      </div>
    );
  }

  return (
    <Canvas
      camera={{ position: [0, 0.4, 7.2], fov: 38 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
    >
      <CameraRig />
      <Particles count={count} />
      <EngineRing y={2.1} radius={2.28} tilt={0.09} speed={0.16} />
      <EngineRing y={1.1} radius={1.62} tilt={-0.07} speed={-0.22} />
      <EngineRing y={0.15} radius={1.05} tilt={0.05} speed={0.3} red />
      <EngineRing y={-0.7} radius={0.5} tilt={-0.04} speed={-0.4} />
    </Canvas>
  );
}
