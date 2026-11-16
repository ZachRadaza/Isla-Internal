<script setup>
</script>
<template>
    <body>
        <h1>Heading 1</h1>
        <h2>Heading 2</h2>
        <h3>Heading 3</h3>
        <h4>Heading 4</h4>
        <h5>Heading 5</h5>
        <h6>Heading 6</h6>
        <p>p is the best test tes test</p>
        <a>vinta</a>
        <div class="tags">
            <span class="tag-red">red</span>
            <span class="tag-green">green</span>
            <span class="tag-blue">blue</span>
        </div>

        <button class="btn-primary">primary</button>
        <button class="btn">secondary</button>
        <button class="btn-no-bg">no bg</button>

        <input placeholder="the input" />
        <textarea placeholder="text area"></textarea>
        
        <input type="checkbox"/>
        <input type="date"/>

    </body>
</template>
<style scoped>

body{
    padding: var(--space-5);
    display: flex;
    flex-direction: column;
}

.tags{
    display: flex;
    flex-direction: row;
    gap: var(--space-3);
}
</style>