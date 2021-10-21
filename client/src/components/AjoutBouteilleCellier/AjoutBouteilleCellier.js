import React from "react";
import BouteilleSAQ from "../BouteilleSAQ/BouteilleSAQ";

import './AjoutBouteilleCellier.css';

export default class AjoutBouteilleCellier extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			bouteillesSAQ: [],
			recherche: "",
			nomBouteilleSAQ: "",
			prixBouteilleSAQ: "",
			nom: "",
			millesime: "",
			quantite: "1",
			date_achat: "",
			prix: "",
			garde: "",
			commentaires: "",

		}

		// Binding des fonctions
		this.fetchBouteillesSAQ = this.fetchBouteillesSAQ.bind(this);
		this.afficheBouteilleSAQ = this.afficheBouteilleSAQ.bind(this);
		this.ajouterBouteilleCellier = this.ajouterBouteilleCellier.bind(this);
	}

	afficheBouteilleSAQ(event) {
		this.setState({recherche:event.target.value});
	}

	fetchBouteillesSAQ(){
		fetch("") // Insérer l'adresse pour la request HTTP
		.then(reponse => reponse.json())
		.then((donnees)=>{
			this.setState({bouteillesSAQ:donnees.data}) 
			console.log(donnees)
		});
	}

	choixBouteille(){
		//this.setState({nomBouteilleSAQ:this.bouteille.nom, prixBouteilleSAQ: this.bouteille.prix_saq});
    }

	ajouterBouteilleCellier() {
		const entete = new Headers();
        entete.append("Content-Type", "application/json");
		const reqOptions = {
            method: 'POST',
            headers: entete,
            body: "", // Insérer le body de la requete
            redirect: 'follow'
        };
	}
	
	
	componentDidMount(){
		
	}

	render() {

		const bouteilles = this.state.bouteillesSAQ
								.map((bouteille, index)=>{
									return (
										<Bouteille info={bouteille} onClick={this.choixBouteille.bind(bouteille)} key={index}/>
									)
								})
		
		return (
			<div className="nouvelleBouteille" vertical layout>
				<p>Recherche : <input onChange={this.afficheBouteilleSAQ} type="text" name="nom_bouteille" /></p>
					<ul>
						{bouteilles}
					</ul>
				<div>
					<p>Nom : <input name="nom" value={this.state.nom} onChange={ e => this.setState({ nom : e.target.value }) }/></p>
					<p>Millesime : <input name="millesime" value={this.state.millesime} onChange={ e => this.setState({ millesime : e.target.value }) }/></p>
					<p>Quantité : <input name="quantite" value={this.state.quantite} onChange={ e => this.setState({ quantite : e.target.value }) }/></p>
					<p>Date d'achat : <input name="date_achat" value={this.state.date_achat} onChange={ e => this.setState({ date_achat : e.target.value }) }/></p>
					<p>Prix : <input name="prix" value={this.state.prix} onChange={ e => this.setState({ prix : e.target.value }) }/></p>
					<p>Peux être garder ? : <input name="garde_jusqua" value={this.state.garde} onChange={ e => this.setState({ garde : e.target.value }) }/></p>
					<p>Commentaires: <input name="notes" value={this.state.commentaires} onChange={ e => this.setState({ commentaires : e.target.value }) }/></p>
				</div>
				<button onClick={this.ajouterBouteilleCellier} name="ajouterBouteilleCellier">Ajouter la bouteille au cellier</button>
			</div>
			);
	}
}