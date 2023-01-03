<template>
  <div></div>
</template>
<script>
export default {
  async mounted() {
    const { nearAccountId } = await this.$store.dispatch("getURLSearchParams");
    if (nearAccountId) {
      window.close();
      return;
    }

    await this.$store.dispatch("near/initNear");

    let res = this.$store.dispatch("near/connectNear");
    console.log(res);
  },
};
</script>
