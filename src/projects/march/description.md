MARCH combines model-based foothold planning with reinforcement learning to control a vision-guided humanoid over sparse footholds.

### Contribution

Lead developer and first author. Developed the MuJoCo/mjlab training pipeline, PPO teacher training with domain randomization, perceptive student-policy distillation, and physical deployment on a Unitree G1.

### Evaluation

Simulation: 66.7% success across 1,024 randomized trials; half the teacher-training episodes of the model-free baseline; at least 12% lower mean absolute joint torque and 39% lower mean absolute angular jerk.

Hardware: a policy running at 50 Hz on the G1’s Jetson Orin NX, using Intel RealSense depth observations and proprioception, demonstrated traversal over four laterally constrained stepping stones. No hardware success rate is reported here.
