<template>
  <div 
    @click.self="$emit('close')"
    class="fixed z-30 inset-0 bg-white bg-opacity-30 grid justify-center items-center"
  >
    <div class="bg-[#0a9396] h-fit w-fit p-4 grid gap-2 max-w-sm rounded-3xl">
      <h1 class="text-xl text-left">Nouvelle conversation</h1>
      <form 
        @submit.prevent="NewConversation()" 
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
          <label for="">Numero de téléphone :</label>
          <input type="tel" v-model="form.tel" name="" id="" autocomplete="tel">
        </div>
        <input type="submit" class="btn-primary" name="" id="" value="Lancer la conversation">
      </form>
      <button @click="$emit('close')" class="btn-secondary">Annuler</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
	return {
    dataUser: '',
    form: {
      formMessages: [],
			tel: '',
		}
	}
  },
  methods: {
    CheckForm(form)
    {
      form.formMessages = []
      if (!form.tel)
        form.formMessages.push({type: 'error', content: 'Le champ "Numero de téléphone" est requis.'})
      else if (!isValidTel(form.tel))
        form.formMessages.push({type: 'error', content: 'Le numéro de téléphone n\'est pas valide.'})
      if (form.formMessages.length == 0)
        return (0)
      return (1)
    },
    NewConversation() {
      if (this.CheckForm(this.form))
        return (0)
      this.FetchDataUserByTel(this.form.tel).then((userValue) => {
        console.log(userValue);
        const uuid = self.crypto.randomUUID()
        if (userValue) {
          this.form.formMessages.push({type: 'succes', content: 'Debug: User find'})
          this.PostConversation(uuid).then(() => {
            this.form.formMessages.push({type: 'succes', content: 'Debug: conversation post'})
            const user = useSupabaseUser();
            this.PostParticipant(
              userValue.user_id,
              uuid,
              userValue.first_name,
              userValue.surname,
            ).then(() => {
              this.form.formMessages.push({type: 'succes', content: 'Debug: participant 1 post'})
            })
            this.PostParticipant(
              user.value.id,
              uuid,
              this.dataUser.first_name,
              this.dataUser.surname
            ).then(() => {
              this.form.formMessages.push({type: 'succes', content: 'Debug: participant 2 post'})
            })
          })
        }
        else {
          this.form.formMessages.push({type: 'error', content: 'Aucun utilisateur trouvé'})
        }
      })
    },
    async PostParticipant(userId, conversationId, first_name, surname) {
      try {
    		const supabase = useSupabaseClient();
        const { data, error } = await supabase
          .from('participants')
          .insert([
            { 
              user_id: userId,
              conversation_id: conversationId,
              first_name: first_name,
              surname: surname
            },
          ])
          if (error) throw error
          // return(data)
    	} catch (error) {
    		this.form.formMessages.push({type: 'error', content: error })
    	}
    },
    async PostConversation(uuid) {
      try {
    		const supabase = useSupabaseClient();
        const { data: conversation, error } = await supabase
          .from('conversations')
          .insert([
            { 
              id: uuid,
              type: 0 
            },
          ])
          if (error) throw error
          // return(conversation[0])
    	} catch (error) {
    		this.form.formMessages.push({type: 'error', content: error })
    	}
    },
    async FetchDataUserByTel(tel) {
      try {
				this.form.formMessages = [];
				const supabase = useSupabaseClient();
        const user = useSupabaseUser();
				const { data: dataUser, error } = await supabase
				.from('user_data')
        .select('*')
				.eq('tel', tel)
				.eq('discoverable', true)
				.neq('user_id', user.value.id)
				if (error) throw error
        console.log(dataUser);
        return(dataUser[0])
			} catch (error) {
				this.form.formMessages.push({ type: 'error', content: error })
			}
    },
    async FetchDataUserByUserId(user_id) {
      try {
				this.form.formMessages = [];
				const supabase = useSupabaseClient();
				const { data: dataUser, error } = await supabase
				.from('user_data')
        .select('*')
				.eq('user_id', user_id)
				if (error) throw error
        return(dataUser[0])
			} catch (error) {
				this.form.formMessages.push({ type: 'error', content: error })
			}
    },
  },
  mounted() {
    const user = useSupabaseUser();
    this.FetchDataUserByUserId(user.value.id).then((data_user) => {
      this.dataUser = data_user
    })
  },
}
</script>