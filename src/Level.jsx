import * as THREE from 'three'

// Base for all blocks
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)

const floor1Material = new THREE.MeshStandardMaterial({ color: 'limegreen' })
const floor2Material = new THREE.MeshStandardMaterial({ color: 'greenyellow' })
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: 'orangered' })
const wallMaterial = new THREE.MeshStandardMaterial({ color: 'slategrey' })


const BlockStart = ({ position = [0, 0, 0] }) => {

    {/* Floor */ }
    return <group position={position}>
        <mesh
            geometry={boxGeometry}
            material={floor1Material}
            position={[0, -0.1, 0]}
            receiveShadow
            scale={[4, 0.2, 4]}
        />
    </group>
}


const Level = () => {
    return <>
        <BlockStart position={[0, 0, 0]} />
    </>
}

export default Level