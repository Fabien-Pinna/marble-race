import * as THREE from "three"
import { useRef, useEffect, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { RigidBody, useRapier } from "@react-three/rapier"
import { useKeyboardControls } from "@react-three/drei"
import useGame from "./stores/useGame"


const Player = () => {

    const body = useRef()

    // hook for using keyboard controls
    const [subscribeKeys, getKeys] = useKeyboardControls()

    // hook for using raycast from rapier
    const { rapier, world } = useRapier()
    const rapierWorld = world

    // hook for smoothing the camera
    const [smoothedCameraPosition] = useState(new THREE.Vector3(10, 10, 10))
    const [smoothedCameraTarget] = useState(new THREE.Vector3())

    const start = useGame((state) => state.start)
    const end = useGame((state) => state.end)
    const restart = useGame((state) => state.restart)
    const blocksCount = useGame((state) => state.blocksCount)

    // jump function
    const jump = () => {
        // get the current position of the ball for the origin of the impulse 
        const origin = body.current.translation()
        origin.y -= 0.31
        const direction = { x: 0, y: -1, z: 0 }
        // create the ray
        const ray = new rapier.Ray(origin, direction)
        // cast the ray
        const hit = rapierWorld.castRay(ray, 10, true)
        // apply the impulse if the ray hit something
        if (hit.toi < 0.15)
            body.current.applyImpulse({ x: 0, y: 0.5, z: 0 })
    }

    // reset function
    const reset = () => {
        body.current.setTranslation({ x: 0, y: 1, z: 0 })
        body.current.setLinvel({ x: 0, y: 0, z: 0 })
        body.current.setAngvel({ x: 0, y: 0, z: 0 })
    }

    // subscribe to the jump key
    useEffect(() => {
        // We unsubscribe from any event before subscribing to a new one
        const unsubscribeReset = useGame.subscribe(
            (state) => state.phase,
            (value) => {
                if (value === 'ready')
                    reset()
            }
        )

        const unsubscribeJump = subscribeKeys(
            // Selector
            (state) => state.jump,

            // Action
            (value) => {
                if (value) {
                    jump()
                }
            }
        )
        // subscribe to any key and listen wich phase of game it is
        const unsubscribeAny = subscribeKeys(() => {
            start()
        })

        // Clean up function
        return () => {
            unsubscribeJump()
            unsubscribeAny()
            unsubscribeReset()
        }
    }, [])

    useFrame((state, delta) => {

        // animate the ball with keyboard controls
        // retrieve the keyboard controls
        const { forward, backward, leftward, rightward, jump } = getKeys()

        // instanciate the impulse and torque vectors
        const impulse = { x: 0, y: 0, z: 0 }
        const torque = { x: 0, y: 0, z: 0 }

        // calculate the impulse and torque vectors
        const impulseStrength = 0.6 * delta
        const torqueStrength = 0.6 * delta

        // apply the impulse and torque vectors
        if (forward) {
            impulse.z -= impulseStrength
            torque.x -= torqueStrength
        }
        if (rightward) {
            impulse.x += impulseStrength
            torque.z -= torqueStrength
        }
        if (leftward) {
            impulse.x -= impulseStrength
            torque.z += torqueStrength
        }
        if (backward) {
            impulse.z += impulseStrength
            torque.x += torqueStrength
        }

        body.current.applyImpulse(impulse)
        body.current.applyTorqueImpulse(torque)

        // animate the camera
        // get the current position of the ball
        const bodyPosition = body.current.translation()

        // set the initial position of the camera
        const cameraPosition = new THREE.Vector3()

        // set the camera position to the ball position
        cameraPosition.copy(bodyPosition)
        cameraPosition.z += 2.25
        cameraPosition.y += 0.65

        // set a target for the camera
        const cameraTarget = new THREE.Vector3()

        // set the camera target to the ball position
        cameraTarget.copy(bodyPosition)
        cameraTarget.y += 0.25

        // smooth the camera position and target
        smoothedCameraPosition.lerp(cameraPosition, 5 * delta)
        smoothedCameraTarget.lerp(cameraTarget, 5 * delta)

        // apply the camera position and its target
        state.camera.position.copy(smoothedCameraPosition)
        state.camera.lookAt(smoothedCameraTarget)

        /**
         * Phases
         */
        if (bodyPosition.z < -(blocksCount * 4 + 2))
            end()

        if (bodyPosition.y < -4)
            restart()


    })

    return <>
        {/* The player ball */}
        <RigidBody
            ref={body}
            colliders='ball'
            restitution={0.2}
            friction={1}
            linearDamping={0.5}
            angularDamping={0.5}
            position={[0, 1, 0]}
            canSleep={false}
        >
            <mesh castShadow>
                <icosahedronGeometry args={[0.3, 1]} />
                <meshStandardMaterial flatShading color='mediumpurple' />
            </mesh>
        </RigidBody>
    </>
}

export default Player