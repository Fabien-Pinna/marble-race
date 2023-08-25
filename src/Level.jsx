import * as THREE from 'three'
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'

// Base for all blocks
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)

const floor1Material = new THREE.MeshStandardMaterial({ color: 'limegreen' })
const floor2Material = new THREE.MeshStandardMaterial({ color: 'greenyellow' })
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: 'orangered' })
const wallMaterial = new THREE.MeshStandardMaterial({ color: 'slategrey' })


{/*start block */ }
const BlockStart = ({ position = [0, 0, 0] }) => {

    // Block
    return <group position={position}>
        {/* Floor */}
        <mesh
            geometry={boxGeometry}
            material={floor1Material}
            position={[0, -0.1, 0]}
            receiveShadow
            scale={[4, 0.2, 4]}
        />
    </group>
}

{/* Spinner block */ }
const BlockSpinner = ({ position = [0, 0, 0] }) => {

    // Get a random value for the rotation speed, and add 0.2 to have a minimum speed. Then multiply by -1 or 1 to have a random direction
    const [speed] = useState(() => (Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1))

    // Obstacle ref
    const obstacle = useRef()

    // Animate obstacle rotation
    useFrame((state, delta) => {
        const time = state.clock.getElapsedTime()

        const rotation = new THREE.Quaternion()
        rotation.setFromEuler(new THREE.Euler(0, time * speed, 0))
        obstacle.current.setNextKinematicRotation(rotation)
    })

    // Block
    return <group position={position}>
        {/* Floor */}
        <mesh
            geometry={boxGeometry}
            material={floor2Material}
            position={[0, -0.1, 0]}
            receiveShadow
            scale={[4, 0.2, 4]}
        />
        {/* Spinner obstacle */}
        <RigidBody
            ref={obstacle}
            type='kinematicPosition'
            position={[0, 0.3, 0]}
            restitution={0.2}
            friction={0}
        >
            <mesh
                geometry={boxGeometry}
                material={obstacleMaterial}
                scale={[3.5, 0.3, 0.3]}
                castShadow
                receiveShadow
            />
        </RigidBody>
    </group>
}

{/* Limbo block */ }
const BlockLimbo = ({ position = [0, 0, 0] }) => {

    // Get a random value for the elevation speed, and multiply it by Pi * 2
    const [timeOffset] = useState(() => Math.random() * Math.PI * 2)

    // Obstacle ref
    const obstacle = useRef()

    // Animate obstacle elevation
    useFrame((state, delta) => {
        const time = state.clock.getElapsedTime()

        const y = Math.sin(time + timeOffset) + 1.15
        obstacle.current.setNextKinematicTranslation({
            x: position[0],
            y: position[1] + y,
            z: position[2]
        })
    })

    // Block
    return <group position={position}>
        {/* Floor */}
        <mesh
            geometry={boxGeometry}
            material={floor2Material}
            position={[0, -0.1, 0]}
            receiveShadow
            scale={[4, 0.2, 4]}
        />
        {/* Limbo obstacle */}
        <RigidBody
            ref={obstacle}
            type='kinematicPosition'
            position={[0, 0.3, 0]}
            restitution={0.2}
            friction={0}
        >
            <mesh
                geometry={boxGeometry}
                material={obstacleMaterial}
                scale={[3.5, 0.3, 0.3]}
                castShadow
                receiveShadow
            />
        </RigidBody>
    </group>
}

{/* Axe block */ }
const BlockAxe = ({ position = [0, 0, 0] }) => {

    // Get a random value for the elevation speed, and multiply it by Pi * 2
    const [timeOffset] = useState(() => Math.random() * Math.PI * 2)

    // Obstacle ref
    const obstacle = useRef()

    // Animate obstacle elevation
    useFrame((state, delta) => {
        const time = state.clock.getElapsedTime()

        const x = Math.sin(time + timeOffset) * 1.25
        obstacle.current.setNextKinematicTranslation({
            x: position[0] + x,
            y: position[1] + 0.75,
            z: position[2]
        })
    })

    // Block
    return <group position={position}>
        {/* Floor */}
        <mesh
            geometry={boxGeometry}
            material={floor2Material}
            position={[0, -0.1, 0]}
            receiveShadow
            scale={[4, 0.2, 4]}
        />
        {/* Axe obstacle */}
        <RigidBody
            ref={obstacle}
            type='kinematicPosition'
            position={[0, 0.3, 0]}
            restitution={0.2}
            friction={0}
        >
            <mesh
                geometry={boxGeometry}
                material={obstacleMaterial}
                scale={[1.5, 1.5, 0.3]}
                castShadow
                receiveShadow
            />
        </RigidBody>
    </group>
}

// Level
const Level = () => {
    return <>
        <BlockStart position={[0, 0, 12]} />
        <BlockSpinner position={[0, 0, 8]} />
        <BlockLimbo position={[0, 0, 4]} />
        <BlockAxe position={[0, 0, 0]} />
    </>
}

export default Level