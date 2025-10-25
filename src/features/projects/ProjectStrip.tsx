import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import type { RootState } from '@react-three/fiber';
import { Center, Environment, Html, OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import Markdown from 'react-markdown';
import type { Project } from '../../types/projects';
import ProjectMedia from './ProjectStripMedia';
import ProjectMetadata from './ProjectStripMetadata';

const LIGHT_COLOR = '#cbd5f5';

const DEFAULT_MODEL_OFFSET: [number, number, number] = [0, 0, 0];
const DEFAULT_MODEL_ROTATION: [number, number, number] = [0, 0, 0];
const DEFAULT_CAMERA = {
  position: [0, 1.8, 6] as [number, number, number],
  target: [0, 0, 0] as [number, number, number],
  fov: 45,
  near: 0.1,
  far: 100
};

const ENABLE_SNAPSHOT_DOWNLOAD = false;

const ProjectPreview = ({
  poster,
  title
}: {
  poster?: string | null;
  title: string;
}) => {
  if (poster) {
    return (
      <img
        src={poster}
        alt=""
        loading="lazy"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          border: 'none',
          boxShadow: 'none'
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(30, 64, 175, 0.85))',
        color: '#e2e8f0',
        fontSize: '1.1rem',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        border: 'none',
        boxShadow: 'none'
      }}
    >
      {title}
    </div>
  );
};

const CanvasPreviewFallback = ({
  poster,
  title
}: {
  poster?: string | null;
  title: string;
}) => (
  <Html
    center
    transform={false}
    prepend
    style={{ width: '100%', height: '100%', display: 'block' }}
    pointerEvents="none"
  >
    <div style={{ width: '100%', height: '100%' }}>
      <ProjectPreview poster={poster} title={title} />
    </div>
  </Html>
);

const ProjectStrip = ({ project, index }: { project: Project; index: number }) => {
  const isEven = index % 2 === 0;
  const lightingPosition = useMemo(() => (isEven ? [6, 12, 10] : [-6, 12, 10]), [isEven]);
  const { offset, rotation, rotationDeg, camera } = project.media;
  const [showModel, setShowModel] = useState(false);
  const snapshotStateRef = useRef<RootState | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [snapshotReady, setSnapshotReady] = useState(false);

  const modelOffset: [number, number, number] = offset ?? DEFAULT_MODEL_OFFSET;
  const modelRotation: [number, number, number] = rotation
    ? rotation
    : rotationDeg
    ? ((rotationDeg as [number, number, number]).map((degrees) => (degrees * Math.PI) / 180) as [
        number,
        number,
        number
      ])
    : DEFAULT_MODEL_ROTATION;

  const cameraPosition = camera?.position ?? DEFAULT_CAMERA.position;
  const cameraTarget = camera?.target ?? DEFAULT_CAMERA.target;
  const cameraFov = camera?.fov ?? DEFAULT_CAMERA.fov;
  const cameraNear = camera?.near ?? DEFAULT_CAMERA.near;
  const cameraFar = camera?.far ?? DEFAULT_CAMERA.far;

  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  const resolvedCameraPosition = useMemo(() => {
    return [...cameraPosition] as [number, number, number];
  }, [cameraPosition]);

  const applyCameraState = useCallback(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const snapshotState = snapshotStateRef.current;
    if (snapshotState) {
      snapshotState.camera.position.set(...cameraPosition);
      snapshotState.camera.updateProjectionMatrix();
    }

    controls.target.set(...cameraTarget);
    controls.object.position.set(...cameraPosition);
    controls.object.updateMatrixWorld();
    controls.object.lookAt(...cameraTarget);
    controls.update();

    if (snapshotState) {
      snapshotState.invalidate();
    }
  }, [cameraPosition, cameraTarget]);

  useEffect(() => {
    applyCameraState();
  }, [applyCameraState]);

  const renderPreview = useCallback(
    (key: string) => <ProjectPreview key={key} poster={project.media.poster ?? null} title={project.title} />,
    [project.media.poster, project.title]
  );

  const handleLoadModel = useCallback(() => {
    if (!showModel) {
      snapshotStateRef.current = null;
      canvasRef.current = null;
      setSnapshotReady(false);
      setShowModel(true);
    }
  }, [showModel]);

  const snapshotFileName = useMemo(() => {
    const slugSource = (project.id || project.title || 'model').toLowerCase();
    const safe = slugSource.replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '') || 'model';
    return `${safe}-snapshot.png`;
  }, [project.id, project.title]);

  const handleDownloadSnapshot = useCallback(() => {
    if (!ENABLE_SNAPSHOT_DOWNLOAD) return;
    const snapshotState = snapshotStateRef.current;
    const canvas = canvasRef.current;
    if (!snapshotState || !canvas) return;

    snapshotState.gl.render(snapshotState.scene, snapshotState.camera);

    const triggerDownload = (url: string) => {
      const link = document.createElement('a');
      link.href = url;
      link.download = snapshotFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    if (typeof canvas.toBlob === 'function') {
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        triggerDownload(url);
        URL.revokeObjectURL(url);
      }, 'image/png');
      return;
    }

    triggerDownload(canvas.toDataURL('image/png'));
  }, [snapshotFileName]);

  return (
    <article className={`project-strip ${isEven ? 'project-strip--even' : ''}`}>
      <div
        className="project-strip__media"
        aria-hidden={project.media.type === 'image'}
        style={{ width: '100%', height: '100%', position: 'relative', border: 'none', boxShadow: 'none' }}
      >
        {project.media.type === 'image' ? (
          <img
            src={project.media.src}
            alt=""
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              border: 'none',
              boxShadow: 'none'
            }}
          />
        ) : !showModel ? (
          <>
            {renderPreview(showModel ? 'loading' : 'preview')}
            <div
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem'
              }}
            >
              <button
                type="button"
                onClick={handleLoadModel}
                disabled={showModel}
                style={{
                  border: '1px solid rgba(148, 163, 184, 0.35)',
                  background: 'rgba(15, 23, 42, 0.82)',
                  color: '#e2e8f0',
                  padding: '0.5rem 1rem',
                  fontSize: '0.85rem',
                  lineHeight: 1.2,
                  borderRadius: '999px',
                  cursor: showModel ? 'wait' : 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em'
                }}
              >
                {showModel ? 'Preparing…' : 'Load 3D View'}
              </button>
            </div>
          </>
        ) : (
          <Canvas
            shadows
            dpr={[1, 1.5]}
            frameloop="demand"
            camera={{
              position: resolvedCameraPosition,
              fov: cameraFov,
              near: cameraNear,
              far: cameraFar
            }}
            gl={{
              alpha: true,
              antialias: true,
              powerPreference: 'high-performance'
            }}
            onCreated={(state) => {
              snapshotStateRef.current = state;
              canvasRef.current = state.gl.domElement;
              state.invalidate();
              applyCameraState();
              setSnapshotReady(true);
            }}
            style={{ width: '100%', height: '100%', display: 'block', border: 'none', boxShadow: 'none' }}
          >
            <ambientLight intensity={0.6} color={LIGHT_COLOR} />
            <directionalLight
              color={LIGHT_COLOR}
              intensity={0.9}
              castShadow
              position={lightingPosition as [number, number, number]}
              shadow-mapSize={[1024, 1024]}
            />
            <Suspense
              fallback={
                <CanvasPreviewFallback
                  poster={project.media.poster ?? null}
                  title={project.title}
                />
              }
            >
              <group position={modelOffset} rotation={modelRotation}>
                <Center disableZ={false} disableY={false} disableX={false}>
                  <ProjectMedia media={project.media} />
                </Center>
              </group>
              <Environment preset="city" />
            </Suspense>
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              enableDamping={false}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={(Math.PI / 6) * 5}
              minDistance={1}
              maxDistance={40}
              ref={(instance) => {
                controlsRef.current = instance;
                applyCameraState();
              }}
            />
          </Canvas>
        )}

        {ENABLE_SNAPSHOT_DOWNLOAD && showModel ? (
          <div
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              display: 'flex',
              gap: '0.5rem',
              zIndex: 2,
              pointerEvents: 'auto'
            }}
          >
            <button
              type="button"
              onClick={handleDownloadSnapshot}
              disabled={!snapshotReady}
              style={{
                border: '1px solid rgba(148, 163, 184, 0.35)',
                background: 'rgba(15, 23, 42, 0.82)',
                color: '#e2e8f0',
                padding: '0.5rem 1rem',
                fontSize: '0.85rem',
                lineHeight: 1.2,
                borderRadius: '999px',
                cursor: snapshotReady ? 'pointer' : 'not-allowed',
                textTransform: 'uppercase',
                letterSpacing: '0.08em'
              }}
            >
              Download PNG
            </button>
          </div>
        ) : null}
      </div>
      <div className="project-strip__body">
        <ProjectMetadata project={project} />
        <Markdown className="project-strip__description">{project.description}</Markdown>
      </div>
    </article>
  );
};

export default ProjectStrip;
