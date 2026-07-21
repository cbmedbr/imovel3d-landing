"use client";

import { useRef, useEffect, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, TransformControls, Grid, Environment } from "@react-three/drei";
import * as THREE from "three";
import { PlacedObject, EditorMode } from "./types";

interface EditorViewportProps {
  placedObjects: PlacedObject[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onUpdateObject: (id: string, updates: Partial<PlacedObject>) => void;
  mode: EditorMode;
  wallColor: string;
  floorColor: string;
}

function Room({ wallColor, floorColor }: { wallColor: string; floorColor: string }) {
  const roomWidth = 8;
  const roomDepth = 6;
  const roomHeight = 3;

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[roomWidth, roomDepth]} />
        <meshStandardMaterial color={floorColor} roughness={0.8} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, roomHeight / 2, -roomDepth / 2]} receiveShadow>
        <planeGeometry args={[roomWidth, roomHeight]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-roomWidth / 2, roomHeight / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[roomDepth, roomHeight]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>

      {/* Right wall */}
      <mesh position={[roomWidth / 2, roomHeight / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[roomDepth, roomHeight]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
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
  const meshRef = useRef<THREE.Mesh>(null);
  const { furniture } = obj;

  return (
    <mesh
      ref={meshRef}
      position={obj.position}
      rotation={obj.rotation}
      scale={obj.scale}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      castShadow
    >
      {furniture.shape === "box" && (
        <boxGeometry args={furniture.size} />
      )}
      {furniture.shape === "cylinder" && (
        <cylinderGeometry args={[furniture.size[0] / 2, furniture.size[0] / 2, furniture.size[1], 16]} />
      )}
      {furniture.shape === "sphere" && (
        <sphereGeometry args={[furniture.size[0] / 2, 16, 16]} />
      )}
      <meshStandardMaterial
        color={furniture.color}
        roughness={0.7}
        emissive={isSelected ? "#1a4a8a" : "#000000"}
        emissiveIntensity={isSelected ? 0.3 : 0}
      />
      {isSelected && (
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(...furniture.size)]} />
          <lineBasicMaterial color="#3b82f6" linewidth={2} />
        </lineSegments>
      )}
    </mesh>
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
      if (orbitRef.current) {
        orbitRef.current.enabled = !event.value;
      }
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

function Scene({
  placedObjects,
  selectedId,
  onSelect,
  onUpdateObject,
  mode,
  wallColor,
  floorColor,
}: EditorViewportProps) {
  const orbitRef = useRef<any>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedId) {
          onSelect(null);
        }
      }
    },
    [selectedId, onSelect]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-3, 5, -3]} intensity={0.3} />

      {/* Room */}
      <Room wallColor={wallColor} floorColor={floorColor} />

      {/* Grid */}
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

      {/* Placed furniture */}
      {placedObjects.map((obj) => (
        <FurnitureObject
          key={obj.id}
          obj={obj}
          isSelected={selectedId === obj.id}
          onSelect={() => onSelect(obj.id)}
        />
      ))}

      {/* Transform controls for selected object */}
      <SelectedTransform
        placedObjects={placedObjects}
        selectedId={selectedId}
        mode={mode}
        onUpdateObject={onUpdateObject}
        orbitRef={orbitRef}
      />

      {/* Camera controls */}
      <OrbitControls
        ref={orbitRef}
        makeDefault
        target={[0, 1, 0]}
        maxPolarAngle={Math.PI / 2}
        minDistance={2}
        maxDistance={15}
      />

      {/* Click on empty space to deselect */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        onClick={() => onSelect(null)}
        visible={false}
      >
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
      camera={{ position: [5, 4, 5], fov: 50 }}
      className="w-full h-full"
      onPointerMissed={() => props.onSelect(null)}
    >
      <Scene {...props} />
    </Canvas>
  );
}
