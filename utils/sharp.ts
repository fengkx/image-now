import sharp from 'sharp'

sharp.cache({memory: 512, items: 1000});
export default sharp
