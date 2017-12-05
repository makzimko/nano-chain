/**
 * Create chain of functions
 * @public
 * @param {Function[]} functions
 * @returns {NanoChain}
 */
function createChain ( functions ) {
    validateChain( functions );
    return function NanoChain( data ) {
        var funcs = functions.slice();
        var chain = {
            then: then
        };

        setTimeout( function() {
            next.call( chain, funcs, data, {} );
        }, 1 );

        return chain;
    }
}

/**
 * Validate functions in chain
 * @private
 * @param {Function[]} functions
 * @throws {TypeError} Chain has to be an Array
 * @throws {Error} Chain is empty
 * @throws {Error} Chain item is not a function
 */
function validateChain ( functions ) {
    if ( !Array.isArray( functions ) ) {
        throw new TypeError( 'Chain has to be an Array' );
    }
    if ( !functions.length ) {
        throw new Error( 'Chain is empty' );
    }
    for ( var i = 0; i < functions.length; i++ ) {
        if ( typeof functions[ i ] !== 'function' ) {
            throw new Error( 'Chain item at index ' + i + ' is not a function' );
        }
    }
}

/**
 * Define handler when chain is competed
 * @private
 * @memberof NanoChain
 * @param {Function} handler
 * @returns {NanoChain}
 */
function then ( handler ) {
    this.__proto__.thenHandler = handler;
    return this;
}

/**
 * Stop chain and return an error
 * @private
 * @memberof NanoChain
 * @param data
 * @param {object} result
 * @param e
 */
function error ( data, result, e ) {
    if ( e === false ) {
        throw new Error( 'Error can\'t has value of false' );
    }
    this.errorHandler.call( null, e, data, result );
}

/**
 * Proceed next item of a chain
 * @private
 * @param {Function[]} functions
 * @param data
 * @param {object} result
 */
function next ( functions, data, result ) {
    if ( functions.length ) {
        var func = functions.shift();
        var nextPrototype = {
            next: next.bind( this, functions, data, result ),
            error: error.bind( this, data, result )
        };
        func.call( nextPrototype, data, result );
    } else {
        this.thenHandler.call( null, false, data, result );
    }
}

module.exports = createChain;