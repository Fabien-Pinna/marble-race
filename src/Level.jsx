import * as THREE from 'three'
import {
    useRef,
    useState,
    useMemo
} from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import { useGLTF } from '@react-three/drei'

// Base for all blocks
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)

const floor1Material = new THREE.MeshStandardMaterial({ color: 'limegreen' })
const floor2Material = new THREE.MeshStandardMaterial({ color: 'greenyellow' })
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: 'orangered' })
const wallMaterial = new THREE.MeshStandardMaterial({ color: 'slategrey' })


{/*start block */ }
export const BlockStart = ({ position = [0, 0, 0] }) => {

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

{/* End block */ }
export const BlockEnd = ({ position = [0, 0, 0] }) => {

    const hamburger = useGLTF('./hamburger.glb')
    // Make the model castes shadows
    hamburger.scene.children.forEach((mesh) => {
        mesh.castShadow = true
    })

    // Block
    return <group position={position}>
        {/* Floor */}
        <mesh
            geometry={boxGeometry}
            material={floor1Material}
            position={[0, 0, 0]}
            receiveShadow
            scale={[4, 0.2, 4]}
        />

        {/* Hamburger */}
        <RigidBody
            type='fixed'
            colliders='hull'
            position={[0, 0.25, 0]}
            restitution={0.2}
            friction={0}
        >
            <primitive object={hamburger.scene} scale={0.2} />
        </RigidBody>
    </group>
}

{/* Spinner block */ }
export const BlockSpinner = ({ position = [0, 0, 0] }) => {

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
export const BlockLimbo = ({ position = [0, 0, 0] }) => {

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
export const BlockAxe = ({ position = [0, 0, 0] }) => {

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

// Walls
export const Bounds = ({ length = 1 }) => {
    return <>
        <RigidBody type='fixed' restitution={0.2} friction={0} >
            {/* right */}
            <mesh
                position={[2.15, 0.75, -(length * 2) + 2]}
                geometry={boxGeometry}
                material={wallMaterial}
                scale={[0.3, 1.5, length * 4]}
                castShadow
            />
            {/* left */}
            <mesh
                position={[-2.15, 0.75, -(length * 2) + 2]}
                geometry={boxGeometry}
                material={wallMaterial}
                scale={[0.3, 1.5, length * 4]}
                receiveShadow
            />
            {/* back */}
            <mesh
                position={[0, 0.75, -(length * 4) + 2]}
                geometry={boxGeometry}
                material={wallMaterial}
                scale={[4, 1.5, 0.3]}
                receiveShadow
            />
            <CuboidCollider
                args={[2, 0.1, length * 2]}
                position={[0, -0.1, -(length * 2) + 2]}
                restitution={0.2}
                friction={1}
            />
        </RigidBody>
    </>
}

// Level
export const Level = ({
    // Number of blocks
    count = 5,
    // Block types
    types = [BlockSpinner, BlockLimbo, BlockAxe]
}) => {

    // Blocks
    const blocks = useMemo(() => {
        const blocks = []

        // Loop through the number of blocks
        for (let i = 0; i < count; i++) {
            // Get a random block type
            const type = types[Math.floor(Math.random() * types.length)]
            blocks.push(type)
        }
        return blocks
    }, [count, types])

    return <>
        <BlockStart position={[0, 0, 0]} />

        {/* Loop through the blocks */}
        {blocks.map((Block, index) =>
            <Block key={index} position={[0, 0, -(index + 1) * 4]} />
        )}

        <BlockEnd position={[0, 0, -(count + 1) * 4]} />

        {/* Walls */}
        <Bounds length={count + 2} />
    </>
}
