var referee = require('referee');
global.assert = referee.assert;
global.refute = referee.refute;

referee.format = require('formatio').ascii;
