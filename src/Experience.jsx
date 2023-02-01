import React, { useMemo } from "react";
import vertexShader from "./shaders/vertexShader";
import fragmentShader from "./shaders/fragmentShader";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
const Experience = () => {
  const { size } = useThree();

  const count = 32;
  const dataTexture = useMemo(() => {
    const width = count;
    const height = count;
    const size = width * height;
    const data = new Uint8Array(size * 4);

    for (let i = 0; i < size; i++) {
      const col = Math.random() * 255;
      const stride = i * 4;
      data[stride] = col;
      data[stride + 1] = col;
      data[stride + 2] = col;
      data[stride + 3] = 255;
    }

    return new THREE.DataTexture(data, width, height, 1023, THREE.FloatType);
  }, []);

  dataTexture.magFilter = dataTexture.minFilter = THREE.NearestFilter;
  dataTexture.type = THREE.UnsignedByteType;
  dataTexture.needsUpdate = true;
  const t = new THREE.TextureLoader().load("./bw.jpeg");

  const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      time: { value: 0 },
      t: { value: t },
      resolution: { value: { x: 0, y: 0, z: 0, w: 0 } },
      dataTexture: { value: dataTexture },
      mouse: { value: { x: 0, y: 0 } },
    },
  });

  useFrame(({ clock, size, pointer }) => {
    shaderMaterial.uniforms.time.value = clock.elapsedTime;
    shaderMaterial.uniforms.mouse.value = {
      x: pointer.x * 0.5 + 0.5,
      y: pointer.y * 0.5 + 0.5,
    };

    // resolution

    let a1, a2;

    if (size.height / size.width > 1) {
      a1 = size.width / size.height;
      a2 = 1;
    } else {
      a1 = 1;
      a2 = size.height / size.width;
    }
    shaderMaterial.uniforms.resolution.value.x = size.width;
    shaderMaterial.uniforms.resolution.value.y = size.height;
    shaderMaterial.uniforms.resolution.value.z = a1;
    shaderMaterial.uniforms.resolution.value.w = a2;

    // update data texture
    const data = dataTexture.image.data;

    for (let i = 0; i < data.length; i += 4) {
      // data[i] *= 0.9555;
      // data[i + 1] *= 0.955;
    }

    let gridMouseX = count * (pointer.x * 0.5 + 0.5);
    let gridMouseY = count * (pointer.y * 0.5 + 0.5);
    let maxDist = 4;
    for (let i = 0; i < count; i++) {
      for (let j = 0; j < count; j++) {
        let distance = (gridMouseX - i) ** 2 + (gridMouseY - j) ** 2;
        let maxDistSq = maxDist ** 2;

        if (distance < maxDistSq) {
          let index = (i + count * j) * 4;
          data[index] = 0;
          data[index + 1] = 0;
        }
      }
    }

    dataTexture.needsUpdate = true;
  });
  return (
    <mesh material={shaderMaterial}>
      <planeGeometry args={[size.width, size.height]} />
    </mesh>
  );
};

export default Experience;
