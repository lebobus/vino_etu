import React from 'react';
import './ListeAchat.css';
import { DataGrid } from '@mui/x-data-grid';  //import { DataGrid } from '@mui/x-data-grid/index-cjs';
import { Box } from "@mui/system";
import DeleteIcon from '@mui/icons-material/Delete';
import { Fab } from '@mui/material';
import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined';

export default class ListeAchat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      itemsSelected: [],
      itemsListeAchat: [],
      bouteilles: [],
      listeAchat: false,
      titre: "",
      idListeAchat: '',
      isChecked: false,
      mappedItems: [],
      titreBouton: "",
      bouteillesSelectionnes: []
    }

    this.fetchBouteilles = this.fetchBouteilles.bind(this);
    this.creerListeAchat = this.creerListeAchat.bind(this);
    this.fetchListeAchat = this.fetchListeAchat.bind(this);
    this.effacerListe = this.effacerListe.bind(this);
    this.afficherBouteilles = this.afficherBouteilles.bind(this);
    this.onCheckbox = this.onCheckbox.bind(this);
    this.onModificationQte = this.onModificationQte.bind(this);
    this.cocherListeAchat = this.cocherListeAchat.bind(this);
  }

  componentDidMount() {
    if (!window.sessionStorage.getItem('estConnecte')) {
      return this.props.history.push("/connexion");
    }

    this.props.title("Liste d'achat");
    this.fetchBouteilles();;
  }

  componentDidUpdate() {
    if (!window.sessionStorage.getItem('estConnecte')) {
      return this.props.history.push("/connexion");
    }
  }

  /**
   * Fonctionne que retourne les items de la liste d'achat par usager, si elle existe
   */
  fetchListeAchat() {
    fetch('https://rmpdwebservices.ca/webservice/php/listeachat/usager/' + window.sessionStorage.getItem('id_usager'), {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        authorization: 'Basic ' + btoa('vino:vino')
      })
    })
      .then((reponse) => reponse.json())
      .then((donnees) => {
        if (donnees.data) {
          this.setState(
            {
              itemsListeAchat: donnees.data,
              listeAchat: true,
              titre: "Liste d'achat",
              titreBouton: "Modifier"
            }
          );
          this.state.itemsListeAchat.map(x => {
            this.setState({ idListeAchat: x.id });
          });
          this.cocherListeAchat();
        } else {
          this.setState(
            {
              titre: "Inventaire des bouteilles",
              listeAchat: false,
              titreBouton: "Créer"
            });
        }
      });
  }

  /**
   * Fonctionne que retourne les bouteilles existentes sur la liste d'achat de l'usager pour
   * qu'elles soient croché sur la liste de bouteilles
   */
  cocherListeAchat() {
    let bouteillesListeAchat = [];

    this.state.itemsListeAchat
      .map((item) => {
        bouteillesListeAchat = [...bouteillesListeAchat, parseInt(item.bouteille_id)]

        this.setState(function (state, props) {
          let index = state.mappedItems.findIndex(x => x.id == item.bouteille_id);
          let nouveauTableau = state.mappedItems.slice();

          nouveauTableau[index].quantite_achat = item.quantite;

          return {
            mappedItems: nouveauTableau,
            bouteillesSelectionnes: bouteillesListeAchat
          };
        })
      })
  }

  /**
   * Fonctionne que retourne les vinos qui existen dans tous les celliers de l'usager, pour voir la quantité existente
   */
  fetchBouteilles() {
    fetch('https://rmpdwebservices.ca/webservice/php/bouteilles/usager/' + window.sessionStorage.getItem('id_usager'), {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        authorization: 'Basic ' + btoa('vino:vino')
      })
    })
      .then((reponse) => reponse.json())
      .then((donnees) => {
        if (donnees.data) {
          this.setState(
            {
              items: donnees.data,
              titre: "Inventaire des bouteilles",
              //listeAchat: false,
              titreBouton: "CRÉER LISTE"
            });
          this.afficherBouteilles()
          this.fetchListeAchat();
        }
      });
  }

  /**
   * Fonctionne qui crée ou modifie la lista d'achat de l'usager
   */
  creerListeAchat() {
    if (this.state.bouteillesSelectionnes.length > 0) {

      this.setState({ bouteilles: [] })

      let bouteilles = [];

      this.state.bouteillesSelectionnes
        .map((item) => {
          let index = this.state.mappedItems.findIndex(x => x.id == item);

          bouteilles.push({ id: this.state.mappedItems[index].id, millesime: this.state.mappedItems[index].millesime, quantite: this.state.mappedItems[index].quantite_achat });
        });

      this.setState(prevState => {
        return {
          bouteilles: [...prevState.bouteilles, bouteilles]
        }
      });

      if (this.state.listeAchat) { //Modifier liste d'achat
        let donnes = {
          bouteilles: bouteilles
        };

        const putMethod = {
          method: 'PUT',
          headers: new Headers({
            'Content-type': 'application/json',
            authorization: 'Basic ' + btoa('vino:vino')
          }),
          body: JSON.stringify(donnes)
        };

        fetch('https://rmpdwebservices.ca/webservice/php/listeachat/' + this.state.idListeAchat, putMethod)
          .then((reponse) => reponse.json())
          .then((donnees) => {
            if (donnees.data) {
              this.fetchBouteilles();
              this.setState({ titre: "Liste d'achat", listeAchat: true });
            }
          });
      } else {  //Créer liste d'achat
        let donnes = {
          id_usager: window.sessionStorage.getItem('id_usager'),
          bouteilles: bouteilles
        };

        const postMethod = {
          method: 'POST',
          headers: new Headers({
            'Content-type': 'application/json',
            authorization: 'Basic ' + btoa('vino:vino')
          }),
          body: JSON.stringify(donnes)
        };

        fetch('https://rmpdwebservices.ca/webservice/php/listeachat/', postMethod)
          .then((reponse) => reponse.json())
          .then((donnees) => {
            if (donnees.data) {
              this.fetchBouteilles();
              this.setState({ titre: "Liste d'achat", listeAchat: true });
            }
          });
      }
    }
  }

  /**
   * Fonctionne que efface la liste d'achat par usager
   */
  effacerListe() {
    if (this.state.listeAchat) {

      const postMethod = {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
          authorization: 'Basic ' + btoa('vino:vino')
        },
      };

      fetch('https://rmpdwebservices.ca/webservice/php/listeachat/' + this.state.idListeAchat, postMethod)
        .then((reponse) => reponse.json())
        .then((donnees) => {
          if (donnees.data) {
            this.setState({ bouteillesSelectionnes: [], listeAchat: false });
            this.fetchBouteilles();
          }
        });
    }
  }

  /**
   * 
   * @param {*} e 
   * 
   * Fonctionne qui mettre à jour la quantité pour acheter de chaque bouteilles
   */
  onModificationQte(e) {
    this.setState(function (state, props) {
      let index = state.mappedItems.findIndex(x => x.id === e.id);
      let nouveauTableau = state.mappedItems.slice();

      nouveauTableau[index].quantite_achat = e.value;

      return {
        mappedItems: nouveauTableau,
        itemsSelected: [nouveauTableau[index]]
      };
    });
  }

  /**
   * 
   * @param {Set} ids 
   * 
   * Fonctionne que remplie l'array des bouteilles séléectionnes
   */
  onCheckbox(ids) {
    const selectedIDs = new Set(ids)

    const selectedRowData = this.state.mappedItems.filter((row) => {
      if (selectedIDs.has(row.id)) {
        return row;
      }
    })

    this.setState(function (state, props) {

      let arr = [];
      Array.from(selectedIDs).map((x) => arr.push(x));

      return {
        itemsSelected: selectedRowData,
        bouteillesSelectionnes: arr
      }

    });
  }

  /**
   * Fonctionne que fixe l'entête du datagrid
   */
  afficherBouteilles() {
    let arr = [...this.state.mappedItems];

    const map = this.state.items.map(bteObj => {
      return {
        id: bteObj.bouteille_id,
        nom: bteObj.nom,
        millesime: bteObj.millesime,
        quantite: bteObj.quantite,
        quantite_achat: this.state.mappedItems.find(x => x.id === bteObj.bouteille_id) === undefined
          ? 1 : this.state.mappedItems.find(x => x.id === bteObj.bouteille_id).quantite_achat
      }
    })

    arr = map;

    this.setState({ mappedItems: arr })
  }



  render() {

    const colonnes = [
      { field: 'nom', headerName: 'Nom', width: 230 },
      { field: 'millesime', headerName: 'Millesime', width: 90 },
      { field: 'quantite', headerName: 'Inv.', width: 60, type: 'number' },
      { field: 'quantite_achat', headerName: 'Achat', width: 70, editable: true, type: 'number', shrink: true, min: 1 },
    ];

    return (
      <Box className="liste_achat_container" sx={{
        display: "flex", justfyContent: "center", alignItems: "center",
        width: "85vw", flexDirection: "column", borderRadius: "1rem",
        margin: "0 auto", marginTop: "10vh", color: "white",
      }} >

        <Box className="liste_achat_rows" style={{ height: 400, width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.8)', padding: 0 }}>
          <DataGrid
            rows={this.state.mappedItems}
            columns={colonnes}
            onCellEditCommit={(e) => this.onModificationQte(e)}
            onRow
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick={true}
            checkboxSelection
            onSelectionModelChange={(ids) => this.onCheckbox(ids)}
            selectionModel={this.state.bouteillesSelectionnes}

          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'space-between'
          }}
        >
          <Fab
            className="button"
            variant="extended"
            onClick={() => this.creerListeAchat()}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '.5rem',
              backgroundColor: '#641b30', color: 'white'
            }}
          >
            <AutoFixHighOutlinedIcon />
            {this.state.titreBouton}
          </Fab>
          <Fab
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '.5rem',
              backgroundColor: '#641b30', color: 'white'
            }}
            className="button"
            variant="extended"
            onClick={(e) => this.effacerListe()}
            disabled={!this.state.listeAchat}
          >
            {<DeleteIcon />}
            Supprimer
          </Fab>
        </Box>
      </Box>
    );
  }
}