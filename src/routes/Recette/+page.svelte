<script lang="ts">
    import { onMount } from "svelte";
    import { supabase } from "../Bdd/bdd";

    let titreRecette = "";
    let imageRecette = "";
    let notice = "";

    let idMeal = 0;
    let idUser = 0;

    let preparation: string[] = [];
    let miseEnFormeNotice: string[] = [];
    let recupCommentaire: Commentaire[] = [];

    let retourUtilisateur = {
        name: "",
        comment: "",
        rating: 0,
    };

    interface Commentaire {
        co_user: string;
        co_commentaire: string;
        co_note: string;
    }

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

            idMeal = meals.idMeal;
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

            AffichageCommentaireRecette(idMeal);
        } catch (error) {
            console.error("Erreur sur le fetch de l'API", error);
        }
    });

    async function recupIdUser($nomUser: string) {
        const { data, error } = await supabase
            .from("User")
            .select("id")
            .like("Login", $nomUser);

        if (data && data.length > 0) {
            idUser = Number(data[0].id);
        }
    }

    async function validationAvis() {
        await recupIdUser(retourUtilisateur.name);
        const { data, error } = await supabase.from("Commentaire").insert([
            {
                co_user: idUser,
                co_commentaire: retourUtilisateur.comment,
                co_note: retourUtilisateur.rating,
                co_recette: idMeal,
            },
        ]);
        AffichageCommentaireRecette(idMeal);
        retourUtilisateur.name = "";
        retourUtilisateur.comment = "";
        retourUtilisateur.rating = 0;
    }

    async function AffichageCommentaireRecette($idMeal: number) {
        const { data, error } = await supabase
            .from("Commentaire")
            .select("*")
            .eq("co_recette", $idMeal);

        if (data && data.length > 0) {
            recupCommentaire = data;
        }
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

    <h3>Section commentaire</h3>
    {#each recupCommentaire as com}
        <p>Utilisateur : {com.co_user}</p>
        <p>{com.co_commentaire}</p>
        <p>Note : {com.co_note}/5</p>
    {/each}

    <form on:submit|preventDefault={validationAvis}>
        <h4>Donnez nous votre avis !</h4>

        <label for="name">Nom :</label>
        <input type="hidden" id="idMeal" bind:value={idMeal} />
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
