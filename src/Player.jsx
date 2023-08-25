import { useRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { RigidBody, useRapier } from "@react-three/rapier"
import { useKeyboardControls } from "@react-three/drei"


export const Player = () => {

    const body = useRef()

    // hook for using keyboard controls
    const [sucribeKeys, getKeys] = useKeyboardControls()

    // hook for using raycast from rapier
    const { rapier, world } = useRapier()

    const rapierWorld = world

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

    // subscribe to the jump key
    useEffect(() => {
        const unsubscribeJump = sucribeKeys(

            // Selector
            (state) => state.jump,

            // Action
            (value) => {
                if (value) {
                    jump()
                }
            }
        )
        return () => {
            unsubscribeJump()
        }
    }, [])

    // animate the ball with keyboard controls
    useFrame((state, delta) => {

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