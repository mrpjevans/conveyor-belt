# conveyor-belt

Technical challenge for the Raspberry Pi Foundation

## Technologies used

- Node v22.5.1
- ESLint
- Prettier
- Vitest

## Installation

To clone this repo:

```
git clone https://github.com/mrpjevans/conveyor-belt.git
```

To install dependancies (only required for development)

```
cd conveyor-belt
npm install
```

## Usage

To run the simulation from the project directory:

```
npm run simulation
```

or

```
node src/index.js
```

## Tests

To run the simple unit test:

```
npm run test
```

## Configuration

The solution is designed to be extensible, so `src/config.js` contains various options for
changing the behaviour of the simulation:

### conveyorBeltLength

Int. How many slots exist on the conveyor belt.

### iterations

Int. How many times the conveyor belt moves.

### buildIterations

Int. How long it takes to assemble the product once all the parts have been collected.

### parts

Array of string. The parts that need to be collected to make the product.

### hands

Int. How many parts can be held at once.

### workersPerGroup

Int. How many workers work on a single slot.

The default values reflect the requirements in the challenge.

## Notes

I have developed this solution using standard ES6 Javascript. Normally I would use TypeScript but
felt that the added complexity of having to transpile the code and install extra dependancies
was overkill in this instance.

I also considered an object-orientated approach, as the workers and slots would
lend themselves well to being classes. As Javascript is a prototype language, I felt a simpler
approach would suffice.

The main code is in `src/simulation.js`. This was done so it could be encapsulated for unit
testing.

## Assumptions

- On the iteration a worker finishes a product, they cannot place it down
- Workers alway carry out their work in the same order
