/**
 * External dependencies
 */
import localforage from 'localforage';
import reduce from 'lodash/reduce';

/**
 * Internal dependencies
 */
import localforageBypass from './localforage-bypass';

const config = {
	name: 'calypso',
	storeName: 'calypso_store',
	version: 1.0,
	description: 'Calypso Browser Storage',
	driver: [
		localforage.INDEXEDDB,
		localforage.WEBSQL,
		localforage.LOCALSTORAGE
	]
};

let _ready = false;
// Promise that resolves when our localforage configuration has been applied
const localForagePromise = localforage.defineDriver( localforageBypass )
	.then( () => {
		localforage.config( config );
		_ready = true;
		return localforage;
	} )
	.catch( ( error ) => console.error( 'Configuring localforage: %s', error ) );

// Wraps a function to run after waiting until a promise has resolved.
// The promise should contain the original object for context.
const wrapOriginalFunc = ( promise, original ) => {
	return function( ...args ) {
		return promise.then( ( context ) => original.apply( context, args ) );
	};
}

// List of localforage methods that should wait for localForagePromise to resolve
const wrapFuncs = [
	'getItem', 'setItem', 'removeItem',
	'length', 'key', 'keys', 'iterate', 'clear'
];

// Proxy each localforage method to ensure our configuration is initialized first
// NOTE: This means every localForage method returns a promise
const localForageProxy = reduce(
		wrapFuncs,
		( result, fn ) => {
			result[ fn ] = wrapOriginalFunc( localForagePromise, localforage[ fn ] );
			return result;
		},
		{}
);

localForageProxy.bypass = () => {
	if ( _ready ) {
		console.error( 'Cannot bypass localforage after initialization' );
	} else {
		config.driver = [ localforageBypass._driver ];
	}
}

export default Object.assign( {}, localforage, localForageProxy );
