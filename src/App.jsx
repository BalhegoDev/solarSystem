import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TextureLoader } from "three";
import earth from "./assets/earth.jpg";
import sun from "./assets/sun.jpg"; 
import "./style.css";

export default function App() {
  const div = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const control = new OrbitControls(camera, renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10).normalize();
    scene.add(directionalLight);

    const loader = new TextureLoader();

    const sunMaterial = new THREE.MeshBasicMaterial({ map: loader.load(sun) });
    const sunGeometry = new THREE.SphereGeometry(5, 30, 30);
    const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    sunMesh.castShadow = true;
    scene.add(sunMesh);

    const sphereGeometry = new THREE.SphereGeometry(2, 30, 30);
    const sphereMaterial = new THREE.MeshStandardMaterial({ map: loader.load(earth) });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.castShadow = true;
    sphere.receiveShadow = true;

    const solarSystem = new THREE.Object3D();
    solarSystem.add(sphere);
    scene.add(solarSystem);

    sphere.position.z = -12;
    camera.position.z = 20;

    const animate = () => {
      requestAnimationFrame(animate);
      solarSystem.rotation.y += 0.01;
      sunMesh.rotateY(0.005);
      sphere.rotateY(0.01);
      control.update();
      renderer.render(scene, camera);
    };

    animate();

    renderer.setSize(window.innerWidth, window.innerHeight);
    div.current.appendChild(renderer.domElement);

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onWindowResize);

    return () => {
      window.removeEventListener('resize', onWindowResize);
      div.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }} ref={div}></div>
  );
}