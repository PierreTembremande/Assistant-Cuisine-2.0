<script lang="ts">
    import { onMount } from "svelte";

    let titreRecette = "";
    let imageRecette = "";
    let notice = "";

    let preparation: string[] = [];
    let miseEnFormeNotice: string[] = [];

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
    });
</script>

<body>

    <h2>{titreRecette}</h2>
    <img src={imageRecette} width="400" height="300" />

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
            <p>{etape + "."}</p>
        {/each}
    {:else}
        <p>Chargement en cours...</p>
    {/if}
</body>

<style>
    h2{
        text-align: center;
    }
</style>
