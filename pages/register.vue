<template>
  <div class="flex flex-col pt-12 gap-12 sm:pt-0 sm:grid sm:grid-cols-2 min-h-[calc(100vh-2rem)]">
    <div class="flex flex-col justify-center items-center">
      <NuxtLink to="/" class="text-2xl text-left text-[#E7D7C1] font-bold">Messages App</NuxtLink>
    </div>
    <div class="flex flex-col justify-center items-center">
      <div class="bg-[#E7D7C1] rounded-3xl p-4 grid gap-2 max-w-sm w-full">
        <h1 class="text-xl text-left">Inscription</h1>
        <form 
          @submit.prevent="Register()" 
          class="grid gap-2" 
          action=""
        >
          <div 
            v-if="formMessages.length"
            class="grid gap-1"
          >
            <div 
              v-for="formMessage in formMessages" 
					    @click="formMessages.splice(formMessages.indexOf(message), 1)"
              class="rounded-md px-2 py-0.5"
              :class="{ 'bg-red-500': formMessage.type == 'error', 'bg-green-500': formMessage.type == 'succes', 'bg-white': !formMessage.type }"
            >
              <p>{{ formMessage.content }}</p>
            </div>
          </div>
          <div>
            <label for="">Email :</label>
            <input type="email" v-model="form.email" placeholder="example@gmail.com" name="" id="" autocomplete="email">
          </div>
          <div>
            <label for="">Télephone :</label>
            <input type="tel" v-model="form.tel" placeholder="09 36 05 16 63" name="" id="" autocomplete="tel">
          </div>
          <div>
            <label for="">Mot de passe :</label>
            <input type="password" v-model="form.password" name="" id="" autocomplete="new-password">
          </div>
          <div>
            <label for="">Comfirmation du mot de passe :</label>
            <input type="password" v-model="form.passwordRetype" name="" id="" autocomplete="new-password">
          </div>
          <input type="submit" class="btn-primary" name="" id="" value="S'inscrire">
        </form>
        <NuxtLink to="/login" class="btn-secondary" >J'ai deja un compte</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
	return {
		formMessages: [],
		form: {
			email: '',
			tel: '',
			password: '',
			passwordRetype: ''
		}
	}
  },
  methods: {
    CheckForm()
    {
      this.formMessages = []
      if (!this.form.email)
        this.formMessages.push({type: 'error', content: 'Le champ "E-mail" est requis'})
      else if (!isValidEmail(this.form.email))
        this.formMessages.push({type: 'error', content: "L'e-mail n'est pas valide"})
      if (!this.form.tel)
        this.formMessages.push({type: 'error', content: 'Le champ "Télephone " est requis.'})
      else if (!isValidTel(this.form.tel))
        this.formMessages.push({type: 'error', content: 'Le numéro de téléphone n\'est pas valide.'})
      if (!this.form.password)
        this.formMessages.push({type: 'error', content: 'Le champ "Mot de passe" est requis'})
      else if (this.form.password.length < 6)
        this.formMessages.push({type: 'error', content: 'Le Mot de passe doit contenir au moins 6 caracteres'})
      if (!this.form.passwordRetype)
        this.formMessages.push({type: 'error', content: 'Le champ "Confirmation du mot de passe" est requis'})
      if (this.form.passwordRetype && this.form.password)
        if (this.form.password !== this.form.passwordRetype)
          this.formMessages.push({type: 'error', content: 'Les mots de passe ne correspondent pas' })
      if (this.formMessages.length == 0)
        return (0)
      return (1)
    },
    async SignUp() {
    	try {
    		const supabase = useSupabaseClient();
    		let { data, error } = await supabase.auth.signUp({
    			email: this.form.email,
    			password: this.form.password
    		})
    		if (error) throw error
    	} catch (error) {
    		this.formMessages.push({type: 'error', content: error })
    	}
    }, 
    Register()
    {
      if (this.CheckForm())
        return (1);
      this.SignUp();
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