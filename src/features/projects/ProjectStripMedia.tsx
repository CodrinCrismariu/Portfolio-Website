import { useCallback, useEffect, useRef } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { Mesh, MeshStandardMaterial, Color, Box3, Vector3 } from 'three';
import type { ProjectMedia } from '../../types/projects';

const FALLBACK_COLOR = new Color('#38bdf8');
const DRACO_DECODER_BASE_URL = '/draco/';
const TARGET_MODEL_SIZE = 4;
const UP_AXIS = 'y';

const isResource = (resource: string, extension: string) => resource.toLowerCase().endsWith(extension);

const configureCrossOrigin = (loader: { setCrossOrigin?: (value: string) => void }) => {
  if ('setCrossOrigin' in loader && typeof loader.setCrossOrigin === 'function') {
    loader.setCrossOrigin('anonymous');
  }
};

let sharedDracoLoader: DRACOLoader | null = null;

const getDracoLoader = () => {
  if (!sharedDracoLoader) {
    sharedDracoLoader = new DRACOLoader();
    sharedDracoLoader.setDecoderConfig({ type: 'wasm' });
    sharedDracoLoader.setDecoderPath(DRACO_DECODER_BASE_URL);
    sharedDracoLoader.setCrossOrigin('anonymous');
    sharedDracoLoader.preload();
  }
  return sharedDracoLoader;
};

type ProjectStripMediaProps = {
  media: ProjectMedia;
  onLoaded?: () => void;
};

const ProjectStripMedia = ({ media, onLoaded }: ProjectStripMediaProps) => {
  const notifiedRef = useRef(false);
  const notifyReady = useCallback(() => {
    if (notifiedRef.current) return;
    notifiedRef.current = true;
    onLoaded?.();
  }, [onLoaded]);

  if (media.type === 'gltf' || media.type === 'glb') {
    const gltf = useLoader(
      GLTFLoader,
      media.src,
      (loader) => {
        configureCrossOrigin(loader);
        loader.setDRACOLoader(getDracoLoader());
        if (media.src.includes('/')) {
          const base = media.src.split('/').slice(0, -1).join('/') + '/';
          loader.setResourcePath(base);
        }
      }
    );

    useEffect(() => {
      if (!gltf.scene.userData.__normalized) {
        gltf.scene.updateMatrixWorld(true);

        const box = new Box3().setFromObject(gltf.scene);
        const size = box.getSize(new Vector3());
        const maxAxis = Math.max(size.x, size.y, size.z);
        if (maxAxis > 0) {
          const scale = TARGET_MODEL_SIZE / maxAxis;
          gltf.scene.scale.multiplyScalar(scale);
        }

        if (UP_AXIS === 'y') {
          gltf.scene.rotation.x = -Math.PI / 2;
        }

        gltf.scene.updateMatrixWorld(true);
        box.setFromObject(gltf.scene);
        const center = box.getCenter(new Vector3());
        gltf.scene.position.sub(center);
        gltf.scene.userData.__normalized = true;
      }

      gltf.scene.traverse((child) => {
        if ('castShadow' in child && 'receiveShadow' in child) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      notifyReady();
    }, [gltf.scene, notifyReady]);

    return <primitive object={gltf.scene} />;
  }

  if (media.type === 'obj') {
  let materials: MTLLoader.MaterialCreator | undefined;

    if (media.resources?.some((resource) => isResource(resource, '.mtl'))) {
      const materialPath = media.resources.find((resource) => isResource(resource, '.mtl'))!;
      materials = useLoader(MTLLoader, materialPath, (loader) => {
        configureCrossOrigin(loader);
      });
      materials?.preload();
    }

    const object = useLoader(
      OBJLoader,
      media.src,
      (loader) => {
        configureCrossOrigin(loader);
        if (materials) loader.setMaterials(materials);
      }
    );

    useEffect(() => {
      if (!object.userData.__normalized) {
        object.updateMatrixWorld(true);

        const box = new Box3().setFromObject(object);
        const size = box.getSize(new Vector3());
        const maxAxis = Math.max(size.x, size.y, size.z);
        if (maxAxis > 0) {
          const scale = TARGET_MODEL_SIZE / maxAxis;
          object.scale.multiplyScalar(scale);
        }

        if (UP_AXIS === 'y') {
          object.rotation.x = -Math.PI / 2;
        }

        object.updateMatrixWorld(true);
        box.setFromObject(object);
        const center = box.getCenter(new Vector3());
        object.position.sub(center);
        object.userData.__normalized = true;
      }

      object.traverse((child) => {
        if ('isMesh' in child && child.isMesh) {
          const mesh = child as Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          if (!mesh.material) {
            mesh.material = new MeshStandardMaterial({ color: FALLBACK_COLOR });
          }
        }
      });
      notifyReady();
    }, [object, notifyReady]);

    return <primitive object={object} />;
  }

  useEffect(() => {
    notifyReady();
  }, [notifyReady]);

  return (
    <mesh>
      <boxGeometry args={[1.6, 0.9, 0.1]} />
      <meshStandardMaterial color={FALLBACK_COLOR} />
    </mesh>
  );
};

export default ProjectStripMedia;
