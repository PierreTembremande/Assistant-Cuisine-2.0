<script lang="ts">
    import { onMount } from "svelte";
    import { supabase } from "../Bdd/bdd";

    let titreRecette = "";
    let imageRecette = "";
    let notice = "";
    let req;

    let preparation: string[] = [];
    let miseEnFormeNotice: string[] = [];

    let retourUtilisateur = {
        name: "",
        comment: "",
        rating: 0,
    };

    onMount(async () => {
        const params = new URLSearchParams(window.location.search);
        const nomRecette = params.get("nom");
        const newPreparation: Array<string> = [];

        try {
            const reponse = await fetch(
                `https://www.themealdb.com/api/json/v1/1/search.php?s=${nomRecette}`
            );
            const recette = await reponse.json();
            const meals = recette.meals[0];

            titreRecette = meals.strMeal;
            imageRecette = meals.strMealThumb;

            for (let i = 1; i <= 20; i++) {
                let ingredient = `strIngredient${i}`;
                let quantite = `strMeasure${i}`;

                if (meals[ingredient] && meals[quantite]) {
                    newPreparation.push(
                        `${meals[quantite]} ${meals[ingredient]}`
                    );
                }
            }

            preparation = newPreparation;

            notice = meals.strInstructions;
            miseEnFormeNotice = notice.split(".");
        } catch (error) {
            console.error("Erreur sur le fetch de l'API", error);
        }

        const { data } = await supabase.from("User").select();
        console.log(data)
    });

    function validationAvis() {
        console.log("Nom de l'utilisateur :", retourUtilisateur.name);
        console.log("Commentaire :", retourUtilisateur.comment);
        console.log("Note :", retourUtilisateur.rating);
    }

    function AffichageCommentaireRecette() {
        // const { data, error } = supabase.from("User").select("*");
        // req = supabase.from("User").select("*");
        // if (req. {
        //     console.error(
        //         "Erreur lors de la récupération des données depuis Supabase",
        //         error
        //     );
        // } else {
        //     console.log("Données depuis Supabase :", data);
        // }
    }
</script>

<body>
    <h2>{titreRecette}</h2>
    <img src={imageRecette} width="400" height="300" alt="Non trouvé" />

    {#if preparation.length > 0}
        <ul>
            {#each preparation as ingredient}
                <li>{ingredient}</li>
            {/each}
        </ul>
    {:else}
        <p>Chargement en cours...</p>
    {/if}

    {#if miseEnFormeNotice.length > 0}
        {#each miseEnFormeNotice as etape}
            <p>{etape}</p>
        {/each}
    {:else}
        <p>Chargement en cours...</p>
    {/if}

    <form on:submit|preventDefault={validationAvis}>
        <h4>Donnez nous votre avis !</h4>

        <label for="name">Nom :</label>
        <input type="text" id="name" bind:value={retourUtilisateur.name} />
        <br />

        <label for="comment">Commentaire :</label>
        <textarea
            id="comment"
            rows="4"
            bind:value={retourUtilisateur.comment}
        />
        <br />

        <label for="rating">Note :</label>
        <input
            type="number"
            id="rating"
            min="1"
            max="5"
            bind:value={retourUtilisateur.rating}
        />
        <br />

        <button type="submit">Envoyer l'avis</button>
    </form>
</body>

<style>
    h2,
    form {
        text-align: center;
    }
</style>
