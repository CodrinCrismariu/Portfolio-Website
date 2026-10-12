/* eslint react/no-unknown-property: off -- React Three Fiber elements use Three.js properties. */
import { Suspense, useLayoutEffect, useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { Environment, Html, OrbitControls } from '@react-three/drei';
import type { ProjectMedia } from '../../types/projects';
import ProjectStripMedia from './ProjectStripMedia';

const FittedCamera = ({
	position,
	target,
	fov,
}: {
	position: number[];
	target: number[];
	fov: number;
}) => {
	const { camera, size, invalidate } = useThree();
	useLayoutEffect(() => {
		const center = new Vector3().fromArray(target);
		const direction = new Vector3().fromArray(position).sub(center);
		const aspect = size.width / Math.max(size.height, 1);
		// Models are normalized to four units; retain the saved viewing angle while fitting narrow viewports.
		const minimumDistance = 2.2 / (Math.tan((fov * Math.PI) / 360) * Math.min(aspect, 1));
		const distance = Math.max(direction.length(), minimumDistance);
		if (direction.lengthSq() === 0) direction.set(0, 1.8, 6);
		camera.position.copy(center.add(direction.normalize().multiplyScalar(distance)));
		camera.lookAt(...(target as [number, number, number]));
		camera.updateProjectionMatrix();
		invalidate();
	}, [camera, size.width, size.height, position, target, fov, invalidate]);
	return null;
};

const ProjectModelViewer = ({ media, title }: { media: ProjectMedia; title: string }) => {
	const position = media.camera?.position ?? [0, 1.8, 6];
	const target = media.camera?.target ?? [0, 0, 0];
	const rotation = useMemo<[number, number, number]>(
		() =>
			media.rotation ??
			(media.rotationDeg?.map((degrees) => (degrees * Math.PI) / 180) as
				| [number, number, number]
				| undefined) ?? [0, 0, 0],
		[media.rotation, media.rotationDeg],
	);
	return (
		<>
			<Canvas
				dpr={[1, 1.5]}
				frameloop="demand"
				camera={{
					position: [...position],
					fov: media.camera?.fov ?? 45,
					near: media.camera?.near ?? 0.1,
					far: media.camera?.far ?? 100,
				}}
				gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
				style={{ width: '100%', height: '100%' }}
			>
				<FittedCamera position={position} target={target} fov={media.camera?.fov ?? 45} />
				<ambientLight intensity={0.6} color="#cbd5f5" />
				<directionalLight intensity={0.9} position={[6, 12, 10]} color="#cbd5f5" />
				<Suspense
					fallback={
						<Html center>
							<span className="model-notice model-notice--inline" role="status">
								Loading {title}…
							</span>
						</Html>
					}
				>
					<group position={media.offset ?? [0, 0, 0]} rotation={rotation}>
						<ProjectStripMedia media={media} />
					</group>
					<Environment preset="city" />
				</Suspense>
				<OrbitControls
					target={target}
					enableDamping={false}
					minPolarAngle={Math.PI / 6}
					maxPolarAngle={(Math.PI * 5) / 6}
					minDistance={1}
					maxDistance={40}
					makeDefault
				/>
			</Canvas>
			<span className="model-hint">Drag to rotate · Scroll to zoom</span>
		</>
	);
};
export default ProjectModelViewer;
