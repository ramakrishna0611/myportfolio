/* Pixel-art characters. One character per pixel; '.' is transparent. */

export const BOY = [
  '...HHHHHH...',
  '..HHHHHHHH..',
  '..HSSSSSSH..',
  '..SSESSESS..',
  '..SSSSSSSS..',
  '...SSMMSS...',
  '....SSSS....',
  '..TTTTTTTT..',
  '.STTTTTTTTS.',
  '.STTTWWTTTS.',
  '.S.TTTTTT.S.',
  '...TTTTTT...',
  '...PPPPPP...',
  '...PP..PP...',
  '...PP..PP...',
  '...PP..PP...',
  '..BBB..BBB..',
]

export const MAN = [
  '....HHHHHH....',
  '...HHHHHHHH...',
  '...HHSSSSHH...',
  '...SSSSSSSS...',
  '...SSESSESS...',
  '...SSSSSSSS...',
  '....SSMMSS....',
  '.....SSSS.....',
  '...JJJCCJJJ...',
  '..JJJJCCJJJJ..',
  '.JJJJJJJJJJJJ.',
  '.JJJJJAAJJJJJ.',
  '.JJJJJAAJJJJJ.',
  '.SJJJJJJJJJJS.',
  '.SJJJJJJJJJJS.',
  '.S.JJJJJJJJ.S.',
  '...JJJJJJJJ...',
  '...PPPPPPPP...',
  '...PPP..PPP...',
  '...PPP..PPP...',
  '...PPP..PPP...',
  '...PPP..PPP...',
  '...PPP..PPP...',
  '..BBBB..BBBB..',
]

export const COLORS = {
  H: '#3a2416', S: '#f1c27d', E: '#14151a', M: '#b5523b', W: '#ffffff',
  T: '#4de1ff', P: '#3b4a7a', B: '#0e0f14',
  J: '#8b5cf6', C: '#eef1f8', A: '#4de1ff',
}

/* grid the canvas draws on; both characters stand on the bottom row */
export const GRID_W = 24
export const GRID_H = 30

export function pixels(sprite) {
  const w = sprite[0].length, h = sprite.length
  const ox = Math.floor((GRID_W - w) / 2), oy = GRID_H - h
  const out = []
  sprite.forEach((row, y) => [...row].forEach((ch, x) => { if (ch !== '.') out.push({ x: ox + x, y: oy + y, ch }) }))
  return out
}
