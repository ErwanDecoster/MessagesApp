<template>
  <div class="flex flex-col pt-12 gap-12 sm:pt-0 sm:grid sm:grid-cols-2 min-h-[calc(100vh-2rem)]">
    <div class="flex flex-col justify-center items-center">
      <NuxtLink to="/"  class="text-2xl text-left text-[#E7D7C1] font-bold">Messages App</NuxtLink>
    </div>
    <div class="flex flex-col justify-center items-center">
      <div class="bg-[#E7D7C1] rounded-3xl p-4 grid gap-2 max-w-sm w-full">
        <h1 class="text-xl text-left">Connection</h1>
        <form 
          @submit.prevent="Login()" 
          class="grid gap-2" 
          action=""
        >
          <div 
            v-if="form.formMessages.length"
            class="grid gap-1"
          >
            <div 
              v-for="formMessage in form.formMessages" 
					    @click="form.formMessages.splice(form.formMessages.indexOf(message), 1)"
              class="rounded-md px-2 py-0.5"
              :class="{ 'bg-red-500': formMessage.type == 'error', 'bg-green-500': formMessage.type == 'succes', 'bg-white': !formMessage.type }"
            >
              <p>{{ formMessage.content }}</p>
            </div>
          </div>
          <div>
            <label for="">Email :</label>
            <input type="email" v-model="form.email" name="" id="" autocomplete="email">
          </div>
          <div>
            <label for="">Mot de passe :</label>
            <input type="password" v-model="form.password" name="" id="" autocomplete="current-password">
          </div>
          <input type="submit" class="btn-primary" name="" id="" value="Se connecter">
        </form>
        <NuxtLink to="/register" class="btn-secondary" >Crée un compte</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
	return {
    form: {
      formMessages: [],
			email: '',
			password: '',
		}
	}
  },
  methods: {
    CheckForm(form)
    {
      form.formMessages = []
      if (!form.email)
        form.formMessages.push({type: 'error', content: 'Le champ "E-mail" est requis'})
      if (!form.password)
        form.formMessages.push({type: 'error', content: 'Le champ "Mot de passe" est requis'})
      if (form.formMessages.length == 0)
        return (0)
      return (1)
    },
    async SignIn(email, password) {
			try {
				const supabase = useSupabaseClient();
				let { data, error } = await supabase.auth.signInWithPassword({
					email: email,
					password: password
				})
				if (error) throw error
			} catch (error) {
				this.formMessages.push({type: 'error', content: error })
			}
    },
    async Login()
    {
      if (this.CheckForm(this.form))
        return (1);
      this.SignIn(
        this.form.email,
        this.form.password
      );
    }
  },
  mounted() {
    const user = useSupabaseUser();
    watchEffect(() => {
      if (user.value)
        navigateTo('/messages');
    })
  },
}
</script>