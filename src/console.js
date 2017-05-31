// import util from 'util'
// import transform from './transform'

// Console overrides
// FYI: Would need to override every console method since the prototype
// is bound to the original Console instance, for now we're treating
// everything that's not 'error' as 'info'

// console.log = (...args) => {
//   const original = `${util.format.apply(null, args)}\n`;
//   const enhanced = transform(original).setLevel('info');
//   process.stdout.write(enhanced);
// }

// console.warn = (...args) => {
//   const original = `${util.format.apply(null, args)}\n`;
//   const enhanced = transform(original).setLevel('warn');
//   process.stdout.write(transform(enhanced));
// }

// console.dir = (object, options) => {
//   const options = Object.assign({customInspect: false}, options);
//   const original = `${util.inspect(object, options)}\n`;
//   const enhanced = transform(original, { level: 'info' });
//   stdout.write(transform(enhanced));
// }

export default console
