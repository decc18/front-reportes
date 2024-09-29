<script setup lang="ts">
</script>

<template>
    <div class="d-flex justify-center align-center text-center h-100">
        <div>
            <img src="@/assets/images/backgrounds/error_conexion.jpg" width="700" alt="404" />
            <h1 class="text-h1 pt-3">Opps!!!</h1>
            <h4 class="text-h4 my-8">No es posible la conexión a internet o al servidor, por favor verifique su conexión o el estado de la red.</h4>
            <v-btn rounded="pill" color="primary" class="mb-4 px-10"  to="/">Reintentar</v-btn>
        </div>
    </div>
</template>
