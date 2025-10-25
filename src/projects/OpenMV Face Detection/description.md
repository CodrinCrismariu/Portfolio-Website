This project is part of the work I did for the Tufts Center for Engineering Education Outreach. It ports Google's BlazeFace model to the OpenMV H7 camera so the board can run face detection on-device. It includes compressed Python utilities, custom firmware, and example scripts that draw bounding boxes, keypoints, and calculate face angles relative to the lens.

## Highlights

- Created custom firmware optimized for running embedded AI models with low computation
- Custom firmware reorganizes memory so the H7 can host the BlazeFace TFLite model while sustaining 128x128 RGB capture.
- Designed for classroom delivery with README flashing steps, wiring diagrams, and ready-to-run OpenMV IDE scripts.
