import React from 'react';
import Page404 from '../Page404/Page404';
import { Route, Redirect, withRouter, Switch, BrowserRouter as Router } from 'react-router-dom';
import { Box } from '@mui/system';
import { Fab, TextField } from '@mui/material';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import './Connexion.css';

export default class Connexion extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			courriel: '',
			mot_passe: '',
			id_usager: undefined
		};

		this.validation = this.validation.bind(this);
		this.seConnecter = this.seConnecter.bind(this);

	}

	validation() {
		let bValidation = false;

		if (
			this.state.courriel &&
			this.state.courriel.trim() !== '' &&
			(this.state.mot_passe && this.state.mot_passe.trim() !== '')
		) {
			// Validation selon la forme minimale [a-Z]@[a-Z]
			let expRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
			let bRegex = expRegex.test(this.state.courriel);

			if (bRegex) {
				bValidation = true;
			} else {
			}
		}

		return bValidation;
	}

	seConnecter() {
		if (this.validation()) {
			const donnes = {
				courriel: this.state.courriel,
				mot_passe: this.state.mot_passe
			};

			const putMethod = {
				method: 'PUT',
				headers: {
					'Content-type': 'application/json',
					authorization: 'Basic ' + btoa('vino:vino')
				},
				body: JSON.stringify(donnes)
			};

			fetch('https://rmpdwebservices.ca/webservice/php/usagers/login/', putMethod)
				.then((res) => res.json())
				.then((data) => {
					if (data.data) {
						this.props.login(data.data);
						this.props.history.push('/celliers/liste');
					} else {
					}
				});
		}
	}

	render() {

		return (
			<Box
				className="login_container"
				sx={{
					backgroundColor: 'rgba(0, 0, 0, 0.8)',
					display: 'flex',
					justfyContent: 'center',
					alignItems: 'center',
					gap: '1rem',
					width: '85vw',
					flexDirection: 'column',
					borderRadius: '1rem',
					margin: '0 auto',
					marginTop: '20vh'
				}}
			>
				<Box
					sx={{
						display: 'flex',
						width: '80%',
						flexDirection: 'column',
						gap: '2rem'
					}}
				>
					<span className="login_title">Bienvenue dans votre cellier</span>

					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							gap: '1rem'
						}}
					>
						<TextField
							label="Courriel"
							variant="outlined"
							onBlur={(evt) => this.setState({ courriel: evt.target.value })}
							placeholder="bobus@gmail.com"
						/>
						<TextField
							label="Mot de passe"
							type="password"
							variant="outlined"
							onBlur={(evt) => this.setState({ mot_passe: evt.target.value })}
							placeholder="12345"
						/>
					</Box>
					<Fab 
						variant="extended" 
						onClick={() => this.seConnecter()}
						sx={{backgroundColor: "#641b30", color: "white"}}
					>
						<LoginOutlinedIcon sx={{marginRight: '1rem'}}/>
						Se connecter
					</Fab>
				</Box>
			</Box>
		);
	}
}
