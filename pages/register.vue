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
            <label for="surname">Nom :</label>
            <input type="text" v-model="form.surname" placeholder="Dupont" name="surname" id="surname" autocomplete="family-name">
          </div>
          <div>
            <label for="first_name">Prenom :</label>
            <input type="text" v-model="form.first_name" placeholder="Jean" name="first_name" id="first_name" autocomplete="given-name">
          </div>
          <div>
            <label for="email">Email :</label>
            <input type="email" v-model="form.email" placeholder="example@gmail.com" name="email" id="email" autocomplete="email">
          </div>
          <div>
            <label for="tel">Télephone :</label>
            <input type="tel" v-model="form.tel" placeholder="09 36 05 16 63" name="tel" id="tel" autocomplete="tel">
          </div>
          <div>
            <label for="password">Mot de passe :</label>
            <input type="password" v-model="form.password" name="password" id="password" autocomplete="new-password">
          </div>
          <div>
            <label for="password-retype">Comfirmation du mot de passe :</label>
            <input type="password" v-model="form.passwordRetype" name="password-retype" id="password-retype" autocomplete="new-password">
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
    form: {
      formMessages: [],
			surname: '',
			first_name: '',
			email: '',
			tel: '',
			password: '',
			passwordRetype: ''
		}
	}
  },
  methods: {
    CheckForm(form)
    {
      form.formMessages = []
      if (!form.surname)
        form.formMessages.push({type: 'error', content: 'Le champ "Nom" est requis'})
      if (!form.first_name)
        form.formMessages.push({type: 'error', content: 'Le champ "Prenom" est requis'})
      if (!form.email)
        form.formMessages.push({type: 'error', content: 'Le champ "E-mail" est requis'})
      else if (!isValidEmail(form.email))
        form.formMessages.push({type: 'error', content: "L'e-mail n'est pas valide"})
      if (!form.tel)
        form.formMessages.push({type: 'error', content: 'Le champ "Télephone " est requis.'})
      else if (!isValidTel(form.tel))
        form.formMessages.push({type: 'error', content: 'Le numéro de téléphone n\'est pas valide.'})
      if (!form.password)
        form.formMessages.push({type: 'error', content: 'Le champ "Mot de passe" est requis'})
      else if (form.password.length < 6)
        form.formMessages.push({type: 'error', content: 'Le Mot de passe doit contenir au moins 6 caracteres'})
      if (!form.passwordRetype)
        form.formMessages.push({type: 'error', content: 'Le champ "Confirmation du mot de passe" est requis'})
      if (form.passwordRetype && form.password)
        if (form.password !== form.passwordRetype)
          form.formMessages.push({type: 'error', content: 'Les mots de passe ne correspondent pas' })
      if (form.formMessages.length == 0)
        return (0)
      return (1)
    },
    async PostUserTel(user_id, surname, first_name, tel) {
      try {
    		const supabase = useSupabaseClient();
        const { data, error } = await supabase
          .from('user_data')
          .insert([
            { 
              user_id: user_id, 
              surname: surname, 
              first_name: first_name, 
              tel: tel 
            },
          ])
          .select()
          if (error) throw error
    	} catch (error) {
    		this.form.formMessages.push({type: 'error', content: error })
    	}
    },
    async SignUp(email, password) {
    	try {
    		const supabase = useSupabaseClient();
    		let { data, error } = await supabase.auth.signUp({
    			email: email,
    			password: password
    		})
    		if (error) throw error
    	} catch (error) {
    		this.form.formMessages.push({type: 'error', content: error })
    	}
    }, 
    Register()
    {
      if (this.CheckForm(this.form))
        return (1);
      this.SignUp(
        this.form.email, 
        this.form.password, 
      ).then(() => {
        const user = useSupabaseUser();
        this.PostUserTel(
          user.value.id, 
          this.form.surname, 
          this.form.first_name, 
          formatTel(this.form.tel)
        ).then(() => {
          navigateTo('/messages');
        })
      });
    }
  },
  mounted() {
    // const user = useSupabaseUser();
    // watchEffect(() => {
    //   if (user.value)
    //     navigateTo('/messages');
    // })
  },
}
</script>