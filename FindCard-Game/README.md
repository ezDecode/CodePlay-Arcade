# Memory Match Game

A classic memory card matching game built with HTML, CSS, and JavaScript. Test your memory by matching pairs of cards while keeping track of your moves and time.

## Features

- 16 cards (8 pairs) with emoji symbols
- Card flip animations
- Move counter
- Timer
- Reset functionality
- Responsive design for all screen sizes
- Modern UI with smooth animations

## How to Play

1. Click on any card to reveal its symbol
2. Click on a second card to find its match
3. If the cards match, they stay face up
4. If they don't match, they flip face down after a brief delay
5. Continue until all pairs are matched
6. Try to complete the game in the fewest moves and shortest time!

## Code Structure

### HTML (`index.html`)
- Basic structure with game board container
- Move counter and timer display
- Reset button
- Responsive meta tags

### CSS (`styles.css`)
- Modern gradient background
- Card flip animations using CSS transforms
- Responsive grid layout
- Mobile-friendly design
- Smooth transitions and hover effects

### JavaScript (`script.js`)
- Card generation and shuffling
- Game state management
- Card matching logic
- Timer functionality
- Win condition checking
- Move counting
- Reset game functionality

## Technical Implementation

### Card Flipping
The game uses CSS 3D transforms for smooth card flipping animations. Each card has two sides (front and back) implemented using absolute positioning and `backface-visibility`.

### Game Logic
- Cards are generated dynamically using JavaScript
- Shuffling is implemented using the Fisher-Yates algorithm
- Game prevents clicking same card twice or clicking while cards are being checked
- Matching pairs are detected by comparing data attributes
- Timer starts on game initialization and stops when all pairs are found

### Responsive Design
- Uses CSS Grid for card layout
- Adjusts grid columns based on screen size:
  - 4 columns on desktop
  - 3 columns on tablet
  - 2 columns on mobile
- Flexible container sizing
- Responsive typography

## Getting Started

1. Clone or download the repository
2. Open `index.html` in a web browser
3. Start playing!

No additional setup or dependencies required - it's a pure HTML, CSS, and JavaScript implementation.

## Browser Compatibility

The game works in all modern browsers that support:
- CSS Grid
- CSS 3D Transforms
- ES6 JavaScript features

## Future Improvements

Potential features that could be added:
- Difficulty levels (more cards)
- Different card themes
- High score system
- Sound effects
- Multiplayer mode

## License

This project is open source and available under the MIT License. 