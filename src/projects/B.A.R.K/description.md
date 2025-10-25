Big Automated Robot "Kanine" is a 12-DOF quadruped I designed to explore terrain that wheeled robots can’t reach. Each leg uses inverse-kinematics control to keep the body level while stepping over debris, letting the platform handle uneven ground, slopes, and gaps.

## Highlights
- Designed in Fusion 360 with modular 3‑axis legs (goBILDA motors, REV servos).
- 3D‑printed PLA frame (~150 h) reinforced with PVC for a light build.
- Dual REV hubs drive eight hub motors and four servos; Moto G5 runs FTC Dashboard and TensorFlow Lite for tele‑op/inspection.
- Inverse Kinematics converts Cartesian targets to joint angles, using PID + IMU feedback for balance.
- Smooth interpolation and parallel threads keep leg motions synchronized.
