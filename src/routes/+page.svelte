<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    interface Category {
        idCategory: string;
        strCategory: string;
        strCategoryDescription: string;
        strCategoryThumb: string;
    }

    let categories: Category[] = [];
    let recette = "";
    let nomRecetteDuJour="";

    onMount(async () => {
        try {
            const response = await fetch(
                "https://www.themealdb.com/api/json/v1/1/categories.php"
            );
            const { categories: fetchedCategories } = await response.json();
            categories = fetchedCategories.filter((category: Category) =>
                category.strCategory.toLowerCase()
            );

            const reponse1 = await fetch(
                `https://www.themealdb.com/api/json/v1/1/random.php`
            );
            const recetteDuJour = await reponse1.json();
            nomRecetteDuJour =recetteDuJour.meals[0]["strMeal"];

        } catch (error) {
            console.error("Erreur lors de la récupération des données", error);
        }
    });

    function redirectionVersRecette() {
        goto(`/Recette?nom=${recette}`);
    }
</script>

<div>
    <input
        bind:value={recette}
        type="text"
        placeholder="Entrer le nom de votre recette"
    />
    <button on:click={redirectionVersRecette}>Trouver</button>
</div>

<br />

<div>
    <p>Recette du moment : {nomRecetteDuJour} </p>
</div>

<br/>

<table>
    <thead>
        <tr>
            <th>Nom de la Catégorie</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        {#each categories as category}
            <tr>
                <td>{category.strCategory}</td>
                <td>{category.strCategoryDescription}</td>
            </tr>
        {/each}
    </tbody>
</table>

<style>
    table {
        width: 100%;
        border-collapse: collapse;
    }

    th,
    td {
        border: 1px solid black;
        padding: 8px;
        text-align: left;
    }

    div{
        text-align: center;
    }
</style>
