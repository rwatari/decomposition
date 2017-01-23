## Decomposition: A Phase Separation Simulator

### Background

When two immiscible materials are mixed, they tend to separate and coalesce into regions consisting purely of one component each to achieve thermodynamic equilibrium. (Think how water and oil separate after mixing.) In many two-phase liquid systems, the liquids will mix at high temperatures and separate at low temperatures. After a sudden temperature change from high to low, these systems will undergo a process called [spinodal decomposition][spinodal] and rapidly separate.

![gif][spinodal gif]

This process can be represented by a differential equation known as the [Cahn-Hilliard equation][ch wiki]:

![equation][ch equation]


In this equation, the value c represents the concentration of the two phases as a value from 1 to -1. The RGB values of pixels in images can also be thought of as concentrations of those colors, except between 0 and 255. By mapping the two scales together, we can represent any image as a snapshot of a system of two mixed liquids and watch how it evolves and tries to reach equilibrium.

[spinodal]: https://en.wikipedia.org/wiki/Spinodal_decomposition
[ch wiki]: https://en.wikipedia.org/wiki/Cahn-Hilliard_equation
[ch equation]: http://www.sciweavers.org/tex2img.php?eq=%20%5Cfrac%7B%5Cpartial%20c%7D%7B%5Cpartial%20t%7D%20%3D%20D%20%5Cnabla%5E2%20%5Cbig%28c%5E3%20-%20c%20-%20%5Cgamma%20%5Cnabla%5E2%20c%5Cbig%29%20&bc=White&fc=Black&im=jpg&fs=12&ff=modern&edit=0
[spinodal gif]: https://upload.wikimedia.org/wikipedia/commons/9/9b/CahnHilliard_Animation.gif

### Functionality & MVP

This spinodal decomposition simulator will allow users to:

- [ ] Start and stop the simulation at any point
- [ ] Allow users to tweak the simulation parameters with slider bars

In addition, this project will include:

- [ ] A description and links about the scientific and mathematical background of the simulation
- [ ] A production Readme

### Wireframe

There will be a central frame consisting of the simulation. Above this, there will be some user controls, including pause, play, and sliders for adjusting the simulation. Below the simulation will be a description of the simulation with relevant links. A nav bar at the top of the page will contain the logo and links to the Github page and my LinkedIn.

![wireframe](wireframes/decomposition-wireframe.png)

### Architecture and Technologies

This project will be implemented with the following technologies:

- `jquery` for user controls
- `HTML5 Canvas` for rendering the simulation
- Vanilla Javascript and `WebGL` for running the simulation with fast matrix operations
- `Webpack` for bundling the script files

In addition to the webpack entry file, there will be two scripts involved in this project:

- `simulation.js`: This script will be the main workhorse for the app, storing the matrix of image data and running the matrix calculations.

- `controller.js`: This script will get user input through the control elements and communicate them to the simulation.

### Implementation Timeline

**Day 1**: Main objective: learn how to run matrix calculations in `WebGL`
- Set up basic html and canvas so the animation can be seen
- Create matrix with grayscale values and have it show on the page
- Read up on WebGL and write code for matrix multiplication

**Day 2**: Main objective: Working simulation step
- Continue practice with `WebGL` and learn how to calculate Laplacian by finite differences
- Tweak simulation parameters for animation to run at correct speed
- Choose appropriate boundary conditions

**Day 3**: Main objective: Fully working simulation
- Run full simulation without stopping
- Create start and stop controls
- `run` function must allow user inputs to interrupt animation and continue with new parameters

**Day 4**: Main objective: User controls and styling
- Create controls for user inputs
- Set range of user controls to prevent calculations from running out of control
- Style page and add links to Github and LinkedIn


### Bonus features
- [ ] Allow users to upload images
- [ ] Run three simulations at the same time - one for each color. These can be blended on the canvas to show one animation.
