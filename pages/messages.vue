<template>
  <div class="m-4 rounded-3xl bg-[#0a9396] h-[calc(100vh-2rem)] grid">
    <NewConversation 
      @close="newConversationModal = false"
      v-if="newConversationModal" />
    <div class="flex flex-col p-2 h-[calc(100vh-2rem)] max-w-full">
      <div 
        v-if="alertMessages.length"
        class="grid gap-1 z-50 fixed right-4 top-4 w-2/3"
      >
        <div 
          v-for="alertMessage in alertMessages" 
          @click="alertMessages.splice(alertMessages.indexOf(message), 1)"
          class="rounded-md px-2 py-0.5"
          :class="{ 'bg-red-500': alertMessage.type == 'error', 'bg-green-500': alertMessage.type == 'succes', 'bg-white': !alertMessage.type }"
        >
          <p>{{ alertMessage.content }}</p>
        </div>
      </div>
      <div class="flex justify-between py-4">
        <h1 class="text-2xl text-left">Messages App</h1>
        <button @click="SignOut" class="btn-secondary w-fit">Déconection</button>
      </div>
      <div class="grid grid-cols-7 gap-2 h-full">
        <div class="col-span-2 flex flex-col gap-4 h-[calc(100vh-2rem-1rem-70px)] scroll-black">
          <h2 class="text-xl">Messages</h2>
          <div class="flex flex-col gap-2 overflow-y-scroll -mr-1 pr-1">
            <button @click="newConversationModal = true" class="btn-secondary text-left">
              <h3 class="text-lg">Nouvelle conversation</h3>
            </button>
            <div 
              @click="DisableOtherConversations(conversation)"
              v-for="conversation in conversations" 
              class="btn-primary text-left blur-sm"
            >
              <h3 v-if="conversation.participants[0]" class="text-lg">
                {{ conversation.participants[0].first_name }}
                {{ conversation.participants[0].surname }}
              </h3>
              <p v-if="conversation.messages[0]" class="text-sm text-ellipsis overflow-hidden h-10">
                {{ conversation.messages[conversation.messages.length - 1].content }}
              </p>
            </div>
          </div>
        </div>
        <!-- class="p-2 mr-2 mb-2 col-span-5 rounded-2xl flex flex-col bg-white gap-4 w-full h-[calc(100vh-2rem-0.5rem-70px)]" -->
        <div 
          v-for="conversation in conversations" 
          :key="conversation"
          class="col-span-5"
          :class="{ 'hidden': !conversation.active }"

        >
          <div
            v-if="conversation.active"
            class="p-2 relative  rounded-2xl flex flex-col justify-between gap-2 bg-white w-full h-[calc(100vh-2rem-1rem-70px)] overflow-hidden"
          >
            <div class="rounded-lg bg-[#0a9396] backdrop-blur-lg z-10 bg-opacity-75 absolute inset-x-2 p-2">
              <h3 v-if="conversation.participants[0]" class="text-lg text-center">
                {{ conversation.participants[0].first_name }}
                {{ conversation.participants[0].surname }}
              </h3>
            </div>
            <span class="absolute w-1 h-14 top-0 right-1 bg-white z-10"></span>
            <div class="grow flex flex-col-reverse gap-1 rounded-lg pt-12 -mr-1 pr-1 overflow-y-scroll relative">
              <div
                v-for="timelineElem in conversation.messages.slice().reverse()"
                :key="timelineElem"
              >
                <p 
                  v-if="timelineElem.timeString"
                  class="text-white text-center"
                >
                  {{ timelineElem.timeString }}
                </p>
                <Message 
                  v-if="timelineElem.id"
                  :message="timelineElem"
                  :user="user"
                />
              </div>
            </div>
            <form 
              @submit.prevent="NewMessages(conversation, form.message)" 
              class="rounded-lg flex gap-2"
            >
              <div class="grow">
                <input class="text-black border border-black first-letter:uppercase" type="text" v-model="form.message" placeholder="Nouveau message" name="" id="">
              </div>
              <input class="w-fit px-6 bg-[#0a9396] text-black hover:border hover:border-black hover:text-black btn-primary" type="submit" value="Envoyer">
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newConversationModal: false,
      alertMessages: [],
      conversations: [],
      form: {
        message: '',
      },
      user: {},
    }
  },
  methods: {
    DisableOtherConversations(activeConversation) {
      this.conversations.forEach((conversation) => {
        conversation.active = false;
      })
      activeConversation.active = true;
    },
    UpdateConversationMessage(eventType, newMessage, oldMessage) {
      if (eventType == 'INSERT') {
        const conversation_pos = this.conversations.findIndex(conversation => conversation.id == newMessage.conversation_id)
        const actualConversation = this.conversations[conversation_pos]
        if (actualConversation.messages.length == 0)
          actualConversation.messages.push(newMessage);
        else if (actualConversation.messages[actualConversation.messages.length - 1].id != newMessage.id) {
          actualConversation.messages.push(newMessage);
        }
      }
      else if (eventType == 'DELETE') {
        let conversation_pos = 0;
        let message_pos
        while (conversation_pos < this.conversations.length) {
          const element = this.conversations[conversation_pos];
          message_pos = element.messages.findIndex(message => message.id == oldMessage.id)
          if (message_pos >= 0)
            break
          conversation_pos++
        }
        this.conversations[conversation_pos].messages.splice(message_pos, 1)
      }
      else if (eventType == 'UPDATE') {
        const conversation_pos = this.conversations.findIndex(conversation => conversation.id == newMessage.conversation_id)
        const actualConversation = this.conversations[conversation_pos]
        const message_pos = actualConversation.messages.findIndex(message => message.id == newMessage.id)
        
        actualConversation.messages[message_pos] = newMessage;
      }
    },
    MessageUpdate() {
      const supabase = useSupabaseClient();
      const message = supabase.channel('messages-all-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        (payload) => {
          this.UpdateConversationMessage(payload.eventType, payload.new, payload.old)
        }
      )
      .subscribe()
    },
    UpdateConversation(eventType, newConversation, oldConversation) {
      const user = useSupabaseUser();

      if (eventType == 'INSERT') {
        this.FetchConversations(newConversation.id).then((conversation) => {
          this.conversations.push(conversation[0]);
        })
      }
      else if (eventType == 'DELETE') {
        const conversation_pos = this.conversations.findIndex(conversation => conversation.id == oldConversation.id)
        this.conversations.splice(this.conversations[conversation_pos], 1)
      }
        // WARNING should delete messages and parcipant
        // else if (eventType == 'UPDATE') {
        //   conversation_pos = this.conversations.findIndex(conversation => conversation.id == oldConversation.id)
        //   this.conversations[conversation_pos] = newConversation;
        // }
    },
    ConversationUpdate() {
      const supabase = useSupabaseClient();
      const conversation = supabase.channel('conversation-all-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'conversations' },
        (payload) => {
          this.UpdateConversation(payload.eventType, payload.new, payload.old)
        }
      )
      .subscribe()
    },
    UpdateConversationParticipant(eventType, newParticipant, oldParticipant) {
      if (eventType == 'INSERT') {
        const conversation_pos = this.conversations.findIndex(conversation => conversation.id == newParticipant.conversation_id)
        const actualConversation = this.conversations[conversation_pos]

        actualConversation.participants.push(newParticipant)
      }
    },
    ParticipantUpdate() {
      const supabase = useSupabaseClient();
      const participant = supabase.channel('participants-all-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'participants' },
        (payload) => {
          this.UpdateConversationParticipant(payload.eventType, payload.new, payload.old)
        }
      )
      .subscribe()
    },
    async FetchConversations(id) {
      if (id) {
        try {
          const supabase = useSupabaseClient();
          const user = useSupabaseUser();
          let { data: conversation, error } = await supabase
          .from('conversations')
          .select(`
            *,
            participants (
              *
            ),
            messages (
              *
            )
          `)
          .eq('id', id)
          .neq('participants.user_id', user.value.id)
          if (error) throw error
          return(conversation)
        } catch (error) {
          this.alertMessages.push({ type: 'error', content: error })
        }
      } else {
        try {
          const supabase = useSupabaseClient();
          const user = useSupabaseUser();
          let { data: conversations, error } = await supabase
          .from('conversations')
          .select(`
            *,
            participants (
              *
            ),
            messages (
              *
            )
          `)
          // .eq('participants.user_id', user.value.id)
          .neq('participants.user_id', user.value.id)
          .order('id', { foreignTable: 'messages', ascending: true })
          if (error) throw error
          return(conversations)
        } catch (error) {
          this.alertMessages.push({ type: 'error', content: error })
        }
      }
    },
    async FetchUserData(id) {
      try {
				const supabase = useSupabaseClient();
				let { data: data_user , error } = await supabase
        .from('user_data')
        .select(`*`)
        .eq('user_id', id)
				if (error) throw error
        return(data_user)
			} catch (error) {
				this.alertMessages.push({ type: 'error', content: error })
			}
    },
    NewMessages(conversation, content) {
      if (content.length) {
        const user = useSupabaseUser();
        this.PostMessages(user.value.id, conversation.id, content).then((value) => {
          conversation.messages.push(value[0])
          this.form.message = ''
        })
      }
    },
    async PostMessages(user_id, conversation_id, content) {
      try {
    		const supabase = useSupabaseClient();
        let { data , error } = await supabase
          .from('messages')
          .insert([
            { 
              send_user_id: user_id,
              conversation_id: conversation_id,
              content: content,
            },
          ])
          .select()
          if (error) throw error
          return(data)
    	} catch (error) {
    		this.alertMessages.push({type: 'error', content: error })
    	}
    },
    async SignOut() {
			try {
				const supabase = useSupabaseClient();
				let { error } = await supabase.auth.signOut()
				if (error) throw error
			} catch (error) {
				this.alertMessages.push({type: 'error', content: error })
			}
    },
    CreateMessagesTimeline(messages) {
      let i = 0
      let timeline = []
      const dif = 1

      let actualDayTimestamp = new Date()
      actualDayTimestamp.setHours(0, 0, 0, 0)
      actualDayTimestamp = actualDayTimestamp.getTime()

      let yesterdayTimestamp = new Date()
      yesterdayTimestamp.setHours(0, 0, 0, 0)
      yesterdayTimestamp.setDate(new Date().getDate() - 1)
      yesterdayTimestamp = yesterdayTimestamp.getTime()
      
      // console.log(messages);


      while (i < messages.length) {
        console.log(messages.length);
        // console.log(i);
        let messageDate = new Date(messages[i].created_at)
        let messageTimestamp = messageDate.getTime()
        
        // console.log('actualDayTimestamp:', actualDayTimestamp);
        // console.log('yesterdayTimestamp:', yesterdayTimestamp);
        // console.log('messageTimestamp:', messageTimestamp);
        // console.log('messageDate:', messageDate);
        
        if (timeline.length > 0) {
          const previousMessageDate = new Date(timeline[i - 1].date)

          let actualMessageWithoutDif = messageDate
          const actualMessageHoursWithoutDif = messageDate.getHours() - dif
          if (actualMessageHoursWithoutDif >= 0)
            actualMessageWithoutDif.setHours(actualMessageHoursWithoutDif)
          // console.log('actualMessageWithoutDif:', actualMessageWithoutDif);
          // console.log('previousMessageDate', previousMessageDate);
          if (previousMessageDate < actualMessageWithoutDif)
          {
            if (actualDayTimestamp < messageTimestamp)
              timeline.push({ timeString: timeToString(messageDate), date: messageDate })
            else if (yesterdayTimestamp < messageTimestamp)
              timeline.push({ timeString: formatDate(messageDate), date: messageDate })
          }
        }
        else {
          if (actualDayTimestamp < messageTimestamp)
            timeline.push({ timeString: timeToString(messageDate), date: messageDate })
          else
            timeline.push({ timeString: formatDate(messageDate), date: messageDate })
        }
        messages[i].date = messageTimestamp
        timeline.push(messages[i])
        // console.log(timeline);
        // console.log(timeline.length);
        i++;
      }
      return (timeline)
    }
  },
  mounted() {
    const user = useSupabaseUser();
    this.user = user;
    this.MessageUpdate()
    this.ConversationUpdate()
    this.ParticipantUpdate()
    this.FetchConversations().then((conversations) => {
      conversations.forEach((conversation) => {
        console.log(conversation);
        conversation.messages = this.CreateMessagesTimeline(conversation.messages)
        console.log(conversation);
      })
      this.conversations = conversations
      // console.log(conversations);
    })
    // watchEffect(() => {
    //   if (!user.value)
    //     navigateTo('/');
    // })
  },
}
</script>