// const util = require('util');
const chalk = require('chalk');
// const config = { showHidden: false, depth: null, colors: true };
// const inspector = console.dir(util.inspect({}, config));
// const inspector = (inputs = {}) => console.log(util.inspect(inputs, config));

// const { inspector } = require('../util/inspector'); // crap

/*     basic colors      */
// const blue = chalk.blueBright;
// const red = chalk.redBright;
// const cyan = chalk.cyanBright;
// const magenta = chalk.magentaBright;
// const green = chalk.greenBright;
/* %% todo: fix const pink = chalk.pink; 
const purple = chalk.purple; end broken %% */
// const yellow = chalk.yellowBright;

/*     color obj ￼    */

const chalkContainer = {
	b: chalk.blueBright.bold,
	r: chalk.redBright.bold,
	c: chalk.cyanBright.bold,
	m: chalk.magentaBright.bold,
	g: chalk.greenBright.bold,
	// k: chalk.pink, // pink & purple
	// p: chalk.purple, // have issues
	y: chalk.yellowBright.bold.underline,

	/*   color arrrrr ☠  */
	colArr: [
		'black',
		'red',
		'green',
		'yellow',
		'blue',
		'magenta',
		'cyan',
		'white',
		'blackBright', //(alias: gray, grey)
		'redBright',
		'greenBright',
		'yellowBright',
		'blueBright',
		'magentaBright',
		'cyanBright',
		'whiteBright',
	],
};

// log out all sortsa shit, no depth limit
// inspector(chalkContainer.colArr.map((c, i) => `colArr: ${c}[${i}]`));
// inspector(chalkContainer);
// example colored log:
exports.chalkChecks = (
	level = console.info,
	heading1 = 'Folders',
	message1 = '✔ done!',
	heading2 = 'Analytics',
	message2 = '✔ processed!',
	heading3 = 'MergedOutput',
	message3 = '✔ created!',
) => {
	const { b, c, g, m, r, y } = chalkContainer;
	return level(
		b(`${heading1}: ${c(message1)}\n`),
		r(`${heading2}: ${g(message2)}\n`),
		m(` ${heading3}: ${y(message3)}\n`),
	);
};

// console.warn(
//   chalk.yellow(
//     `Here's a yellow line, ${chalk.bold.blue.underline(
//       "with a segment with underlined blue text"
//     )} and then back to yellow.`
//   )
// );
