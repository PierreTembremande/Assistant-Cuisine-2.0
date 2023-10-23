<script lang="ts">
    import { onMount } from "svelte";

    // Définition de l'interface pour une catégorie
    interface Category {
        idCategory: string;
        strCategory: string;
        strCategoryDescription: string;
        strCategoryThumb: string;
    }

    // Déclaration et typage de la variable
    let categories: Category[] = [];

    onMount(async () => {
        try {
            const response = await fetch(
                "https://www.themealdb.com/api/json/v1/1/categories.php"
            );
            const { categories: fetchedCategories } = await response.json();
            categories = fetchedCategories.filter((category: Category) =>
                category.strCategory.toLowerCase()
            );
            console.log(categories)
        } catch (error) {
            console.error("Erreur lors de la récupération des données", error);
        }
    });
</script>

<!-- HTML pour le tableau -->
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

<!-- Style CSS pour le tableau -->
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
</style>
