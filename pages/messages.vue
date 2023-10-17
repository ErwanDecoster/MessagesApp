<template>
  <div class="rounded-3xl bg-[#E7D7C1] overflow-hidden min-h-[calc(100vh-2rem)] grid">
    <div class="flex flex-col">
      <div class="flex justify-between py-4 px-2">
        <h1 class="text-2xl text-left">Messages App</h1>
        <button @click="SignOut" class="btn-secondary w-fit">Déconection</button>
      </div>
      <div class="flex h-full">
        <div class="w-64 h-full p-2 flex flex-col gap-4">
          <h2 class="text-xl">Messages</h2>
          <div class="flex flex-col gap-2">
            <div class="btn-secondary text-left">
              <h3 class="text-lg">Nouvelle conversation</h3>
            </div>
            <div class="btn-primary text-left">
              <h3 class="text-lg">Loise Archer</h3>
              <p class="text-sm text-ellipsis overflow-hidden h-10">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti maiores nemo tenetur odio aliquam. Vero </p>
            </div>
            <div class="btn-primary text-left">
              <h3 class="text-lg">Yanis Decoster</h3>
              <p class="text-sm text-ellipsis overflow-hidden h-10">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti maiores nemo tenetur odio aliquam. Vero </p>
            </div>
            <div class="btn-primary text-left">
              <h3 class="text-lg">Sarah Decoster</h3>
              <p class="text-sm text-ellipsis overflow-hidden h-10">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti maiores nemo tenetur odio aliquam. Vero </p>
            </div>
          </div>
        </div>
        <div class="p-2 mr-2 mb-2 flex-1 rounded-2xl flex flex-col bg-black gap-4">
          <div class="rounded-lg bg-[#E7D7C1] p-2">
            <h3 class="text-lg text-center">Loise Archer</h3>
          </div>
          <div class="flex-1 flex flex-col-reverse gap-2">
            <div class="flex flex-col items-end">
              <p class="text-sm text-white">10h30</p>
              <p class="bg-[#E7D7C1] py-1 px-2 rounded-lg max-w-[60%]">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facilis velit, reiciendis minus officia excepturi laborum repellendus saepe ipsa. Veritatis qui beatae rem modi architecto sed quo perspiciatis? Doloribus</p>
            </div>
            <div class="flex flex-col">
              <p class="text-sm text-white">10h30</p>
              <p class="bg-white py-1 px-2 rounded-lg max-w-[60%]">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facilis velit, reiciendis minus officia excepturi laborum repellendus saepe ipsa. Veritatis qui beatae rem modi architecto sed quo perspiciatis? Doloribus</p>
            </div>
            <div class="flex flex-col">
              <p class="text-sm text-white">10h30</p>
              <p class="bg-white py-1 px-2 rounded-lg max-w-[60%]">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facilis velit, reiciendis minus officia excepturi laborum repellendus saepe ipsa. Veritatis qui beatae rem modi architecto sed quo perspiciatis? Doloribus</p>
            </div>
          </div>
          <div class="rounded-lg flex gap-2">
            <div class="grow">
              <input type="text" placeholder="Nouveau message" name="" id="">
            </div>
            <input class="w-fit px-6 bg-[#E7D7C1] text-black hover:text-white hover:border hover:border-white btn-primary" type="submit" value="Envoyer">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
  },
  methods: {
    async SignOut() {
			try {
				const supabase = useSupabaseClient();
				let { error } = await supabase.auth.signOut()
				if (error) throw error
			} catch (error) {
				// this.formMessages.push({type: 'error', content: error })
			}
    },
  },
  mounted() {
    const user = useSupabaseUser();
    watchEffect(() => {
      if (!user.value)
        navigateTo('/');
    })
  },
}
</script>