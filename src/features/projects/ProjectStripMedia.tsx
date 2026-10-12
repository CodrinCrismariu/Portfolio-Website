/* eslint react/no-unknown-property: off -- React Three Fiber elements use Three.js properties. */
import { useEffect, useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { Mesh, MeshStandardMaterial, Box3, Vector3, type Object3D } from 'three';
import type { ProjectMedia } from '../../types/projects';

type Props = { media: ProjectMedia; onLoaded?: () => void };
let sharedDracoLoader: DRACOLoader | null = null;
const getDracoLoader = () => {
	if (!sharedDracoLoader) {
		sharedDracoLoader = new DRACOLoader();
		sharedDracoLoader.setDecoderConfig({ type: 'wasm' });
		sharedDracoLoader.setDecoderPath(
			new URL(`${import.meta.env.BASE_URL}draco/`, window.location.origin).href,
		);
		sharedDracoLoader.setCrossOrigin('anonymous');
	}
	return sharedDracoLoader;
};
// Normalize before mounting so the camera sees the final bounds on its first frame.
const normalizeModel = (source: Object3D) => {
	const object = source.clone(true);
	object.updateMatrixWorld(true);
	const box = new Box3().setFromObject(object);
	const size = box.getSize(new Vector3());
	const maxAxis = Math.max(size.x, size.y, size.z);
	if (maxAxis > 0) object.scale.multiplyScalar(4 / maxAxis);
	object.rotation.x = -Math.PI / 2;
	object.updateMatrixWorld(true);
	box.setFromObject(object);
	object.position.sub(box.getCenter(new Vector3()));
	object.updateMatrixWorld(true);
	object.traverse((child) => {
		if (child instanceof Mesh) {
			child.castShadow = true;
			child.receiveShadow = true;
			if (!child.material) child.material = new MeshStandardMaterial({ color: '#c6f276' });
		}
	});
	return object;
};
const GltfMedia = ({ media, onLoaded }: Props) => {
	const gltf = useLoader(GLTFLoader, media.src, (loader) => {
		loader.setCrossOrigin('anonymous');
		loader.setDRACOLoader(getDracoLoader());
		const url = new URL(media.src, window.location.origin);
		loader.setResourcePath(url.href.replace(/[^/]+$/, ''));
	});
	const object = useMemo(() => normalizeModel(gltf.scene), [gltf.scene]);
	useEffect(() => {
		onLoaded?.();
	}, [object, onLoaded]);
	return <primitive object={object} />;
};
const ObjMedia = ({
	media,
	onLoaded,
	materials,
}: Props & { materials?: MTLLoader.MaterialCreator }) => {
	const source = useLoader(OBJLoader, media.src, (loader) => {
		loader.setCrossOrigin('anonymous');
		if (materials) loader.setMaterials(materials);
	});
	const object = useMemo(() => normalizeModel(source), [source]);
	useEffect(() => {
		onLoaded?.();
	}, [object, onLoaded]);
	return <primitive object={object} />;
};
const ObjWithMaterials = ({ materialPath, ...props }: Props & { materialPath: string }) => {
	const materials = useLoader(MTLLoader, materialPath, (loader) =>
		loader.setCrossOrigin('anonymous'),
	);
	useMemo(() => materials.preload(), [materials]);
	return <ObjMedia {...props} materials={materials} />;
};
const ProjectStripMedia = (props: Props) => {
	if (props.media.type === 'gltf' || props.media.type === 'glb') return <GltfMedia {...props} />;
	if (props.media.type === 'obj') {
		const materialPath = props.media.resources?.find((resource) =>
			resource.toLowerCase().endsWith('.mtl'),
		);
		return materialPath ? (
			<ObjWithMaterials {...props} materialPath={materialPath} />
		) : (
			<ObjMedia {...props} />
		);
	}
	return null;
};
export default ProjectStripMedia;
