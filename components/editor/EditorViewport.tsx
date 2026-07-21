"use client";

import { useRef, useEffect, useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, TransformControls, Grid, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { PlacedObject, EditorMode, FurniturePart, RoomConfig } from "./types";

interface EditorViewportProps {
  placedObjects: PlacedObject[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onUpdateObject: (id: string, updates: Partial<PlacedObject>) => void;
  mode: EditorMode;
  wallColor: string;
  floorColor: string;
  room: RoomConfig;
}

function Room({ wallColor, floorColor, room }: { wallColor: string; floorColor: string; room: RoomConfig }) {
  const { width: w, depth: d, height: h } = room;

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial color={floorColor} roughness={0.8} />
      </mesh>
      {/* Ceiling */}
      {room.showCeiling && (
        <mesh position={[0, h, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[w, d]} />
          <meshStandardMaterial color="#f5f5f5" roughness={0.9} side={THREE.DoubleSide} />
        </mesh>
      )}
      {/* Back wall */}
      {room.showWallBack && (
        <mesh position={[0, h / 2, -d / 2]} receiveShadow>
          <planeGeometry args={[w, h]} />
          <meshStandardMaterial color={wallColor} roughness={0.9} side={THREE.DoubleSide} />
        </mesh>
      )}
      {/* Front wall */}
      {room.showWallFront && (
        <mesh position={[0, h / 2, d / 2]} rotation={[0, Math.PI, 0]} receiveShadow>
          <planeGeometry args={[w, h]} />
          <meshStandardMaterial color={wallColor} roughness={0.9} side={THREE.DoubleSide} />
        </mesh>
      )}
      {/* Left wall */}
      {room.showWallLeft && (
        <mesh position={[-w / 2, h / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[d, h]} />
          <meshStandardMaterial color={wallColor} roughness={0.9} side={THREE.DoubleSide} />
        </mesh>
      )}
      {/* Right wall */}
      {room.showWallRight && (
        <mesh position={[w / 2, h / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[d, h]} />
          <meshStandardMaterial color={wallColor} roughness={0.9} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

function PartMesh({ part }: { part: FurniturePart }) {
  return (
    <mesh position={part.position} castShadow>
      {part.shape === "box" && <boxGeometry args={part.size} />}
      {part.shape === "cylinder" && (
        <cylinderGeometry args={[part.size[0] / 2, part.size[0] / 2, part.size[1], 16]} />
      )}
      {part.shape === "sphere" && <sphereGeometry args={[part.size[0] / 2, 16, 16]} />}
      <meshStandardMaterial color={part.color} roughness={0.7} />
    </mesh>
  );
}

function GlbModel({ url, glbScale = 1, glbOffsetY = 0 }: { url: string; glbScale?: number; glbOffsetY?: number }) {
  const { scene } = useGLTF(url);
  const cloned = scene.clone(true);

  cloned.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return <primitive object={cloned} scale={glbScale} position={[0, glbOffsetY, 0]} />;
}

function FurnitureObject({
  obj,
  isSelected,
  onSelect,
}: {
  obj: PlacedObject;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const hasGlb = !!obj.furniture.glbUrl;

  return (
    <group
      position={obj.position}
      rotation={obj.rotation}
      scale={obj.scale}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {hasGlb ? (
        <Suspense fallback={
          obj.furniture.parts.map((part, i) => <PartMesh key={i} part={part} />)
        }>
          <GlbModel
            url={obj.furniture.glbUrl!}
            glbScale={obj.furniture.glbScale}
            glbOffsetY={obj.furniture.glbOffsetY}
          />
        </Suspense>
      ) : (
        obj.furniture.parts.map((part, i) => <PartMesh key={i} part={part} />)
      )}
      {isSelected && (
        <mesh>
          <boxGeometry args={obj.furniture.boundingSize} />
          <meshBasicMaterial color="#3b82f6" wireframe transparent opacity={0.3} />
        </mesh>
      )}
    </group>
  );
}

function SelectedTransform({
  placedObjects,
  selectedId,
  mode,
  onUpdateObject,
  orbitRef,
}: {
  placedObjects: PlacedObject[];
  selectedId: string | null;
  mode: EditorMode;
  onUpdateObject: (id: string, updates: Partial<PlacedObject>) => void;
  orbitRef: React.RefObject<any>;
}) {
  const transformRef = useRef<any>(null);
  const selectedObj = placedObjects.find((o) => o.id === selectedId);

  useEffect(() => {
    const controls = transformRef.current;
    if (!controls) return;

    const onDragging = (event: { value: boolean }) => {
      if (orbitRef.current) orbitRef.current.enabled = !event.value;
    };

    controls.addEventListener("dragging-changed", onDragging);
    return () => controls.removeEventListener("dragging-changed", onDragging);
  }, [orbitRef]);

  useEffect(() => {
    const controls = transformRef.current;
    if (!controls || !selectedId) return;

    const onObjectChange = () => {
      const obj = controls.object;
      if (!obj) return;
      onUpdateObject(selectedId, {
        position: [obj.position.x, obj.position.y, obj.position.z],
        rotation: [obj.rotation.x, obj.rotation.y, obj.rotation.z],
        scale: [obj.scale.x, obj.scale.y, obj.scale.z],
      });
    };

    controls.addEventListener("objectChange", onObjectChange);
    return () => controls.removeEventListener("objectChange", onObjectChange);
  }, [selectedId, onUpdateObject, orbitRef]);

  if (!selectedObj) return null;

  return (
    <TransformControls
      ref={transformRef}
      mode={mode}
      position={selectedObj.position}
      rotation={selectedObj.rotation}
      scale={selectedObj.scale}
    />
  );
}

function Scene(props: EditorViewportProps) {
  const orbitRef = useRef<any>(null);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow shadow-mapSize={[2048, 2048]} />
      <directionalLight position={[-3, 5, -3]} intensity={0.4} />
      <hemisphereLight args={["#b1e1ff", "#b97a20", 0.3]} />

      <Room wallColor={props.wallColor} floorColor={props.floorColor} room={props.room} />

      <Grid
        args={[20, 20]}
        position={[0, 0.001, 0]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#334155"
        sectionSize={2}
        sectionThickness={1}
        sectionColor="#475569"
        fadeDistance={15}
        fadeStrength={1}
        infiniteGrid={false}
      />

      {props.placedObjects.map((obj) => (
        <FurnitureObject
          key={obj.id}
          obj={obj}
          isSelected={props.selectedId === obj.id}
          onSelect={() => props.onSelect(obj.id)}
        />
      ))}

      <SelectedTransform
        placedObjects={props.placedObjects}
        selectedId={props.selectedId}
        mode={props.mode}
        onUpdateObject={props.onUpdateObject}
        orbitRef={orbitRef}
      />

      <OrbitControls
        ref={orbitRef}
        makeDefault
        target={[0, 1, 0]}
        maxPolarAngle={Math.PI / 2}
        minDistance={2}
        maxDistance={15}
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} onClick={() => props.onSelect(null)} visible={false}>
        <planeGeometry args={[50, 50]} />
        <meshBasicMaterial />
      </mesh>
    </>
  );
}

export default function EditorViewport(props: EditorViewportProps) {
  return (
    <Canvas
      shadows
      gl={{ preserveDrawingBuffer: true }}
      camera={{ position: [5, 4, 5], fov: 50 }}
      className="w-full h-full"
      onPointerMissed={() => props.onSelect(null)}
    >
      <Scene {...props} />
    </Canvas>
  );
}
