/**
 * External dependencies
 */
import React from 'react';
import classNames from 'classnames';

export default React.createClass( {
	getInitialState() {
		return {
			firstViewActive: false
		};
	},

	componentDidMount() {
		if ( this.props.firstViewActive ) {
			// we have to slightly delay this so that the CSS transition will show
			process.nextTick( this.showFirstView );
		}
	},

	componentWillReceiveProps( nextProps ) {
		this.setState( {
			firstViewActive: nextProps.firstViewActive
		} );
	},

	render() {
		const firstViewActive = this.state.firstViewActive;

		const children = React.Children.map( this.props.children, function( child ) {
			// TODO: Is there a way to only do this for 'FirstView'-derived components
			return React.cloneElement( child, {
				firstViewActive: firstViewActive,
				onFirstViewDismiss: this.props.onFirstViewDismiss
			} );
		}, this );

		const classes = classNames( 'first-viewable', {
			'first-view-active': firstViewActive
		} );

		return (
			<div className={ classes }>
				{ children }
			</div>
		);
	},

	showFirstView() {
		this.setState( { firstViewActive: true } );
	}
} );
