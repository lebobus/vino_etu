import React from "react";

import './Bouteille.css';

export default class Bouteille extends React.Component {
	constructor(props){
	  super(props);
	
	}

	render() {
		return (
			<li>{this.props.info.nom}</li>
		)
	}
}