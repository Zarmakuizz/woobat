/** The goal of this file is to keep track of various js tools not related to the project. */

/** Casts a number to a string and fill with characters to match a size.
 	@param n the number to cast
 	@param width the number of chars the string should take
 	@param z optional parameter for content to fill before the number.
 		If not given, 0 is used instead.
 	@return string*/
function pad(n, width, z) {
	z = z || '0';
	n = n + '';
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
