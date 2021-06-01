<template>
    <div>
        {{dict}}
    </div>
</template>
<script>
const axios = require('axios')

export default {
    data() {
        return {
            dynamicComponent: null,
            dict: 1
        }
    },
    mounted () {
        axios({
            method: 'get',
            url: '/dict'
        })
        .then(res => {
            this.dict = res.data
        })
        .catch(err => {
            // TODO: display error
            console.log('axios err', err)
        })
    }
}
</script>
