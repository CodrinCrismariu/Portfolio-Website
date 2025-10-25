### Coordinated autonomy for any airframe

OpenDrone breaks the barrier to swarm experimentation. I fused PX4 flight stacks with ROS 2 mission coordination, backed by a Gazebo and Isaac Sim bridge for high-fidelity rehearsal.

- Behavior trees orchestrate distributed tasking and gracefully degrade when nodes drop.
- Ultra-wideband localization feeds a Kalman fusion block for precise relative positioning indoors.
- Mission control dashboard visualizes swarm health, signal strength, and planned trajectories.
- Hardware abstraction allows deploying the same behaviors on 5-inch quads or long-range hexacopters.
