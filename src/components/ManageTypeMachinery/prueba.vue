<template>
    <div>
        <label>{{ jwt }}</label>
    </div>
</template>

<script>
import { getJWT } from '../../auth';

export default {
    data() {
        return {
            jwt: ''
        };
    },
    mounted() {
        this.jwt = getJWT();
    }
};
</script>