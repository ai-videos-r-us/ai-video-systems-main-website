import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const COLD_COUNT = 260;
const SIGNAL_COUNT = 90;

// A wide, scattered "cold attention" cloud that continuously funnels inward
// toward a narrow "warm audience / qualified appointment" point — the visual
// metaphor for turning broad reach into converted, trackable demand.
function ColdCloud() {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(COLD_COUNT * 3);
    for (let i = 0; i < COLD_COUNT; i++) {
      const radius = 2.4 + Math.random() * 1.4;
      const angle = Math.random() * Math.PI * 2;
      const depth = (Math.random() - 0.5) * 3.2;
      arr[i * 3] = Math.cos(angle) * radius;
      arr[i * 3 + 1] = Math.sin(angle) * radius * 0.6 + depth * 0.2;
      arr[i * 3 + 2] = depth;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.06;
    ref.current.rotation.z = Math.sin(t * 0.08) * 0.05;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.045} color="#0B0B0D" transparent opacity={0.35} sizeAttenuation />
    </points>
  );
}

function SignalFunnel() {
  const ref = useRef<THREE.Points>(null);

  const { start, end } = useMemo(() => {
    const s = new Float32Array(SIGNAL_COUNT * 3);
    const e = new Float32Array(SIGNAL_COUNT * 3);
    for (let i = 0; i < SIGNAL_COUNT; i++) {
      const progress = i / SIGNAL_COUNT;
      const radius = 2.1 * (1 - progress * 0.4);
      const angle = Math.random() * Math.PI * 2;
      s[i * 3] = Math.cos(angle) * radius;
      s[i * 3 + 1] = Math.sin(angle) * radius * 0.55 + (Math.random() - 0.5) * 0.6;
      s[i * 3 + 2] = (Math.random() - 0.5) * 2.4;

      const funnelRadius = 0.06 + progress * 0.05;
      const funnelAngle = angle + progress * 2.4;
      e[i * 3] = Math.cos(funnelAngle) * funnelRadius;
      e[i * 3 + 1] = 1.1 - progress * 2.2;
      e[i * 3 + 2] = Math.sin(funnelAngle) * funnelRadius;
    }
    return { start: s, end: e };
  }, []);

  const positions = useMemo(() => start.slice(), [start]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const geom = ref.current.geometry as THREE.BufferGeometry;
    const attr = geom.getAttribute('position') as THREE.BufferAttribute;
    const t = (Math.sin(clock.getElapsedTime() * 0.35) + 1) / 2;
    for (let i = 0; i < SIGNAL_COUNT * 3; i++) {
      attr.array[i] = start[i] + (end[i] - start[i]) * t;
    }
    attr.needsUpdate = true;
    ref.current.rotation.y = clock.getElapsedTime() * 0.12;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.07} color="#FF1F1F" transparent opacity={0.85} sizeAttenuation />
    </points>
  );
}

export default function SignalField() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 42 }}
      gl={{ alpha: true, antialias: true }}
      style={{ background: 'transparent' }}
    >
      <ColdCloud />
      <SignalFunnel />
    </Canvas>
  );
}
