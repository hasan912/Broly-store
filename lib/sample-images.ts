// Sample base64 images for testing
// These are small colored placeholder images

export const SAMPLE_IMAGES = {
  // Simple blue gradient (200x200)
  blue: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8//8/AwAI/AL+hc6KzwAAAABJRU5ErkJggg==',
  
  // Simple red gradient
  red: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0icmdiYSgyNTUsIDUyLCA1MiwgMC44KSIvPjwvc3ZnPg==',
  
  // Simple green gradient
  green: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0icmdiYSg1MiwgMjExLCA3NiwgMC44KSIvPjwvc3ZnPg==',
  
  // Simple purple gradient  
  purple: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0icmdiYSgxMDksIDQwLCAxNzcsIDAuOCkiLz48L3N2Zz4=',
  
  // Simple indigo gradient
  indigo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0icmdiYSg5OSwgMTAyLCAyNDEsIDAuOCkiLz48L3N2Zz4=',
};

export function getRandomSampleImage(): string {
  const images = Object.values(SAMPLE_IMAGES);
  return images[Math.floor(Math.random() * images.length)];
}
